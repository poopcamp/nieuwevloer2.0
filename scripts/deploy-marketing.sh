#!/usr/bin/env bash
# Public marketing deploy for nieuwevloer.be.
#
# This is the only supported path for the public site.
# Never rsync web/dist or dist/ into the live/dist root.
# Never copy the built homepage over live/dist/index.html.
#
# Usage:
#   scripts/deploy-marketing.sh <built-dist> <live-dist>
#
# Each existing target index.html is copied to index.html.bak-YYYY-MM-DD
# before it is replaced. The build is refused unless the
# vloerder-vanderheyden <title> contains Vanderheyden.
set -euo pipefail

SRC="${1:-}"
DEST="${2:-}"

if [[ -z "$SRC" || -z "$DEST" ]]; then
  echo "Usage: scripts/deploy-marketing.sh <built-dist> <live-dist>" >&2
  echo "Refuses a bulk copy into the live root and refuses to write <live-dist>/index.html." >&2
  exit 2
fi

SRC="$(cd "$SRC" && pwd)"
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"

if [[ "$SRC" == "$DEST" ]]; then
  echo "REFUSE: source and destination are the same directory" >&2
  exit 1
fi

TITLE_FILE="$SRC/vloerder-vanderheyden/index.html"
if [[ ! -f "$TITLE_FILE" ]]; then
  echo "REFUSE: missing $TITLE_FILE" >&2
  exit 1
fi

TITLE="$(sed -n 's:.*<title>\([^<]*\)</title>.*:\1:p' "$TITLE_FILE" | head -n 1)"
if [[ "$TITLE" != *Vanderheyden* ]]; then
  echo "REFUSE: title does not contain Vanderheyden ($TITLE)" >&2
  exit 1
fi

copy_one() {
  local rel="$1"
  if [[ "$rel" == "index.html" || "$rel" == "/index.html" ]]; then
    echo "REFUSE: refusing to write live/dist/index.html" >&2
    exit 1
  fi
  if [[ "$rel" == *".."* ]]; then
    echo "REFUSE: unsafe path $rel" >&2
    exit 1
  fi
  local src="$SRC/$rel"
  local target="$DEST/$rel"
  if [[ ! -f "$src" ]]; then
    echo "REFUSE: missing source $src" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$target")"
  if [[ -f "$target" ]]; then
    local stamp
    stamp="$(date +%F)"
    local bak="$target.bak-$stamp"
    if [[ -e "$bak" ]]; then
      bak="$target.bak-$stamp-$(date +%H%M%S)"
    fi
    cp -p "$target" "$bak"
    echo "BACKUP $rel -> $(basename "$bak")"
  fi
  cp "$src" "$target"
  echo "OK $rel"
}

while IFS= read -r file; do
  rel="${file#"$SRC"/}"
  if [[ "$rel" == "index.html" ]]; then
    echo "SKIP homepage index.html"
    continue
  fi
  copy_one "$rel"
done < <(find "$SRC" -name index.html -type f | sort)

if [[ -f "$SRC/404.html" ]]; then
  copy_one "404.html"
else
  echo "REFUSE: missing 404.html" >&2
  exit 1
fi

DEPLOYED_TITLE="$(sed -n 's:.*<title>\([^<]*\)</title>.*:\1:p' "$DEST/vloerder-vanderheyden/index.html" | head -n 1)"
if [[ "$DEPLOYED_TITLE" != *Vanderheyden* ]]; then
  echo "REFUSE: deployed title does not contain Vanderheyden ($DEPLOYED_TITLE)" >&2
  exit 1
fi

if [[ -f "$DEST/index.html" ]]; then
  echo "HOMEPAGE_LEFT_IN_PLACE"
else
  echo "HOMEPAGE_NOT_CREATED"
fi

echo "MARKETING_DEPLOY_OK"
