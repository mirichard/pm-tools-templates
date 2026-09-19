import sys,json,hashlib,hmac,re,subprocess,collections,datetime,argparse
parser=argparse.ArgumentParser(description="Audit a checked-out post-migration revision without changing templates")
parser.add_argument("--output", required=True)
parser.add_argument("--as-of", default=datetime.date.today().isoformat())
args=parser.parse_args()
audit_date=datetime.date.fromisoformat(args.as_of)
from pathlib import Path
root=Path.cwd();sys.path.insert(0,str(root/'scripts'))
from lint_template_metadata import metadata
from migration_pointer import pointer_errors
from check_migration_links import check
sha=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
load=lambda p:json.loads(Path(p).read_text())
inv=load('meta/migration-inventory.json');cat=load('templates/templates.json')['templates'];mapping=load('meta/domain-mapping.json')['mappings']
rows=[]
for m in inv['moves']:
 p=m['destination'];content=Path(p).read_text();raw=Path(p).read_bytes();h=hashlib.sha256(raw).hexdigest();norm=hashlib.sha256(re.sub(r'\s+',' ',content).strip().encode()).hexdigest()
 errors,warnings=metadata(content,audit_date)
 rows.append({'path':p,'legacy_path':m['source'],'sha256':h,'recorded_sha256':m['execution']['pre_move_source_sha256'],'integrity_match':'raw' if hmac.compare_digest(h,m['execution']['pre_move_source_sha256']) else 'normalized' if hmac.compare_digest(norm,m['execution']['pre_move_source_sha256']) else 'FAIL','metadata_errors':errors,'metadata_warnings':warnings,'pointer_errors':pointer_errors(root,m['source'],Path(m['source']).read_text())})
files=sorted({r['path'] for r in rows}|{r['legacy_path'] for r in rows}|{x['path'] for x in cat}|{x.get('canonical_path',x['path']) for x in cat}|{'README.md','TEMPLATE_INDEX.md','docs/domain-navigation-and-legacy-paths.md'}|{f'domains/{d}/README.md' for d in ['stakeholder','team','delivery','planning','uncertainty','measurement']})
links=[];total=0
for p in files:
 n,failures=check(Path(p).read_text(),p,lambda t:Path(t).read_text(),lambda t:Path(t).exists());total+=n
 for (href,reason),count in failures.items():links.append({'path':p,'href':href,'reason':reason,'occurrences':count})
extra=[]
for item in cat:
 if item['path'] not in {r['path'] for r in rows}:
  e,w=metadata(Path(item['path']).read_text(),audit_date);extra.append({'path':item['path'],'metadata_errors':e,'metadata_warnings':w})
groups=collections.defaultdict(list)
for r in rows:groups[r['sha256']].append(r['path'])
dups=[v for v in groups.values() if len(v)>1]
bodygroups=collections.defaultdict(list)
for r in rows:
 c=Path(r['path']).read_text();c=re.sub(r'^---\n.*?\n---\n','',c,count=1,flags=re.S)
 bodygroups[hashlib.sha256(re.sub(r'\s+',' ',c).strip().encode()).hexdigest()].append(r['path'])
bodydups=[v for v in bodygroups.values() if len(v)>1]
checks={}
commands={'sprint10':['node','scripts/validate-sprint-10.mjs'],'catalog':['node','scripts/validate-curated-templates.js'],'domains':['node','scripts/sync-catalog-domains.js','--check'],'canonical':['node','scripts/validate-canonical-paths.js'],'navigation':['node','scripts/validate-domain-navigation.mjs'],'postcheck':['node','scripts/migration-post-check.mjs'],'tests':['node','--test','tests/catalog-domains.test.cjs','tests/migration-post-check.test.mjs','tests/domain-navigation.test.mjs','tests/reviewed-domain-mapping.test.mjs']}
for name,command in commands.items():
    process=subprocess.run(command,capture_output=True,text=True,timeout=120)
    checks[name]={'command':' '.join(command),'exit_code':process.returncode,'output':process.stdout+process.stderr}
result={'commit' :sha,'audit_date':audit_date.isoformat(),'migrated_templates':rows,'additional_catalog_templates':extra,'catalog_count':len(cat),'domain_counts':dict(collections.Counter(x['domain'] for x in cat)),'catalog_path_disagreements':[{'path':x['path'],'canonical_path':x['canonical_path']} for x in cat if x.get('canonical_path',x['path'])!=x['path']],'duplicate_raw_content_groups':dups,'duplicate_normalized_body_groups':bodydups,'link_scope_files':files,'local_inline_links_checked':total,'local_link_failures':links,'checks':checks}
Path(args.output).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'integrity':dict(collections.Counter(x['integrity_match'] for x in rows)),'metadata_pass':sum(not r['metadata_errors'] for r in rows),'metadata_error_count':sum(len(r['metadata_errors']) for r in rows),'metadata_warning_count':sum(len(r['metadata_warnings']) for r in rows),'pointer_errors':sum(len(r['pointer_errors']) for r in rows),'files':len(files),'links':total,'link_failures':sum(x['occurrences'] for x in links),'link_affected':len(set(x['path'] for x in links)),'raw_duplicates':len(dups),'body_duplicates':len(bodydups),'catalog_disagreements':result['catalog_path_disagreements']},indent=2))

# Evidence capture succeeds even when it records failed checks; this is not a release gate.
