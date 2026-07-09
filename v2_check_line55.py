import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"
path = os.path.join(base, "lib", "duplicateChecker.ts")

with open(path, "rb") as f:
    lines = f.read().split(b"\n")

for i in [53, 54, 55, 56]:
    if i < len(lines):
        line = lines[i-1]  # 0-indexed
        # Show detailed byte info
        print(f"Line {i}: length={len(line)}, bytes={repr(line[:80])}")
        # Check for 0x5c (backslash) near double quotes
        for j in range(len(line)):
            if line[j] == 0x22:  # double quote
                ctx = line[max(0,j-1):min(len(line),j+2)]
                print(f"  Double quote at byte {j}, context: {repr(ctx)}")
        # Also check for 0x5c (backslash)
        for j in range(len(line)):
            if line[j] == 0x5c:
                ctx = line[max(0,j-1):min(len(line),j+3)]
                print(f"  Backslash at byte {j}, context: {repr(ctx)}")
