import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import GlobalToast from './components/ui/GlobalToast';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App-root">
        <GlobalToast />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
