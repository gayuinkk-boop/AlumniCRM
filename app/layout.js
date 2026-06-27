import { Inter, Syne } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });

export const metadata = {
  title: "VSIT Alumni CRM",
  description: "Vidyalankar School of Information Technology Alumni Network.",
};

const MetaMaskErrorSuppressorScript = `
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && (
      (event.reason.stack && event.reason.stack.indexOf('chrome-extension://') !== -1) ||
      (event.reason.message && event.reason.message.indexOf('MetaMask') !== -1) ||
      (event.reason.message && event.reason.message.indexOf('Failed to connect to MetaMask') !== -1)
    )) {
      event.preventDefault();
      console.warn('Suppressed unhandled browser extension rejection:', event.reason);
    }
  });
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MetaMaskErrorSuppressorScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
