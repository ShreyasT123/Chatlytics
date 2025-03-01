'use client';
// import { CardSpotlight } from "@/components/ui/card-spotlight";
// import { useAuth } from '@/context/AuthContext';
// import Image from 'next/image';

// export default function Login() {
//   const { signInWithGoogle } = useAuth();

//   const handleLogin = async () => {
//     try {
//       await signInWithGoogle();
//     } catch (error) {
//       console.error('Error signing in:', error);
//     }
//   };

//   return (
//     <button 
//       onClick={handleLogin}
//       //className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
//       className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-blue-400 hover:bg-blue-400 hover:text-white transition duration-150"

//     >
//       <Image
//         className="w-6 h-6" 
//         src="https://www.svgrepo.com/show/475656/google-color.svg" 
//         loading="lazy" 
//         alt="google logo"
//         height={20}
//         width={30}
//       />
//       <span>Login with Google</span>
//     </button>
//   );
// }



import React from 'react';
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Enhanced Login Component
export default function Login() {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all duration-200 shadow-sm"
          >
            <Image
              className="w-6 h-6" 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              loading="lazy" 
              alt="google logo"
              height={24}
              width={24}
            />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}