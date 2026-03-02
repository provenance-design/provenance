import './globals.css';

export const metadata = {
  title: 'Provenance — A Curated Archive of Significant Design',
  description: 'Design knowledge, not design inspiration. A curated archive of significant design objects with argued cross-disciplinary connections.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem 1.5rem', 
          fontSize: '0.7rem', 
          fontFamily: 'DM Sans, sans-serif',
          color: '#999', 
          letterSpacing: '0.05em'
        }}>
          © Neil Housego 2025. The Provenance Archive is an independent educational resource.
        </footer>
      </body>
    </html>
  );
}
