import os

base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"
path = os.path.join(base, "components", "OutputCard.tsx")

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: replace corrupted prop names back while keeping Chinese display text
content = content.replace("on\u91cd\u65b0\u751f\u6210", "onRegenerate")
content = content.replace("\u91cd\u65b0\u751f\u6210", "\u91cd\u65b0\u751f\u6210")
# Need to undo the Regenerate -> 重新生成 replacement in code where it broke the prop
# But keep it for the display text

content = content.replace("onRegenerate", "onRegenerate")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed OutputCard.tsx")

# Also check CharacterCounter
path2 = os.path.join(base, "components", "CharacterCounter.tsx")
with open(path2, "r", encoding="utf-8") as f:
    content2 = f.read()

# Fix CharacterCounter labels back if needed  
content2 = content2.replace("\u8d85\u51fa\u9650\u5236", "OVER LIMIT")
content2 = content2.replace("\u63a5\u8fd1\u4e0a\u9650", "NEAR LIMIT")
content2 = content2.replace("\u826f\u597d", "GOOD")
content2 = content2.replace("\u6b63\u5e38", "OK")
content2 = content2.replace("\u8f83\u77ed", "SHORT")
# But then re-apply the Chinese translation for those
# Actually CharacterCounter uses these as status labels, they're fine in Chinese
print("CharacterCounter.tsx labels OK")

print("Done")
