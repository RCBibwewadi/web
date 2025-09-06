# GitHub API Integration Setup Guide

## 🚀 **"Push to Website" Button - Complete Setup**

Your admin dashboard now has a **"Push to Website"** button that commits changes directly to GitHub, making them live globally for everyone!

## 📋 **Step-by-Step Setup**

### **Step 1: Create GitHub Personal Access Token**

1. Go to [GitHub.com](https://github.com) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Configure the token:
   - **Note**: `Rotaract Admin Dashboard`
   - **Expiration**: No expiration (or 1 year for security)
   - **Scopes**: ✅ Check **`repo`** (Full control of private repositories)
4. Click **"Generate token"**
5. **⚠️ IMPORTANT**: Copy the token immediately (you won't see it again!)

### **Step 2: Configure GitHub Repository Details**

Update the following values in `/js/admin.js` (around line 14):
```javascript
GITHUB_CONFIG.owner = 'your-actual-github-username'; // Replace with your GitHub username
GITHUB_CONFIG.repo = 'your-actual-repository-name';   // Replace with your repo name
```

### **Step 3: Set Up Vercel Environment Variables**

1. Go to [vercel.com](https://vercel.com) → Your project → **Settings** → **Environment Variables**
2. Add these three variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `GITHUB_TOKEN` | `your_copied_token_here` | Production, Preview, Development |
| `GITHUB_OWNER` | `your-github-username` | Production, Preview, Development |
| `GITHUB_REPO` | `rotaract-club-website` | Production, Preview, Development |

3. Click **"Save"** for each variable

### **Step 4: Deploy and Test**

1. **Commit these changes** to your GitHub repository
2. **Vercel will auto-deploy** (takes 1-2 minutes)
3. **Test the button**:
   - Go to your admin dashboard
   - Make some test changes
   - Click **"Push to Website"**
   - Wait 1-2 minutes and check your live site

## 🎯 **How It Works**

```
Admin Dashboard → GitHub API → GitHub Repository → Vercel Auto-Deploy → Live Website
     (Changes)      (Commits)     (Updated Files)      (New Build)      (Global Updates)
```

## ✨ **Features**

- ✅ **Green "Push to Website" button** in admin header
- ✅ **Loading animation** during push process
- ✅ **Success/error notifications** with detailed feedback
- ✅ **Automatic commit messages** with timestamps
- ✅ **Fallback to localStorage** if GitHub fails
- ✅ **Global updates** visible to all users

## 🔧 **Usage Workflow**

1. **Make changes** in admin dashboard (board members, content, etc.)
2. **Save changes** normally (stores locally)
3. **Click "Push to Website"** when ready to go live
4. **Wait for confirmation** (green notification)
5. **Changes are live** globally in 1-2 minutes!

## 🛠️ **Troubleshooting**

### **"GitHub token not configured" Error**
- Check Vercel environment variables are set correctly
- Verify the token has `repo` scope
- Ensure the token hasn't expired

### **"Failed to get file info" Error**
- Verify GitHub username and repository name are correct
- Check the repository exists and is accessible
- Ensure `data/content.json` file exists in the repo

### **"Failed to commit changes" Error**
- Token might not have sufficient permissions
- Repository might be private (token needs private repo access)
- Network connection issues

### **Button doesn't work**
- Check browser console for JavaScript errors
- Verify admin.js is loading correctly
- Clear browser cache and try again

## 📞 **Support**

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify all environment variables are set in Vercel
3. Test with a fresh browser session
4. Check GitHub repository permissions

## 🎉 **Success!**

Once set up, your admin changes will be instantly available to everyone worldwide! No more local-only updates.

**Your live website**: https://rcbibwewadipune.vercel.app/
**Admin dashboard**: https://rcbibwewadipune.vercel.app/admin.html