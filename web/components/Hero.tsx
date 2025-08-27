import { motion } from 'framer-motion'
import { TrendingUp, Zap, Search } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center wave-bg text-center p-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-current-glow/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-current-bright/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {/* Logo/Brand */}
                <motion.div
                    className="mb-8"
                    animate={{ rotate: [-1, 1, -1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <h1 className="text-7xl md:text-8xl font-bold text-gradient mb-4">
                        Current
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-current-bright to-current-hover mx-auto rounded-full"></div>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-2xl text-current-deep mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    Stay ahead of the wave in tech. Track 130+ frameworks, libraries, and tools with real-time popularity metrics.
                </motion.p>

                {/* Feature highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-6 mb-12"
                >
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <TrendingUp className="w-5 h-5 text-current-accent" />
                        <span className="text-current-deep font-medium">Trending Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Zap className="w-5 h-5 text-current-accent" />
                        <span className="text-current-deep font-medium">Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Search className="w-5 h-5 text-current-accent" />
                        <span className="text-current-deep font-medium">Smart Search</span>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/stacks" className="btn-primary text-lg px-8 py-4">
                        Explore Stacks
                    </Link>
                    <Link href="/trending" className="btn-secondary text-lg px-8 py-4">
                        View Trending
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-deep">130+</div>
                        <div className="text-current-rich">Tracked Stacks</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-deep">20+</div>
                        <div className="text-current-rich">Categories</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-current-deep">Daily</div>
                        <div className="text-current-rich">Updates</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-current-accent rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-3 bg-current-accent rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    )
}