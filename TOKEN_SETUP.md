# GitHub Token Configuration - Quick Setup

## 🔐 **Adding Your GitHub Token**

### **Step 1: Find Your GitHub Token**
You should have created a GitHub Personal Access Token earlier. If you don't have it:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` scope
3. Copy the token (starts with `ghp_` or similar)

### **Step 2: Add Token to Code**

Open `/js/admin.js` and find this line (around line 12):
```javascript
GITHUB_CONFIG.token = 'YOUR_GITHUB_TOKEN_HERE'; // Replace with your actual token
```

Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token:
```javascript
GITHUB_CONFIG.token = 'ghp_your_actual_token_here'; // Your real GitHub token
```

### **Step 3: Security Note**
⚠️ **IMPORTANT**: This puts your token in client-side code, which is not ideal for production. For now, this is a quick solution to test the integration. 

For production, consider:
- Using a backend API endpoint
- Implementing server-side functions
- Using GitHub Apps instead of personal tokens

### **Step 4: Commit and Deploy**
1. Save the file with your token
2. Commit via GitHub Desktop
3. Push to GitHub
4. Vercel will auto-deploy
5. Test the "Push to Website" button

### **Repository Details (Already Configured)**
- Owner: `RCBibwewadi`
- Repository: `web`
- File: `data/content.json`

### **Testing**
After adding your token:
1. Go to your admin dashboard
2. Make a test change
3. Click "Push to Website"
4. Should see success message instead of error

## 🚨 **Security Reminder**
Remember to:
- Keep your token private
- Consider using environment variables for production
- Regenerate token if compromised
- Set token expiration for security