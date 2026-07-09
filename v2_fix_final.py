import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

# 1. Fix duplicateChecker.ts - remove backslash before double quotes in template literals
path = os.path.join(base, "lib", "duplicateChecker.ts")
with open(path, "rb") as f:
    data = f.read()

# Replace \" with " in the content - only affects template literal
fixed = data.replace(b'\x5c\x22', b'\x22')

with open(path, "wb") as f:
    f.write(fixed)
print("Fixed duplicateChecker.ts")

# 2. Fix compliance.ts - same issue
path2 = os.path.join(base, "lib", "compliance.ts")
with open(path2, "rb") as f:
    data = f.read()
# Check for \${ patterns
if b'\x5c\x24' in data:
    fixed2 = data.replace(b'\x5c\x24', b'\x24')
    with open(path2, "wb") as f:
        f.write(fixed2)
    print("Fixed compliance.ts $ escaping")

# 3. Fix generate route.ts if needed
path3 = os.path.join(base, "app", "api", "generate", "route.ts")
with open(path3, "rb") as f:
    data = f.read()
# Check for \\${ patterns
if b'\x5c\x24\x7b' in data:
    fixed3 = data.replace(b'\x5c\x24\x7b', b'\x24\x7b')
    with open(path3, "wb") as f:
        f.write(fixed3)
    print("Fixed route.ts $ escaping")

print("Done")
