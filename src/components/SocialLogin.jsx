// 5. Create Social Login Component (src/components/SocialLogin.jsx)
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SocialLoginButton from './SocialLoginButton';

export default function SocialLogin() {
  const { signInWithGoogle, signInWithFacebook, signInWithTwitter } = useAuth();
  const router = useRouter();

  const handleSocialLogin = async (signInMethod) => {
    try {
      await signInMethod();
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <SocialLoginButton
        provider="google"
        onClick={() => handleSocialLogin(signInWithGoogle)}
        icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
              fill="#4285F4"
            />
          </svg>
        }
        label="Sign in with Google"
        bgColor="bg-white"
        textColor="text-gray-700"
      />

      <SocialLoginButton
        provider="facebook"
        onClick={() => handleSocialLogin(signInWithFacebook)}
        icon={
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        }
        label="Sign in with Facebook"
        bgColor="bg-blue-600"
        textColor="text-white"
      />

      <SocialLoginButton
        provider="twitter"
        onClick={() => handleSocialLogin(signInWithTwitter)}
        icon={
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        }
        label="Sign in with Twitter"
        bgColor="bg-blue-400"
        textColor="text-white"
      />
    </div>
  );
}