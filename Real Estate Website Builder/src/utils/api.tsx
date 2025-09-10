import { projectId, publicAnonKey } from './supabase/info'

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b`

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  city: string
  area: string
  type: string
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
  features: string[]
  status: 'available' | 'sold' | 'pending'
  createdAt: string
  updatedAt: string
}

export interface PropertyImage {
  id: string
  fileName: string
  originalName: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

export interface DashboardStats {
  totalProperties: number
  totalImages: number
  totalAdmins: number
  propertyTypes: Record<string, number>
  avgPrice: number
}

// Auth functions
export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }
  
  return data
}

export async function signupAdmin(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ email, password, name })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed')
  }
  
  return data
}

// Property functions
export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch properties')
  }
  
  return data.properties
}

export async function getProperty(id: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch property')
  }
  
  return data.property
}

export async function createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(property)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create property')
  }
  
  return data.property
}

export async function updateProperty(id: string, updates: Partial<Property>, token: string): Promise<Property> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update property')
  }
  
  return data.property
}

export async function deleteProperty(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to delete property')
  }
}

export async function searchProperties(params: {
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  type?: string
}): Promise<Property[]> {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  
  const response = await fetch(`${API_BASE_URL}/properties/search?${searchParams}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to search properties')
  }
  
  return data.properties
}

// Image functions
export async function uploadImage(file: File, token: string): Promise<PropertyImage> {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload image')
  }
  
  return data.image
}

export async function getImages(token: string): Promise<PropertyImage[]> {
  const response = await fetch(`${API_BASE_URL}/images`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch images')
  }
  
  return data.images
}

export async function deleteImage(fileName: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/images/${fileName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to delete image')
  }
}

// Dashboard functions
export async function getDashboardStats(token: string): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch dashboard stats')
  }
  
  return data.stats
}

// Site Settings functions
export async function getSiteSettings(token: string) {
  const response = await fetch(`${API_BASE_URL}/site-settings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch site settings')
  }
  
  return data
}

export async function updateSiteSettings(settings: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/site-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update site settings')
  }
  
  return data
}

// Contact/Communication functions
export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify(formData)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit contact form')
  }
  
  return data
}

export async function getContactMessages(token: string) {
  const response = await fetch(`${API_BASE_URL}/contact-messages`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch contact messages')
  }
  
  return data.messages
}

export async function updateContactMessageStatus(messageId: string, status: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/contact-messages/${messageId}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to update message status')
  }
}

export async function replyToContactMessage(messageId: string, message: string, sendEmail: boolean, token: string) {
  const response = await fetch(`${API_BASE_URL}/contact-messages/${messageId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message, sendEmail })
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to send reply')
  }
}

// Admin Users functions
export async function getAdminUsers(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin-users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch admin users')
  }
  
  return data.users
}

export async function createAdminUser(userData: {
  email: string;
  name: string;
  password: string;
  role: string;
  permissions: string[];
}, token: string) {
  const response = await fetch(`${API_BASE_URL}/admin-users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create admin user')
  }
  
  return data.user
}

// Initialize sample properties (for testing/demo)
export async function addSampleProperties(token: string) {
  const response = await fetch(`${API_BASE_URL}/add-sample-properties`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add sample properties')
  }
  
  return data
}

