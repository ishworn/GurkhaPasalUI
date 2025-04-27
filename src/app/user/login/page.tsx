
'use client'

import LoginModal from '@/components/user/Login/LoginModal'
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';


function page() {


    const [showLogin, setShowLogin] = useState(false);
      const [userName, setUserName] = useState(null);
      const [loading, setLoading] = useState(false);
      const router = useRouter();



       const fetchUser = async () => {
            console.log("🔍 Trying to fetch user from /api/user");
            const [cookies] = useCookies(['jwt']);
            const token = cookies.jwt;
          
            try {
              // Get the authentication token from wherever you store it
              // (localStorage, cookies, context, etc.)
            
              
              const res = await fetch('http://127.0.0.1:8000/api/user', {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : '',
                },
                credentials: 'include',
              });
              
              console.log("👀 Fetched user:", res);
              console.log("👀 Response status:", res.status);
              console.log("👀 Response headers:", [...res.headers.entries()]);
          
              if (!res.ok) {
                const err = await res.text();
                console.log("❌ Not OK:", err);
                setUserName(null);
                return;
              }
          
              const data = await res.json();
              console.log("✅ User data received:", data);
              setUserName(data.name || "User");
            } catch (err) {
              console.error("🔥 Fetch error:", err);
              setUserName(null);
            } finally {
              setLoading(false);
            }
          };
          
        
          // 🔁 Run once on mount
          useEffect(() => {
            fetchUser();
          }, []);

      const handleLoginSuccess = () => {
        setShowLogin(false);
        setTimeout(() => {
          fetchUser();
        }, 300); // Small delay to ensure JWT is set
    
       
      };
    
  return (


    <><LoginModal
                        open={showLogin}
                        onClose={() => setShowLogin(false)}
                        onLoginSuccess={handleLoginSuccess}
                      />
    
    </>
   
  )
}

export default page


