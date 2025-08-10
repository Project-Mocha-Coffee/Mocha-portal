"use client";

import React from "react";
import {
  OpenfortKitProvider,
  getDefaultConfig,
  RecoveryMethod,
} from "@openfort/openfort-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { polygonAmoy } from "viem/chains";

const config = createConfig(
  getDefaultConfig({
    appName: "Project Mocha",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [polygonAmoy],
    ssr: true,
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY || ""}
          walletConfig={{
            createEmbeddedSigner: true,
            embeddedSignerConfiguration: {
              shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY || "",
              recoveryMethod: RecoveryMethod.PASSWORD,
              shieldEncryptionKey: process.env.NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE || "",
            },
          }}
        >
          {children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}