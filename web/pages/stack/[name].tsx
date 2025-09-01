import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
    Star,
    Download,
    GitFork,
    ExternalLink,
    Package,
    Calendar,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import DownloadsChart from '../../components/DownloadsChart'
import CompatibilityMatrix from '../../components/CompatibilityMatrix'

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
    description?: string
    last_checked?: string
    previous_version?: string
    version_history?: Array<{
        version: string
        date: string
        changes?: string[]
    }>
    compatibility?: {
        [key: string]: string[]
    }
}

export default function StackDetail() {
    const router = useRouter()
    const { name } = router.query

    const { data: stack, error, isLoading } = useSWR(
        name ? `${API_URL}/stacks/${name}` : null,
        fetcher
    )

    const formatNumber = (num?: number) => {
        if (!num) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            frontend: 'bg-blue-100 text-blue-800 border-blue-200',
            backend: 'bg-green-100 text-green-800 border-green-200',
            database: 'bg-purple-100 text-purple-800 border-purple-200',
            styling: 'bg-pink-100 text-pink-800 border-pink-200',
            testing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'build-tools': 'bg-orange-100 text-orange-800 border-orange-200',
            'data-science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            runtime: 'bg-red-100 text-red-800 border-red-200',
        }
        return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getInstallCommands = () => {
        const commands = []
        if (stack?.install?.npm) commands.push({ type: 'npm', command: stack.install.npm })
        if (stack?.install?.yarn) commands.push({ type: 'yarn', command: stack.install.yarn })
        if (stack?.install?.bun) commands.push({ type: 'bun', command: stack.install.bun })
        if (stack?.install?.pip) commands.push({ type: 'pip', command: stack.install.pip })
        return commands
    }

    const getVersionStatus = () => {
        if (!stack?.previous_version || !stack?.latest_version) return null

        const current = stack.latest_version.split('.').map(Number)
        const previous = stack.previous_version.split('.').map(Number)

        // Major version change
        if (current[0] > previous[0]) {
            return { type: 'major', color: 'text-red-600', icon: AlertCircle }
        }
        // Minor version change
        if (current[1] > previous[1]) {
            return { type: 'minor', color: 'text-yellow-600', icon: TrendingUp }
        }
        // Patch version change
        if (current[2] > previous[2]) {
            return { type: 'patch', color: 'text-green-600', icon: CheckCircle }
        }

        return null
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center py-20">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-current-deep mb-2">Stack Not Found</h1>
                    <p className="text-current-rich mb-6">
                        The stack "{name}" could not be found or there was an error loading it.
                    </p>
                    <Link href="/stacks" className="btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Stacks
                    </Link>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-current-glow rounded w-1/4 mb-4"></div>
                    <div className="h-12 bg-current-glow rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="h-32 bg-current-glow rounded"></div>
                        <div className="h-32 bg-current-glow rounded"></div>
                        <div className="h-32 bg-current-glow rounded"></div>
                    </div>
                    <div className="h-64 bg-current-glow rounded mb-8"></div>
                </div>
            </div>
        )
    }

    const versionStatus = getVersionStatus()
    const installCommands = getInstallCommands()

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
            >
                <Link
                    href="/stacks"
                    className="inline-flex items-center gap-2 text-current-rich hover:text-current-deep transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Stacks
                </Link>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                            {stack?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(stack?.category)}`}>
                                {stack?.category?.replace('-', ' ')}
                            </span>
                            <span className="text-current-rich">{stack?.language}</span>
                            {versionStatus && (
                                <div className={`flex items-center gap-1 ${versionStatus.color}`}>
                                    <versionStatus.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {versionStatus.type} update
                                    </span>
                                </div>
                            )}
                        </div>
                        {stack?.description && (
                            <p className="text-lg text-current-rich max-w-2xl">
                                {stack.description}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-3xl font-bold text-current-deep mb-1">
                            v{stack?.latest_version}
                        </div>
                        <div className="text-sm text-current-rich mb-2">
                            Released {stack?.release_date}
                        </div>
                        {stack?.previous_version && (
                            <div className="text-xs text-current-rich">
                                Previous: v{stack.previous_version}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Metrics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
                <div className="card text-center">
                    <Star className="w-8 h-8 text-current-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-current-deep">
                        {formatNumber(stack?.github_stars)}
                    </div>
                    <div className="text-sm text-current-rich">GitHub Stars</div>
                </div>

                <div className="card text-center">
                    <GitFork className="w-8 h-8 text-current-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-current-deep">
                        {formatNumber(stack?.github_forks)}
                    </div>
                    <div className="text-sm text-current-rich">Forks</div>
                </div>

                <div className="card text-center">
                    <Download className="w-8 h-8 text-current-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-current-deep">
                        {formatNumber(stack?.downloads_weekly)}
                    </div>
                    <div className="text-sm text-current-rich">Weekly Downloads</div>
                </div>

                <div className="card text-center">
                    <Clock className="w-8 h-8 text-current-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-current-deep">
                        {stack?.last_checked ? new Date(stack.last_checked).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-current-rich">Last Checked</div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Downloads Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-current-deep mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Downloads Over Time
                        </h2>
                        <DownloadsChart stackName={stack?.name} />
                    </motion.div>

                    {/* Compatibility Matrix */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-current-deep mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Compatibility Matrix
                        </h2>
                        <CompatibilityMatrix
                            stackName={stack?.name}
                            category={stack?.category}
                            compatibility={stack?.compatibility}
                        />
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Installation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card"
                    >
                        <h3 className="text-lg font-bold text-current-deep mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Installation
                        </h3>
                        <div className="space-y-3">
                            {installCommands.map((cmd, index) => (
                                <div key={index} className="bg-current-mist rounded-lg p-3 border border-current-glow/50">
                                    <div className="text-xs font-medium text-current-rich mb-1 uppercase">
                                        {cmd.type}
                                    </div>
                                    <code className="text-sm text-current-deep font-mono break-all">
                                        {cmd.command}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card"
                    >
                        <h3 className="text-lg font-bold text-current-deep mb-4">
                            Links
                        </h3>
                        <div className="space-y-3">
                            <a
                                href={stack?.docs_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full btn-secondary flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Documentation
                            </a>
                            {stack?.github_url && (
                                <a
                                    href={stack.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    GitHub Repository
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* Version History */}
                    {stack?.version_history && stack.version_history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="card"
                        >
                            <h3 className="text-lg font-bold text-current-deep mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Recent Versions
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {stack.version_history.slice(0, 5).map((version: any, index: number) => (
                                    <div key={index} className="border-l-2 border-current-glow pl-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-current-deep">
                                                v{version.version}
                                            </span>
                                            <span className="text-xs text-current-rich">
                                                {version.date}
                                            </span>
                                        </div>
                                        {version.changes && version.changes.length > 0 && (
                                            <ul className="text-sm text-current-rich space-y-1">
                                                {version.changes.slice(0, 3).map((change: string, i: number) => (
                                                    <li key={i} className="text-xs">• {change}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}