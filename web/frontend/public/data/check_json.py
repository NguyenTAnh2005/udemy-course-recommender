import json
for f in ['summary','clusters','breakdown','points','courses']:
    d = json.load(open(f'{f}.json', encoding='utf-8'))
    s = json.dumps(d, ensure_ascii=False)
    print('=====', f, type(d).__name__, len(d))
    print(s[:600])
