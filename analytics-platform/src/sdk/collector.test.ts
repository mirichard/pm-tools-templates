import { AnalyticsCollector } from './collector';

const createdCollectors: AnalyticsCollector[] = [];

function makeCollector(overrides: Partial<{ apiUrl: string; apiKey: string; userId: string }> = {}) {
  const collector = new AnalyticsCollector({
    apiUrl: 'https://analytics.example.com',
    apiKey: 'test-key',
    flushIntervalMs: 3600_000, // effectively disable auto-flush during tests
    ...overrides,
  });
  createdCollectors.push(collector);
  return collector;
}

afterEach(() => {
  // Each collector's constructor starts a setInterval for auto-flush; stop
  // it so the open handle doesn't leak across tests/keep the runner alive.
  while (createdCollectors.length) {
    const collector = createdCollectors.pop()!;
    const interval = (collector as unknown as { flushInterval: ReturnType<typeof setInterval> | null }).flushInterval;
    if (interval) clearInterval(interval);
  }
});

describe('AnalyticsCollector - consent gating (success behavior)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('events are not queued before consent is granted', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    collector.trackTemplateDownload('Sprint Plan', 'agile');
    await collector.flush();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('requestConsent grants and persists consent, then queued events are sent on flush', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    const consent = await collector.requestConsent({ usageAnalytics: true });
    expect(consent.usageAnalytics).toBe(true);
    expect(consent.performanceData).toBe(false);
    // Granting usageAnalytics makes requestConsent's own internal
    // consent_updated tracking call visible; it's a "critical event" that
    // flushes immediately (see isCriticalEvent). Clear that call so the
    // assertions below observe only the event this test is exercising.
    fetchMock.mockClear();

    collector.trackTemplateDownload('Sprint Plan', 'agile');
    await collector.flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://analytics.example.com/analytics/events');
    const body = JSON.parse(init.body);
    expect(body.events).toHaveLength(1);
    expect(body.events[0].type).toBe('template_download');
    expect(body.events[0].data.templateName).toBe('Sprint Plan');
  });

  test('consent is scoped per event category, not all-or-nothing', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    await collector.requestConsent({ featureAdoption: true }); // usageAnalytics left false

    collector.trackTemplateDownload('Sprint Plan', 'agile'); // requires usageAnalytics
    collector.trackCLIUsage('init', true); // requires featureAdoption
    await collector.flush();

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.events).toHaveLength(1);
    expect(body.events[0].type).toBe('cli_usage');
  });
});

describe('AnalyticsCollector - data sanitization (malformed/hostile input)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('strips sensitive-looking fields from event data before sending', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    await collector.requestConsent({ usageAnalytics: true });
    fetchMock.mockClear(); // drop the internal consent_updated flush call
    collector.track('template_download', {
      templateName: 'Risk Register',
      email: 'user@example.com',
      password: 'hunter2',
      token: 'secret-token',
      apiKey: 'sk-live-should-not-leak',
      personalInfo: { ssn: '000-00-0000' },
    });
    await collector.flush();

    const sentData = JSON.parse(fetchMock.mock.calls[0][1].body).events[0].data;
    expect(sentData.templateName).toBe('Risk Register');
    expect(sentData.email).toBeUndefined();
    expect(sentData.password).toBeUndefined();
    expect(sentData.token).toBeUndefined();
    expect(sentData.apiKey).toBeUndefined();
    expect(sentData.personalInfo).toBeUndefined();
  });

  test('truncates overlong string fields rather than sending them unbounded', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    await collector.requestConsent({ usageAnalytics: true });
    fetchMock.mockClear(); // drop the internal consent_updated flush call
    collector.track('template_download', { note: 'x'.repeat(5000) });
    await collector.flush();

    const sentData = JSON.parse(fetchMock.mock.calls[0][1].body).events[0].data;
    expect(sentData.note).toHaveLength(1003); // 1000 chars + '...'
    expect(sentData.note.endsWith('...')).toBe(true);
  });

  test('trackFeedback handles a missing comment without throwing', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    await collector.requestConsent({ feedbackData: true });
    expect(() => collector.trackFeedback('Sprint Plan', 5)).not.toThrow();
    await collector.flush();

    const sentData = JSON.parse(fetchMock.mock.calls[0][1].body).events[0].data;
    expect(sentData.hasComment).toBe(false);
    expect(sentData.commentLength).toBe(0);
  });
});

describe('AnalyticsCollector - failure behavior', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('flush() re-queues events and does not throw when the network request fails', async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error('network down'));
    global.fetch = fetchMock as unknown as typeof fetch;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const collector = makeCollector();
    // featureAdoption (not usageAnalytics) so requestConsent's own internal
    // consent_updated tracking - gated on usageAnalytics - never fires and
    // this test observes only the one event it's actually exercising.
    await collector.requestConsent({ featureAdoption: true });
    collector.trackCLIUsage('init', true);

    await expect(collector.flush()).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();

    // The failed event should have been re-queued: a second, successful
    // flush should now send it.
    fetchMock.mockResolvedValueOnce({ ok: true });
    await collector.flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.events).toHaveLength(1);
  });

  test('constructs safely and falls back to all-false consent when localStorage is unavailable', () => {
    // The default Node/Jest test environment has no `localStorage` global,
    // which is exactly the runtime condition loadConsentFromStorage's
    // try/catch exists to handle gracefully.
    expect(() => makeCollector()).not.toThrow();
    const collector = makeCollector();
    expect(collector.getConsent()).toEqual({
      usageAnalytics: false,
      featureAdoption: false,
      performanceData: false,
      feedbackData: false,
      geographicData: false,
    });
  });

  test('falls back to defaults when stored consent is malformed JSON', () => {
    const store: Record<string, string> = { 'pm-tools-analytics-consent': '{not valid json' };
    global.localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      key: () => null,
      length: 0,
    } as Storage;

    expect(() => makeCollector()).not.toThrow();
    const collector = makeCollector();
    expect(collector.getConsent().usageAnalytics).toBe(false);

    delete (global as { localStorage?: Storage }).localStorage;
  });

  test('revokeConsent clears the queue and resets consent to all-false', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const collector = makeCollector();
    await collector.requestConsent({ usageAnalytics: true });
    fetchMock.mockClear(); // drop the internal consent_updated flush call
    collector.trackTemplateDownload('Sprint Plan', 'agile');

    collector.revokeConsent();
    expect(collector.getConsent().usageAnalytics).toBe(false);

    await collector.flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
