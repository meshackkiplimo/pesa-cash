import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Pesa App',
  description: 'Secure money management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
