# Marketing deploy (public site)

The public site is deployed only with `scripts/deploy-marketing.sh`.

Never rsync `web/dist` or `dist/` into the live/dist root. That would overwrite `live/dist/index.html`. The homepage file is locked and is not part of this copy.

## Build

```bash
npm ci --legacy-peer-deps
npm run build:seo
```

`build:seo` runs `vite build` and then `node scripts/prerender-meta.mjs`.

## Output files that change

Prerender reads `dist/index.html` and does not modify it.

It writes:

- `dist/<route>/index.html` for every path in `src/seo/route-meta-2026-09-26.json` and `src/seo/extra-route-meta.json` (town pages, regio, blog, legal, `/diensten/vloeren/`, `/diensten/terrassen/`, `/diensten/badkamerrenovatie/`, and the other public routes)
- `dist/404.html` (noindex, no canonical)
- `dist/seo-output-files.txt` (the list above)

`vite build` also emits hashed files under `dist/assets/`. Every generated HTML file must reference an `/assets/index-*.js` that exists. Do not hand-patch an entry such as `index-apiFix-*.js`.

## Copy to the Home Server

```bash
scripts/deploy-marketing.sh dist /mnt/TheLord/Nieuwevloer/nieuwevloer/live/dist
```

The script:

1. Refuses to copy `dist/index.html` onto `live/dist/index.html`.
2. Backs up each existing target (`index.html.bak-YYYY-MM-DD`) before replacing it.
3. Copies route `index.html` files one by one, plus `404.html`.
4. Aborts unless the `vloerder-vanderheyden` `<title>` contains `Vanderheyden`.

Nginx, after the files are in place:

```nginx
error_page 404 /404.html;
```

Admin SPA deploys stay on their own path. Do not point that sync at the live/dist root either.
