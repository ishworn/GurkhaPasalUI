import { z } from "zod";

export const vendorFormSchema = z.object({
  name: z.string().min(2, { message: "Vendor name must be at least 2 characters." }),
  contactPerson: z.string().min(2, { message: "Contact person name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number is required." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  zipCode: z.string().min(3, { message: "ZIP/Postal Code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  commissionRate: z.coerce.number().min(0).max(100),
  permissions: z.object({
    dashboard: z.object({
      view: z.boolean().default(false),
      analytics: z.boolean().default(false),
      reports: z.boolean().default(false),
      notifications: z.boolean().default(false),
      settings: z.boolean().default(false),
    }),
    products: z.object({
      view: z.boolean().default(false),
      add: z.boolean().default(false),
      edit: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),
    orders: z.object({
      view: z.boolean().default(false),
      process: z.boolean().default(false),
      cancel: z.boolean().default(false),
    }),
    customers: z.object({
      view: z.boolean().default(false),
      contact: z.boolean().default(false),
    }),
    cms: z.object({
      view: z.boolean().default(false),
      edit: z.boolean().default(false),
    }),
  }),
});