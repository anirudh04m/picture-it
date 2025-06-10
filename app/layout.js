import '../index.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Picture It - Guess the Location',
  description: 'A gamified social media app where users guess photo locations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
} 