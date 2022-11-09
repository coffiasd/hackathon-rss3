import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import Charts from '../components/Charts';
import Script from 'next/script'

const Header = dynamic(() => import('../components/Header'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200" data-theme="emerald">
      <Head>
        <title>Next.js Startup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Alert />

      <Charts />

      <Footer />
    </div >
  )
}
