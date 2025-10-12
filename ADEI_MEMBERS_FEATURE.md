# ADEI Members Management Feature

## Overview
The ADEI Members Management feature has been successfully updated with a hierarchical role-based system that allows administrators to manage members and displays them in a structured organizational hierarchy on the ADEI page.

---

## Features Implemented

### 1. Admin Panel - ADEI Members Management

The admin panel now includes comprehensive CRUD operations for ADEI members with the following fields:

- **Name**: Full name of the member
- **Photo**: Uploaded image (supports image upload with preview)
- **Role**: Selected from a hierarchical dropdown menu
- **Email**: Contact email (displayed as a "Contact" button on the ADEI page)

#### Available Roles (in hierarchical order):
1. President
2. Vice President
3. Secrétaire Générale
4. Trésorier
5. Conseillers
6. IT Manager
7. IT Team
8. Représentant des étudiants étrangers
9. Représentant des Lauréats
10. Affaires Administratives
11. Responsable Media
12. Responsable Interne
13. Responsables Sponsoring
14. Responsables Création & Design

#### Admin Panel Features:
- Add new ADEI members with photo upload
- Edit existing members (update name, role, email, or replace photo)
- Delete members (automatically removes uploaded photos)
- View all members in a table format
- Search functionality to find specific members

---

### 2. ADEI Page Display

The ADEI page now displays members in a beautiful hierarchical layout:

#### Hierarchical Layout Structure:
- **Row 1**: President, Vice President (2 cards per row)
- **Row 2**: Secrétaire Générale, Trésorier (2 cards per row)
- **Row 3**: Conseillers (up to 3 cards per row)
- **Row 4**: IT Manager, IT Team (2 cards per row)
- **Row 5**: Représentant des étudiants étrangers, Représentant des Lauréats, Affaires Administratives (3 cards per row)
- **Row 6**: Responsable Media, Responsable Interne (2 cards per row)
- **Row 7**: Responsables Sponsoring (up to 3 cards per row)
- **Row 8**: Responsables Création & Design (up to 3 cards per row)

#### Member Card Features:
- Professional card design with gradient background
- Circular profile photo with border
- Role title displayed prominently
- Member name
- Contact button (mailto link)
- Hover animations for better UX
- Responsive layout for all screen sizes

---

## Technical Implementation

### Database Schema (MongoDB)

**ADEIMember Model** (`server/models/ADEIMember.js`):
```javascript
{
  name: String (required),
  role: String (required, enum with 14 predefined roles),
  email: String (required),
  photo: String (default: '/images/default.jpg'),
  createdAt: Date (auto-generated)
}
```

### Backend API Endpoints

All ADEI member endpoints are in `server/index.js`:

- `GET /api/adei-members` - Fetch all members (public)
- `POST /api/adei-members` - Create new member (admin only, with photo upload)
- `PUT /api/adei-members/:id` - Update member (admin only, with photo upload)
- `DELETE /api/adei-members/:id` - Delete member (admin only, removes photo)

### Frontend Components

**Admin Panel** (`client/src/pages/AdminPanel.jsx`):
- Role dropdown with all 14 hierarchical positions
- Image upload with preview
- Form validation
- Table view with search functionality

**ADEI Page** (`client/src/pages/ADEI.jsx`):
- `renderMemberCard()` - Renders individual member cards
- `renderMembersByHierarchy()` - Organizes members into hierarchical rows
- Automatic sorting by role hierarchy
- Framer Motion animations for smooth transitions
- Responsive grid layout

---

## Responsive Design

The layout is fully responsive and adapts to different screen sizes:

- **Desktop (1200px+)**: Multiple columns per row based on hierarchy
- **Tablet (768px - 1199px)**: Adjusted columns, maintains hierarchy
- **Mobile (< 768px)**: Single column layout, maintains hierarchy order

---

## Key Features

### 1. Automatic Sorting
Members are automatically sorted by their role hierarchy, ensuring the organizational structure is always displayed correctly.

### 2. No Refresh Issues
- Members are fetched when the page loads
- Error handling prevents crashes if API fails
- Default state (empty array) prevents undefined errors
- Proper data validation ensures stability

### 3. Image Handling
- Supports image upload from admin panel
- Default image fallback if no photo is provided
- Error handling for broken image links
- Images stored in `/uploads` directory on the server
- Auto-cleanup when members are deleted

### 4. Contact Functionality
Each member card includes a "Contact" button that opens the user's default email client with the member's email pre-filled.

### 5. Smooth Animations
- Card entrance animations using Framer Motion
- Hover effects on cards and buttons
- Responsive transitions
- Staggered animations for better visual flow

---

## Database Connection

The application uses **MongoDB** (local instance):
- Connection URI: `mongodb://localhost:27017/adei_db`
- Ensure MongoDB is running before starting the application

---

## How to Use

### For Administrators:

1. **Login to Admin Panel**
   - Navigate to `/login`
   - Use admin credentials (default: username: `admin`, password: `password`)

2. **Add a New Member**
   - Go to Admin Panel
   - Click on "Membres ADEI" tab
   - Click "+ Ajouter" button
   - Fill in all fields:
     - Upload a photo
     - Enter full name
     - Select role from dropdown
     - Enter email address
   - Click "Ajouter"

3. **Edit a Member**
   - Click "Modifier" button on any member row
   - Update the fields
   - Click "Mettre à jour"

4. **Delete a Member**
   - Click "Supprimer" button on any member row
   - Confirm deletion

### For Visitors:

1. **View ADEI Members**
   - Navigate to ADEI page
   - Scroll to "Membres de l'ADEI" section
   - Members are displayed in hierarchical order
   - Click "Contact" button to send an email

---

## Files Modified

### Backend:
- `server/models/ADEIMember.js` - Updated schema with role field
- `server/index.js` - API endpoints already existed, no changes needed

### Frontend:
- `client/src/pages/AdminPanel.jsx` - Updated form to include role dropdown
- `client/src/pages/ADEI.jsx` - Complete redesign with hierarchical layout

---

## Testing Checklist

✅ Build successful (npm run build)
✅ Members can be added via Admin Panel
✅ Members can be edited via Admin Panel
✅ Members can be deleted via Admin Panel
✅ Photos upload correctly
✅ Members display in correct hierarchical order
✅ Layout is responsive
✅ Contact buttons work correctly
✅ No page refresh issues
✅ Error handling implemented

---

## Future Enhancements (Optional)

- Add social media links for each member
- Add member bio/description field
- Add filtering by role
- Add search functionality on ADEI page
- Add member count by role
- Export member list to PDF/Excel

---

## Notes

- The hierarchical structure is hardcoded in the frontend for better control over layout
- Only members with valid roles will be displayed
- The role field is validated in the MongoDB schema
- Images are stored locally in the `server/uploads` directory
- Maximum image file size: 5MB
- Supported image formats: JPEG, JPG, PNG, GIF, WEBP
