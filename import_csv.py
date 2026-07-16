import csv
import json
import re
from datetime import datetime

input_files = ['F:\\Antigravity\\Alba\\wp_posts.csv', 'F:\\Antigravity\\Alba\\wp_posts (1).csv']
articles = []
seen_ids = set()

for file_path in input_files:
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                post_type = row.get('post_type')
                post_status = row.get('post_status')
                if post_type == 'post' and post_status == 'publish':
                    post_id = int(row.get('ID', 0))
                    if post_id in seen_ids:
                        continue
                    seen_ids.add(post_id)
                    
                    title = row.get('post_title', 'Sem Título')
                    content = row.get('post_content', '')
                    date_str = row.get('post_date', '')
                    try:
                        date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
                        date_formatted = date_obj.strftime('%d/%m/%Y')
                    except:
                        date_formatted = date_str
                    
                    summary = re.sub('<[^<]+>', '', content)
                    summary = summary[:120].strip() + '...'
                    
                    articles.append({
                        'id': post_id,
                        'title': title,
                        'author': 'Admin',
                        'status': 'Publicado',
                        'date': date_formatted,
                        'conteudo': content,
                        'resumo': summary,
                        'imagem': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
                        'tag': 'Geral'
                    })
        print(f"Parsed {file_path}")
    except Exception as e:
        print(f"Failed to parse {file_path}: {e}")

with open('F:\\Antigravity\\Alba\\ALBA\\data\\artigos-importados.json', 'w', encoding='utf-8') as out:
    json.dump(articles, out, ensure_ascii=False, indent=2)

print(f"Exported {len(articles)} articles!")
