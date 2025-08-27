# Stack Knowledge API Documentation

Generated on: 2025-08-27

## Overview

A comprehensive system for tracking and maintaining up-to-date information about popular development stacks, frameworks, and tools with enhanced popularity metrics and categorization.

## Features

- **Automated Updates**: Weekly full updates + daily fast-moving stack updates
- **Popularity Metrics**: GitHub stars, forks, and download statistics
- **Categorization**: Organized by framework type and use case
- **Search & Filter**: Find stacks by name, category, or popularity
- **Historical Data**: Track version and popularity changes over time
- **Trending Analysis**: Discover popular and growing technologies

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run initial crawl
python cli.py update-stacks

# Start API server
uvicorn main:app --reload

# Use CLI tools
python cli.py trending --limit 10
python cli.py search react
python cli.py list --category frontend
```

## API Endpoints

### Core Endpoints

#### `GET /stacks`

List all tracked stacks with metadata.

**Example:**

```bash
curl http://localhost:8000/stacks
```

#### `GET /stacks/{name}`

Get detailed information for a specific stack.

**Example:**

```bash
curl http://localhost:8000/stacks/react
```

### Enhanced Endpoints

#### `GET /stacks/category/{category}`

Filter stacks by category (frontend, backend, database, etc.).

**Example:**

```bash
curl http://localhost:8000/stacks/category/frontend
```

#### `GET /stacks/search?q={query}`

Search stacks by name with fuzzy matching.

**Parameters:**

- `q` (string, required): Search query

**Example:**

```bash
curl "http://localhost:8000/stacks/search?q=react"
```

#### `GET /stacks/trending`

Get trending stacks sorted by popularity metrics.

**Parameters:**

- `sort_by` (string, optional): Sort criteria - "stars", "downloads", "forks", "combined" (default: "stars")
- `limit` (integer, optional): Number of results (default: 20)

**Example:**

```bash
curl "http://localhost:8000/stacks/trending?sort_by=stars&limit=10"
```

#### `GET /stacks/outdated`

Get stacks that haven't been checked recently.

**Parameters:**

- `threshold_days` (integer, optional): Days threshold (default: 7)

**Example:**

```bash
curl "http://localhost:8000/stacks/outdated?threshold_days=7"
```

#### `POST /stacks/refresh`

Manually trigger stack data refresh.

**Parameters:**

- `fast_only` (boolean, optional): Update only fast-moving stacks (default: false)

**Example:**

```bash
# Full refresh
curl -X POST http://localhost:8000/stacks/refresh

# Fast-moving only
curl -X POST "http://localhost:8000/stacks/refresh?fast_only=true"
```

## CLI Commands

### Basic Commands

```bash
# Update all stacks
python cli.py update-stacks

# Update only fast-moving stacks
python cli.py update-stacks --fast

# List all stacks
python cli.py list

# Show stack details
python cli.py show react
```

### Enhanced Commands

```bash
# List by category
python cli.py list --category frontend

# Search stacks
python cli.py search tailwind

# Show trending stacks
python cli.py trending --sort-by stars --limit 10

# Show outdated stacks
python cli.py outdated --days 7

# Add new stack interactively
python cli.py add-stack
```

## Data Models

### Enhanced Stack Object

```json
{
  "name": "React",
  "language": "JavaScript",
  "latest_version": "18.2.0",
  "release_date": "2024-07-10",
  "docs_url": "https://react.dev",
  "github_url": "https://github.com/facebook/react",
  "install": {
    "npm": "npm install react",
    "bun": "bun add react",
    "yarn": "yarn add react"
  },
  "github_stars": 220000,
  "github_forks": 46000,
  "downloads_weekly": 25000000,
  "downloads_monthly": 100000000,
  "last_checked": "2025-08-27T00:00:00Z",
  "category": "frontend",
  "last_updated": "2025-08-27T00:00:00Z"
}
```

### Categories

- **frontend** - Frontend frameworks and libraries (React, Vue, Angular)
- **backend** - Backend frameworks and servers (Express, FastAPI, Django)
- **database** - Database ORMs and tools (Prisma, SQLAlchemy, Mongoose)
- **testing** - Testing frameworks and tools (Jest, Cypress, Playwright)
- **styling** - CSS frameworks and styling libraries (Tailwind, Bootstrap, Styled Components)
- **build-tools** - Build tools and bundlers (Webpack, Vite, esbuild)
- **state-management** - State management libraries (Redux, Zustand, MobX)
- **data-science** - Data science and ML libraries (Pandas, TensorFlow, PyTorch)
- **animation** - Animation and graphics libraries (Framer Motion, Three.js)
- **networking** - HTTP clients and networking tools (Axios, Requests)
- **runtime** - JavaScript/Python runtimes (Node.js, Bun, Deno)
- **package-manager** - Package managers (npm, Yarn, pnpm)
- **code-quality** - Linting and formatting tools (ESLint, Prettier, TypeScript)
- **monorepo** - Monorepo management tools (Turbo, Lerna, Nx)
- **visualization** - Data visualization libraries (D3.js, Chart.js, Plotly)
- **ml-apps** - ML application frameworks (Streamlit, Gradio)
- **validation** - Data validation libraries (Zod, Yup, Joi)
- **forms** - Form handling libraries (React Hook Form, Formik)
- **routing** - Routing libraries (React Router, Vue Router)
- **realtime** - Real-time communication (Socket.io, WebSockets)
- **graphql** - GraphQL tools and clients (Apollo, Relay, Urql)
- **utility** - Utility libraries (Lodash, Ramda, RxJS)

## Configuration

### Fast-Moving Stacks

These stacks are updated daily due to frequent releases:

- React, Vue, Angular, Next.js, Nuxt, Vite
- TypeScript, FastAPI, Django, Tailwind CSS
- Prisma, Bun, Deno

### Scheduler Configuration

```json
{
  "scheduler": {
    "enabled": true,
    "cron": "0 0 * * 0",
    "daily_cron": "0 2 * * *",
    "timezone": "UTC"
  }
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (stack not found)
- `500` - Internal Server Error

Error responses include a `detail` field:

```json
{
  "detail": "Stack 'nonexistent' not found"
}
```

## Development Roadmap

### Phase 1: Enhanced Metrics ✅

- GitHub stars, forks, download statistics
- Category-based organization
- Trending analysis

### Phase 2: Historical Trends (Next)

- Version history tracking
- Popularity trend charts
- Growth rate analysis

### Phase 3: Web Dashboard (Future)

- Interactive web interface
- Visual trend charts
- Community features

### Phase 4: GraphQL API (Future)

- GraphQL endpoint for complex queries
- Real-time subscriptions
- Advanced filtering

### Phase 5: Community Features (Future)

- Community-driven stack additions
- Rating and review system
- Usage recommendations

## Interactive Documentation

For complete interactive API documentation with request/response examples, start the server and visit:

**http://localhost:8000/docs** (Swagger UI)
**http://localhost:8000/redoc** (ReDoc)
