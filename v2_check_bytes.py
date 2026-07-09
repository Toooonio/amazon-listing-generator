import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

path = os.path.join(base, "lib", "factExtractor.ts")
with open(path, "rb") as f:
    data = f.read()

# Find lines around 13
lines = data.split(b"\n")
for i in range(10, 16):
    if i < len(lines):
        print(f"Line {i+1}: {lines[i][:80]}")

# Check for the backtick pattern  
print()
print("Looking for backtick patterns...")
backtick = b"\x60"
backslash_backtick = b"\x5c\x60"

print(f"Number of ` characters: {data.count(backtick)}")
print(f"Number of \\` sequences: {data.count(backslash_backtick)}")

# Show context around first template literal
idx = data.find(backslash_backtick)
if idx >= 0:
    print(f"Found \\` at byte {idx}: {data[idx-10:idx+30]}")
else:
    print("No \\` sequences found")
    # Show what's around where we expect template literals
    for marker in [b"return", b"Extract", b"Target Language", b"${"]:
        idx = data.find(marker)
        if idx >= 0:
            print(f"Found '{marker.decode()}' at byte {idx}: {data[max(0,idx-5):idx+40]}")
