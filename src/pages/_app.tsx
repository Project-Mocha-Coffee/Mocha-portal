import { Web3Provider } from "@/components/providers/web3-provider";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

// Import your CrefyProvider
import CrefyProvider from "@/components/CrefyProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CrefyProvider>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </CrefyProvider>
  );
}
