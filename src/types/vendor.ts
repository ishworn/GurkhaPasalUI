export interface Vendor {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "pending"
  commission: number
  created_at: string
  permissions: {
    dashboard: {
      view: boolean
      analytics: boolean
      reports: boolean
      notifications: boolean
      settings: boolean
    }
    products: {
      view: boolean
      add: boolean
      edit: boolean
      delete: boolean
    }
    orders: {
      view: boolean
      process: boolean
      cancel: boolean
    }
    customers: {
      view: boolean
      contact: boolean
    }
    cms: {
      view: boolean
      edit: boolean
    }
  }
}
