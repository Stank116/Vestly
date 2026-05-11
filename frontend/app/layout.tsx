import type { Metadata } from 'next';
import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Vestly - Solana Escrow',
  description:
    'Milestone-based USDC escrow, team approvals, and on-chain payouts for crypto-native teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
