"use client";
import '@rainbow-me/rainbowkit/styles.css';

import App from './components/App';

// Rainbowkit ===================================================================================================
import { 
  getDefaultConfig, 
  RainbowKitProvider, 
  darkTheme } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_NAME || 'iArt-NFTs',
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || '',
  chains: [arbitrumSepolia, arbitrum],
});

const queryClient = new QueryClient();
// ==============================================================================================================

export default function Main() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );  
}