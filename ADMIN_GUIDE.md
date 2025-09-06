# Rotaract Club Website - Admin Guide

## 🔐 Admin Access

### How to Access the Admin Dashboard:
1. Navigate to `admin.html` in your browser
2. Enter the admin password: `rotaract2024admin`
3. You'll be taken to the content management dashboard

### Security Features:
- Password-protected admin interface
- Session-based authentication
- Automatic logout functionality
- Content backup system

## 📝 Content Management

### Available Sections:

#### 1. **Hero Section**
- Change background image URL
- Edit main title and subtitle
- Update description text
- Modify call-to-action button text

#### 2. **About Section**
- Edit section title
- Update main title
- Modify all description paragraphs
- Content automatically reflects on main site

#### 3. **Board Members**
- Add new board members
- Edit existing member information
- Upload member photos (or use image URLs)
- Delete members
- Supports unlimited number of board members

#### 4. **Projects**
- Add new projects
- Edit project titles and descriptions
- Add project images
- Delete projects
- All projects display in a responsive grid

#### 5. **Events**
- Add new events with dates
- Edit event details (title, time, location, description)
- Delete events
- Events automatically appear in both list and calendar views
- Calendar integration works automatically

#### 6. **Contact Information**
- Update email address
- Change phone number
- Modify address
- Update social media links

## 🎨 Features

### Dynamic Content Loading:
- All content is stored in `data/content.json`
- Main website automatically loads content from JSON
- No need to edit HTML files directly
- Real-time updates when JSON is updated

### Image Management:
- Upload images to `data/images/` directory
- Use relative paths or full URLs
- Automatic fallbacks for missing images
- Responsive image handling

### Backup System:
- Content automatically saved to browser localStorage
- Download JSON backup files
- Import/export functionality
- Version control friendly

## 🚀 How It Works

### File Structure:
```
/RCB website/
├── index.html          (Main website - public)
├── admin.html          (Admin dashboard - password protected)
├── js/
│   ├── admin.js        (Admin functionality)
│   └── content-loader.js (Dynamic content loading)
└── data/
    ├── content.json    (All website content)
    └── images/         (Uploaded images)
```

### Content Flow:
1. **Admin edits content** → Updates stored in browser + downloads new JSON
2. **JSON file updated** → Main website automatically loads new content
3. **Visitors see changes** → Dynamic content reflects immediately

## 🔧 Technical Details

### Authentication:
- Password stored in `content.json` → `siteConfig.adminPassword`
- Can be changed by editing the JSON file
- Session-based (stays logged in until browser closed)

### Content Storage:
- Primary: `data/content.json` file
- Backup: Browser localStorage
- Export: Downloadable JSON files

### Image Handling:
- Supports both local images and external URLs
- Automatic fallbacks for missing images
- Responsive image sizing

## 📱 Usage Tips

### For Content Managers:
1. Always use the **Save Changes** button after editing
2. Download backup JSON files regularly
3. Test changes by previewing the main site
4. Use descriptive filenames for images

### For Developers:
1. JSON structure is fully documented in the content file
2. Easy to extend with new content types
3. All styling preserved - only content changes
4. Can migrate to backend database later if needed

## 🛡️ Security Best Practices

1. **Change Default Password**: Update the admin password in `content.json`
2. **Regular Backups**: Download content backups frequently
3. **Secure Hosting**: Use HTTPS for production deployment
4. **Access Control**: Consider IP restrictions for admin access

## 🔄 Future Enhancements

The system is designed to be easily expandable:
- Multiple admin users with different permissions
- Image upload interface (currently uses URLs)
- Rich text editor for content
- Preview mode before publishing
- Backend database integration
- API for mobile app integration

## 📞 Support

For technical support or questions about the content management system, refer to this guide or contact the web development team.

---

**Password**: `rotaract2024admin`
**Admin URL**: `yourwebsite.com/admin.html`
**Main Site**: `yourwebsite.com/index.html`