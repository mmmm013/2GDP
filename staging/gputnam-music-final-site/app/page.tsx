export default function Home() {
  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>G Putnam Music</h1>
      <p style={{ opacity: 0.7 }}>The One Stop Song Shop</p>

      <div style={{ marginTop: '40px' }}>
        <a href="/catalog" style={{ marginRight: '20px' }}>Browse Catalog</a>
        <a href="/contact">Contact</a>
      </div>
    </main>
  );
}
