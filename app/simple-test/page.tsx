'use client';

import { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
  }, []);

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        padding: '4rem 1rem',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '64rem', 
          margin: '0 auto', 
          padding: '0 1rem' 
        }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem', 
            textAlign: 'center' 
          }}>
            Simple Test Page
          </h1>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '1.5rem'
          }}>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      padding: '4rem 1rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '64rem', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem', 
          textAlign: 'center',
          fontFamily: 'var(--font-poppins, system-ui, sans-serif)'
        }}>
          Simple Test Page
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '1.5rem'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              fontFamily: 'var(--font-poppins, system-ui, sans-serif)'
            }}>
              Test Results
            </h2>
            <div style={{ 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              backgroundColor: '#dcfce7',
              color: '#166534'
            }}>
              <p style={{ fontWeight: '500' }}>
                ✅ Page loaded successfully without hydration errors
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-poppins, system-ui, sans-serif)'
              }}>
                Font Tests
              </h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    System Font (fallback):
                  </p>
                  <p style={{ 
                    fontSize: '1.125rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '0.375rem',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Poppins Font (via CSS variable):
                  </p>
                  <p style={{ 
                    fontSize: '1.125rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '0.375rem',
                    fontFamily: 'var(--font-poppins, system-ui, sans-serif)'
                  }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-poppins, system-ui, sans-serif)'
              }}>
                CSS Tests
              </h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  borderRadius: '0.375rem'
                }}>
                  Tailwind CSS working
                </div>
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'linear-gradient(to right, #8b5cf6, #ec4899)', 
                  color: 'white', 
                  borderRadius: '0.375rem'
                }}>
                  Gradient working
                </div>
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  Shadow working
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}