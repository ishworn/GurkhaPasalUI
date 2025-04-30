import { create } from 'zustand';
import { Vendor } from '@/types/vendor';

interface VendorState {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
  removeVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
}

const initialVendors: Vendor[] = [
  {
    id: "V001",
    name: "TechGadgets Inc.",
    contactPerson: "John Smith",
    email: "john@techgadgets.com",
    phone: "+1 (555) 123-4567",
    website: "https://techgadgets.com",
    address: "123 Tech Blvd",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
    description: "Leading provider of tech gadgets and accessories",
    status: "active",
    commissionRate: 15,
    joinDate: "2023-01-15",
    permissions: {
      dashboard: {
        view: true,
        analytics: true,
        reports: true,
        notifications: false,
        settings: false,
      },
      products: {
        view: true,
        add: true,
        edit: true,
        delete: false,
      },
      orders: {
        view: true,
        process: true,
        cancel: false,
      },
      customers: {
        view: true,
        contact: false,
      },
      cms: {
        view: false,
        edit: false,
      },
    },
  },
  {
    id: "V002",
    name: "Fashion Forward",
    contactPerson: "Emily Johnson",
    email: "emily@fashionforward.com",
    phone: "+1 (555) 987-6543",
    website: "https://fashionforward.com",
    address: "456 Style Ave",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    description: "Trendy fashion items and accessories",
    status: "active",
    commissionRate: 20,
    joinDate: "2023-02-10",
    permissions: {
      dashboard: {
        view: true,
        analytics: true,
        reports: false,
        notifications: true,
        settings: false,
      },
      products: {
        view: true,
        add: true,
        edit: true,
        delete: false,
      },
      orders: {
        view: true,
        process: true,
        cancel: false,
      },
      customers: {
        view: false,
        contact: false,
      },
      cms: {
        view: true,
        edit: true,
      },
    },
  },
  {
    id: "V003",
    name: "Home Essentials",
    contactPerson: "Michael Brown",
    email: "michael@homeessentials.com",
    phone: "+1 (555) 456-7890",
    website: "https://homeessentials.com",
    address: "789 Comfort St",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "United States",
    description: "Quality home goods and essentials",
    status: "inactive",
    commissionRate: 18,
    joinDate: "2023-03-05",
    permissions: {
      dashboard: {
        view: false,
        analytics: false,
        reports: false,
        notifications: false,
        settings: false,
      },
      products: {
        view: true,
        add: true,
        edit: false,
        delete: false,
      },
      orders: {
        view: true,
        process: false,
        cancel: false,
      },
      customers: {
        view: false,
        contact: false,
      },
      cms: {
        view: false,
        edit: false,
      },
    },
  },
  {
    id: "V004",
    name: "Outdoor Adventures",
    contactPerson: "Sarah Wilson",
    email: "sarah@outdooradventures.com",
    phone: "+1 (555) 234-5678",
    website: "https://outdooradventures.com",
    address: "321 Mountain Rd",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    country: "United States",
    description: "Outdoor gear and equipment for adventurers",
    status: "pending",
    commissionRate: 12,
    joinDate: "2023-04-20",
    permissions: {
      dashboard: {
        view: false,
        analytics: false,
        reports: false,
        notifications: false,
        settings: false,
      },
      products: {
        view: true,
        add: false,
        edit: false,
        delete: false,
      },
      orders: {
        view: true,
        process: false,
        cancel: false,
      },
      customers: {
        view: false,
        contact: false,
      },
      cms: {
        view: false,
        edit: false,
      },
    },
  },
];

export const useVendorStore = create<VendorState>((set) => ({
  vendors: initialVendors,
  
  addVendor: (vendor) => 
    set((state) => ({ 
      vendors: [...state.vendors, vendor] 
    })),
  
  updateVendor: (updatedVendor) => 
    set((state) => ({ 
      vendors: state.vendors.map(
        vendor => vendor.id === updatedVendor.id ? updatedVendor : vendor
      ) 
    })),
  
  removeVendor: (id) => 
    set((state) => ({ 
      vendors: state.vendors.filter(vendor => vendor.id !== id) 
    })),
  
  toggleVendorStatus: (id) => 
    set((state) => ({ 
      vendors: state.vendors.map(vendor => 
        vendor.id === id 
          ? { 
              ...vendor, 
              status: vendor.status === "active" ? "inactive" : "active"
            } 
          : vendor
      ) 
    })),
}));