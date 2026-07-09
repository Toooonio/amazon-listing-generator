import os, re
base = "C:\\Users\\Dell\\Documents\\Codex\\2026-07-08\\listing-listing-1-75-125-2"

# Fix BulletOutput.tsx - needs template literal for label
path = os.path.join(base, "components", "BulletOutput.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the Bullet  template literal issue  
content = content.replace('label={Bullet }', 'label={"Bullet " + (i + 1)}')
# Also fix the Bullet  if partially mangled
content = re.sub(r'label=\{Bullet\s*\$\{i\s*\+\s*1\}\}', 'label={"Bullet " + (i + 1)}', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed BulletOutput.tsx")

print("Done")
