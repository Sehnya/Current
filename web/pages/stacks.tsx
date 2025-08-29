import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid3X3 } from 'lucide-react'
import StackCard from '../components/StackCard'
import useSWR from 'swr'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Stack {
    name: string
    language: string
    latest_version: string
    release_date: string
    docs_url: string
    github_url?: string
    github_stars?: number
    github_forks?: number
    downloads_weekly?: number
    category: string
    install: {
        npm?: string
        pip?: string
        bun?: string
        yarn?: string
    }
}

const categories = [
    'all',
    'frontend',
    'backend',
    'database',
    'styling',
    'testing',
    'build-tools',
    'data-science',
    'runtime',
    'package-manager'
]

export default function Stacks() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [filteredStacks, setFilteredStacks] = useState<Stack[]>([])

    const { data, error, isLoading } = useSWR(`${API_URL}/stacks`, fetcher)

    useEffect(() => {
        if (!data?.stacks) return

        let stacks = Object.values(data.stacks) as Stack[]

        // Filter by category
        if (selectedCategory !== 'all') {
            stacks = stacks.filter(stack => stack.category === selectedCategory)
        }

        // Filter by search query
        if (searchQuery) {
            stacks = stacks.filter(stack =>
                stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stack.language.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Sort by popularity (stars)
        stacks.sort((a, b) => (b.github_stars || 0) - (a.github_stars || 0))

        setFilteredStacks(stacks)
    }, [data, searchQuery, selectedCategory])

    if (error) return <div className="text-center py-20 text-red-600">Failed to load stacks</div>
    if (isLoading) return <div className="text-center py-20">Loading stacks...</div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                    All Stacks
                </h1>
                <p className="text-xl text-current-rich max-w-2xl mx-auto">
                    Explore {Object.keys(data?.stacks || {}).length} frameworks, libraries, and tools
                </p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 space-y-4"
            >
                {/* Search */}
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-current-rich w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search stacks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-current-glow/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-current-accent focus:border-transparent"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                ? 'bg-current-accent text-white'
                                : 'bg-white/60 text-current-deep hover:bg-current-glow'
                                }`}
                        >
                            {category === 'all' ? 'All' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
            >
                <p className="text-current-rich">
                    Showing {filteredStacks.length} stack{filteredStacks.length !== 1 ? 's' : ''}
                    {selectedCategory !== 'all' && ` in ${selectedCategory.replace('-', ' ')}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            </motion.div>

            {/* Stacks Grid */}
            {filteredStacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStacks.map((stack, index) => (
                        <StackCard key={stack.name} stack={stack} index={index} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Grid3X3 className="w-16 h-16 text-current-glow mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-current-deep mb-2">No stacks found</h3>
                    <p className="text-current-rich">
                        Try adjusting your search or filter criteria
                    </p>
                </motion.div>
            )}
        </div>
    )
}