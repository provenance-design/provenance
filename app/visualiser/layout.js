export const metadata = {
  title: 'Provenance Visualiser — Dev',
};

export default function VisualiserLayout({ children }) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1E2228' }}>
      {children}
    </div>
  );
}
