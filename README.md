# Portfolio Website

Modern 3D portfolio website built with React, Vite, and Tailwind CSS.

## Features

- 🎨 Modern design with dark theme
- 🚀 Fast performance with Vite
- 📱 Fully responsive
- 🎭 Smooth animations with Framer Motion
- 📊 GitHub API integration
- 🔥 Firebase contact form
- ♿ Accessibility compliant

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js
- **Backend**: Firebase (contact form)
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your GitHub token to `.env`:
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Generate a new token with `public_repo` scope
   - Add it to your `.env` file

5. Start development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── firebase/           # Firebase configuration
```

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT License - see LICENSE file for details.

---

**Version**: 1.0.0  
**Status**: Production Ready ✅