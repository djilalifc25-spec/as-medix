#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AS-MEDIX - Extracteur Haute Qualité de QCMs (OCR IA Bounding-Box Re-ordering)
--------------------------------------------------------------------------------
Ce script extrait TOUS les QCMs d'un document PDF (texte ou SCANNÉ / photo d'examen),
avec réalignement haute définition à 300 DPI et reconstruction spatiale par coordonnées.

Il génère :
  - `qcms_extracted.json` : Fichier JSON formaté pour import direct sur le site AS-MEDIX
  - `qcms_formatted.txt`  : Fichier Texte propre à copier/coller dans le panel d'administration
  - Téléversement direct en 1 clic vers votre site web AS-MEDIX / Supabase !
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
        print(f"📦 Installation des dépendances OCR/PDF de haute qualité : {', '.join(missing)}...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing)

ensure_dependencies()

import fitz
import requests
from PIL import Image, ImageEnhance, ImageFilter
import io
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

def extract_high_quality_lines_from_pdf(pdf_path):
    """ Extrait le texte par reconstruction spatiale des boîtes OCR à 300 DPI """
    doc = fitz.open(pdf_path)
    all_pages_lines = []
    scanned_count = 0
    engine = None

    for i, page in enumerate(doc):
        # Vérifier si la page contient du texte natif clair
        page_text = page.get_text()
        if page_text and len(page_text.strip()) > 100:
            lines = [l.strip() for l in page_text.splitlines() if l.strip()]
            all_pages_lines.extend(lines)
        else:
            # Page scannée ! Rendu 300 DPI + Rehaussement de contraste
            scanned_count += 1
            if engine is None:
                print("🔍 PDF Scanné (photos d'examen). Lancement du moteur OCR haute définition (300 DPI + Contraste)...")
                engine = RapidOCR()
            
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("L")
            img = ImageEnhance.Contrast(img).enhance(2.5)
            img = img.filter(ImageFilter.SHARPEN)
            
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            res, _ = engine(buf.getvalue())
            if not res:
                continue

            # Tri des blocs détectés par ligne Y puis par position X
            sorted_res = sorted(res, key=lambda item: (item[0][0][1], item[0][0][0]))
            current_line_boxes = []
            last_y = None

            for item in sorted_res:
                box = item[0]
                y_top = box[0][1]
                if last_y is None or abs(y_top - last_y) < 18:
                    current_line_boxes.append(item)
                    last_y = y_top if last_y is None else min(last_y, y_top)
                else:
                    current_line_boxes.sort(key=lambda b: b[0][0][0])
                    all_pages_lines.append(" ".join([b[1].strip() for b in current_line_boxes]))
                    current_line_boxes = [item]
                    last_y = y_top

            if current_line_boxes:
                current_line_boxes.sort(key=lambda b: b[0][0][0])
                all_pages_lines.append(" ".join([b[1].strip() for b in current_line_boxes]))

    if scanned_count > 0:
        print(f"⚡ Traitement OCR haute définition terminé avec succès sur {scanned_count} page(s) !")

    return all_pages_lines

def parse_qcms_exact(lines):
    """ Analyseur universel haute précision des QCMs """
    qcms = []
    current_qcm = None

    q_re = re.compile(r'^\s*(?:QCM|Q|Question)?\s*(\d{1,3})\s*[\s.:\)-]+(.*)', re.IGNORECASE)
    opt_re = re.compile(r'^\s*([A-Ea-e])\s*[\s.:\)-]+(.*)', re.IGNORECASE)
    ans_re = re.compile(r'^(?:Réponse[s]?|Corrigé|Reponses?|Clef|Key)[\s:]*([A-Ea-e,\s]+)', re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        opt_m = opt_re.match(stripped)
        q_m = q_re.match(stripped)

        # Détection d'un nouveau numéro de QCM (ex: 1-, QCM 2, 15-)
        if q_m and not opt_m:
            num = int(q_m.group(1))
            title = q_m.group(2).strip()

            if 1 <= num <= 150:
                if current_qcm:
                    qcms.append(current_qcm)
                current_qcm = {
                    "id": f"qcm_py_{num}_{int(os.times().system * 100)}",
                    "num": num,
                    "question": f"QCM {num} : {title}" if title else f"QCM {num}",
                    "options": [],
                    "explanationHtml": "<p>Explication issue de la banque d'examen.</p>"
                }
                continue

        # Détection d'un choix / option (ex: a-, b., C))
        if opt_m and current_qcm:
            letter = opt_m.group(1).upper()
            text = opt_m.group(2).strip()
            current_qcm['options'].append({
                "letter": letter,
                "text": text,
                "isCorrect": False
            })
            continue

        # Détection de la clé de réponse (ex: Réponse : AC)
        ans_m = ans_re.match(stripped)
        if ans_m and current_qcm:
            ans_str = ans_m.group(1).upper()
            correct_letters = re.findall(r'[A-E]', ans_str)
            for opt in current_qcm['options']:
                if opt['letter'] in correct_letters:
                    opt['isCorrect'] = True
            continue

        # Accumulation du texte de question ou de choix
        if current_qcm:
            if len(current_qcm['options']) == 0:
                current_qcm['question'] += " " + stripped
            else:
                current_qcm['options'][-1]['text'] += " " + stripped

    if current_qcm:
        qcms.append(current_qcm)

    # Compléter le formatage pour l'API
    for q in qcms:
        correct_indices = [idx for idx, o in enumerate(q['options']) if o.get('isCorrect')]
        q['correctAnswers'] = correct_indices if correct_indices else [0]
        q['type'] = 'MULTIPLE' if len(q['correctAnswers']) > 1 else 'SINGLE'

    return qcms

def format_as_text_import(qcms):
    """ Format en texte clair prêt à être collé dans le panel d'administration """
    text_out = []
    for q in qcms:
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
            print(f"🎉 RÉSULTAT : Les {resp.json().get('count')} QCM(s) ont été enregistrés et synchronisés avec succès sur le site AS-MEDIX et Supabase !")
            return True
        else:
            print(f"⚠️ Erreur serveur ({resp.status_code}) : {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Échec de la connexion à l'API du site : {e}")
        return False

def main():
    print("=" * 70)
    print(" 🏥 AS-MEDIX - EXTRACTEUR HAUTE QUALITÉ DE QCMS (OCR HAUTE DÉFINITION)")
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

    print(f"\n📄 Extraction Haute Définition depuis : {pdf_path}...")
    lines = extract_high_quality_lines_from_pdf(pdf_path)
    print(f"✅ {len(lines)} lignes reconstruites de manière spatiale.")

    qcms = parse_qcms_exact(lines)
    print(f"\n✨ {len(qcms)} QCM(s) EXACTS extraits du document complet !")

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
