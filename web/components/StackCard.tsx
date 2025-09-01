import { motion } from 'framer-motion'
import { Star, Download, GitFork, ExternalLink, Package } from 'lucide-react'
import Link from 'next/link'

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

interface StackCardProps {
    stack: Stack
    index?: number
}

export default function StackCard({ stack, index = 0 }: StackCardProps) {
    const formatNumber = (num?: number) => {
        if (!num) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            frontend: 'bg-blue-100 text-blue-800',
            backend: 'bg-green-100 text-green-800',
            database: 'bg-purple-100 text-purple-800',
            styling: 'bg-pink-100 text-pink-800',
            testing: 'bg-yellow-100 text-yellow-800',
            'build-tools': 'bg-orange-100 text-orange-800',
            'data-science': 'bg-indigo-100 text-indigo-800',
            runtime: 'bg-red-100 text-red-800',
        }
        return colors[category] || 'bg-gray-100 text-gray-800'
    }

    const getInstallCommand = () => {
        if (stack.install.npm) return stack.install.npm
        if (stack.install.pip) return stack.install.pip
        if (stack.install.bun) return stack.install.bun
        if (stack.install.yarn) return stack.install.yarn
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card group hover:scale-105"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <Link href={`/stack/${encodeURIComponent(stack.name.toLowerCase())}`}>
                        <h3 className="text-xl font-bold text-current-deep group-hover:text-current-accent transition-colors cursor-pointer">
                            {stack.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(stack.category)}`}>
                            {stack.category.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-current-rich">{stack.language}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-semibold text-current-deep">v{stack.latest_version}</div>
                    <div className="text-xs text-current-rich">{stack.release_date}</div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-current-accent">
                        <Star className="w-4 h-4" />
                        <span className="font-semibold">{formatNumber(stack.github_stars)}</span>
                    </div>
                    <div className="text-xs text-current-rich">Stars</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-current-accent">
                        <GitFork className="w-4 h-4" />
                        <span className="font-semibold">{formatNumber(stack.github_forks)}</span>
                    </div>
                    <div className="text-xs text-current-rich">Forks</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-current-accent">
                        <Download className="w-4 h-4" />
                        <span className="font-semibold">{formatNumber(stack.downloads_weekly)}</span>
                    </div>
                    <div className="text-xs text-current-rich">Weekly</div>
                </div>
            </div>

            {/* Install command */}
            {getInstallCommand() && (
                <div className="mb-4">
                    <div className="bg-current-mist rounded-lg p-3 border border-current-glow/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-current-accent" />
                            <span className="text-xs font-medium text-current-rich">Install</span>
                        </div>
                        <code className="text-sm text-current-deep font-mono">{getInstallCommand()}</code>
                    </div>
                </div>
            )}

            {/* Links */}
            <div className="flex gap-2">
                <a
                    href={stack.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-sm py-2 text-center flex items-center justify-center gap-1"
                >
                    <ExternalLink className="w-4 h-4" />
                    Docs
                </a>
                {stack.github_url && (
                    <a
                        href={stack.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-sm py-2 text-center flex items-center justify-center gap-1"
                    >
                        <ExternalLink className="w-4 h-4" />
                        GitHub
                    </a>
                )}
            </div>
        </motion.div>
    )
}