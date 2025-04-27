"use client"

import { useEffect, useState } from "react"
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  User,
  ShoppingBag,
  Gift,
  MessageSquare,
  HelpCircle,
  ChevronRight,
} from "lucide-react"
import  LogoutConfirmModal from "@/components/user/Account/logoutconfirm"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type User = {
  name: string;
 gmail: string;
  phone: string;

  avatar: string;
  memberSince: string;
  loyaltyPoints: number;
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data
  // const user = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   phone: "+977 9812345678",
  //   avatar: "/placeholder.svg?height=100&width=100",
  //   memberSince: "January 2022",
  //   loyaltyPoints: 250,
  // }

  
  
  

  // Mock orders
  const orders = [
    { id: "DRZ123456", date: "15 Mar 2024", status: "Delivered", items: 2, total: "Rs. 2,500" },
    { id: "DRZ123123", date: "28 Feb 2024", status: "Processing", items: 1, total: "Rs. 1,200" },
    { id: "DRZ122456", date: "10 Jan 2024", status: "Delivered", items: 3, total: "Rs. 4,750" },
  ]

  // Mock wishlist items
  const wishlistItems = [
    { id: 1, name: "Smartphone X Pro", price: "Rs. 45,000", image: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Wireless Earbuds", price: "Rs. 3,500", image: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Smart Watch Series 5", price: "Rs. 12,000", image: "/placeholder.svg?height=80&width=80" },
  ]

  // Mock addresses
  const addresses = [
    { id: 1, type: "Home", address: "123 Main Street, Kathmandu", phone: "+977 9812345678", isDefault: true },
    { id: 2, type: "Office", address: "456 Business Avenue, Lalitpur", phone: "+977 9898765432", isDefault: false },
  ]

 

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

    
        router.push('/'); // Redirect to home page after logout
       
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}


      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.gmail}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
                <div className="mt-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                  {user.loyaltyPoints} Loyalty Points
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarItem
                  icon={<User className="h-5 w-5" />}
                  label="My Account"
                  active={activeTab === "account"}
                  onClick={() => setActiveTab("account")}
                />
                <SidebarItem
                  icon={<Package className="h-5 w-5" />}
                  label="My Orders"
                  active={activeTab === "orders"}
                  onClick={() => setActiveTab("orders")}
                />
                <SidebarItem
                  icon={<Heart className="h-5 w-5" />}
                  label="My Wishlist"
                  active={activeTab === "wishlist"}
                  onClick={() => setActiveTab("wishlist")}
                />
                <SidebarItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="My Addresses"
                  active={activeTab === "addresses"}
                  onClick={() => setActiveTab("addresses")}
                />
                <SidebarItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Payment Methods"
                  active={activeTab === "payment"}
                  onClick={() => setActiveTab("payment")}
                />
                <SidebarItem
                  icon={<Gift className="h-5 w-5" />}
                  label="Vouchers"
                  active={activeTab === "vouchers"}
                  onClick={() => setActiveTab("vouchers")}
                />
                <SidebarItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                  active={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                />
                <SidebarItem
                  icon={<LogOut className="h-5 w-5" />}
                  label="Logout"
                  onClick={() => setShowModal(true)}
                />
                <LogoutConfirmModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  onConfirm={() => {
                    setShowModal(false);
                    handleLogout();
                  }}
                />
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "orders" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">To Pay</TabsTrigger>
                      <TabsTrigger value="processing">To Ship</TabsTrigger>
                      <TabsTrigger value="shipped">To Receive</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <span className="font-medium">Order #{order.id}</span>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="text-sm text-gray-500">{order.date}</span>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded ${order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {order.items} {order.items > 1 ? "items" : "item"} • {order.total}
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="pending">
                      <div className="text-center py-8 text-gray-500">
                        <p>No orders to pay</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="processing">
                      <div className="space-y-4">
                        {orders
                          .filter((o) => o.status === "Processing")
                          .map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <span className="font-medium">Order #{order.id}</span>
                                  <span className="mx-2 text-gray-400">|</span>
                                  <span className="text-sm text-gray-500">{order.date}</span>
                                </div>
                                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                  {order.items} {order.items > 1 ? "items" : "item"} • {order.total}
                                </div>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "wishlist" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 flex hover:shadow-md transition-shadow">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-orange-600 font-semibold">{item.price}</p>
                          <div className="flex mt-2 space-x-2">
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              Add to Cart
                            </Button>
                            <Button size="sm" variant="outline">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "addresses" && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Addresses</h2>
                    <Button className="bg-orange-500 hover:bg-orange-600">Add New Address</Button>
                  </div>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span className="font-medium">{address.type}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500">
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{address.address}</p>
                        <p className="text-gray-500 text-sm mt-1">{address.phone}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "account" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Personal Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={user.name}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={user.gmail}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={user.phone}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                      </div>
                      <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Account Security</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Password</h4>
                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                          </div>
                          <Button variant="outline">Change</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500">Not enabled</p>
                          </div>
                          <Button variant="outline">Enable</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "payment" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Saved Payment Methods</h3>
                      <div className="text-center py-8 text-gray-500">
                        <p>You don't have any saved payment methods</p>
                        <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Add Payment Method</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Available Payment Options</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border rounded p-3 text-center">
                          <p className="font-medium">Cash on Delivery</p>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <p className="font-medium">eSewa</p>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <p className="font-medium">Khalti</p>
                        </div>
                        <div className="border rounded p-3 text-center">
                          <p className="font-medium">Connect IPS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "vouchers" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My Vouchers</h2>
                  <Tabs defaultValue="available">
                    <TabsList className="mb-4">
                      <TabsTrigger value="available">Available</TabsTrigger>
                      <TabsTrigger value="used">Used</TabsTrigger>
                      <TabsTrigger value="expired">Expired</TabsTrigger>
                    </TabsList>
                    <TabsContent value="available">
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-orange-600">Rs. 500 OFF</h3>
                              <p className="text-sm">Min. spend Rs. 3,000</p>
                              <p className="text-xs text-gray-500 mt-2">Valid until: 30 Apr 2024</p>
                            </div>
                            <div className="flex items-center">
                              <Button className="bg-orange-500 hover:bg-orange-600">Use Now</Button>
                            </div>
                          </div>
                        </div>
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-orange-600">15% OFF</h3>
                              <p className="text-sm">Electronics category only</p>
                              <p className="text-xs text-gray-500 mt-2">Valid until: 15 Apr 2024</p>
                            </div>
                            <div className="flex items-center">
                              <Button className="bg-orange-500 hover:bg-orange-600">Use Now</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="used">
                      <div className="text-center py-8 text-gray-500">
                        <p>No used vouchers</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="expired">
                      <div className="text-center py-8 text-gray-500">
                        <p>No expired vouchers</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Settings</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>Order updates</span>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>Promotions and deals</span>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span>Price drops on wishlist items</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Language Preferences</h3>
                      <select className="w-full p-2 border rounded-md">
                        <option>English</option>
                        <option>नेपाली</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${active ? "bg-orange-100 text-orange-800" : "hover:bg-gray-100"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}
