import re

with open('data/artigos.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

articles = []
cur_art = {}

for l in lines:
    if '"id":' in l:
        cur_art['id'] = l.split('"id":')[1].strip().strip(',')
    if '"title":' in l:
        cur_art['title'] = l.split('"title":')[1].strip().strip('",\'`')
    if '"imagem":' in l:
        cur_art['imagem'] = l.split('"imagem":')[1].strip().strip('",\'`')
    if '"conteudo":' in l:
        cur_art['conteudo'] = l.split('"conteudo":')[1].strip()
    if '},' in l and 'id' in cur_art:
        articles.append(cur_art)
        cur_art = {}

print(f"Total articles parsed: {len(articles)}")

imgs_in_body = 0
wp_uploads = 0
external_imgs = 0

for a in articles:
    body = a.get('conteudo', '')
    img_matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body, re.IGNORECASE)
    # also check for wp-content/uploads or image links
    wp_matches = re.findall(r'https?:\/\/[^\s"\'<>]*wp-content\/uploads[^\s"\'<>]*', body)
    
    if img_matches or wp_matches:
        imgs_in_body += 1
        print(f"\nArticle ID {a['id']} [{a.get('title')}]:")
        for m in img_matches:
            print("  <img> tag:", m[:120])
        for w in wp_matches:
            print("  WP link:", w[:120])

print(f"\nSummary:")
print(f"  Articles with <img> or WP image links in body: {imgs_in_body}/{len(articles)}")
