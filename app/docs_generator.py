#!/usr/bin/env python3
"""
API Documentation Generator

Generates comprehensive API documentation for the Current Stack Tracker API.
"""

import json
from datetime import datetime
from typing import Dict, List, Any
from pathlib import Path


class APIDocsGenerator:
    def __init__(self):
        self.base_url = "https://current-api.railway.app"
        self.local_url = "http://localhost:8000"
    
    def generate_markdown_docs(self) -> str:
        """Generate comprehensive API documentation in Markdown format"""
        
        docs = f"""# Current Stack Tracker API Documentation

*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*

## 🌐 Base URLs

- **Production**: `{self.base_url}`
- **Development**: `{self.local_url}`

## 📋 Overview

The Current Stack Tracker API provides real-time data about popular technology stacks, including download statistics, GitHub metrics, and trend analysis.

## 🔗 Quick Links

- **Interactive Docs**: [{self.base_url}/docs]({self.base_url}/docs)
- **ReDoc**: [{self.base_url}/redoc]({self.base_url}/redoc)
- **OpenAPI Schema**: [{self.base_url}/openapi.json]({self.base_url}/openapi.json)

## 📊 Endpoints

### Health Check

#### `GET /health`
Check API health status.

**Response:**
```json
{{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}}
```

### Stack Data

#### `GET /stacks`
Get all available stacks with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (frontend, backend, database, etc.)
- `limit` (optional): Limit number of results (default: 100)
- `offset` (optional): Offset for pagination (default: 0)

**Example Request:**
```bash
curl "{self.base_url}/stacks?category=frontend&limit=10"
```

**Response:**
```json
{{
  "stacks": [
    {{
      "name": "react",
      "description": "A JavaScript library for building user interfaces",
      "category": "frontend",
      "website": "https://reactjs.org",
      "repository": "https://github.com/facebook/react",
      "downloads": 18500000,
      "stars": 220000,
      "forks": 45000,
      "last_updated": "2024-01-15T09:00:00Z",
      "tags": ["javascript", "ui", "library"],
      "trend_data": {{
        "downloads_change": 5.2,
        "stars_change": 2.1,
        "trend_score": 95.8
      }}
    }}
  ],
  "total": 130,
  "page": 1,
  "per_page": 10
}}
```

#### `GET /stacks/{{name}}`
Get detailed information about a specific stack.

**Path Parameters:**
- `name`: Stack name (e.g., "react", "vue", "django")

**Example Request:**
```bash
curl "{self.base_url}/stacks/react"
```

**Response:**
```json
{{
  "name": "react",
  "description": "A JavaScript library for building user interfaces",
  "category": "frontend",
  "website": "https://reactjs.org",
  "repository": "https://github.com/facebook/react",
  "downloads": 18500000,
  "stars": 220000,
  "forks": 45000,
  "last_updated": "2024-01-15T09:00:00Z",
  "tags": ["javascript", "ui", "library"],
  "trend_data": {{
    "downloads_change": 5.2,
    "stars_change": 2.1,
    "trend_score": 95.8
  }},
  "historical_data": [
    {{
      "date": "2024-01-01",
      "downloads": 17800000,
      "stars": 218000
    }}
  ]
}}
```

### Search

#### `GET /search`
Search stacks by name, description, or tags.

**Query Parameters:**
- `q`: Search query (required)
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 20)

**Example Request:**
```bash
curl "{self.base_url}/search?q=javascript&category=frontend"
```

**Response:**
```json
{{
  "query": "javascript",
  "results": [
    {{
      "name": "react",
      "description": "A JavaScript library for building user interfaces",
      "category": "frontend",
      "relevance_score": 0.95,
      "match_type": "description"
    }}
  ],
  "total": 15,
  "took_ms": 12
}}
```

### Trending

#### `GET /trending`
Get trending stacks based on recent growth.

**Query Parameters:**
- `period` (optional): Time period (7d, 30d, 90d) - default: 30d
- `metric` (optional): Trending metric (downloads, stars, combined) - default: combined
- `limit` (optional): Number of results (default: 20)

**Example Request:**
```bash
curl "{self.base_url}/trending?period=7d&limit=10"
```

**Response:**
```json
{{
  "period": "7d",
  "metric": "combined",
  "trending_stacks": [
    {{
      "name": "next.js",
      "trend_score": 98.5,
      "downloads_change": 12.3,
      "stars_change": 8.7,
      "rank": 1,
      "category": "frontend"
    }}
  ],
  "generated_at": "2024-01-15T10:30:00Z"
}}
```

### Categories

#### `GET /categories`
Get all available categories with stack counts.

**Response:**
```json
{{
  "categories": [
    {{
      "name": "frontend",
      "display_name": "Frontend",
      "count": 25,
      "description": "Client-side frameworks and libraries"
    }},
    {{
      "name": "backend",
      "display_name": "Backend",
      "count": 30,
      "description": "Server-side frameworks and tools"
    }}
  ]
}}
```

### Statistics

#### `GET /stats`
Get overall platform statistics.

**Response:**
```json
{{
  "total_stacks": 130,
  "total_downloads": 2500000000,
  "total_stars": 8500000,
  "last_updated": "2024-01-15T09:00:00Z",
  "categories": {{
    "frontend": 25,
    "backend": 30,
    "database": 15,
    "devtools": 20,
    "mobile": 12,
    "other": 28
  }},
  "top_languages": [
    "JavaScript",
    "Python",
    "TypeScript",
    "Go",
    "Rust"
  ]
}}
```

## 📈 Data Models

### Stack Model
```typescript
interface Stack {{
  name: string;
  description: string;
  category: string;
  website: string;
  repository: string;
  downloads: number;
  stars: number;
  forks: number;
  last_updated: string;
  tags: string[];
  trend_data?: {{
    downloads_change: number;
    stars_change: number;
    trend_score: number;
  }};
  historical_data?: Array<{{
    date: string;
    downloads: number;
    stars: number;
  }}>;
}}
```

### Error Model
```typescript
interface APIError {{
  error: string;
  message: string;
  status_code: number;
  timestamp: string;
}}
```

## 🔄 Rate Limiting

- **Rate Limit**: 1000 requests per hour per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## ❌ Error Handling

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Stack or endpoint not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

### Error Response Format
```json
{{
  "error": "not_found",
  "message": "Stack 'invalid-stack' not found",
  "status_code": 404,
  "timestamp": "2024-01-15T10:30:00Z"
}}
```

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/yourusername/current.git
cd current/api

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload

# API available at http://localhost:8000
```

### Environment Variables
```bash
# Optional configuration
PORT=8000
PYTHONPATH=/app
RAILWAY_ENVIRONMENT=development
```

## 📚 Examples

### Python
```python
import requests

# Get all frontend stacks
response = requests.get('{self.base_url}/stacks?category=frontend')
stacks = response.json()['stacks']

# Get specific stack
react = requests.get('{self.base_url}/stacks/react').json()
print(f"React has {{react['downloads']:,}} downloads")

# Search for stacks
results = requests.get('{self.base_url}/search?q=database').json()
```

### JavaScript/Node.js
```javascript
// Using fetch
const getStacks = async () => {{
  const response = await fetch('{self.base_url}/stacks');
  const data = await response.json();
  return data.stacks;
}};

// Get trending stacks
const trending = await fetch('{self.base_url}/trending?limit=5');
const trendingData = await trending.json();
```

### cURL
```bash
# Get all stacks
curl "{self.base_url}/stacks"

# Search with filters
curl "{self.base_url}/search?q=react&category=frontend"

# Get trending stacks
curl "{self.base_url}/trending?period=7d&limit=10"
```

## 🚀 Deployment

The API is deployed on Railway with automatic deployments from the main branch.

- **Production URL**: {self.base_url}
- **Health Check**: {self.base_url}/health
- **Interactive Docs**: {self.base_url}/docs

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/current/issues)
- **Documentation**: [README.md](../README.md)
- **API Status**: {self.base_url}/health

---

*This documentation is automatically generated. For the most up-to-date information, visit the interactive docs at {self.base_url}/docs*
"""
        
        return docs
    
    def save_docs(self, output_path: str = "../API_DOCS.md"):
        """Save generated documentation to file"""
        docs_content = self.generate_markdown_docs()
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(docs_content)
        
        print(f"✅ API documentation generated: {output_file}")
        return str(output_file)
    
    def generate_postman_collection(self) -> Dict[str, Any]:
        """Generate Postman collection for API testing"""
        
        collection = {
            "info": {
                "name": "Current Stack Tracker API",
                "description": "API for tracking technology stack popularity and trends",
                "version": "1.0.0",
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            "variable": [
                {
                    "key": "baseUrl",
                    "value": self.base_url,
                    "type": "string"
                }
            ],
            "item": [
                {
                    "name": "Health Check",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/health",
                            "host": ["{{baseUrl}}"],
                            "path": ["health"]
                        }
                    }
                },
                {
                    "name": "Get All Stacks",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/stacks?limit=10",
                            "host": ["{{baseUrl}}"],
                            "path": ["stacks"],
                            "query": [
                                {
                                    "key": "limit",
                                    "value": "10"
                                },
                                {
                                    "key": "category",
                                    "value": "frontend",
                                    "disabled": True
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "Get Specific Stack",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/stacks/react",
                            "host": ["{{baseUrl}}"],
                            "path": ["stacks", "react"]
                        }
                    }
                },
                {
                    "name": "Search Stacks",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/search?q=javascript",
                            "host": ["{{baseUrl}}"],
                            "path": ["search"],
                            "query": [
                                {
                                    "key": "q",
                                    "value": "javascript"
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "Get Trending Stacks",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/trending?period=7d&limit=10",
                            "host": ["{{baseUrl}}"],
                            "path": ["trending"],
                            "query": [
                                {
                                    "key": "period",
                                    "value": "7d"
                                },
                                {
                                    "key": "limit",
                                    "value": "10"
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "Get Categories",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/categories",
                            "host": ["{{baseUrl}}"],
                            "path": ["categories"]
                        }
                    }
                },
                {
                    "name": "Get Statistics",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/stats",
                            "host": ["{{baseUrl}}"],
                            "path": ["stats"]
                        }
                    }
                }
            ]
        }
        
        return collection
    
    def save_postman_collection(self, output_path: str = "../current-api.postman_collection.json"):
        """Save Postman collection to file"""
        collection = self.generate_postman_collection()
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(collection, f, indent=2)
        
        print(f"✅ Postman collection generated: {output_file}")
        return str(output_file)


def main():
    """Generate API documentation"""
    generator = APIDocsGenerator()
    
    # Generate Markdown documentation
    docs_path = generator.save_docs()
    
    # Generate Postman collection
    postman_path = generator.save_postman_collection()
    
    print(f"\n📚 Documentation generated:")
    print(f"  📄 Markdown: {docs_path}")
    print(f"  📮 Postman: {postman_path}")
    print(f"\n🌐 Interactive docs available at:")
    print(f"  🔗 {generator.base_url}/docs")
    print(f"  🔗 {generator.base_url}/redoc")


if __name__ == '__main__':
    main()