// CrefyProvider.tsx
"use client"
import { CrefyProvider, type SocialLogins } from "crefy-connect";
import "../../node_modules/crefy-connect/dist/index.css";

const socialLogins: SocialLogins = {
  google: true,
  github: false,
  discord: false,
  telegram: false,
  twitter: true,
  wallet: true,
  email: true,
  phone: true,
};

const config = {
  socialLogins,
  crefyId: "45c5b20a66bd3101f2d585dd631aca541d62bf3feaa2d03c43ae84240b16bbe6",
  appearance: {
    primaryColor: "#000000",
    secondaryColor: "#000000",
  },
};

export default function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
        <CrefyProvider config={config}>
        {children}
        </CrefyProvider>
    </html>
  );
}
