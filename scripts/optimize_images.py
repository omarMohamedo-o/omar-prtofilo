#!/usr/bin/env python3
"""
Optimize images: resize, save JPEG fallback and WebP, copy SVGs.
Run from repository root: `python3 scripts/optimize_images.py`
"""
import sys
from pathlib import Path
from PIL import Image
import shutil

HERE = Path(__file__).resolve().parent
INPUT_DIR = HERE.parent / 'frontend' / 'public' / 'images'
OUTPUT_DIR = HERE.parent / 'frontend' / 'public' / 'images-optimized'

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def optimize_image(p: Path):
    try:
        with Image.open(p) as img:
            img_format = img.format
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255,255,255))
                background.paste(img, mask=img.split()[-1])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Resize if wider than 1920
            max_width = 1920
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.LANCZOS)

            rel = p.relative_to(INPUT_DIR)
            out_base = OUTPUT_DIR / rel.parent
            out_base.mkdir(parents=True, exist_ok=True)

            # Save JPEG fallback
            jpeg_path = out_base / (p.stem + '.jpg')
            img.save(jpeg_path, format='JPEG', quality=70, optimize=True, progressive=True)

            # Save WebP
            webp_path = out_base / (p.stem + '.webp')
            img.save(webp_path, format='WEBP', quality=75, method=6)

            orig_size = p.stat().st_size
            opt_size = jpeg_path.stat().st_size
            print(f"Optimized {rel}: {orig_size//1024}KB -> {opt_size//1024}KB")
            return orig_size, opt_size
    except Exception as e:
        print(f"Error optimizing {p}: {e}")
        return 0,0

def copy_svg(p: Path):
    rel = p.relative_to(INPUT_DIR)
    dest = OUTPUT_DIR / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(p, dest)
    print(f"Copied SVG {rel}")

def main():
    if not INPUT_DIR.exists():
        print(f"Input dir not found: {INPUT_DIR}")
        sys.exit(1)

    imgs = list(INPUT_DIR.rglob('*'))
    total_orig = 0
    total_opt = 0
    processed = 0

    for p in imgs:
        if p.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            o, n = optimize_image(p)
            total_orig += o
            total_opt += n
            processed += 1
        elif p.suffix.lower() == '.svg':
            copy_svg(p)

    print('\nSummary:')
    print(f'Processed images: {processed}')
    if total_orig:
        saved = total_orig - total_opt
        print(f'Original size: {total_orig/1024/1024:.2f} MB')
        print(f'Optimized size: {total_opt/1024/1024:.2f} MB')
        print(f'Saved: {saved/1024/1024:.2f} MB')

if __name__ == "__main__":
    main()
