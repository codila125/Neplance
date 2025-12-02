# 🎨 Neplance Client

Frontend application for Neplance - built with Next.js 16 and React 19.

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- Running Neplance server (see [../server/README.md](../server/README.md))

### Installation

```bash
cd client

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
npm run dev
```

**Access**: http://localhost:3000

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |

---

## 🔧 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📁 Structure

```
client/
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   ├── lib/          # Utilities
│   └── styles/       # CSS files
├── public/           # Static assets
└── .env.local        # Your config (create this)
```

---

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- React 19
- TailwindCSS 4
- Biome (linting)
- React Compiler

---

## 🐛 Troubleshooting

**Port in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**API not connecting?**
- Check backend is running on port 3001
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Build errors?**
```bash
rm -rf .next node_modules
npm install
```

---

Need help? Check the [main README](../README.md)
