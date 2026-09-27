#!/usr/bin/env python3
"""
Google Drive / Slides / Docs to Direct PDF Link Converter
Converts any Google Presentation, Google Doc, or Google Drive link into a direct PDF download URL.
"""

import sys
import re

def convert_google_link_to_pdf(url: str) -> str:
    clean_url = url.strip()
    
    # 1. Google Slides / Presentation
    pres_match = re.search(r'docs\.google\.com/presentation/d/([a-zA-Z0-9_-]+)', clean_url, re.IGNORECASE)
    if pres_match:
        doc_id = pres_match.group(1)
        return f"https://docs.google.com/presentation/d/{doc_id}/export/pdf"
        
    # 2. Google Docs
    doc_match = re.search(r'docs\.google\.com/document/d/([a-zA-Z0-9_-]+)', clean_url, re.IGNORECASE)
    if doc_match:
        doc_id = doc_match.group(1)
        return f"https://docs.google.com/document/d/{doc_id}/export?format=pdf"
        
    # 3. Google Drive File Share (uploaded PPTX or PDF)
    file_match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', clean_url, re.IGNORECASE)
    if file_match:
        file_id = file_match.group(1)
        return f"https://drive.google.com/uc?export=download&confirm=no_antivirus&id={file_id}"
        
    # 4. Google Drive Open ID
    open_match = re.search(r'drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)', clean_url, re.IGNORECASE)
    if open_match:
        file_id = open_match.group(1)
        return f"https://drive.google.com/uc?export=download&confirm=no_antivirus&id={file_id}"
        
    # 5. Dropbox link
    if "dropbox.com" in clean_url and "dl=0" in clean_url:
        return clean_url.replace("dl=0", "dl=1")
        
    return clean_url

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_url = sys.argv[1]
    else:
        input_url = "https://docs.google.com/presentation/d/1QMRCE5oZPM3--jAkbK5KTRPiN9J7UF8m/edit?usp=drive_link&ouid=114551473414415009185&rtpof=true&sd=true"
        
    direct_pdf_link = convert_google_link_to_pdf(input_url)
    print("=" * 70)
    print("URL d'origine :", input_url)
    print("Lien PDF direct :", direct_pdf_link)
    print("=" * 70)
