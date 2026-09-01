#!/usr/bin/env python3
"""Generate or verify the repository-owned 1200x630 Open Graph image."""

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ModuleNotFoundError as error:
    if error.name != "PIL":
        raise
    raise SystemExit(
        "Pillow is required to generate the OGP image. "
        "Install it in a virtual environment with: "
        "python3 -m pip install --no-deps -r tools/requirements-ogp.txt"
    ) from error


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "ogp.png"
APPS = [
    ("SubLog", ROOT / "public" / "apps" / "sublog" / "icon.png"),
    ("CafLog", ROOT / "public" / "apps" / "caflog" / "icon.png"),
]
def font(size: int) -> ImageFont.FreeTypeFont:
    # Pillow に同梱されたフォントを使い、OS のフォント差分を生成物へ持ち込まない。
    return ImageFont.load_default(size=size)


def rounded_icon(path: Path, size: int) -> Image.Image:
    image = Image.open(path).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 5, fill=255)
    image.putalpha(mask)
    return image


def render() -> Image.Image:
    width, height = 1200, 630
    image = Image.new("RGBA", (width, height))
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            tx = x / (width - 1)
            ty = y / (height - 1)
            r = int(28 + 59 * tx + 40 * (1 - ty))
            g = int(25 + 33 * tx + 16 * ty)
            b = int(75 + 73 * tx + 45 * ty)
            pixels[x, y] = (min(r, 255), min(g, 255), min(b, 255), 255)

    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-140, -210, 600, 520), fill=(255, 103, 190, 118))
    glow_draw.ellipse((690, 120, 1390, 820), fill=(71, 193, 255, 112))
    image = Image.alpha_composite(image, glow.filter(ImageFilter.GaussianBlur(90)))

    panel = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(panel)
    draw.rounded_rectangle((72, 58, 1128, 572), radius=52, fill=(255, 255, 255, 30), outline=(255, 255, 255, 95), width=2)
    draw.rounded_rectangle((73, 59, 1127, 571), radius=51, outline=(255, 255, 255, 35), width=7)
    image = Image.alpha_composite(image, panel)
    draw = ImageDraw.Draw(image)

    draw.text((138, 116), "AppLibrary", font=font(72), fill=(255, 255, 255, 255), stroke_width=1, stroke_fill=(255, 255, 255, 90))
    draw.text((142, 210), "A collection of things I've made.", font=font(30), fill=(238, 235, 255, 235))
    draw.text((142, 274), "Small tools for iOS, the Web, and beyond.", font=font(22), fill=(231, 227, 255, 210))

    pill_font = font(19)
    pill_x = 142
    badges = Image.new("RGBA", image.size, (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badges)
    badge_labels: list[tuple[int, str]] = []
    for label in ("Static Next.js", "Vercel", "app.yutodev.com"):
        box = draw.textbbox((0, 0), label, font=pill_font)
        pill_width = box[2] - box[0] + 34
        badge_draw.rounded_rectangle((pill_x, 338, pill_x + pill_width, 382), radius=22, fill=(255, 255, 255, 35), outline=(255, 255, 255, 75), width=1)
        badge_labels.append((pill_x, label))
        pill_x += pill_width + 12
    image = Image.alpha_composite(image, badges)
    draw = ImageDraw.Draw(image)
    for label_x, label in badge_labels:
        draw.text((label_x + 17, 346), label, font=pill_font, fill=(255, 255, 255, 225))

    icon_size = 142
    icon_x = 718
    for name, path in APPS:
        icon = rounded_icon(path, icon_size)
        shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
        shadow.paste((0, 0, 0, 115), (icon_x + 10, 204, icon_x + icon_size + 10, 204 + icon_size), icon.getchannel("A"))
        image = Image.alpha_composite(image, shadow.filter(ImageFilter.GaussianBlur(18)))
        image.alpha_composite(icon, (icon_x, 188))
        label_box = draw.textbbox((0, 0), name, font=font(20))
        label_width = label_box[2] - label_box[0]
        draw = ImageDraw.Draw(image)
        draw.text((icon_x + (icon_size - label_width) / 2, 348), name, font=font(20), fill=(255, 255, 255, 225))
        icon_x += 174

    draw.text((142, 485), "APP COLLECTION", font=font(18), fill=(255, 255, 255, 175), spacing=4)
    return image.convert("RGB")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when public/ogp.png is out of date")
    args = parser.parse_args()
    generated = render()

    if args.check:
        if not OUTPUT.is_file():
            print(f"Missing generated OGP image: {OUTPUT}")
            return 1
        with Image.open(OUTPUT) as existing:
            existing_rgb = existing.convert("RGB")
            if existing_rgb.size != generated.size or existing_rgb.tobytes() != generated.tobytes():
                print("public/ogp.png is stale; run npm run generate:ogp")
                return 1
        print("OGP image synchronized")
        return 0

    generated.save(OUTPUT, format="PNG", optimize=False)
    print(f"Generated {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
