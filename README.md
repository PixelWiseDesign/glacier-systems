# Glacier Systems — Company Website

Professional marketing website for **Glacier Systems**, an intelligent automation company. Built with pure HTML, CSS, and JavaScript — no frameworks or dependencies required.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure & semantic markup |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript | Interactivity and animations |
| [Google Fonts](https://fonts.google.com) | Rajdhani (headings) + Inter (body) |

No build tools, no npm, no frameworks. Just open and go.

---

## Getting Started

**Run locally:**

1. Clone the repository:
   ```bash
   git clone https://github.com/PixelWiseDesign/glacier-systems.git
   ```
2. Open `index.html` in your browser — that's it.

No server required. Works by opening the file directly.

---

## Deployment

### GitHub Pages
1. Go to your repo **Settings → Pages**
2. Set source to `main` branch, `/ (root)` folder
3. Click **Save** — your site will be live at `https://pixelwisedesign.github.io/glacier-systems`

### Netlify (Recommended)
1. Drag and drop the project folder onto [netlify.com/drop](https://netlify.com/drop)
2. Your site is instantly live with a public URL

### Any Static Host
Upload `index.html`, `styles.css`, and `script.js` to any web host (Vercel, Cloudflare Pages, traditional hosting, etc.)

---

## Page Sections

| Section | Description |
|---|---|
| **Navigation** | Fixed top bar with scroll-blur, active links, mobile hamburger menu |
| **Hero** | Animated particle canvas, live stat counters, call-to-action |
| **Trust Banner** | Client company name strip |
| **Services** | 6 service cards — BPA, AI Automation, RPA, Integration, Consulting, Analytics |
| **About** | Orbital animation graphic, company mission and pillars |
| **Industries** | 6 industry verticals served |
| **Results** | Animated metrics counters + rotating client testimonials |
| **Process** | 4-step timeline: Discovery → Strategy → Build → Deploy |
| **Contact** | Contact info + validated inquiry form |
| **Footer** | Links, social icons, legal |

---

## Customization

### Colors
All brand colors are defined as CSS variables at the top of `styles.css`:

```css
:root {
  --primary:       #1a9fd4;  /* Main blue */
  --primary-light: #5ac8f5;  /* Ice blue */
  --navy:          #0a1628;  /* Dark background */
}
```

### Content
All text content is in `index.html`. Search for the section you want to update and edit directly.

### Contact Form
The form currently simulates a submission. To make it functional, replace the `setTimeout` inside `initContactForm()` in `script.js` with your preferred form handler (e.g. [Formspree](https://formspree.io), [Netlify Forms](https://docs.netlify.com/forms/setup/), or your own backend).

---

## Project Structure

```
glacier-systems/
├── index.html      # Full page structure and content
├── styles.css      # All styles, animations, and responsive design
├── script.js       # Interactivity: particles, counters, form, nav
└── README.md       # This file
```

---

&copy; 2026 Glacier Systems. All rights reserved.
