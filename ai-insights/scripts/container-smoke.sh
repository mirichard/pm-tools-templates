#!/usr/bin/env bash
# Run only on a disposable Docker host. No external service or published image.
set -euo pipefail
image="${1:?immutable image ID required}"
evidence="${2:?evidence directory required}"
mkdir -p "$evidence"
container=""
cleanup() {
  if [[ -n "$container" ]]; then
    docker logs "$container" > "$evidence/container.log" 2>&1 || true
    docker inspect "$container" > "$evidence/container.json" || true
    docker rm -f "$container" >/dev/null || true
  fi
}
trap cleanup EXIT
container=$(docker run -d -p 127.0.0.1::3001 "$image")
[[ "$(docker inspect -f '{{.Image}}' "$container")" == "$image" ]]
[[ "$(docker exec "$container" id -u)" != "0" ]]
port=$(docker port "$container" 3001/tcp | sed 's/.*://')
python3 - "$port" "$evidence" <<'PY'
import json, pathlib, sys, time, urllib.request, urllib.error
base = 'http://127.0.0.1:' + sys.argv[1]
out = pathlib.Path(sys.argv[2])
for attempt in range(60):
    try:
        with urllib.request.urlopen(base + '/health', timeout=2) as response:
            health = json.load(response)
        assert health['status'] == 'healthy' and health['aiEngine'] == 'initialized'
        break
    except (OSError, AssertionError):
        time.sleep(1)
else:
    raise RuntimeError('API did not become healthy within readiness window')
(out / 'health.json').write_text(json.dumps(health, indent=2) + '\n')
for label, body, expected in [('valid', {'teamSize': 4}, 200), ('invalid', {'teamSize': 0}, 400)]:
    request = urllib.request.Request(base + '/api/v1/risk/predict', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(request, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        status, result = response.status, json.load(response)
    (out / (label + '.json')).write_text(json.dumps({'status': status, 'body': result}, indent=2) + '\n')
    assert status == expected, (label, status)
    if label == 'valid':
        assert result['success'] is True
        assert result['data']['metadata']['trainingStatus'] == 'untrained'
print('API health, valid response and invalid-input rejection passed')
PY
# Exercise the image's declared HEALTHCHECK, rather than only host HTTP.
for attempt in {1..45}; do
  health=$(docker inspect -f '{{.State.Health.Status}}' "$container")
  [[ "$health" == "healthy" ]] && break
  [[ "$health" != "unhealthy" ]]
  sleep 2
done
[[ "$health" == "healthy" ]]
docker stop --time 20 "$container" >/dev/null
[[ "$(docker inspect -f '{{.State.ExitCode}}' "$container")" == "0" ]]
[[ "$(docker inspect -f '{{.State.OOMKilled}}' "$container")" == "false" ]]
echo 'PASS: immutable image, non-root process, API, Docker health and graceful stop' | tee "$evidence/smoke-result.txt"
