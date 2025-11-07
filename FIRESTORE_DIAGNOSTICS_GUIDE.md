# Firestore Diagnostics Guide

## 🔍 Overview

This guide explains how to diagnose and fix Firestore connection issues in your application.

## 🚀 Quick Start

### Automatic Diagnostics
The app automatically runs diagnostics when loading data from Firestore. Check your browser console for detailed diagnostic information.

### Manual Diagnostics
1. Go to **Admin Panel** → **🔍 Diagnostics** tab
2. Click **"Run Diagnostics"** button
3. Review the test results and follow the recommendations

## 📊 Diagnostic Tests

The diagnostic tool performs the following tests:

1. **Database Initialization** - Checks if Firestore `db` object is properly initialized
2. **Firebase App Initialization** - Verifies Firebase app configuration
3. **Connection Test** - Tests basic Firestore connectivity
4. **Fishes Collection Access** - Verifies read access to the fishes collection
5. **Network Connectivity** - Checks internet connection

## 🔧 Common Issues & Solutions

### ❌ Permission Denied (Error Code: `permission-denied`)

**Problem:** Firestore security rules are blocking read access.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ajayseafoods-b6e6b`
3. Navigate to **Firestore Database** → **Rules**
4. Update rules to:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if true; // For development only
       }
     }
   }
   ```
5. Click **"Publish"** to save

**Note:** For production, add proper authentication instead of `if true`.

### ⚠️ Database Not Initialized (Error Code: `failed-precondition`)

**Problem:** Firestore database hasn't been created yet.

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ajayseafoods-b6e6b`
3. Navigate to **Firestore Database**
4. Click **"Create database"**
5. Choose location (closest to your users, e.g., `asia-south1` for India)
6. Select **"Start in test mode"** for development
7. Click **"Enable"**

### 🌐 Connection Unavailable (Error Code: `unavailable` or `deadline-exceeded`)

**Problem:** Network connectivity issues or Firebase service unavailable.

**Solutions:**
- Check your internet connection
- Verify Firebase project is active
- Check if Firestore database is created
- Try refreshing the page
- Check Firebase status page: https://status.firebase.google.com/

### ❌ Invalid Configuration (Error Code: `invalid-argument`)

**Problem:** Firebase configuration has incorrect values.

**Solution:**
1. Check `src/firebaseConfig.js`:
   - Verify `projectId` matches your Firebase project
   - Check `apiKey` is correct
   - Ensure `authDomain` format is correct
   - Verify all fields are properly formatted (no extra spaces, quotes, etc.)

2. Current configuration should be:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDZMLYNgESnfNQk8fzBj2vfvEtD8irJfr0",
     authDomain: "ajayseafoods-b6e6b.firebaseapp.com",
     projectId: "ajayseafoods-b6e6b",
     storageBucket: "ajayseafoods-b6e6b.appspot.com",
     messagingSenderId: "600898251069",
     appId: "1:600898251069:web:153633d7e1143059c8fd54"
   };
   ```

### 📦 Empty Collection

**Problem:** Fishes collection exists but is empty.

**Solution:**
- This is normal on first run
- The app will automatically migrate data from `src/data/fishData.json`
- After migration, data will be stored in Firestore
- You can also manually import data using **Admin Panel** → **Backup & Restore** → **Bulk Import**

## 🔍 Using the Diagnostics Component

### Access Diagnostics
1. Log in to Admin Panel (password: `admin123`)
2. Click on **🔍 Diagnostics** tab
3. Click **"Run Diagnostics"** button

### Understanding Results

**Status Icons:**
- ✅ **PASS** - Test passed successfully
- ❌ **FAIL** - Test failed (check recommendations)
- ⚠️ **ERROR** - Test encountered an error

**Overall Status:**
- **PASS** - All tests passed, Firestore is working correctly
- **FAIL** - Some tests failed, follow recommendations
- **ERROR** - Critical errors detected, check configuration

### Recommendations
The diagnostic tool provides specific recommendations based on test results. Follow them step-by-step to resolve issues.

## 📝 Console Logging

The app logs detailed information to the browser console:

### Enable Console Logging
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Look for logs starting with:
   - 🔄 - Loading/Processing
   - ✅ - Success
   - ❌ - Error
   - ⚠️ - Warning
   - 📊 - Data information
   - 🔍 - Diagnostic information

### Example Console Output
```
🔄 ========== STARTING FIRESTORE DATA LOAD ==========
🔍 ========== FIRESTORE DIAGNOSTICS START ==========
✅ Test 1: db object exists
✅ Test 2: Firebase app initialized
✅ Test 3: Firestore connection successful
✅ Test 4: Fishes collection accessible (15 documents)
✅ Test 5: Network connectivity OK
📊 ========== DIAGNOSTICS SUMMARY ==========
Overall Status: PASS
```

## 🛠️ Manual Testing

You can also test Firestore connection manually using browser console:

```javascript
// Import diagnostics function
const { runFirestoreDiagnostics } = await import('./src/services/firestoreService');

// Run diagnostics
const results = await runFirestoreDiagnostics();
console.log('Diagnostic Results:', results);
```

## 📞 Getting Help

If diagnostics don't resolve the issue:

1. **Check Browser Console** - Look for detailed error messages
2. **Check Firebase Console** - Verify project status and database
3. **Check Network Tab** - Look for failed Firestore API requests
4. **Review Diagnostic Results** - Follow all recommendations
5. **Check Firebase Status** - https://status.firebase.google.com/

## 🔄 Data Loading Flow

1. App tries to load from Firestore
2. If Firestore is empty → Auto-migrates from JSON
3. If Firestore fails → Falls back to JSON
4. Diagnostics run automatically on errors
5. Detailed error messages logged to console

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Diagnostics show "PASS" for all tests
- [ ] Fishes collection is accessible
- [ ] Data loads in the app
- [ ] No console errors related to Firestore
- [ ] Admin panel can add/edit/delete fish
- [ ] Changes persist in Firestore

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

---

**Last Updated:** 2024
**Project:** Ajay Sea Foods - Fish Website

