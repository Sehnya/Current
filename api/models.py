from pydantic import BaseModel, HttpUrl
from typing import Dict, Optional, List
from datetime import datetime
from enum import Enum

class StackCategory(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"
    DATABASE = "database"
    TESTING = "testing"
    STYLING = "styling"
    BUILD_TOOLS = "build-tools"
    STATE_MANAGEMENT = "state-management"
    DATA_SCIENCE = "data-science"
    ANIMATION = "animation"
    NETWORKING = "networking"
    RUNTIME = "runtime"
    PACKAGE_MANAGER = "package-manager"
    CODE_QUALITY = "code-quality"
    MONOREPO = "monorepo"
    VISUALIZATION = "visualization"
    ML_APPS = "ml-apps"
    VALIDATION = "validation"
    FORMS = "forms"
    ROUTING = "routing"
    REALTIME = "realtime"
    GRAPHQL = "graphql"
    UTILITY = "utility"
    OTHER = "other"

class InstallCommands(BaseModel):
    npm: Optional[str] = None
    bun: Optional[str] = None
    pip: Optional[str] = None
    yarn: Optional[str] = None

class PopularityMetrics(BaseModel):
    github_stars: Optional[int] = 0
    github_forks: Optional[int] = 0
    downloads_weekly: Optional[int] = 0
    downloads_monthly: Optional[int] = 0

class Stack(BaseModel):
    name: str
    language: str
    latest_version: str
    release_date: str
    docs_url: HttpUrl
    github_url: Optional[HttpUrl] = None
    install: InstallCommands
    github_stars: Optional[int] = 0
    github_forks: Optional[int] = 0
    downloads_weekly: Optional[int] = 0
    downloads_monthly: Optional[int] = 0
    last_checked: Optional[datetime] = None
    category: StackCategory = StackCategory.OTHER
    last_updated: Optional[datetime] = None

class StackResponse(BaseModel):
    stacks: Dict[str, Stack]
    total_count: int
    last_refresh: Optional[datetime] = None

class CategoryResponse(BaseModel):
    category: str
    stacks: Dict[str, Stack]
    total_count: int

class SearchResponse(BaseModel):
    query: str
    stacks: Dict[str, Stack]
    total_count: int

class TrendingResponse(BaseModel):
    stacks: List[Stack]
    sort_by: str
    total_count: int

class OutdatedResponse(BaseModel):
    stacks: Dict[str, Stack]
    threshold_days: int
    total_count: int

class RefreshResponse(BaseModel):
    success: bool
    updated_stacks: int
    errors: Dict[str, str]
    timestamp: datetime

class HistoricalSnapshot(BaseModel):
    timestamp: datetime
    version: str
    github_stars: Optional[int] = 0
    downloads_weekly: Optional[int] = 0

class StackWithHistory(Stack):
    history: List[HistoricalSnapshot] = []