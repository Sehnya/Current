import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

interface CompatibilityMatrixProps {
    stackName?: string
    category?: string
    compatibility?: {
        [key: string]: string[]
    }
}

interface CompatibilityItem {
    name: string
    versions: string[]
    status: 'compatible' | 'incompatible' | 'warning' | 'unknown'
    note?: string
}

export default function CompatibilityMatrix({ stackName, category, compatibility }: CompatibilityMatrixProps) {
    const [compatibilityData, setCompatibilityData] = useState<CompatibilityItem[]>([])
    const [loading, setLoading] = useState(true)

    // Generate compatibility data based on the stack category and name
    useEffect(() => {
        const generateCompatibilityData = (): CompatibilityItem[] => {
            if (!stackName || !category) return []

            const data: CompatibilityItem[] = []

            // Define compatibility rules based on category
            switch (category) {
                case 'frontend':
                    if (stackName.toLowerCase() === 'react') {
                        data.push(
                            { name: 'TypeScript', versions: ['4.9+', '5.0+'], status: 'compatible' },
                            { name: 'Next.js', versions: ['13.0+', '14.0+'], status: 'compatible' },
                            { name: 'Tailwind CSS', versions: ['3.0+'], status: 'compatible' },
                            { name: 'Vite', versions: ['4.0+', '5.0+'], status: 'compatible' },
                            { name: 'Webpack', versions: ['5.0+'], status: 'compatible' },
                            { name: 'ESLint', versions: ['8.0+'], status: 'compatible' },
                            { name: 'Jest', versions: ['29.0+'], status: 'compatible' },
                            { name: 'React Router', versions: ['6.0+'], status: 'compatible' },
                            { name: 'Material-UI', versions: ['5.0+'], status: 'warning', note: 'Some breaking changes' },
                            { name: 'Styled Components', versions: ['5.0+', '6.0+'], status: 'compatible' }
                        )
                    } else if (stackName.toLowerCase() === 'vue') {
                        data.push(
                            { name: 'TypeScript', versions: ['4.9+', '5.0+'], status: 'compatible' },
                            { name: 'Nuxt.js', versions: ['3.0+'], status: 'compatible' },
                            { name: 'Vite', versions: ['4.0+', '5.0+'], status: 'compatible' },
                            { name: 'Vue Router', versions: ['4.0+'], status: 'compatible' },
                            { name: 'Pinia', versions: ['2.0+'], status: 'compatible' },
                            { name: 'Vuetify', versions: ['3.0+'], status: 'compatible' },
                            { name: 'Tailwind CSS', versions: ['3.0+'], status: 'compatible' }
                        )
                    } else if (stackName.toLowerCase() === 'angular') {
                        data.push(
                            { name: 'TypeScript', versions: ['4.9+', '5.0+'], status: 'compatible' },
                            { name: 'RxJS', versions: ['7.0+'], status: 'compatible' },
                            { name: 'Angular Material', versions: ['17.0+'], status: 'compatible' },
                            { name: 'NgRx', versions: ['17.0+'], status: 'compatible' },
                            { name: 'Jasmine', versions: ['4.0+'], status: 'compatible' },
                            { name: 'Karma', versions: ['6.0+'], status: 'warning', note: 'Consider migrating to Jest' }
                        )
                    }
                    break

                case 'backend':
                    if (stackName.toLowerCase() === 'express') {
                        data.push(
                            { name: 'Node.js', versions: ['16+', '18+', '20+'], status: 'compatible' },
                            { name: 'TypeScript', versions: ['4.9+', '5.0+'], status: 'compatible' },
                            { name: 'MongoDB', versions: ['5.0+', '6.0+'], status: 'compatible' },
                            { name: 'PostgreSQL', versions: ['13+', '14+', '15+'], status: 'compatible' },
                            { name: 'Redis', versions: ['6.0+', '7.0+'], status: 'compatible' },
                            { name: 'Jest', versions: ['29.0+'], status: 'compatible' },
                            { name: 'Passport.js', versions: ['0.6+'], status: 'compatible' }
                        )
                    } else if (stackName.toLowerCase() === 'fastapi') {
                        data.push(
                            { name: 'Python', versions: ['3.8+', '3.9+', '3.10+', '3.11+'], status: 'compatible' },
                            { name: 'Pydantic', versions: ['2.0+'], status: 'compatible' },
                            { name: 'SQLAlchemy', versions: ['1.4+', '2.0+'], status: 'compatible' },
                            { name: 'PostgreSQL', versions: ['13+', '14+', '15+'], status: 'compatible' },
                            { name: 'Redis', versions: ['6.0+', '7.0+'], status: 'compatible' },
                            { name: 'Pytest', versions: ['7.0+'], status: 'compatible' }
                        )
                    }
                    break

                case 'styling':
                    if (stackName.toLowerCase() === 'tailwind css') {
                        data.push(
                            { name: 'React', versions: ['17+', '18+'], status: 'compatible' },
                            { name: 'Vue', versions: ['3.0+'], status: 'compatible' },
                            { name: 'Angular', versions: ['15+', '16+', '17+'], status: 'compatible' },
                            { name: 'Next.js', versions: ['13+', '14+'], status: 'compatible' },
                            { name: 'Nuxt.js', versions: ['3.0+'], status: 'compatible' },
                            { name: 'Vite', versions: ['4.0+', '5.0+'], status: 'compatible' },
                            { name: 'PostCSS', versions: ['8.0+'], status: 'compatible' },
                            { name: 'Autoprefixer', versions: ['10.0+'], status: 'compatible' }
                        )
                    }
                    break

                case 'database':
                    if (stackName.toLowerCase() === 'postgresql') {
                        data.push(
                            { name: 'Node.js', versions: ['16+', '18+', '20+'], status: 'compatible' },
                            { name: 'Python', versions: ['3.8+', '3.9+', '3.10+', '3.11+'], status: 'compatible' },
                            { name: 'Prisma', versions: ['4.0+', '5.0+'], status: 'compatible' },
                            { name: 'SQLAlchemy', versions: ['1.4+', '2.0+'], status: 'compatible' },
                            { name: 'TypeORM', versions: ['0.3+'], status: 'compatible' },
                            { name: 'Sequelize', versions: ['6.0+'], status: 'compatible' }
                        )
                    }
                    break

                default:
                    // Generic compatibility for unknown categories
                    data.push(
                        { name: 'Node.js', versions: ['16+', '18+', '20+'], status: 'compatible' },
                        { name: 'TypeScript', versions: ['4.9+', '5.0+'], status: 'compatible' },
                        { name: 'ESLint', versions: ['8.0+'], status: 'compatible' },
                        { name: 'Prettier', versions: ['2.0+', '3.0+'], status: 'compatible' }
                    )
            }

            return data
        }

        setLoading(true)
        setTimeout(() => {
            setCompatibilityData(generateCompatibilityData())
            setLoading(false)
        }, 300)
    }, [stackName, category])

    const getStatusIcon = (status: CompatibilityItem['status']) => {
        switch (status) {
            case 'compatible':
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'incompatible':
                return <XCircle className="w-4 h-4 text-red-600" />
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />
            default:
                return <Info className="w-4 h-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: CompatibilityItem['status']) => {
        switch (status) {
            case 'compatible':
                return 'bg-green-50 border-green-200'
            case 'incompatible':
                return 'bg-red-50 border-red-200'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-16 bg-current-glow rounded-lg"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (compatibilityData.length === 0) {
        return (
            <div className="text-center py-8">
                <Info className="w-12 h-12 text-current-glow mx-auto mb-3" />
                <p className="text-current-rich">
                    No compatibility information available for this stack.
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-4 text-sm text-current-rich">
                Recommended versions for compatible stacks with <strong>{stackName}</strong>
            </div>

            <div className="space-y-3">
                {compatibilityData.map((item, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${getStatusColor(item.status)}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(item.status)}
                                    <h4 className="font-medium text-current-deep">
                                        {item.name}
                                    </h4>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {item.versions.map((version, vIndex) => (
                                        <span
                                            key={vIndex}
                                            className="px-2 py-1 bg-white/60 rounded text-xs font-mono text-current-deep border"
                                        >
                                            {version}
                                        </span>
                                    ))}
                                </div>

                                {item.note && (
                                    <p className="text-xs text-current-rich italic">
                                        {item.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-current-mist rounded-lg border border-current-glow/50">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-current-accent mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-current-rich">
                        <p className="font-medium mb-1">Compatibility Notes:</p>
                        <ul className="text-xs space-y-1">
                            <li>• Version ranges are recommendations based on common usage patterns</li>
                            <li>• Always check official documentation for the most up-to-date compatibility info</li>
                            <li>• Warning status indicates potential issues or breaking changes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}