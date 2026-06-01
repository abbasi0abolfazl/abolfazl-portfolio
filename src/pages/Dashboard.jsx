import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import DashboardShell from '../components/dashboard/DashboardShell';

const PASSWORD = 'admin2025';

export default function Dashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('dash_auth') === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem('dash_auth', '1');
      setAuthed(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all
                ${error ? 'border-destructive ring-2 ring-destructive/30' : 'border-border/50'}`}
            />
            {error && <p className="text-destructive text-xs text-center">Incorrect password</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <DashboardShell onLogout={() => { sessionStorage.removeItem('dash_auth'); setAuthed(false); }} />;
}