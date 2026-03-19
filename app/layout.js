import './globals.css';

export const metadata = {
  title: 'Provenance — A Curated Archive of Significant Design',
  description: 'Design knowledge, not design inspiration. A curated archive of significant design objects with argued cross-disciplinary connections.',
  openGraph: {
    title: 'Provenance — Today\'s Design Object',
    description: 'A curated archive of 1,000 design objects. A new entry featured daily.',
    url: 'https://provenancearchive.uk',
    siteName: 'Provenance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Provenance — Today\'s Design Object',
    description: 'A curated archive of 1,000 design objects. A new entry featured daily.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
