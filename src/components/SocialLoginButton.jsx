// 4. Create a SocialLoginButton component (src/components/SocialLoginButton.jsx)
'use client';

import { useState } from 'react';

export default function SocialLoginButton({ provider, onClick, icon, label, bgColor, textColor }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium ${bgColor} ${textColor} transition-colors hover:opacity-90 disabled:opacity-50`}
    >
      {icon}
      <span className="ml-2">{isLoading ? 'Signing in...' : label}</span>
    </button>
  );
}