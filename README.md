# Molivor Studio — Digital Agency Website

A modern, production-ready digital agency website built with **Node.js + Express** and vanilla HTML/CSS/JS. Features a premium dark-themed UI with smooth animations, responsive design, and clean architecture.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
Avox Media/
├── public/                   # Static assets
│   ├── css/
│   │   └── style.css         # Design system & all styles
│   ├── js/
│   │   └── main.js           # Vanilla JS engine
│   ├── favicon.svg           # SVG favicon
│   ├── index.html            # Homepage
│   ├── services.html         # Services page
│   ├── contact.html          # Contact page
│   └── 404.html              # Custom error page
├── server.js                 # Express server
├── package.json              # Dependencies & scripts
├── firebase.json             # Firebase Hosting config
├── .firebaserc               # Firebase project settings
└── .gitignore
```

---

## 🌐 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, about, services grid, stats, team, CTA |
| `/services` | Services | 4 service sections with expandable accordions |
| `/contact` | Contact | Form with validation + contact info sidebar |
| `/*` | 404 | Custom branded error page |

All routes support both clean URLs (`/contact`) and `.html` extension (`/contact.html`).

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Primary BG** | `#0c0c1d` (Deep Indigo) |
| **Accent** | `#6366f1` (Vibrant Purple) |
| **Headings** | Space Grotesk (Google Fonts) |
| **Body** | Inter (Google Fonts) |
| **Layout** | CSS Grid + Flexbox, 1200px max |
| **Radius** | 8px / 12px / 20px scale |

---

## ⚡ Features

- **Express Server** — Helmet security headers, gzip compression, static caching
- **Zero Dependencies UI** — No jQuery, Bootstrap, or CSS frameworks
- **Responsive** — Mobile-first with breakpoints at 480px, 768px, 1024px
- **Animations** — Scroll-triggered reveals via Intersection Observer
- **Accessibility** — ARIA labels, focus states, skip links, reduced-motion support
- **SEO** — Meta descriptions, Open Graph tags, semantic HTML5
- **Form Validation** — Real-time client-side validation with error states
- **Clean URLs** — `/services` instead of `/services.html`
- **Custom 404** — Branded error page with navigation back

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Server** | Node.js + Express |
| **Security** | Helmet |
| **Compression** | compression (gzip) |
| **Frontend** | Vanilla HTML5 / CSS3 / JavaScript |
| **Fonts** | Google Fonts (Inter, Space Grotesk) |
| **Hosting** | Firebase Hosting (configured) |

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with auto-restart |

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Login to Firebase
firebase login

# Deploy
firebase deploy --only hosting
```

The `firebase.json` is preconfigured with:
- Clean URLs (no `.html` extensions needed)
- 1-year cache for static assets (JS, CSS, SVG)
- No-cache for HTML pages
- URL rewrites for `/services` and `/contact`

---

## 📄 License

MIT
