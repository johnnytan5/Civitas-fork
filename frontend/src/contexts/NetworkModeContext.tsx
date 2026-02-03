'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NetworkMode, getNetworkConfig } from '@/lib/config/networks';

interface NetworkModeContextType {
    networkMode: NetworkMode;
    setNetworkMode: (mode: NetworkMode) => void;
    toggleNetworkMode: () => void;
    config: ReturnType<typeof getNetworkConfig>;
}

const NetworkModeContext = createContext<NetworkModeContextType | undefined>(undefined);

const STORAGE_KEY = 'civitas_network_mode';

export function NetworkModeProvider({ children }: { children: ReactNode }) {
    const [networkMode, setNetworkModeState] = useState<NetworkMode>('testnet');
    const [isClient, setIsClient] = useState(false);

    // Initialize from localStorage on client side
    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem(STORAGE_KEY) as NetworkMode | null;
        if (stored === 'mainnet' || stored === 'testnet') {
            setNetworkModeState(stored);
        }
    }, []);

    const setNetworkMode = (mode: NetworkMode) => {
        setNetworkModeState(mode);
        if (isClient) {
            localStorage.setItem(STORAGE_KEY, mode);
        }
    };

    const toggleNetworkMode = () => {
        const newMode = networkMode === 'mainnet' ? 'testnet' : 'mainnet';
        setNetworkMode(newMode);
    };

    const config = getNetworkConfig(networkMode);

    return (
        <NetworkModeContext.Provider
            value={{
                networkMode,
                setNetworkMode,
                toggleNetworkMode,
                config,
            }}
        >
            {children}
        </NetworkModeContext.Provider>
    );
}

export function useNetworkMode() {
    const context = useContext(NetworkModeContext);
    if (context === undefined) {
        throw new Error('useNetworkMode must be used within a NetworkModeProvider');
    }
    return context;
}
