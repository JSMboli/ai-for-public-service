# AI for Public Sector Strategy & Operations — GitHub Pages site

A no-build, responsive public-facing site for **Dr Julius Sechang Mboli** to promote the three-day executive programme **The Application of Artificial Intelligence for Public Sector Strategy and Operations**, together with related AI consultancy and executive education.

## What is included

- Premium one-page landing site with responsive navigation.
- Animated hero constellation, floating topic nodes, scroll reveals, counters and subtle card tilt.
- Interactive three-day programme tabs covering 9 modules and 3 workshops.
- Interactive 90-day roadmap section.
- Consultancy / bespoke-delivery services.
- Course preview gallery built from selected pages of the supplied teaching deck.
- Instructor section with a safe profile-image placeholder.
- GitHub-Pages-compatible contact form that composes an email rather than storing data.
- Privacy page, robots.txt, sitemap.xml, favicon and Open Graph cover.
- Accessibility support, including `prefers-reduced-motion`.
- No framework and no build step.

## 1. REQUIRED: add your public contact details

Open:

`assets/js/config.js`

Replace these values:

```js
email: "YOUR_EMAIL@example.com",
linkedIn: "https://www.linkedin.com/in/YOUR-LINKEDIN/",
github: "https://github.com/YOUR-GITHUB-USERNAME",
siteUrl: "https://YOUR-GITHUB-USERNAME.github.io/public-sector-ai/"
```

The enquiry form will not send anything to a database. When a real email is configured it opens the visitor's default email application with the enquiry pre-filled.

## 2. Add a professional headshot

Place an image such as:

`assets/img/julius-profile.webp`

Then set in `assets/js/config.js`:

```js
profileImage: "assets/img/julius-profile.webp"
```

Recommended source image: portrait orientation, at least 1200 px high. WebP or JPEG is ideal.

## 3. Update GitHub Pages URLs

Replace `YOUR-GITHUB-USERNAME` in:

- `assets/js/config.js`
- `robots.txt`
- `sitemap.xml`

If the repository name is different from `public-sector-ai`, update that path too.

## 4. Publish on GitHub Pages

1. Create a new GitHub repository, for example `public-sector-ai`.
2. Upload **the contents of this folder** to the repository root.
3. Commit and push to the `main` branch.
4. In GitHub, go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.
7. GitHub will provide the public URL after deployment.

No npm, Node, React or build pipeline is required.

## 5. Optional custom domain

If you later use a domain or subdomain, add a `CNAME` file containing only the domain, then update `siteUrl`, `robots.txt` and `sitemap.xml`.

## Privacy / cookie note

The supplied site has no first-party analytics, advertising or tracking scripts. The enquiry form does not store submissions. It does load Google Fonts. A generic cookie banner has intentionally **not** been added because banners should reflect the technologies actually used rather than appearing by default.

If you later add Google Analytics, Meta Pixel, embedded marketing tools, a live-chat widget, embedded video with tracking, or a third-party form processor, review the UK privacy/cookie requirements and update `privacy.html` before publishing.

## Content strategy

The site intentionally does **not** publish the full slide decks. It shows selected preview images to demonstrate quality and methodology while keeping the complete teaching material private. The original course overview is included as a downloadable DOCX under `assets/docs/` and can be removed if you prefer lead-gated access.

## File structure

```text
.
├── index.html
├── privacy.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets
    ├── css/styles.css
    ├── js/config.js
    ├── js/main.js
    ├── docs/public-sector-ai-course-overview.docx
    └── img/
        ├── favicon.svg
        ├── og-cover.png
        └── slides/*.webp
```

## Suggested next edits before going live

- Add your real email, LinkedIn and GitHub profile.
- Add your professional headshot.
- Add 2–4 genuine teaching / workshop photographs if you have permission to publish them.
- Replace the short biography with the exact professional title and affiliations you want on the public site.
- Decide whether the course overview document should stay as a direct download or become an enquiry-only resource.
- Add testimonials only when you have explicit permission and exact wording.

