export default function CSSTestSimple() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>CSS Test Page</h1>
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <p>This is a simple test to verify CSS is working.</p>
        <p>If you can see this text with blue headers and light blue background, CSS is loading correctly.</p>
      </div>
      <div style={{ 
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '1rem', 
        borderRadius: '8px',
        color: 'white'
      }}>
        <p>This box should have a gradient background if CSS is working properly.</p>
      </div>
    </div>
  );
}