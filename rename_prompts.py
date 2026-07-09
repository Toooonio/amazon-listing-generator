import os
base = r'C:\Users\Dell\Documents\Codex\2026-07-08\listing-listing-1-75-125-2'
import shutil
src = os.path.join(base, 'prompts')
for f in os.listdir(src):
    if f.endswith('.ts'):
        old = os.path.join(src, f)
        new = os.path.join(src, f + '.bak')
        os.rename(old, new)
        print(f'Renamed: {old} -> {new}')
print('Done')

