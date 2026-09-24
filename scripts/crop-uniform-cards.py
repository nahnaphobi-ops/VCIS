"""Crop the five uniform category portraits tightly from the mockup."""

from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\AJA FOBI\.cursor\projects\c-Users-AJA-FOBI-VictoriaCrestWebsite\assets"
    r"\c__Users_AJA_FOBI_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"d292d93a020359137f8043808e1def55_images_WhatsApp_Image_2026-09-19_at_8.20.14_PM-"
    r"b83b13c0-6900-4346-a195-229733ddacab.jpg"
)
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "gallery" / "uniforms"

# Tuned card boxes as fractions of the 1024x514 source (inside rounded frames).
# Each tuple: (left, top, right, bottom) — portrait only, labels added in HTML.
CARDS = {
    "creche-kg": (0.038, 0.055, 0.218, 0.78),
    "primary-boys": (0.232, 0.055, 0.412, 0.78),
    "primary-girls": (0.426, 0.055, 0.606, 0.78),
    "jhs-boys": (0.620, 0.055, 0.800, 0.78),
    "jhs-girls": (0.814, 0.055, 0.994, 0.78),
}


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    print(f"source: {w}x{h}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, (l, t, r, b) in CARDS.items():
        box = (int(w * l), int(h * t), int(w * r), int(h * b))
        card = im.crop(box)
        # Inset a few pixels to clear rounded navy/orange frame edges.
        inset = 4
        card = card.crop((inset, inset, card.width - inset, card.height - inset))
        out = OUT_DIR / f"{name}.jpg"
        card.save(out, quality=92, optimize=True)
        print(f"wrote {out.name}: {card.size}")


if __name__ == "__main__":
    main()
