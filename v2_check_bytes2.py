import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"
path = os.path.join(base, "lib", "duplicateChecker.ts")

with open(path, "rb") as f:
    data = f.read()

# Find the issues.push line
line_start = data.find(b"issues.push")
if line_start >= 0:
    # Show bytes around this area
    context = data[line_start:line_start+80]
    print("Bytes around issues.push:")
    print(repr(context))
    print()
    for i, b in enumerate(context):
        print(f"  byte {i}: 0x{b:02x} ({chr(b) if 32 <= b < 127 else '?'})")
    
    # Specifically check the backtick character
    backtick_pos = data.find(b"`", line_start)
    if backtick_pos >= 0:
        print(f"\nFirst backtick at offset {backtick_pos}")
        print(f"Byte value: 0x{data[backtick_pos]:02x}")
        print(f"Context: {repr(data[max(0,backtick_pos-5):backtick_pos+5])}")
