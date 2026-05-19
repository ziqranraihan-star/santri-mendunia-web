const fs = require('fs');
const path = require('path');
function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath);
    else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      let c = fs.readFileSync(dirPath, 'utf8');
      let init = c;
      c = c.replace(/([a-zA-Z0-9_.]+)\?\.toDate\(\)/g, '($1 ? new Date($1) : null)');
      c = c.replace(/([a-zA-Z0-9_.]+)\.toDate\(\)/g, 'new Date($1)');
      c = c.replace(/([a-zA-Z0-9_.]+)\?\.toLocaleDateString\(([^)]*)\)/g, '($1 ? new Date($1).toLocaleDateString($2) : "")');
      c = c.replace(/([a-zA-Z0-9_.]+)\.toLocaleDateString\(([^)]*)\)/g, '(new Date($1).toLocaleDateString($2))');
      c = c.replace(/updateDocument\(COLLECTIONS\.banners,\s*\{\s*isActive:\s*!current\s*\}\)/g, 'updateDocument(COLLECTIONS.banners, id, { isActive: !current })');
      c = c.replace(/new Date\(i\.created_at\)/g, '(i.created_at ? new Date(i.created_at) : new Date())');
      
      // Fix type instantiation error by simplifying client.ts
      if (dirPath.endsWith('client.ts')) {
        c = c.replace(/Promise<\(T & \{ id: string \}\)\[\]>/g, 'Promise<any[]>');
        c = c.replace(/Promise<\(T & \{ id: string \}\) \| null>/g, 'Promise<any | null>');
        c = c.replace(/return data as \(T & \{ id: string \}\)\[\];/g, 'return data as any[];');
        c = c.replace(/return data as T & \{ id: string \};/g, 'return data as any;');
      }

      if (init !== c) {
        fs.writeFileSync(dirPath, c);
        console.log('Fixed', dirPath);
      }
    }
  });
}
walkDir('src');
