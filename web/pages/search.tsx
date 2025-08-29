import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Zap, Clock } from 'lucide-react'
import StackCard from '../components/StackCard'

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

const popularSearches = [
    'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'Tailwind',
    'FastAPI', 'Django', 'Express', 'Prisma', 'Vite', 'Jest'
]

export default function Search() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Stack[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([])
            setHasSearched(false)
            return
        }

        setIsLoading(true)
        setHasSearched(true)

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            const response = await fetch(`${API_URL}/stacks/search?q=${encodeURIComponent(searchQuery)}`)
            const data = await response.json()
            setResults(Object.values(data.stacks || {}))
        } catch (error) {
            console.error('Search error:', error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            performSearch(query)
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [query])

    const handlePopularSearch = (searchTerm: string) => {
        setQuery(searchTerm)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <SearchIcon className="w-8 h-8 text-current-accent" />
                    <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                        Search Stacks
                    </h1>
                </div>
                <p className="text-xl text-current-rich max-w-2xl mx-auto">
                    Find the perfect framework, library, or tool for your next project
                </p>
            </motion.div>

            {/* Search Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto mb-8"
            >
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-current-rich w-6 h-6" />
                    <input
                        type="text"
                        placeholder="Search for React, Vue, Django, Tailwind..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm border border-current-glow/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-current-accent focus:border-transparent shadow-lg"
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current-accent"></div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Popular Searches */}
            {!hasSearched && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-current-accent" />
                        <h2 className="text-lg font-semibold text-current-deep">Popular Searches</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {popularSearches.map((term) => (
                            <button
                                key={term}
                                onClick={() => handlePopularSearch(term)}
                                className="px-4 py-2 bg-white/60 hover:bg-current-glow text-current-deep rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Search Results */}
            {hasSearched && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-current-deep">
                            Search Results
                            {query && (
                                <span className="text-current-rich font-normal ml-2">
                                    for "{query}"
                                </span>
                            )}
                        </h2>
                        <div className="text-current-rich">
                            {results.length} result{results.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Results Grid */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((stack, index) => (
                                <StackCard key={stack.name} stack={stack} index={index} />
                            ))}
                        </div>
                    ) : !isLoading && hasSearched ? (
                        <div className="text-center py-20">
                            <SearchIcon className="w-16 h-16 text-current-glow mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-current-deep mb-2">No results found</h3>
                            <p className="text-current-rich mb-6">
                                Try searching for a different term or check the spelling
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="text-current-rich">Try:</span>
                                {popularSearches.slice(0, 4).map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => handlePopularSearch(term)}
                                        className="text-current-accent hover:text-current-deep font-medium"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            )}

            {/* Search Tips */}
            {!hasSearched && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-current-glow/30"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-current-accent" />
                        <h2 className="text-xl font-bold text-current-deep">Search Tips</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-current-rich">
                        <div>
                            <h3 className="font-semibold text-current-deep mb-2">What you can search for:</h3>
                            <ul className="space-y-1">
                                <li>• Framework names (React, Vue, Angular)</li>
                                <li>• Library names (Lodash, Axios, Moment)</li>
                                <li>• Programming languages (JavaScript, Python)</li>
                                <li>• Categories (frontend, backend, database)</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-current-deep mb-2">Search features:</h3>
                            <ul className="space-y-1">
                                <li>• Real-time search as you type</li>
                                <li>• Fuzzy matching for typos</li>
                                <li>• Results sorted by popularity</li>
                                <li>• Instant results from 130+ stacks</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}