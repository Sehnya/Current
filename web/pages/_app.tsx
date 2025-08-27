import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/Layout'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Current - Stay ahead of the wave in tech</title>
                <meta name="description" content="Track 130+ frameworks, libraries, and tools with real-time popularity metrics" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}