#!/usr/bin/env bash
set -euo pipefail

# Generate all public image assets from logo.svg and og-banner.svg
# Requirements: resvg (cargo install resvg), sips (macOS)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/public"

LOGO_SVG="$PUBLIC_DIR/logo.svg"
BANNER_SVG="$PUBLIC_DIR/og-banner.svg"

if ! command -v resvg &>/dev/null; then
    echo "Error: resvg is not installed. Install with: cargo install resvg"
    exit 1
fi

echo "Generating assets from SVG sources..."

# --- From logo.svg ---

# logo.png (512x512)
resvg --width 512 --height 512 "$LOGO_SVG" "$PUBLIC_DIR/logo.png"
echo "  logo.png"

# favicon.svg (copy as-is)
cp "$LOGO_SVG" "$PUBLIC_DIR/favicon.svg"
echo "  favicon.svg"

# favicon-16x16.png
resvg --width 16 --height 16 "$LOGO_SVG" "$PUBLIC_DIR/favicon-16x16.png"
echo "  favicon-16x16.png"

# favicon-32x32.png
resvg --width 32 --height 32 "$LOGO_SVG" "$PUBLIC_DIR/favicon-32x32.png"
echo "  favicon-32x32.png"

# favicon.ico
TMPDIR_ICO="$(mktemp -d)"
resvg --width 48 --height 48 "$LOGO_SVG" "$TMPDIR_ICO/48.png"
sips -s format ico "$TMPDIR_ICO/48.png" --out "$PUBLIC_DIR/favicon.ico" >/dev/null 2>&1
rm -rf "$TMPDIR_ICO"
echo "  favicon.ico"

# apple-touch-icon.png (180x180)
resvg --width 180 --height 180 "$LOGO_SVG" "$PUBLIC_DIR/apple-touch-icon.png"
echo "  apple-touch-icon.png"

# android-chrome-192x192.png
resvg --width 192 --height 192 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-192x192.png"
echo "  android-chrome-192x192.png"

# android-chrome-192x192m.png (maskable variant, same source)
resvg --width 192 --height 192 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-192x192m.png"
echo "  android-chrome-192x192m.png"

# android-chrome-512x512.png
resvg --width 512 --height 512 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-512x512.png"
echo "  android-chrome-512x512.png"

# mstile-150x150.png
resvg --width 150 --height 150 "$LOGO_SVG" "$PUBLIC_DIR/mstile-150x150.png"
echo "  mstile-150x150.png"

# safari-pinned-tab.svg (copy logo as-is)
cp "$LOGO_SVG" "$PUBLIC_DIR/safari-pinned-tab.svg"
echo "  safari-pinned-tab.svg"

# --- From og-banner.svg ---

# og-banner.png (1280x640)
resvg --width 1280 --height 640 "$BANNER_SVG" "$PUBLIC_DIR/og-banner.png"
echo "  og-banner.png"

echo "Done! All assets generated."
