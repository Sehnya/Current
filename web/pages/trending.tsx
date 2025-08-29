import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Star, Download, GitFork } from 'lucide-react'
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

const sortOptions = [
    { value: 'stars', label: 'GitHub Stars', icon: Star },
    { value: 'downloads', label: 'Downloads', icon: Download },
    { value: 'forks', label: 'Forks', icon: GitFork },
    { value: 'combined', label: 'Combined Score', icon: TrendingUp },
]

export default function Trending() {
    const [sortBy, setSortBy] = useState('stars')
    const [limit, setLimit] = useState(20)

    const { data, error, isLoading } = useSWR(
        `${API_URL}/stacks/trending?sort_by=${sortBy}&limit=${limit}`,
        fetcher
    )

    if (error) return <div className="text-center py-20 text-red-600">Failed to load trending stacks</div>
    if (isLoading) return <div className="text-center py-20">Loading trending stacks...</div>

    const stacks = data?.stacks || []

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-current-accent" />
                    <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                        Trending Stacks
                    </h1>
                </div>
                <p className="text-xl text-current-rich max-w-2xl mx-auto">
                    Discover the most popular frameworks and libraries in the developer community
                </p>
            </motion.div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                {/* Sort Options */}
                <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => {
                        const Icon = option.icon
                        return (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === option.value
                                    ? 'bg-current-accent text-white'
                                    : 'bg-white/60 text-current-deep hover:bg-current-glow'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        )
                    })}
                </div>

                {/* Limit Selector */}
                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-current-glow/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-current-accent focus:border-transparent"
                >
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                </select>
            </motion.div>

            {/* Trending List */}
            {stacks.length > 0 ? (
                <div className="space-y-6">
                    {/* Top 3 - Featured */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                    >
                        {stacks.slice(0, 3).map((stack: Stack, index: number) => (
                            <div key={stack.name} className="relative">
                                {/* Rank Badge */}
                                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <StackCard stack={stack} index={index} />
                            </div>
                        ))}
                    </motion.div>

                    {/* Rest of the list */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {stacks.slice(3).map((stack: Stack, index: number) => (
                            <div key={stack.name} className="relative">
                                {/* Rank Badge */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-current-accent rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                                    {index + 4}
                                </div>
                                <StackCard stack={stack} index={index + 3} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <TrendingUp className="w-16 h-16 text-current-glow mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-current-deep mb-2">No trending data available</h3>
                    <p className="text-current-rich">
                        Check back later for trending stacks
                    </p>
                </motion.div>
            )}

            {/* Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-current-glow/30"
            >
                <h2 className="text-2xl font-bold text-current-deep mb-4">Trending Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-accent mb-2">
                            {stacks.length > 0 ? stacks[0]?.github_stars?.toLocaleString() : '0'}
                        </div>
                        <div className="text-current-rich">Most starred project</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-accent mb-2">
                            {stacks.reduce((sum: number, stack: Stack) => sum + (stack.github_stars || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-current-rich">Total stars</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-accent mb-2">
                            {new Set(stacks.map((stack: Stack) => stack.language)).size}
                        </div>
                        <div className="text-current-rich">Languages represented</div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}