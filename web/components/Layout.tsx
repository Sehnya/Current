import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Waves, TrendingUp, Search, Grid3X3, Github } from 'lucide-react'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter()

    const navigation = [
        { name: 'Home', href: '/', icon: Waves },
        { name: 'Stacks', href: '/stacks', icon: Grid3X3 },
        { name: 'Trending', href: '/trending', icon: TrendingUp },
        { name: 'Search', href: '/search', icon: Search },
    ]

    const isActive = (href: string) => {
        if (href === '/') return router.pathname === '/'
        return router.pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-current-mist">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-current-glow/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 5 }}
                                className="w-8 h-8 bg-gradient-to-br from-current-bright to-current-hover rounded-lg flex items-center justify-center"
                            >
                                <Waves className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold text-gradient">Current</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-current-glow text-current-deep font-medium'
                                            : 'text-current-rich hover:text-current-deep hover:bg-current-aqua/50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* GitHub Link */}
                        <a
                            href="https://github.com/yourusername/current"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-current-rich hover:text-current-deep transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-current-glow/30">
                    <div className="flex justify-around py-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(item.href)
                                        ? 'text-current-accent'
                                        : 'text-current-rich hover:text-current-deep'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-xs">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-current-deep text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-current-bright rounded-lg flex items-center justify-center">
                                    <Waves className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">Current</span>
                            </div>
                            <p className="text-current-aqua mb-4 max-w-md">
                                Stay ahead of the wave in tech. Track 130+ frameworks, libraries, and tools with real-time popularity metrics.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://github.com/yourusername/current" className="text-current-aqua hover:text-white transition-colors">
                                    <Github className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Explore</h3>
                            <ul className="space-y-2 text-current-aqua">
                                <li><Link href="/stacks" className="hover:text-white transition-colors">All Stacks</Link></li>
                                <li><Link href="/trending" className="hover:text-white transition-colors">Trending</Link></li>
                                <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Categories</h3>
                            <ul className="space-y-2 text-current-aqua">
                                <li><Link href="/stacks?category=frontend" className="hover:text-white transition-colors">Frontend</Link></li>
                                <li><Link href="/stacks?category=backend" className="hover:text-white transition-colors">Backend</Link></li>
                                <li><Link href="/stacks?category=database" className="hover:text-white transition-colors">Database</Link></li>
                                <li><Link href="/stacks?category=styling" className="hover:text-white transition-colors">Styling</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-current-rich/20 mt-8 pt-8 text-center text-current-aqua">
                        <p>&copy; 2025 Current. Built with ❤️ for the developer community.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}