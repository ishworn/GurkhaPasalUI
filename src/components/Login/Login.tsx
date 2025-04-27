'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';


export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowLogin(true)}
        className="px-4 py-2  text-black rounded"
      >
       Login
      </button>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
