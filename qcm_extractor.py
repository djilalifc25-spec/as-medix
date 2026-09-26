#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AS-MEDIX - Extracteur Local de QCMs (PDF Texte, PDF Scanné OCR, Google Drive, Web URL)
---------------------------------------------------------------------------------------
Ce script extrait automatiquement les QCMs à partir :
  1. D'un fichier PDF texte ou d'un PDF SCANNÉ (via OCR automatique)
  2. D'un lien Google Drive (ex: https://drive.google.com/file/d/.../view)
  3. D'une URL web directe vers un PDF (ex: Weebly, Google, etc.)

Il génère :
  - `qcms_extracted.json` : Fichier JSON formaté pour import direct sur le site AS-MEDIX
  - `qcms_formatted.txt`  : Fichier Texte propre à copier/coller dans le panel d'administration
  - Option d'envoi automatique (téléversement) sur votre site AS-MEDIX !

Dépendances requises (s'installent automatiquement si manquantes) :
  pip install pymupdf pypdf requests rapidocr-onnxruntime pillow
"""

import sys
import os
import re
import json

# Enable UTF-8 encoding for Windows standard output
if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def ensure_dependencies():
    missing = []
    try:
        import pypdf
    except ImportError:
        missing.append("pypdf")
    try:
        import requests
    except ImportError:
        missing.append("requests")
    try:
        import fitz  # PyMuPDF
    except ImportError:
        missing.append("pymupdf")
    try:
        import rapidocr_onnxruntime
    except ImportError:
        missing.append("rapidocr-onnxruntime")
    try:
        import PIL
    except ImportError:
        missing.append("pillow")
    
    if missing:
        print(f"📦 Installation des dépendances OCR/PDF manquantes : {', '.join(missing)}...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing)

ensure_dependencies()

import pypdf
import fitz
import requests
from rapidocr_onnxruntime import RapidOCR

def extract_google_drive_id(url_or_id):
    """ Extrait l'ID d'un fichier depuis un lien Google Drive """
    match = re.search(r'/(?:d|folders)/([a-zA-Z0-9_-]+)', url_or_id)
    if match:
        return match.group(1)
    match_id = re.search(r'id=([a-zA-Z0-9_-]+)', url_or_id)
    if match_id:
        return match_id.group(1)
    if len(url_or_id) > 20 and '/' not in url_or_id:
        return url_or_id
    return None

def download_file_from_google_drive(file_id, destination):
    """ Télécharge un fichier public depuis Google Drive """
    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(URL, params={'id': file_id}, stream=True)
    
    token = None
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            token = value
            break
            
    if token:
        params = {'id': file_id, 'confirm': token}
        response = session.get(URL, params=params, stream=True)
        
    with open(destination, "wb") as f:
        for chunk in response.iter_content(32768):
            if chunk:
                f.write(chunk)
    print(f"✅ Fichier téléchargé depuis Google Drive -> {destination}")

def download_pdf_from_url(url, destination):
    """ Télécharge un PDF depuis une URL directe """
    drive_id = extract_google_drive_id(url)
    if drive_id:
        download_file_from_google_drive(drive_id, destination)
    else:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        resp = requests.get(url, headers=headers, stream=True)
        resp.raise_for_status()
        with open(destination, 'wb') as f:
            for chunk in resp.iter_content(32768):
                if chunk:
                    f.write(chunk)
        print(f"✅ Fichier téléchargé depuis l'URL -> {destination}")

def extract_text_with_ocr_fallback(pdf_path):
    """ Extrait le texte d'un PDF (méthode texte direct + fallback OCR pour PDF scannés) """
    doc = fitz.open(pdf_path)
    full_text = ""
    scanned_pages_count = 0
    
    engine = None

    for i, page in enumerate(doc):
        page_text = page.get_text()
        if page_text and len(page_text.strip()) > 30:
            full_text += page_text + "\n"
        else:
            # Page scannée ! Utiliser l'OCR RapidOCR (neural network)
            scanned_pages_count += 1
            if engine is None:
                print("🔍 PDF scanné détecté (Image). Lancement de l'OCR IA local...")
                engine = RapidOCR()
            
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            result, _ = engine(img_bytes)
            if result:
                ocr_lines = [line[1] for line in result]
                full_text += "\n".join(ocr_lines) + "\n"

    if scanned_pages_count > 0:
        print(f"⚡ OCR effectué avec succès sur {scanned_pages_count} page(s) scannée(s) !")

    return full_text

def parse_qcms(raw_text):
    """ Découpe le texte brut (ou OCR) en objets QCMs structurés """
    lines = raw_text.splitlines()
    qcms = []
    
    current_qcm = None
    current_vignette = []
    
    # Regex robustes pour détecter les numéros de QCMs (ex: 1-, 1., QCM 1, Q1, 1 :)
    q_pattern = re.compile(r'^(?:QCM|Q|Question)?\s*(\d+)[\s.:\)-]+(.*)', re.IGNORECASE)
    # Regex pour les options (ex: A-, a., A), a-, B.)
    opt_pattern = re.compile(r'^\s*([A-Ea-e])[\s.:\)-]+(.*)', re.IGNORECASE)
    # Regex pour les corrigés s'ils sont dans le texte
    ans_pattern = re.compile(r'^(?:Réponse[s]?|Corrigé|Reponses?|Clef|Key)[\s:]*([A-Ea-e,\s]+)', re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        q_match = q_pattern.match(stripped)
        if q_match:
            q_num = q_match.group(1)
            q_title = q_match.group(2).strip()
            
            if current_qcm and current_qcm.get('options'):
                qcms.append(current_qcm)
                
            current_qcm = {
                "id": f"qcm_py_{q_num}_{int(os.times().system * 100)}",
                "tempNum": q_num,
                "question": f"QCM {q_num} : {q_title}" if q_title else f"QCM {q_num}",
                "vignetteText": "\n".join(current_vignette).strip(),
                "options": [],
                "explanationHtml": "<p>Explication issue de l'analyse automatique.</p>"
            }
            current_vignette = []
            continue

        opt_match = opt_pattern.match(stripped)
        if opt_match and current_qcm:
            letter = opt_match.group(1).upper()
            opt_text = opt_match.group(2).strip()
            current_qcm['options'].append({
                "letter": letter,
                "text": opt_text,
                "isCorrect": False
            })
            continue

        ans_match = ans_pattern.match(stripped)
        if ans_match and current_qcm:
            ans_str = ans_match.group(1).upper()
            correct_letters = re.findall(r'[A-E]', ans_str)
            for opt in current_qcm['options']:
                if opt['letter'] in correct_letters:
                    opt['isCorrect'] = True
            continue

        # Accumuler texte de vignette ou question ou continuation d'option
        if not current_qcm:
            current_vignette.append(stripped)
        else:
            if len(current_qcm['options']) == 0:
                current_qcm['question'] += " " + stripped
            else:
                current_qcm['options'][-1]['text'] += " " + stripped

    if current_qcm and current_qcm.get('options'):
        qcms.append(current_qcm)

    # Compléter correctAnswers
    for q in qcms:
        correct_indices = [idx for idx, o in enumerate(q['options']) if o.get('isCorrect')]
        q['correctAnswers'] = correct_indices if correct_indices else [0]
        q['type'] = 'MULTIPLE' if len(q['correctAnswers']) > 1 else 'SINGLE'

    return qcms

def format_as_text_import(qcms):
    """ Format en texte clair prêt à être collé dans le panel d'administration """
    text_out = []
    for q in qcms:
        if q.get('vignetteText'):
            text_out.append(f"--- VIGNETTE ---\n{q['vignetteText']}\n----------------")
        text_out.append(f"{q['question']}")
        for opt in q['options']:
            star = " *" if opt.get('isCorrect') else ""
            text_out.append(f"{opt['letter']}. {opt['text']}{star}")
        correct_str = "".join([o['letter'] for o in q['options'] if o.get('isCorrect')])
        if correct_str:
            text_out.append(f"Réponse : {correct_str}")
        text_out.append("\n")
    return "\n".join(text_out)

def upload_to_as_medix(qcms, site_url="http://localhost:3000", admin_key="asmedix-secret-admin"):
    """ Téléverse directement le lot de QCMs vers l'API AS-MEDIX """
    api_endpoint = f"{site_url.rstrip('/')}/api/admin/qcm/batch"
    headers = {
        "Content-Type": "application/json",
        "x-admin-key": admin_key
    }
    
    print(f"\n🚀 Envoi de {len(qcms)} QCM(s) vers {api_endpoint}...")
    try:
        resp = requests.post(api_endpoint, json={"qcms": qcms}, headers=headers, timeout=30)
        if resp.status_code == 200 and resp.json().get('success'):
            print(f"🎉 RÉSULTAT : {resp.json().get('count')} QCM(s) synchronisés avec succès dans la base de données et Supabase !")
            return True
        else:
            print(f"⚠️ Erreur serveur ({resp.status_code}) : {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Échec de la connexion à l'API du site : {e}")
        return False

def main():
    print("=" * 70)
    print(" 🏥 AS-MEDIX - EXTRACTEUR ET SYNCHRONISATEUR LOCAL DE QCMS (AVEC OCR)")
    print("=" * 70)

    source_input = ""
    if len(sys.argv) > 1:
        source_input = sys.argv[1]
    else:
        source_input = input("\n📍 Entrez le chemin du fichier PDF local OU le lien Google Drive / URL PDF : ").strip()

    if not source_input:
        print("❌ Aucune entrée fournie. Arrêt.")
        return

    temp_pdf = "temp_qcm_source.pdf"
    is_temp = False

    if source_input.startswith("http://") or source_input.startswith("https://") or "drive.google.com" in source_input:
        print("\n🌐 Téléchargement du fichier depuis le lien fourni...")
        download_pdf_from_url(source_input, temp_pdf)
        pdf_path = temp_pdf
        is_temp = True
    else:
        pdf_path = source_input.strip('"').strip("'")

    if not os.path.exists(pdf_path):
        print(f"❌ Fichier non trouvé : {pdf_path}")
        return

    print(f"\n📄 Extraction du texte (avec OCR si scanné) depuis : {pdf_path}...")
    raw_text = extract_text_with_ocr_fallback(pdf_path)
    print(f"✅ {len(raw_text)} caractères extraits du document.")

    qcms = parse_qcms(raw_text)
    print(f"\n✨ {len(qcms)} QCM(s) structuré(s) et détecté(s) !")

    # Sauvegarde Fichier JSON
    json_path = "qcms_extracted.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(qcms, f, ensure_ascii=False, indent=2)
    print(f"💾 Fichier JSON sauvegardé : {os.path.abspath(json_path)}")

    # Sauvegarde Fichier TXT propre
    txt_path = "qcms_formatted.txt"
    formatted_txt = format_as_text_import(qcms)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(formatted_txt)
    print(f"📝 Fichier Texte formaté sauvegardé : {os.path.abspath(txt_path)}")

    # Proposer le téléversement direct sur le site
    do_upload = input("\n⚡ Voulez-vous envoyer directement ces QCMs sur votre site AS-MEDIX ? (o/n) [défaut: o] : ").strip().lower()
    if do_upload in ['', 'o', 'oui', 'y', 'yes']:
        site_url = input("🌐 URL de votre site (ex: http://localhost:3000 ou https://votre-site.com) [défaut: http://localhost:3000] : ").strip()
        if not site_url:
            site_url = "http://localhost:3000"
        upload_to_as_medix(qcms, site_url=site_url)

    # Nettoyage
    if is_temp and os.path.exists(temp_pdf):
        try:
            os.remove(temp_pdf)
        except:
            pass

    print("\n✅ Opération terminée avec succès !")

if __name__ == "__main__":
    main()
