#!/usr/bin/env bash
set -euo pipefail

# Generate the shared icon set and Open Graph image.
# Requirements: resvg (cargo install resvg), sips (macOS)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/public"
LOGO_SVG="$PUBLIC_DIR/logo.svg"
BANNER_SVG="$PUBLIC_DIR/og-banner.svg"

if ! command -v resvg &>/dev/null; then
    echo "Error: resvg is not installed. Install with: cargo install resvg"
    exit 1
fi

echo "Generating shared assets..."

resvg --width 512 --height 512 "$LOGO_SVG" "$PUBLIC_DIR/logo.png"
cp "$LOGO_SVG" "$PUBLIC_DIR/favicon.svg"
resvg --width 16 --height 16 "$LOGO_SVG" "$PUBLIC_DIR/favicon-16x16.png"
resvg --width 32 --height 32 "$LOGO_SVG" "$PUBLIC_DIR/favicon-32x32.png"

ICO_DIR="$(mktemp -d)"
trap 'rm -rf "$ICO_DIR"' EXIT
resvg --width 48 --height 48 "$LOGO_SVG" "$ICO_DIR/48.png"
sips -s format ico "$ICO_DIR/48.png" --out "$PUBLIC_DIR/favicon.ico" >/dev/null 2>&1

resvg --width 180 --height 180 "$LOGO_SVG" "$PUBLIC_DIR/apple-touch-icon.png"
resvg --width 192 --height 192 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-192x192.png"
resvg --width 192 --height 192 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-192x192m.png"
resvg --width 512 --height 512 "$LOGO_SVG" "$PUBLIC_DIR/android-chrome-512x512.png"
resvg --width 150 --height 150 "$LOGO_SVG" "$PUBLIC_DIR/mstile-150x150.png"
cp "$LOGO_SVG" "$PUBLIC_DIR/safari-pinned-tab.svg"
resvg --width 1280 --height 640 "$BANNER_SVG" "$PUBLIC_DIR/og-banner.png"

echo "Done! Shared assets generated."
