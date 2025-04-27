"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt"); 
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user");
        
        const userData = await response.json();
        setName(userData.name);
        setRole(userData.role);
      } catch (error) {
        console.error("Error:", error);
        router.push("/home"); 
      }
    };
  
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        router.push("/")
        localStorage.removeItem("jwt")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }


  const handleUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const content = await response.json()
      setName(content.name)
      setRole(content.role)
      console.log(content)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-2">
        {name ? `Welcome, ${name}! You are a ${role}` : "You are not authenticated"}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      <button
        onClick={handleUser}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get User
      </button>
    </div>
  )
}