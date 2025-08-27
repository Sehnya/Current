# 📁 Current - Project Structure

Clean monorepo structure for the Current stack tracking platform.

## 🏗️ Directory Structure

```
current/
├── api/                     # FastAPI Backend Service
│   ├── main.py             # API server entry point
│   ├── crawler.py          # Stack data crawler
│   ├── storage.py          # Data persistence layer
│   ├── scheduler.py        # Automated update scheduler
│   ├── models.py           # Pydantic data models
│   ├── cli.py              # Command-line interface
│   ├── docs_generator.py   # API documentation generator
│   ├── kiro.config.json    # Stack configuration
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker container config
│   ├── railway.toml        # Railway deployment config
│   ├── nixpacks.toml       # Nixpacks build config
│   ├── Procfile            # Process definition
│   ├── runtime.txt         # Python version
│   └── .env.example        # Environment variables template
│
├── web/                     # Next.js Frontend Service
│   ├── pages/              # Next.js routes
│   │   ├── _app.tsx        # App wrapper
│   │   ├── index.tsx       # Homepage
│   │   ├── stacks.tsx      # Stacks listing page
│   │   ├── trending.tsx    # Trending stacks page
│   │   └── search.tsx      # Search page
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Hero.tsx        # Homepage hero section
│   │   └── StackCard.tsx   # Stack display card
│   ├── styles/             # Styling
│   │   └── globals.css     # Global styles + Tailwind
│   ├── public/             # Static assets
│   │   └── favicon.ico     # Site favicon
│   ├── package.json        # Node.js dependencies
│   ├── next.config.js      # Next.js configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── postcss.config.js   # PostCSS config
│   ├── Dockerfile          # Docker container config
│   ├── railway.toml        # Railway deployment config
│   ├── nixpacks.toml       # Nixpacks build config
│   ├── Procfile            # Process definition
│   └── .env.example        # Environment variables template
│
├── shared/                  # Shared Configuration & Types
│   ├── types/
│   │   └── stack.ts        # TypeScript type definitions
│   └── config.json         # Shared configuration
│
├── docker-compose.yml       # Local development setup
├── railway.toml            # Main Railway project config
├── deploy.sh               # Automated deployment script
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Deployment guide
├── PROJECT_STRUCTURE.md    # This file
├── API_DOCS.md             # API documentation
└── .gitignore              # Git ignore rules
```

## 🎯 Service Responsibilities

### API Service (`api/`)

- **Data Collection**: Crawls npm, PyPI, GitHub APIs for stack information
- **Data Storage**: Manages JSON-based data persistence with historical tracking
- **Scheduling**: Automated weekly full updates + daily fast-moving stack updates
- **REST API**: Provides endpoints for frontend consumption
- **CLI Tools**: Command-line interface for manual operations

### Web Service (`web/`)

- **User Interface**: Beautiful, responsive React/Next.js frontend
- **Stack Discovery**: Browse, search, and filter 130+ stacks
- **Trending Analysis**: Visualize popular and growing technologies
- **Real-time Data**: Consumes API service for live stack information

### Shared (`shared/`)

- **Type Definitions**: TypeScript interfaces matching Python models
- **Configuration**: Shared settings and constants

## 🔧 Development Workflow

### Local Development

```bash
# Start both services
docker-compose up -d

# Or run individually:
# API: cd api && uvicorn main:app --reload
# Web: cd web && npm run dev
```

### Adding New Stacks

```bash
cd api
python cli.py add-stack
```

### Manual Data Updates

```bash
cd api
python cli.py update-stacks        # Full update
python cli.py update-stacks --fast  # Fast-moving only
```

### Deployment

```bash
# Automated Railway deployment
./deploy.sh

# Or follow DEPLOYMENT.md for manual setup
```

## 📦 Key Dependencies

### Backend (Python)

- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and serialization
- **Requests**: HTTP client for API calls
- **Schedule**: Task scheduling
- **Uvicorn**: ASGI server

### Frontend (TypeScript/React)

- **Next.js**: React framework with SSR
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **SWR**: Data fetching library

## 🎨 Design System

### Color Palette (Cyan/Teal Theme)

- **Backgrounds**: `#E0FBFC`, `#CFFAFE`, `#A5F3FC`
- **Text**: `#134E4A`, `#115E59`, `#0F766E`
- **Actions**: `#22D3EE`, `#14B8A6`

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold with gradient effects
- **Body**: Clean, readable spacing

## 🚀 Deployment Architecture

### Railway Services

1. **current-api**: Backend service (FastAPI)
2. **current-web**: Frontend service (Next.js)

### Environment Variables

- **API**: `PORT`, `PYTHONPATH`, `RAILWAY_ENVIRONMENT`
- **Web**: `PORT`, `NEXT_PUBLIC_API_URL`

### Data Persistence

- **Development**: Local JSON files
- **Production**: Railway persistent volumes (`/app/data`)

## 📊 Monitoring & Maintenance

### Health Checks

- **API**: `/health` endpoint
- **Web**: Root `/` endpoint

### Logging

```bash
railway logs --service current-api
railway logs --service current-web
```

### Updates

- **Automatic**: Weekly full crawls, daily fast-moving updates
- **Manual**: CLI commands or API endpoints

This structure provides a clean separation of concerns, easy development workflow, and production-ready deployment configuration.
