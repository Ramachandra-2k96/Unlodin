import React, { useEffect, useState } from 'react';

const Debug: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  
  useEffect(() => {
    // Override console.error to capture errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setErrors(prev => [...prev, args.join(' ')]);
      originalConsoleError(...args);
    };
    
    // Capture any window errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `Error: ${event.message} at ${event.filename}:${event.lineno}`]);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  if (errors.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '10px',
      background: 'rgba(255, 0, 0, 0.8)',
      color: 'white',
      zIndex: 9999,
      maxHeight: '30vh',
      overflow: 'auto'
    }}>
      <h3>Debug Errors:</h3>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default Debug; 