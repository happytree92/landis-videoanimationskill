# Report failures in an ElevenLabs status result file, then download any new clips.
param([Parameter(Mandatory)][string]$File)
.\.venv\Scripts\python.exe -c "import json,sys;d=json.load(open(sys.argv[1],encoding='utf-8'));[print('NOT DONE:',g['status'],g['prompt'][:50],'|',g.get('error_message','')[:70]) for g in d['generations'] if g['status']!='completed'];print('all_completed',d['all_completed'],'failures',d['has_failures'])" $File
.\.venv\Scripts\python.exe scripts/el_fetch.py $File
