import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        document.close()
        tree = ET.XML(xml_content)
        
        paragraphs = []
        for paragraph in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

with open("output.txt", "w", encoding="utf-8") as f:
    f.write("=== Eyewash Checklist ===\n")
    f.write(get_docx_text("Eyewash Checklist.docx") + "\n")
    f.write("\n=== Forklift Checklist ===\n")
    f.write(get_docx_text("Forklift Checklist.docx") + "\n")
    f.write("\n=== Site Safety Checklist ===\n")
    f.write(get_docx_text("Site Safety Checklist.docx") + "\n")
