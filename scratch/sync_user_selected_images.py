import os
import shutil
import json
import re

out_dir = r'F:\Antigravity\Alba\ALBA\out\images\cursos'
public_dir = r'F:\Antigravity\Alba\ALBA\public\images\cursos'
cursos_file_path = r'F:\Antigravity\Alba\ALBA\data\cursos.js'

os.makedirs(public_dir, exist_ok=True)

# 1. Copy all folders and files from out/images/cursos to public/images/cursos
print("1. Copying single selected images from out/images/cursos to public/images/cursos...")

folder_image_map = {}

for item in os.listdir(out_dir):
    src_folder = os.path.join(out_dir, item)
    if os.path.isdir(src_folder):
        dest_folder = os.path.join(public_dir, item)
        os.makedirs(dest_folder, exist_ok=True)
        
        # Get image files in src_folder
        files = [f for f in os.listdir(src_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if files:
            # Take the main image (or first image)
            main_img = files[0]
            src_file = os.path.join(src_folder, main_img)
            dest_file = os.path.join(dest_folder, main_img)
            shutil.copyfile(src_file, dest_file)
            
            # Store map: folder_name -> web path
            web_path = f"/images/cursos/{item}/{main_img}"
            folder_image_map[item] = web_path
            print(f"  [{item}] -> {web_path}")

print(f"\nTotal folders mapped: {len(folder_image_map)}")

# 2. Read data/cursos.js
with open(cursos_file_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const initialCourses = (\[[\s\S]*\]);', content)
if not match:
    print("ERROR: Could not parse initialCourses in data/cursos.js")
    exit(1)

courses = json.loads(match.group(1))

def slugify(text):
    text = text.lower()
    text = text.replace('à', 'a').replace('á', 'a').replace('â', 'a').replace('ã', 'a')
    text = text.replace('é', 'e').replace('ê', 'e')
    text = text.replace('í', 'i')
    text = text.replace('ó', 'o').replace('ô', 'o').replace('õ', 'o')
    text = text.replace('ú', 'u')
    text = text.replace('ç', 'c')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# 3. Match each course in cursos.js with its folder
updated_count = 0
for course in courses:
    title_slug = slugify(course['title'])
    
    # Try exact or partial slug match against folder_image_map
    matched_path = None
    
    for folder, path in folder_image_map.items():
        if folder in title_slug or title_slug in folder:
            matched_path = path
            break
        # Special alias matching
        if 'aprofundamento' in title_slug and 'aprofundamento' in folder:
            matched_path = path; break
        if 'anatomia' in title_slug and 'anatomia' in folder:
            matched_path = path; break
        if 'champi' in title_slug and 'champi' in folder:
            matched_path = path; break
        if 'instrutor' in title_slug and 'instrutor' in folder:
            matched_path = path; break
        if 'spa' in title_slug and 'spa' in folder:
            matched_path = path; break
        if 'tradicional' in title_slug and 'tradicional' in folder:
            matched_path = path; break
        if 'costas' in title_slug and 'costas' in folder:
            matched_path = path; break
        if 'oriental' in title_slug and 'oriental' in folder:
            matched_path = path; break
        if 'infantil' in title_slug and 'meditacao' in title_slug and 'meditacao-infantil' in folder:
            matched_path = path; break
        if 'naturopatia' in title_slug and 'naturopatia' in folder:
            matched_path = path; break
        if 'nutricao' in title_slug and 'nutricao' in folder:
            matched_path = path; break
        if 'osho' in title_slug and 'osho' in folder:
            matched_path = path; break
        if 'tantrismo' in title_slug and 'tantrismo' in folder:
            matched_path = path; break
        if 'energia' in title_slug and 'energia' in folder:
            matched_path = path; break
        if 'hormonal' in title_slug and 'hormonal' in folder:
            matched_path = path; break
        if 'infantil' in title_slug and 'yoga' in title_slug and 'yoga-infantil' in folder:
            matched_path = path; break
        if 'idosos' in title_slug and 'idosos' in folder:
            matched_path = path; break
        if 'cristais' in title_slug and 'cristais' in folder:
            matched_path = path; break

    if matched_path:
        course['image'] = matched_path
        updated_count += 1
        print(f"Matched Course ID {course['id']} [{course['title']}] -> {matched_path}")

# Write back data/cursos.js
new_cursos_content = f"export const initialCourses = {json.dumps(courses, indent=2, ensure_ascii=False)};\n"
with open(cursos_file_path, 'w', encoding='utf-8') as f:
    f.write(new_cursos_content)

print(f"\nSUCCESS: Updated {updated_count} courses with single selected image in data/cursos.js!")
