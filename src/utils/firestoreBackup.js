/**
 * Firestore Backup & Restore Utility
 * Handles exporting and importing data from Firestore collections
 */

import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  getDoc,
  addDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Download (Export) collection data from Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} format - Export format: 'json' or 'csv'
 * @returns {Promise<void>}
 */
export async function downloadCollectionData(collectionName, format = 'json') {
  try {
    console.log(`🔄 Exporting collection: ${collectionName}`);
    
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (data.length === 0) {
      alert(`⚠️ Collection "${collectionName}" is empty. Nothing to export.`);
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    let blob;
    let filename;
    let mimeType;

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      // Get all unique keys from all documents
      const allKeys = new Set();
      data.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      const headers = Array.from(allKeys);

      // Create CSV rows
      const csvRows = [
        headers.join(','), // Header row
        ...data.map(item => 
          headers.map(header => {
            const value = item[header];
            // Handle arrays and objects
            if (Array.isArray(value)) {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            if (typeof value === 'object' && value !== null) {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            // Escape quotes and wrap in quotes if contains comma or newline
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `${collectionName}_backup_${timestamp}.csv`;
      mimeType = 'text/csv';
    } else {
      // JSON format
      const jsonContent = JSON.stringify(data, null, 2);
      blob = new Blob([jsonContent], { type: 'application/json' });
      filename = `${collectionName}_backup_${timestamp}.json`;
      mimeType = 'application/json';
    }

    // Download file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`✅ Exported ${data.length} documents from "${collectionName}"`);
    alert(`✅ Successfully exported ${data.length} documents from "${collectionName}"`);
  } catch (error) {
    console.error(`❌ Error exporting collection "${collectionName}":`, error);
    alert(`❌ Error exporting "${collectionName}": ${error.message}`);
    throw error;
  }
}

/**
 * Upload (Import) collection data to Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {File} file - JSON file to import
 * @param {Object} options - Import options
 * @param {boolean} options.merge - If true, merge with existing documents (default: false)
 * @param {boolean} options.deleteExisting - If true, delete existing documents before import (default: false)
 * @returns {Promise<{imported: number, errors: number, skipped: number}>}
 */
export async function uploadCollectionData(collectionName, file, options = {}) {
  const { merge = false, deleteExisting = false } = options;
  
  try {
    console.log(`🔄 Importing data to collection: ${collectionName}`);
    
    // Read file
    const fileText = await file.text();
    let data;
    
    try {
      data = JSON.parse(fileText);
    } catch (parseError) {
      throw new Error('Invalid JSON file. Please check the file format.');
    }

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of documents.');
    }

    if (data.length === 0) {
      alert('⚠️ File is empty. Nothing to import.');
      return { imported: 0, errors: 0, skipped: 0 };
    }

    // Confirm import
    const confirmMessage = deleteExisting 
      ? `This will DELETE all existing documents in "${collectionName}" and import ${data.length} new documents. Continue?`
      : `This will import ${data.length} documents to "${collectionName}". Continue?`;
    
    if (!window.confirm(confirmMessage)) {
      return { imported: 0, errors: 0, skipped: 0 };
    }

    // Delete existing documents if requested
    if (deleteExisting) {
      console.log(`🗑️ Deleting existing documents in "${collectionName}"...`);
      const existingSnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = existingSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`✅ Deleted ${existingSnapshot.docs.length} existing documents`);
    }

    // Import documents
    let imported = 0;
    let errors = 0;
    let skipped = 0;

    for (const item of data) {
      try {
        const { id, ...itemData } = item;
        
        // Skip if id is missing and deleteExisting is false (would create duplicates)
        if (!id && !deleteExisting) {
          console.warn('⚠️ Skipping document without ID:', item);
          skipped++;
          continue;
        }

        if (id) {
          // Use existing document ID
          const docRef = doc(db, collectionName, id.toString());
          if (merge) {
            await setDoc(docRef, itemData, { merge: true });
          } else {
            await setDoc(docRef, itemData);
          }
        } else {
          // Create new document without ID (Firestore will generate ID)
          await addDoc(collection(db, collectionName), itemData);
        }

        imported++;
      } catch (itemError) {
        console.error(`❌ Error importing document:`, item, itemError);
        errors++;
      }
    }

    console.log(`✅ Import complete: ${imported} imported, ${errors} errors, ${skipped} skipped`);
    alert(`✅ Import Complete!\n\nImported: ${imported}\nErrors: ${errors}\nSkipped: ${skipped}`);
    
    return { imported, errors, skipped };
  } catch (error) {
    console.error(`❌ Error importing to collection "${collectionName}":`, error);
    alert(`❌ Error importing: ${error.message}`);
    throw error;
  }
}

/**
 * Export all collections at once
 * @returns {Promise<void>}
 */
export async function downloadAllCollections() {
  try {
    const collections = [
      'fishes',
      'reviews',
      'daily',
      'rateHistory',
      'shopSetting',
      'promotionAndDiscounts'
    ];

    const allData = {};

    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        allData[collectionName] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`✅ Loaded ${allData[collectionName].length} documents from "${collectionName}"`);
      } catch (error) {
        console.warn(`⚠️ Could not load "${collectionName}":`, error);
        allData[collectionName] = [];
      }
    }

    // Also load single documents
    try {
      const shopSettingDoc = await getDoc(doc(db, 'shopSetting', 'main'));
      if (shopSettingDoc.exists()) {
        allData.shopSetting_main = shopSettingDoc.data();
      }
    } catch (error) {
      console.warn('⚠️ Could not load shopSetting/main:', error);
    }

    try {
      const promotionBannerDoc = await getDoc(doc(db, 'promotionAndDiscounts', 'banner'));
      if (promotionBannerDoc.exists()) {
        allData.promotionAndDiscounts_banner = promotionBannerDoc.data();
      }
    } catch (error) {
      console.warn('⚠️ Could not load promotionAndDiscounts/banner:', error);
    }

    try {
      const discountDoc = await getDoc(doc(db, 'promotionAndDiscounts', 'discount'));
      if (discountDoc.exists()) {
        allData.promotionAndDiscounts_discount = discountDoc.data();
      }
    } catch (error) {
      console.warn('⚠️ Could not load promotionAndDiscounts/discount:', error);
    }

    // Download as JSON
    const timestamp = new Date().toISOString().split('T')[0];
    const jsonContent = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_collections_backup_${timestamp}.json`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const totalDocs = Object.values(allData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 1), 0);
    console.log(`✅ Exported all collections (${totalDocs} total documents)`);
    alert(`✅ Successfully exported all collections!\n\nTotal documents: ${totalDocs}`);
  } catch (error) {
    console.error('❌ Error exporting all collections:', error);
    alert(`❌ Error exporting all collections: ${error.message}`);
    throw error;
  }
}

/**
 * Import all collections from a backup file
 * @param {File} file - JSON file containing all collections
 * @param {Object} options - Import options
 * @returns {Promise<{imported: number, errors: number}>}
 */
export async function uploadAllCollections(file, options = {}) {
  const { merge = false, deleteExisting = false } = options;
  
  try {
    const fileText = await file.text();
    const allData = JSON.parse(fileText);

    if (!window.confirm(`This will import data to multiple collections. Continue?`)) {
      return { imported: 0, errors: 0 };
    }

    let totalImported = 0;
    let totalErrors = 0;

    // Import collections
    const collections = ['fishes', 'reviews', 'daily', 'rateHistory'];
    for (const collectionName of collections) {
      if (Array.isArray(allData[collectionName]) && allData[collectionName].length > 0) {
        try {
          // Create a temporary file-like object for uploadCollectionData
          const jsonBlob = new Blob([JSON.stringify(allData[collectionName])], { type: 'application/json' });
          const tempFile = new File([jsonBlob], `${collectionName}.json`, { type: 'application/json' });
          
          const result = await uploadCollectionData(collectionName, tempFile, { merge, deleteExisting });
          totalImported += result.imported;
          totalErrors += result.errors;
        } catch (error) {
          console.error(`Error importing ${collectionName}:`, error);
          totalErrors++;
        }
      }
    }

    // Import single documents
    if (allData.shopSetting_main) {
      try {
        await setDoc(doc(db, 'shopSetting', 'main'), allData.shopSetting_main, { merge });
        totalImported++;
      } catch (error) {
        console.error('Error importing shopSetting/main:', error);
        totalErrors++;
      }
    }

    if (allData.promotionAndDiscounts_banner) {
      try {
        await setDoc(doc(db, 'promotionAndDiscounts', 'banner'), allData.promotionAndDiscounts_banner, { merge });
        totalImported++;
      } catch (error) {
        console.error('Error importing promotionAndDiscounts/banner:', error);
        totalErrors++;
      }
    }

    if (allData.promotionAndDiscounts_discount) {
      try {
        await setDoc(doc(db, 'promotionAndDiscounts', 'discount'), allData.promotionAndDiscounts_discount, { merge });
        totalImported++;
      } catch (error) {
        console.error('Error importing promotionAndDiscounts/discount:', error);
        totalErrors++;
      }
    }

    alert(`✅ Import Complete!\n\nTotal imported: ${totalImported}\nErrors: ${totalErrors}`);
    return { imported: totalImported, errors: totalErrors };
  } catch (error) {
    console.error('❌ Error importing all collections:', error);
    alert(`❌ Error importing: ${error.message}`);
    throw error;
  }
}

