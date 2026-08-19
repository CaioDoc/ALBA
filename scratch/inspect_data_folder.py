import os

data_dir = r'F:\Antigravity\Alba\ALBA\data'

print("Files in data/:")
for f in os.listdir(data_dir):
    print(" -", f)
