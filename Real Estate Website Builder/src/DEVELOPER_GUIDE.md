# Rainbow Properties - Developer Guide

## Quick Start

### 1. Initial Setup
Visit `/setup` to run the initial setup which will:
- Create the developer admin account
- Add sample properties for testing

### 2. Developer Login Credentials
- **Email:** `developer@rainbowproperties.co.za`
- **Password:** `RainbowDev2024!`

### 3. Access Admin Panel
1. Click the "Admin" button in the main navigation menu
2. Login with the developer credentials above
3. You'll have access to all admin functionality

## Key Features Implemented

### Frontend (Public Pages)
- **Home Page** - Hero section with featured properties
- **About Page** - Company information and team
- **Properties Page** - Dynamic property listings with search/filter
- **Services Page** - Service offerings with pricing packages
- **Contact Page** - Contact form integrated with backend
- **Calculator Page** - Mortgage, affordability, and bond calculators

### Admin Dashboard
- **Dashboard Stats** - Overview of properties, images, users
- **Property Manager** - Add, edit, delete properties with image upload
- **Image Manager** - Upload and manage property images
- **Communication Panel** - View and respond to contact form submissions
- **Site Settings** - Manage site theme and settings
- **SEO Manager** - Configure SEO meta tags and Open Graph data
- **User Management** - Manage admin users with different roles

### Backend Features
- **Property Management** - Full CRUD operations
- **Image Storage** - Supabase storage integration
- **Contact Form** - Form submission handling
- **Admin Authentication** - User management with role hierarchy
- **Search & Filtering** - Dynamic property search

## Important Notes

### Currency Formatting
- All prices are displayed in South African Rand (ZAR)
- Format: `R 2,850,000` (using proper ZAR formatting)

### Location Dropdowns
- Property location dropdowns are now dynamic based on actual property data
- Locations are extracted from property city/area fields

### Contact Form Integration
- Contact form now properly submits to backend
- Messages appear in admin Communication Panel
- Includes proper error handling

### Admin Roles
Three levels of admin access:
1. **Developer** - Full access to everything
2. **Super Admin** - Most admin functions
3. **Admin** - Basic admin functions

## API Endpoints

All endpoints are prefixed with `/make-server-9fbf563b/`

### Public Endpoints
- `GET /properties` - List all properties
- `GET /properties/search` - Search properties with filters
- `POST /contact` - Submit contact form

### Admin Endpoints (require authentication)
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `POST /images/upload` - Upload images
- `GET /contact-messages` - Get contact messages
- `POST /contact-messages/:id/reply` - Reply to contact message

## Development Tips

1. **Testing Properties** - Use the setup page to add sample properties
2. **Admin Testing** - Login with developer credentials to test all admin features
3. **Contact Form** - Test the contact form to see it appear in admin panel
4. **Image Upload** - Use the image manager to upload property photos
5. **SEO Testing** - Configure SEO settings and test social sharing

## Troubleshooting

- If you can't login: Make sure you've run the initial setup
- If properties don't load: Check the browser console for API errors
- If images don't upload: Verify Supabase storage bucket is created
- If contact form doesn't work: Check network tab for API response

## Next Steps

You can now:
- Add more properties through the admin panel
- Customize the site theme via Settings
- Manage contact form submissions
- Configure SEO settings for better search visibility
- Add more admin users with different permission levels