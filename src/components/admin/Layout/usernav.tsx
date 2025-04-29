"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import LogoutConfirmModal from "@/components/user/Account/logoutconfirm"
import { useRouter } from "next/navigation"

type User = {
  name: string;
 gmail: string;
  phone: string;

  avatar: string;
  memberSince: string;
  loyaltyPoints: number;
};
export function UserNav() {

const [showModal, setShowModal] = useState(false)
const [user, setUser] = useState<User | null>(null);
 
const [loading, setLoading] = useState(true);
const router = useRouter()


 useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt"); // adjust based on where you store it
  
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch user");
  
        const data = await res.json();
        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);


const handleLogout = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    if (data.message === 'success') {
      localStorage.removeItem('jwt');
      console.log('Logout successful:', data.message);

  
      router.push('/admin/login'); // Redirect to home page after logout
     
    }
  } catch (err) {
    console.error('Logout failed:', err);
  }
};



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <span className="hidden font-medium text-sm md:inline-block">Admin User</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem    
                  onClick={() => setShowModal(true)}>
          <LogOut className="mr-2 h-4 w-4" />
       Log out
        </DropdownMenuItem>
     
      </DropdownMenuContent>
      <LogoutConfirmModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  onConfirm={() => {
                    setShowModal(false);
                    handleLogout();
                  }}
                />
    </DropdownMenu>
    
  )
}

