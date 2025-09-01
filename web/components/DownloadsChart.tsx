import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface DownloadsChartProps {
    stackName?: string
}

interface DownloadData {
    date: string
    downloads: number
}

export default function DownloadsChart({ stackName }: DownloadsChartProps) {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
    const [data, setData] = useState<DownloadData[]>([])
    const [loading, setLoading] = useState(true)
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')

    // Generate mock data for now - in a real app, this would come from your API
    useEffect(() => {
        const generateMockData = () => {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
            const mockData: DownloadData[] = []
            const baseDownloads = Math.floor(Math.random() * 100000) + 10000

            for (let i = days; i >= 0; i--) {
                const date = new Date()
                date.setDate(date.getDate() - i)

                // Add some realistic variation
                const variation = (Math.random() - 0.5) * 0.3
                const trendFactor = i < days / 2 ? 1.1 : 0.95 // slight upward trend in recent data
                const downloads = Math.floor(baseDownloads * (1 + variation) * Math.pow(trendFactor, days - i))

                mockData.push({
                    date: date.toISOString().split('T')[0],
                    downloads: Math.max(0, downloads)
                })
            }

            // Calculate trend
            const recent = mockData.slice(-7).reduce((sum, d) => sum + d.downloads, 0) / 7
            const previous = mockData.slice(-14, -7).reduce((sum, d) => sum + d.downloads, 0) / 7
            const change = (recent - previous) / previous

            if (change > 0.05) setTrend('up')
            else if (change < -0.05) setTrend('down')
            else setTrend('stable')

            return mockData
        }

        setLoading(true)
        // Simulate API call delay
        setTimeout(() => {
            setData(generateMockData())
            setLoading(false)
        }, 500)
    }, [timeRange, stackName])

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const chartData = {
        labels: data.map(d => {
            const date = new Date(d.date)
            if (timeRange === '7d') return date.toLocaleDateString('en-US', { weekday: 'short' })
            if (timeRange === '30d') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (timeRange === '90d') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        }),
        datasets: [
            {
                label: 'Downloads',
                data: data.map(d => d.downloads),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#3B82F6',
                borderWidth: 1,
                callbacks: {
                    label: (context: any) => `Downloads: ${formatNumber(context.parsed.y)}`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6B7280',
                    maxTicksLimit: timeRange === '7d' ? 7 : timeRange === '30d' ? 8 : 6
                }
            },
            y: {
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)'
                },
                ticks: {
                    color: '#6B7280',
                    callback: (value: any) => formatNumber(value)
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    }

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
            case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
            default: return <Minus className="w-4 h-4 text-gray-600" />
        }
    }

    const getTrendText = () => {
        switch (trend) {
            case 'up': return 'Trending up'
            case 'down': return 'Trending down'
            default: return 'Stable'
        }
    }

    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-600'
            case 'down': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-current-rich">Loading chart data...</div>
            </div>
        )
    }

    const totalDownloads = data.reduce((sum, d) => sum + d.downloads, 0)
    const avgDaily = Math.floor(totalDownloads / data.length)

    return (
        <div>
            {/* Chart Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="flex items-center gap-2">
                        {getTrendIcon()}
                        <span className={`text-sm font-medium ${getTrendColor()}`}>
                            {getTrendText()}
                        </span>
                    </div>
                    <div className="text-sm text-current-rich">
                        Avg: {formatNumber(avgDaily)}/day
                    </div>
                </div>

                <div className="flex gap-2">
                    {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-current-accent text-white'
                                    : 'bg-current-glow text-current-deep hover:bg-current-aqua/50'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-64 relative">
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-current-glow/30">
                <div className="text-center">
                    <div className="text-lg font-semibold text-current-deep">
                        {formatNumber(totalDownloads)}
                    </div>
                    <div className="text-xs text-current-rich">Total ({timeRange})</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-current-deep">
                        {formatNumber(Math.max(...data.map(d => d.downloads)))}
                    </div>
                    <div className="text-xs text-current-rich">Peak Day</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-current-deep">
                        {formatNumber(Math.min(...data.map(d => d.downloads)))}
                    </div>
                    <div className="text-xs text-current-rich">Lowest Day</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-current-deep">
                        {formatNumber(avgDaily)}
                    </div>
                    <div className="text-xs text-current-rich">Daily Avg</div>
                </div>
            </div>
        </div>
    )
}