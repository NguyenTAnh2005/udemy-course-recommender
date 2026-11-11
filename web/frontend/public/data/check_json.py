import json

def shape(x, depth=0):
    pad = "  " * depth
    if isinstance(x, dict):
        for k, v in x.items():
            print(f"{pad}{k}: {type(v).__name__}" + (f" [{len(v)}]" if hasattr(v, '__len__') else ""))
            if depth < 2:
                shape(v, depth + 1)
    elif isinstance(x, list) and x:
        print(f"{pad}[0] = {json.dumps(x[0], ensure_ascii=False)[:300]}")

for f in ["summary", "breakdown", "points", "courses"]:
    print("=====", f)
    shape(json.load(open(f"{f}.json", encoding="utf-8")))