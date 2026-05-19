const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove firebase/firestore imports
    if (content.includes('firebase/firestore')) {
      content = content.replace(/import\s+{.*}\s+from\s+["']firebase\/firestore["'];?/g, '');
      changed = true;
    }

    // 2. Remove firebase config imports and db
    if (content.includes('db')) {
      content = content.replace(/import\s+{\s*db.*}\s+from\s+["']@\/lib\/supabase\/client["'];?/g, '');
      content = content.replace(/import\s+{\s*db\s*}\s+from\s+["']@\/lib\/firebase\/config["'];?/g, '');
      changed = true;
    }

    // 3. Replace Timestamp.now()
    if (content.includes('Timestamp.now()')) {
      content = content.replace(/Timestamp\.now\(\)/g, 'new Date().toISOString()');
      changed = true;
    }

    // 4. Replace Timestamp.fromDate
    if (content.includes('Timestamp.fromDate')) {
      content = content.replace(/Timestamp\.fromDate\((.*?)\)/g, '$1.toISOString()');
      changed = true;
    }

    // 5. Replace doc, updateDoc, db usage
    if (content.includes('updateDoc(doc(db')) {
      // await updateDoc(doc(db, COLLECTIONS.tests, id),
      content = content.replace(/updateDoc\(doc\(db,\s*([^,]+),\s*([^)]+)\),\s*({[\s\S]*?})\)/g, 'updateDocument($1, $2, $3)');
      content = content.replace(/await updateDoc\(doc\(db,\s*([^,]+),\s*([^)]+)\),\s*([^)]+)\)/g, 'await updateDocument($1, $2, $3)');
      changed = true;
    }

    // 6. Fix missing imports if they use updateDocument but didn't import it
    if (content.includes('updateDocument(') && !content.includes('updateDocument')) { // Check actual imports properly? Let's just blindly add it if missing.
      // We will do a generic approach: if `updateDocument` is used, ensure it's in the import.
    }
    
    // We can also fix deleteDoc
    if (content.includes('deleteDoc(doc(db')) {
      content = content.replace(/await deleteDoc\(doc\(db,\s*([^,]+),\s*([^)]+)\)\)/g, 'await deleteDocument($1, $2)');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Migrated:', filePath);
    }
  }
});
