import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Initialize storage bucket for property images
async function initializeBucket() {
  const bucketName = 'make-9fbf563b-property-images'
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['image/*']
      })
      
      if (error) {
        // Check if error is because bucket already exists (409 conflict)
        if (error.message?.includes('already exists') || error.statusCode === '409') {
          console.log('Storage bucket already exists - continuing')
        } else {
          console.error('Error creating bucket:', error)
        }
      } else {
        console.log('Storage bucket created successfully')
      }
    } else {
      console.log('Storage bucket already exists')
    }
  } catch (error) {
    console.error('Error initializing bucket:', error)
  }
}

// Initialize bucket on startup
initializeBucket()

// Admin Authentication
app.post('/make-server-9fbf563b/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.error('Signup error:', error)
      return c.json({ error: `Signup failed: ${error.message}` }, 400)
    }

    return c.json({ 
      message: 'Admin user created successfully', 
      user: { id: data.user?.id, email: data.user?.email, name } 
    })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: `Signup failed: ${error}` }, 500)
  }
})

app.post('/make-server-9fbf563b/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login error:', error)
      return c.json({ error: `Login failed: ${error.message}` }, 401)
    }

    return c.json({
      message: 'Login successful',
      access_token: data.session?.access_token,
      user: data.user
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: `Login failed: ${error}` }, 500)
  }
})

// Authentication middleware
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401)
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  
  if (error || !user?.id) {
    console.error('Auth verification error:', error)
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }

  c.set('userId', user.id)
  c.set('userEmail', user.email)
  await next()
}

// Property Management Endpoints

// Get all properties
app.get('/make-server-9fbf563b/properties', async (c) => {
  try {
    const properties = await kv.getByPrefix('property:')
    const propertyData = properties
      .filter(p => p && p.key && p.value)
      .map(p => ({
        id: p.key.replace('property:', ''),
        ...p.value
      }))
    
    return c.json({ properties: propertyData })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return c.json({ error: `Failed to fetch properties: ${error}` }, 500)
  }
})

// Get single property
app.get('/make-server-9fbf563b/properties/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const property = await kv.get(`property:${id}`)
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404)
    }
    
    return c.json({ property: { id, ...property } })
  } catch (error) {
    console.error('Error fetching property:', error)
    return c.json({ error: `Failed to fetch property: ${error}` }, 500)
  }
})

// Create property (requires auth)
app.post('/make-server-9fbf563b/properties', requireAuth, async (c) => {
  try {
    const propertyData = await c.req.json()
    const id = crypto.randomUUID()
    
    const property = {
      ...propertyData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: c.get('userId')
    }
    
    await kv.set(`property:${id}`, property)
    
    return c.json({ 
      message: 'Property created successfully',
      property: { id, ...property }
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return c.json({ error: `Failed to create property: ${error}` }, 500)
  }
})

// Update property (requires auth)
app.put('/make-server-9fbf563b/properties/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    
    const existing = await kv.get(`property:${id}`)
    if (!existing) {
      return c.json({ error: 'Property not found' }, 404)
    }
    
    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`property:${id}`, updated)
    
    return c.json({ 
      message: 'Property updated successfully',
      property: { id, ...updated }
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return c.json({ error: `Failed to update property: ${error}` }, 500)
  }
})

// Delete property (requires auth)
app.delete('/make-server-9fbf563b/properties/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    
    const existing = await kv.get(`property:${id}`)
    if (!existing) {
      return c.json({ error: 'Property not found' }, 404)
    }
    
    await kv.del(`property:${id}`)
    
    return c.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return c.json({ error: `Failed to delete property: ${error}` }, 500)
  }
})

// Image Upload Endpoint (requires auth)
app.post('/make-server-9fbf563b/images/upload', requireAuth, async (c) => {
  try {
    const body = await c.req.formData()
    const file = body.get('image') as File
    
    if (!file) {
      return c.json({ error: 'No image file provided' }, 400)
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const bucketName = 'make-9fbf563b-property-images'
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file)
    
    if (error) {
      console.error('Upload error:', error)
      return c.json({ error: `Upload failed: ${error.message}` }, 500)
    }
    
    // Generate signed URL for the uploaded file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 year
    
    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError)
      return c.json({ error: `Failed to generate signed URL: ${signedUrlError.message}` }, 500)
    }
    
    // Store image metadata in KV store
    const imageData = {
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: signedUrlData.signedUrl,
      uploadedBy: c.get('userId'),
      uploadedAt: new Date().toISOString()
    }
    
    await kv.set(`image:${fileName}`, imageData)
    
    return c.json({ 
      message: 'Image uploaded successfully',
      image: imageData
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return c.json({ error: `Failed to upload image: ${error}` }, 500)
  }
})

// Get all images (requires auth)
app.get('/make-server-9fbf563b/images', requireAuth, async (c) => {
  try {
    const images = await kv.getByPrefix('image:')
    const imageData = images
      .filter(img => img && img.key && img.value)
      .map(img => ({
        id: img.key.replace('image:', ''),
        ...img.value
      }))
    
    return c.json({ images: imageData })
  } catch (error) {
    console.error('Error fetching images:', error)
    return c.json({ error: `Failed to fetch images: ${error}` }, 500)
  }
})

// Delete image (requires auth)
app.delete('/make-server-9fbf563b/images/:fileName', requireAuth, async (c) => {
  try {
    const fileName = c.req.param('fileName')
    const bucketName = 'make-9fbf563b-property-images'
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([fileName])
    
    if (storageError) {
      console.error('Storage delete error:', storageError)
      return c.json({ error: `Failed to delete from storage: ${storageError.message}` }, 500)
    }
    
    // Delete metadata from KV store
    await kv.del(`image:${fileName}`)
    
    return c.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return c.json({ error: `Failed to delete image: ${error}` }, 500)
  }
})

// Search properties
app.get('/make-server-9fbf563b/properties/search', async (c) => {
  try {
    const { location, minPrice, maxPrice, bedrooms, type } = c.req.query()
    
    let properties = await kv.getByPrefix('property:')
    let propertyData = properties
      .filter(p => p && p.key && p.value)
      .map(p => ({
        id: p.key.replace('property:', ''),
        ...p.value
      }))
    
    // Filter properties based on search criteria
    if (location) {
      propertyData = propertyData.filter(p => 
        p.location?.toLowerCase().includes(location.toLowerCase()) ||
        p.city?.toLowerCase().includes(location.toLowerCase()) ||
        p.area?.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    if (minPrice) {
      propertyData = propertyData.filter(p => p.price >= parseInt(minPrice))
    }
    
    if (maxPrice) {
      propertyData = propertyData.filter(p => p.price <= parseInt(maxPrice))
    }
    
    if (bedrooms) {
      propertyData = propertyData.filter(p => p.bedrooms >= parseInt(bedrooms))
    }
    
    if (type && type !== 'all') {
      propertyData = propertyData.filter(p => p.type?.toLowerCase() === type.toLowerCase())
    }
    
    return c.json({ properties: propertyData })
  } catch (error) {
    console.error('Error searching properties:', error)
    return c.json({ error: `Failed to search properties: ${error}` }, 500)
  }
})

// Dashboard stats (requires auth)
app.get('/make-server-9fbf563b/dashboard/stats', requireAuth, async (c) => {
  try {
    const properties = await kv.getByPrefix('property:')
    const images = await kv.getByPrefix('image:')
    const admins = await kv.getByPrefix('admin:')
    
    const validProperties = properties.filter(p => p && p.key && p.value)
    const validImages = images.filter(i => i && i.key && i.value)
    const validAdmins = admins.filter(a => a && a.key && a.value)
    
    const totalProperties = validProperties.length
    const totalImages = validImages.length
    const totalAdmins = Math.max(validAdmins.length, 1) // At least one admin (current user)
    
    // Calculate property statistics
    const propertyTypes = {}
    const propertyData = validProperties.map(p => p.value).filter(p => p)
    
    propertyData.forEach(property => {
      if (property && property.type) {
        const type = property.type || 'Unknown'
        propertyTypes[type] = (propertyTypes[type] || 0) + 1
      }
    })
    
    const avgPrice = propertyData.length > 0 
      ? propertyData.reduce((sum, p) => sum + (p?.price || 0), 0) / propertyData.length
      : 0
    
    return c.json({
      stats: {
        totalProperties,
        totalImages,
        totalAdmins,
        propertyTypes,
        avgPrice: Math.round(avgPrice)
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return c.json({ error: `Failed to fetch dashboard stats: ${error}` }, 500)
  }
})

// Site Settings Endpoints

// Get site settings (requires auth)
app.get('/make-server-9fbf563b/site-settings', requireAuth, async (c) => {
  try {
    const settings = await kv.get('site:settings')
    return c.json(settings || {})
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return c.json({ error: `Failed to fetch site settings: ${error}` }, 500)
  }
})

// Update site settings (requires auth)
app.post('/make-server-9fbf563b/site-settings', requireAuth, async (c) => {
  try {
    const settings = await c.req.json()
    
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: c.get('userId')
    }
    
    await kv.set('site:settings', updatedSettings)
    
    return c.json({ 
      message: 'Site settings updated successfully',
      settings: updatedSettings
    })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return c.json({ error: `Failed to update site settings: ${error}` }, 500)
  }
})

// Contact Messages Endpoints

// Submit contact form (public)
app.post('/make-server-9fbf563b/contact', async (c) => {
  try {
    const { name, email, phone, subject, message } = await c.req.json()
    
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const contactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new',
      priority: 'medium',
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`contact:${contactMessage.id}`, contactMessage)
    
    return c.json({ 
      message: 'Message sent successfully',
      id: contactMessage.id
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return c.json({ error: `Failed to submit message: ${error}` }, 500)
  }
})

// Get contact messages (requires auth)
app.get('/make-server-9fbf563b/contact-messages', requireAuth, async (c) => {
  try {
    const messages = await kv.getByPrefix('contact:')
    const messageData = messages
      .filter(m => m && m.key && m.value)
      .map(m => ({
        id: m.key.replace('contact:', ''),
        ...m.value
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return c.json({ messages: messageData })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return c.json({ error: `Failed to fetch messages: ${error}` }, 500)
  }
})

// Update contact message status (requires auth)
app.post('/make-server-9fbf563b/contact-messages/:id/status', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    
    const existing = await kv.get(`contact:${id}`)
    if (!existing) {
      return c.json({ error: 'Message not found' }, 404)
    }
    
    const updated = {
      ...existing,
      status,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`contact:${id}`, updated)
    
    return c.json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('Error updating message status:', error)
    return c.json({ error: `Failed to update status: ${error}` }, 500)
  }
})

// Reply to contact message (requires auth)
app.post('/make-server-9fbf563b/contact-messages/:id/reply', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const { message, sendEmail } = await c.req.json()
    
    const existing = await kv.get(`contact:${id}`)
    if (!existing) {
      return c.json({ error: 'Message not found' }, 404)
    }
    
    const reply = {
      id: crypto.randomUUID(),
      message,
      isFromAdmin: true,
      authorName: 'Admin',
      createdAt: new Date().toISOString()
    }
    
    const updated = {
      ...existing,
      responses: [...(existing.responses || []), reply],
      status: 'in_progress',
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`contact:${id}`, updated)
    
    // TODO: Send email if sendEmail is true
    if (sendEmail) {
      console.log(`Would send email reply to ${existing.email}:`, message)
    }
    
    return c.json({ message: 'Reply sent successfully' })
  } catch (error) {
    console.error('Error sending reply:', error)
    return c.json({ error: `Failed to send reply: ${error}` }, 500)
  }
})

// Admin Users Management (requires auth)
app.get('/make-server-9fbf563b/admin-users', requireAuth, async (c) => {
  try {
    const admins = await kv.getByPrefix('admin:')
    const adminData = admins
      .filter(a => a && a.key && a.value)
      .map(a => ({
        id: a.key.replace('admin:', ''),
        ...a.value
      }))
    
    return c.json({ users: adminData })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return c.json({ error: `Failed to fetch admin users: ${error}` }, 500)
  }
})

// Create admin user (requires auth)
app.post('/make-server-9fbf563b/admin-users', requireAuth, async (c) => {
  try {
    const { email, name, password, role, permissions } = await c.req.json()
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true
    })

    if (error) {
      console.error('Admin user creation error:', error)
      return c.json({ error: `Failed to create admin user: ${error.message}` }, 400)
    }

    // Store additional admin data
    const adminData = {
      id: data.user.id,
      email,
      name,
      role,
      permissions,
      createdAt: new Date().toISOString(),
      createdBy: c.get('userId')
    }
    
    await kv.set(`admin:${data.user.id}`, adminData)
    
    return c.json({ 
      message: 'Admin user created successfully',
      user: adminData
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return c.json({ error: `Failed to create admin user: ${error}` }, 500)
  }
})

// SEO Management Endpoints

// Get SEO data (requires auth)
app.get('/make-server-9fbf563b/seo', requireAuth, async (c) => {
  try {
    const seoData = await kv.get('seo:settings')
    
    if (!seoData) {
      return c.json({})
    }
    
    return c.json(seoData)
  } catch (error) {
    console.error('Error fetching SEO data:', error)
    return c.json({ error: `Failed to fetch SEO data: ${error}` }, 500)
  }
})

// Update SEO data (requires auth)
app.post('/make-server-9fbf563b/seo', requireAuth, async (c) => {
  try {
    const seoData = await c.req.json()
    
    const updatedData = {
      ...seoData,
      updatedAt: new Date().toISOString(),
      updatedBy: c.get('userId')
    }
    
    await kv.set('seo:settings', updatedData)
    
    return c.json({ 
      message: 'SEO settings updated successfully',
      data: updatedData
    })
  } catch (error) {
    console.error('Error updating SEO data:', error)
    return c.json({ error: `Failed to update SEO data: ${error}` }, 500)
  }
})

// Create developer account (can be called once to set up)
app.post('/make-server-9fbf563b/create-developer', async (c) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'developer@rainbowproperties.co.za',
      password: 'RainbowDev2024!',
      user_metadata: { name: 'Developer', role: 'developer' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      // Check if user already exists
      if (error.message?.includes('already exists') || error.message?.includes('already registered')) {
        return c.json({ message: 'Developer account already exists' })
      }
      console.error('Developer signup error:', error)
      return c.json({ error: `Failed to create developer account: ${error.message}` }, 400)
    }

    // Store additional admin data
    const adminData = {
      id: data.user.id,
      email: 'developer@rainbowproperties.co.za',
      name: 'Developer',
      role: 'developer',
      permissions: ['all'],
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    }
    
    await kv.set(`admin:${data.user.id}`, adminData)

    return c.json({ 
      message: 'Developer account created successfully',
      user: { id: data.user?.id, email: data.user?.email, name: 'Developer' },
      credentials: {
        email: 'developer@rainbowproperties.co.za',
        password: 'RainbowDev2024!'
      }
    })
  } catch (error) {
    console.error('Developer signup error:', error)
    return c.json({ error: `Failed to create developer account: ${error}` }, 500)
  }
})

// Add sample properties (for demo purposes - can be called once to populate)
app.post('/make-server-9fbf563b/add-sample-properties', requireAuth, async (c) => {
  try {
    // Check if any properties already exist
    const existingProperties = await kv.getByPrefix('property:')
    
    if (existingProperties.length > 0) {
      return c.json({ message: 'Properties already exist' })
    }

    // Create sample properties
    const sampleProperties = [
      {
        id: crypto.randomUUID(),
        title: "Modern Family Home in Sandton",
        description: "Beautiful modern family home with spacious rooms and contemporary finishes. Perfect for families looking for luxury and comfort in the heart of Sandton.",
        price: 2850000,
        location: "123 Main Street, Sandton",
        city: "Johannesburg",
        area: "Sandton",
        type: "House",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3500,
        images: ["https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NjcwNjk5MXww&ixlib=rb-4.1.0&q=80&w=1080"],
        features: ["Swimming Pool", "Garden", "Double Garage", "Security System", "Modern Kitchen"],
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: c.get('userId')
      },
      {
        id: crypto.randomUUID(),
        title: "Luxury Apartment with City Views",
        description: "Stunning luxury apartment with breathtaking city and mountain views. Modern amenities and premium finishes throughout this exceptional property.",
        price: 1650000,
        location: "456 Ocean Drive, V&A Waterfront",
        city: "Cape Town",
        area: "V&A Waterfront",
        type: "Apartment",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        images: ["https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3NDc4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"],
        features: ["City Views", "Balcony", "Gym Access", "Concierge", "Secure Parking"],
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: c.get('userId')
      },
      {
        id: crypto.randomUUID(),
        title: "Elegant Townhouse in Rosebank",
        description: "Elegant townhouse in prime location with modern amenities. Close to shopping centers, business districts, and excellent schools.",
        price: 1850000,
        location: "789 Park Avenue, Rosebank",
        city: "Johannesburg",
        area: "Rosebank",
        type: "Townhouse",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        images: ["https://images.unsplash.com/photo-1638284457192-27d3d0ec51aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTY3OTgzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"],
        features: ["Private Garden", "Double Garage", "Study Room", "Patio", "Air Conditioning"],
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: c.get('userId')
      },
      {
        id: crypto.randomUUID(),
        title: "Cozy Apartment in Stellenbosch",
        description: "Charming apartment perfect for students or young professionals. Located in the heart of Stellenbosch with easy access to university and amenities.",
        price: 1200000,
        location: "45 University Street, Stellenbosch",
        city: "Cape Town",
        area: "Stellenbosch",
        type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 650,
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY3OTgzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"],
        features: ["Mountain Views", "Covered Parking", "Modern Finishes", "Communal Garden"],
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: c.get('userId')
      },
      {
        id: crypto.randomUUID(),
        title: "Family Home in Durban North",
        description: "Spacious family home with sea views in the sought-after area of Durban North. Perfect for families with children, close to good schools.",
        price: 2200000,
        location: "67 Coastal Drive, Durban North",
        city: "Durban",
        area: "Durban North",
        type: "House",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1Njc5ODM3OHww&ixlib=rb-4.1.0&q=80&w=1080"],
        features: ["Sea Views", "Swimming Pool", "Large Garden", "Triple Garage", "Entertainment Area"],
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: c.get('userId')
      }
    ]

    // Save all sample properties
    for (const property of sampleProperties) {
      await kv.set(`property:${property.id}`, property)
    }

    return c.json({ 
      message: 'Sample properties added successfully',
      propertiesCreated: sampleProperties.length
    })
  } catch (error) {
    console.error('Error adding sample properties:', error)
    return c.json({ error: `Failed to add sample properties: ${error}` }, 500)
  }
})

// Health check
app.get('/make-server-9fbf563b/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)