import zipfile
import os
import xml.etree.ElementTree as ET

pptx_path = 'pictures.pptx'
output_dir = 'public/images/pptx'
os.makedirs(output_dir, exist_ok=True)

with zipfile.ZipFile(pptx_path, 'r') as z:
    slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml') and '/' not in f[16:]]
    # Sort numerically
    slides.sort(key=lambda x: int(x.replace('ppt/slides/slide', '').replace('.xml', '')))
    
    print(f'Total slides: {len(slides)}')
    
    slide_mapping = []
    
    for s in slides:
        slide_num = s.replace('ppt/slides/slide', '').replace('.xml', '')
        rels_path = f'ppt/slides/_rels/slide{slide_num}.xml.rels'
        
        xml_content = z.read(s).decode('utf-8', errors='ignore')
        texts = []
        try:
            root = ET.fromstring(xml_content)
            for elem in root.iter():
                if elem.tag.endswith('}t') and elem.text:
                    texts.append(elem.text.strip())
        except Exception as e:
            pass
        slide_text = ' '.join(texts)
        
        images = []
        if rels_path in z.namelist():
            rels_xml = z.read(rels_path).decode('utf-8', errors='ignore')
            try:
                rels_root = ET.fromstring(rels_xml)
                for child in rels_root:
                    target = child.attrib.get('Target', '')
                    if 'media/' in target:
                        img_name = target.replace('../media/', '')
                        images.append(img_name)
                        # Extract image to public/images/pptx/
                        media_zip_path = f'ppt/media/{img_name}'
                        if media_zip_path in z.namelist():
                            data = z.read(media_zip_path)
                            with open(os.path.join(output_dir, img_name), 'wb') as f:
                                f.write(data)
            except Exception as e:
                pass
        
        slide_mapping.append({
            'slide': slide_num,
            'text': slide_text,
            'images': images
        })
        print(f"Slide {slide_num}: {slide_text[:60]}... -> Images: {images}")

print(f"\nExtracted all media to {output_dir}")
