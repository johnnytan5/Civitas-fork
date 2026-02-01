'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-6xl font-bold text-white mb-4 text-center">
          Civitas
        </h1>
        <p className="text-2xl text-zinc-300 mb-8 text-center max-w-2xl">
          The first AI Agent that negotiates, deploys, and funds cross-chain agreements in a single click
        </p>

        <div className="flex gap-4">
          <Link
            href="/create"
            className="bg-white text-zinc-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-colors"
          >
            Create Agreement
          </Link>
          <Link
            href="/dashboard"
            className="bg-zinc-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-zinc-600 transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 text-white border border-zinc-700">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered Logic</h3>
            <p className="text-zinc-400 text-sm">Natural language to smart contract configuration</p>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 text-white border border-zinc-700">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Cross-Chain Liquidity</h3>
            <p className="text-zinc-400 text-sm">Fund from any token on any chain via LI.FI</p>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-lg p-6 text-white border border-zinc-700">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold mb-2">Human-Readable Identity</h3>
            <p className="text-zinc-400 text-sm">Basenames for memorable contract addresses</p>
          </div>
        </div>

        <div className="mt-16 text-zinc-500 text-sm">
          Built for ETH HackMoney 2026
        </div>
      </div>
    </div>
  );
}
