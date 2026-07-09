import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"
path = os.path.join(base, "components", "OutputCard.tsx")

# Check the exact bytes of the line with the issue
with open(path, "rb") as f:
    data = f.read()

# Find the corrupted prop name
import re
# Look for the pattern "onXXXXX?" pattern in the interface
corrupt = b"on\xe9\x87\x8d\xe6\x96\xb0\xe7\x94\x9f\xe6\x88\x90"
if corrupt in data:
    data = data.replace(corrupt, b"onRegenerate")
    with open(path, "wb") as f:
        f.write(data)
    print("Fixed binary corruption in OutputCard.tsx")
else:
    # Check what's actually there
    idx = data.find(b"on")
    if idx >= 0:
        print(f"Found 'on' at byte {idx}: {data[idx:idx+20]}")
    print("Could not find the specific corruption pattern")
    print("File content around interface:", data[data.find(b"interface OutputCardProps"):data.find(b"interface OutputCardProps")+200])
