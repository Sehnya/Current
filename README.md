# Current 🌊

**Stay ahead of the wave in tech**

A beautiful, comprehensive system for tracking and discovering popular development stacks, frameworks, and tools with real-time popularity metrics and trending analysis.

![Current Preview](https://via.placeholder.com/800x400/E0FBFC/134E4A?text=Current+-+Stay+ahead+of+the+wave+in+tech)

## ✨ Features

### 🎯 Core Features

- **130+ Tracked Stacks** across 20+ categories
- **Real-time Popularity Metrics** (GitHub stars, forks, downloads)
- **Smart Categorization** (frontend, backend, database, etc.)
- **Trending Analysis** with multiple sorting options
- **Intelligent Search** with fuzzy matching
- **Historical Tracking** of versions and popularity

### 🎨 Beautiful Design

- **Warm Cyan Palette** with deep teal accents
- **Responsive Design** optimized for all devices
- **Smooth Animations** powered by Framer Motion
- **Modern UI Components** with Tailwind CSS
- **Accessible** and user-friendly interface

### 🚀 Developer Experience

- **Monorepo Architecture** with API + Web frontend
- **Docker Compose** for easy local development
- **OrbStack/Docker** optimized setup
- **Docker Support** for easy deployment
- **TypeScript** throughout the stack
- **Comprehensive CLI** tools
- **Auto-generated Documentation**

## 🏗️ Architecture

```
current/
├── app/                 # FastAPI backend
│   ├── main.py         # API server
│   ├── crawler.py      # Stack data crawler
│   ├── storage.py      # Data persistence
│   ├── scheduler.py    # Automated updates
│   └── models.py       # Data models
├── web/                 # Next.js frontend
│   ├── pages/          # App routes
│   ├── components/     # Reusable UI components
│   └── styles/         # Tailwind CSS + custom styles
├── shared/              # Shared types and config
└── docker-compose.yml   # Development setup
```

## 🎨 Design System

### Color Palette

- **Backgrounds**: Soft Cyan Mist (`#E0FBFC`), Light Aqua (`#CFFAFE`), Warm Cyan Glow (`#A5F3FC`)
- **Text**: Deep Teal (`#134E4A`), Rich Teal (`#115E59`), Accent (`#0F766E`)
- **Actions**: Bright Cyan (`#22D3EE`), Teal Hover (`#14B8A6`)

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable spacing

## 🚀 Quick Start

### Self-Hosted Setup (Recommended)

1. **Prerequisites**
   - OrbStack (recommended) or Docker Desktop
   - Insomnia (optional, for API testing)

2. **One-Command Start**

   ```bash
   git clone <your-repo-url>
   cd current
   ./start-local.sh
   ```

3. **Access Your Stack**
   - **🌐 Web App**: http://localhost:3000
   - **🔌 API**: http://localhost:8000
   - **📚 API Docs**: http://localhost:8000/docs

4. **API Testing with Insomnia**
   - Import `insomnia-collection.json`
   - Pre-configured requests for all endpoints
   - Easy testing and development

5. **Stop Services**
   ```bash
   ./stop-local.sh
   ```

📖 **Detailed Guide**: See [SELF_HOSTING_GUIDE.md](./SELF_HOSTING_GUIDE.md) for complete setup instructions, troubleshooting, and production deployment.

### Manual Setup

#### Backend (API)

```bash
cd app
pip install -r requirements.txt
python cli.py update-stacks  # Initial data crawl
python run_server.py
```

#### Frontend (Web)

```bash
cd web
npm install
npm run dev
```

## 📊 Tracked Stacks

### Frontend Frameworks

React, Vue, Angular, Svelte, Solid, Next.js, Nuxt, SvelteKit, Remix, Astro, Gatsby

### Backend Frameworks

Express, FastAPI, Django, Flask, NestJS, Fastify, Koa, Hapi, Starlette, Tornado, Sanic

### UI Libraries & Styling

Tailwind CSS, Bootstrap, Material-UI, Ant Design, Chakra UI, Mantine, Styled Components, Emotion

### Database & ORM

Prisma, Drizzle, TypeORM, Sequelize, Mongoose, SQLAlchemy, Knex

### Data Science & ML

Pandas, NumPy, TensorFlow, PyTorch, Scikit-learn, Matplotlib, Plotly, Streamlit, Gradio

### Build Tools & Dev Experience

Webpack, Vite, Rollup, esbuild, Turbo, ESLint, Prettier, TypeScript, Babel

_...and 70+ more across 20+ categories_

## 🔥 API Endpoints

### Core Endpoints

- `GET /stacks` - List all tracked stacks
- `GET /stacks/{name}` - Get specific stack details
- `GET /stacks/category/{category}` - Filter by category
- `GET /stacks/search?q={query}` - Search stacks
- `GET /stacks/trending` - Get trending stacks
- `POST /stacks/refresh` - Manual refresh

### Example Usage

```bash
# Get trending frontend frameworks
curl "http://localhost:8000/stacks/trending?sort_by=stars&limit=5"

# Search for React-related tools
curl "http://localhost:8000/stacks/search?q=react"

# Get all database tools
curl http://localhost:8000/stacks/category/database
```

## 💻 CLI Commands

```bash
# Update all stacks
python app/cli.py update-stacks

# Update only fast-moving stacks
python app/cli.py update-stacks --fast

# Search stacks
python app/cli.py search tailwind

# Show trending stacks
python app/cli.py trending --sort-by downloads --limit 10

# Add new stack interactively
python app/cli.py add-stack
```

## 🌊 Pages & Features

### 🏠 Homepage

- Beautiful hero section with animated elements
- Feature highlights and statistics
- Call-to-action buttons

### 📚 Stacks Page

- Grid view of all stacks with filtering
- Category-based filtering
- Real-time search functionality
- Popularity metrics display

### 🔥 Trending Page

- Top trending stacks with rankings
- Multiple sorting options (stars, downloads, forks)
- Insights and statistics
- Featured top 3 with special styling

### 🔍 Search Page

- Real-time search with debouncing
- Popular search suggestions
- Fuzzy matching for typos
- Search tips and guidance

## 🚀 Deployment

### Docker Production

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale api=2 --scale web=2
```

### Production Deployment

For production deployment, use the same Docker Compose setup on your server:

```bash
# On your production server
git clone <your-repo>
cd current

# Set production environment variables
export NEXT_PUBLIC_API_URL=http://your-domain.com:8000

# Start services
docker-compose up -d
```

See [SELF_HOSTING_GUIDE.md](./SELF_HOSTING_GUIDE.md) for detailed production setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Stacks

```bash
# Interactive CLI
python app/cli.py add-stack

# Or edit shared/config.json manually
```

## 📈 Roadmap

### ✅ Phase 1: Enhanced Metrics (Current)

- GitHub stars, forks, download statistics
- Category-based organization
- Trending analysis
- Beautiful web interface

### 🔄 Phase 2: Advanced Features (Next)

- Historical trend charts
- Stack comparison tool
- Personalized recommendations
- Community ratings

### 🎯 Phase 3: Community Platform (Future)

- User accounts and profiles
- Stack collections and favorites
- Community-driven content
- Integration guides

### 🚀 Phase 4: Enterprise Features (Future)

- Team collaboration tools
- Private stack tracking
- Custom categories
- API rate limiting

## 📄 License

MIT License - feel free to use this for your own stack tracking needs!

## 🙏 Acknowledgments

- **Design Inspiration**: Modern web design trends with a focus on accessibility
- **Data Sources**: npm, PyPI, GitHub APIs
- **Community**: Developer community for stack suggestions and feedback

---

<div align="center">
  <strong>Built with ❤️ for the developer community</strong>
  <br>
  <em>Stay ahead of the wave in tech with Current</em>
</div>
