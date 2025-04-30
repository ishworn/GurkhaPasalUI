export interface Vendor {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description?: string;
    status: "active" | "inactive" | "pending";
    commissionRate: number;
    joinDate: string;
    permissions: {
      dashboard: {
        view: boolean;
        analytics: boolean;
        reports: boolean;
        notifications: boolean;
        settings: boolean;
      };
      products: {
        view: boolean;
        add: boolean;
        edit: boolean;
        delete: boolean;
      };
      orders: {
        view: boolean;
        process: boolean;
        cancel: boolean;
      };
      customers: {
        view: boolean;
        contact: boolean;
      };
      cms: {
        view: boolean;
        edit: boolean;
      };
    };
  }