// Simple test component to verify React is working
export function TestApp() {
    console.log('🧪 TestApp rendering...');

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center',
                maxWidth: '500px'
            }}>
                <h1 style={{
                    color: '#34ae6f',
                    marginBottom: '20px',
                    fontSize: '32px'
                }}>
                    ✅ React is Working!
                </h1>
                <p style={{
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                }}>
                    If you can see this message, React is rendering correctly.
                    The white screen issue was likely caused by an error in one of the components.
                </p>
                <button
                    onClick={() => {
                        console.log('Button clicked!');
                        alert('React event handlers are working!');
                    }}
                    style={{
                        background: '#34ae6f',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Test Click Event
                </button>
            </div>
        </div>
    );
}
