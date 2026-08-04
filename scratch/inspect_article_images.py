import re

with open('data/artigos.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract img tags inside conteudo
img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', text, re.IGNORECASE)

print(f"Total <img> tags found inside article content: {len(img_srcs)}")

src_domains = {}
for src in img_srcs:
    domain = src.split('/')[2] if src.startswith('http') else 'relative/local'
    src_domains[domain] = src_domains.get(domain, 0) + 1
    print(" - ", src[:120])

print("\nImage domains distribution:")
for d, count in src_domains.items():
    print(f" {d}: {count}")

# Check articles that have no <img> tag in conteudo
article_blocks = re.findall(r'id:\s*(\d+)[\s\S]*?title:\s*["\']([^"\']+)["\'][\s\S]*?conteudo:\s*[`"\']([\s\S]*?)[`"\']\s*,', text)
print(f"\nArticles without <img> in body ({len(article_blocks)} total articles):")
no_img_count = 0
for aid, title, body in article_blocks:
    if '<img' not in body.lower():
        no_img_count += 1
        print(f"  ID {aid}: {title}")

print(f"\nTotal articles without <img> tags inside content: {no_img_count}/{len(article_blocks)}")
