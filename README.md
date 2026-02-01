# burintbevis.com

Personal website for Burint Bevis, built with Hugo + the Blowfish theme.

## Preview locally

### In GitHub Codespaces
```bash
hugo server --bind 0.0.0.0 --port 1313
Then: Ports → 1313 → Open in Browser.

On your own computer
bash

hugo server
Open http://localhost:1313.

Editing content
Home page: _index.md
Research page: _index.md
Blog posts: content/blog/posts/
Contact page: _index.md
CV PDF: cv.pdf
Publishing workflow
Work on draft. Merge to main only when ready to publish.

bash

git checkout draft
# edit files
git add -A
git commit -m "Message"
git push
Publish later:

bash

git checkout main
git merge draft
git push
Theme submodule (important)
After cloning (or if Hugo shows missing layouts/404s), run:

bash

git submodule update --init --recursive
Customizations we added
Fonts + favicon + small CSS tweaks: extend-head.html
Homepage spacing tweak: profile.html
Brand palette notes: BRAND_COLORS.md
Netlify notes
Netlify deploys from main with:

Build: hugo --gc --minify
Publish dir: public