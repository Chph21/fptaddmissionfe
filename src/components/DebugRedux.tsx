import React from 'react';
import { useAppSelector } from '../store/hooks';

const DebugRedux: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Redux State:</h4>
      <pre>{JSON.stringify(authState, null, 2)}</pre>
    </div>
  );
};

export default DebugRedux; 