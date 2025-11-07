# Firestore New Collections Implementation

## Summary

This document describes the implementation of new Firestore collections with dynamic form-to-Firestore CRUD operations as specified in the task requirements.

## ✅ Completed Tasks

### 1. New Firestore Collections Created

- ✅ **`daily`** - Already exists, verified fields intact
- ✅ **`rateHistory`** - NEW collection for storing historical price/rate changes
- ✅ **`shopSetting`** - NEW collection for shop owner info including owner photo (document: `shopSetting/main`)
- ✅ **`promotionAndDiscounts`** - NEW collection for promotions and discounts (documents: `promotionAndDiscounts/banner` and `promotionAndDiscounts/discount`)

### 2. Dynamic Form-to-Firestore Mapping

All forms now use dynamic form data mapping - no hardcoded field names:

- ✅ **Discount Settings Form** - Maps form data dynamically to `promotionAndDiscounts/discount`
- ✅ **Promotion Banner Form** - Maps form data dynamically to `promotionAndDiscounts/banner`
- ✅ **Shop Settings Form** - Maps form data dynamically to `shopSetting/main`
- ✅ **Daily Stock Form** - Already uses dynamic mapping (no changes needed)
- ✅ **Rate History** - Created automatically when fish rate changes

### 3. Cloudinary Owner Photo Upload

- ✅ Created reusable Cloudinary upload utility (`src/utils/cloudinaryUpload.js`)
- ✅ Shop Settings form now uploads owner photo to Cloudinary
- ✅ Stores `secure_url` in Firestore under `ownerPhoto` field (preserves form field name)
- ✅ Uses existing Cloudinary configuration (cloud_name: 'dkfvnzidu', upload_preset: 'fish_upload')

### 4. WhatsApp Number Centralization

- ✅ Added WhatsApp number field to Shop Settings form
- ✅ WhatsApp number stored in `shopSetting/main` document
- ✅ Loaded from Firestore and available via `fishData.shopInfo.whatsapp`
- ✅ Existing code already uses `fishData.shopInfo.whatsapp` so no changes needed

### 5. Rate History Implementation

- ✅ Automatic rate history entry creation when fish rate changes
- ✅ Stores: `fishId`, `fishName`, `oldRate`, `newRate`, `timestamp`, `updatedBy`
- ✅ Saved to `rateHistory` collection
- ✅ Backward compatible with existing `rateHistory` array in fish documents

### 6. Backward Compatibility

- ✅ All new collections fall back to `config/app` if new collections don't exist
- ✅ Existing code reading from `config/app` continues to work
- ✅ No breaking changes to existing Fish management or Reviews collections

### 7. Data Loading

- ✅ `loadFishDataFromFirestore` updated to load from new collections
- ✅ Prioritizes new collections over `config/app`
- ✅ Maintains fallback chain: new collection → config/app → JSON fallback

## 📋 Firestore Collection Structure

### `rateHistory` Collection
```javascript
{
  fishId: number,
  fishName: string,
  oldRate: number,
  newRate: number,
  timestamp: string (ISO),
  updatedBy: string,
  createdAt: string (ISO)
}
```

### `shopSetting/main` Document
```javascript
{
  name: string,
  owner: string,
  ownerPhoto: string (Cloudinary URL),
  phone: string,
  whatsapp: string,
  email: string,
  address: string,
  workingHours: string,
  upiId: string,
  shopLogo: string,
  updatedAt: string (ISO)
  // ... any other fields from the form
}
```

### `promotionAndDiscounts/banner` Document
```javascript
{
  text: string,
  isActive: boolean,
  expiresOn: string (ISO),
  discountPercentage: number,
  discountedFish: string[],
  updatedAt: string (ISO)
  // ... any other fields from the form
}
```

### `promotionAndDiscounts/discount` Document
```javascript
{
  isEnabled: boolean,
  percentage: number,
  minimumAmount: number,
  description: string,
  updatedAt: string (ISO)
  // ... any other fields from the form
}
```

### `daily` Collection
```javascript
{
  fishId: number,
  fishName: string,
  date: string,
  yesterdayNet: number,
  todayQuantity: number,
  total: number,
  todaySale: number,
  returnToMarket: number,
  adjustQuantity: number,
  netAmount: number,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

## 🔧 Key Implementation Details

### Dynamic Form Mapping

All forms use `Object.fromEntries(new FormData(e.target))` to build payloads dynamically:

```javascript
const formData = new FormData(e.target);
const payload = Object.fromEntries(formData.entries());
// Remove undefined/null, convert types, then save
await saveShopSetting(payload);
```

### Cloudinary Upload

Owner photo upload uses the reusable utility:

```javascript
import { uploadOwnerPhoto } from '../utils/cloudinaryUpload';

// Upload file
const imageUrl = await uploadOwnerPhoto(file);
// Store URL in form payload
payload.ownerPhoto = imageUrl;
```

### Rate History Creation

Automatic creation when fish rate changes:

```javascript
if (originalFish.rate !== updatedFish.rate) {
  const rateHistoryPayload = {
    fishId: updatedFish.id,
    fishName: updatedFish.name,
    oldRate: originalFish.rate,
    newRate: updatedFish.rate,
    timestamp: new Date().toISOString(),
    updatedBy: 'admin'
  };
  await addRateHistoryEntry(rateHistoryPayload);
}
```

## 📝 Files Modified

1. **`src/services/firestoreService.js`**
   - Added new collection constants
   - Added `onSnapshot` import
   - Added functions: `addRateHistoryEntry`, `loadRateHistoryFromFirestore`
   - Added functions: `saveShopSetting`, `loadShopSettingFromFirestore`, `subscribeToShopSetting`
   - Added functions: `savePromotionBanner`, `saveDiscountSettings`, `loadPromotionBannerFromFirestore`, `loadDiscountSettingsFromFirestore`, `subscribeToPromotionBanner`, `subscribeToDiscountSettings`
   - Updated `loadFishDataFromFirestore` to load from new collections

2. **`src/components/AdminPanel.jsx`**
   - Added imports for new Firestore functions and Cloudinary upload
   - Updated Discount Settings form to use dynamic mapping
   - Updated Promotion Banner form to use dynamic mapping
   - Updated Shop Settings form with Cloudinary upload and dynamic mapping
   - Updated `handleEditFish` to create rate history entries
   - Added WhatsApp number field to Shop Settings form

3. **`src/utils/cloudinaryUpload.js`** (NEW)
   - Reusable Cloudinary upload utility
   - Handles file validation and upload
   - Returns `secure_url` from Cloudinary response

## 🔐 Security Notes

- All Firestore operations use `setDoc(..., { merge: true })` to prevent accidental data loss
- Form data is validated before saving
- Cloudinary uploads are limited to 5MB file size
- Undefined/null fields are filtered out before saving

## 🚀 Next Steps (Optional Enhancements)

1. **Realtime Form Prefilling** - Add `onSnapshot` listeners to forms for realtime updates
2. **Migration Script** - Optionally migrate data from `config/app` to new collections
3. **Rate History UI** - Create admin UI to view rate history entries
4. **Validation** - Add server-side validation rules in Firestore security rules

## ✅ Testing Checklist

- [ ] Discount Settings form saves correctly to `promotionAndDiscounts/discount`
- [ ] Promotion Banner form saves correctly to `promotionAndDiscounts/banner`
- [ ] Shop Settings form saves correctly to `shopSetting/main`
- [ ] Owner photo uploads to Cloudinary and URL is stored
- [ ] Rate history entries are created when fish rate changes
- [ ] Data loads from new collections with fallback to config/app
- [ ] WhatsApp number is accessible from `fishData.shopInfo.whatsapp`
- [ ] No impact on existing Fish management or Reviews
- [ ] All forms preserve field names exactly as produced by the form

## 📌 Important Notes

- **DO NOT modify** existing Fish management or Reviews collections/code
- **Field names** are preserved exactly as the form outputs them
- **Backward compatibility** is maintained with `config/app`
- **No hardcoded field names** - all mapping is dynamic
- **Cloudinary configuration** uses existing project settings

