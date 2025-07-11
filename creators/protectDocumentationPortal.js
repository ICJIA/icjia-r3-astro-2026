/**
 * Documentation Portal Protection Script
 * Ensures the standalone documentation portal is not overwritten by other processes
 */

const fs = require("fs");
const path = require("path");

const PORTAL_PATH = path.join(process.cwd(), "public", "documentation", "index.html");
const BACKUP_PATH = path.join(process.cwd(), "public", "documentation", "portal.html");

/**
 * Restore the documentation portal from backup if it has been overwritten
 */
function protectDocumentationPortal() {
  try {
    console.log("🛡️  Protecting documentation portal...");

    // Check if the portal exists and is our standalone version
    if (fs.existsSync(PORTAL_PATH)) {
      const currentContent = fs.readFileSync(PORTAL_PATH, "utf8");
      
      // Check if it's our portal (contains "Documentation Portal" title)
      if (currentContent.includes("Documentation Portal") && 
          currentContent.includes("theme-toggle") &&
          currentContent.includes("cards-grid")) {
        console.log("✅ Documentation portal is intact");
        return;
      }
    }

    // Portal has been overwritten or doesn't exist, restore from backup
    if (fs.existsSync(BACKUP_PATH)) {
      console.log("🔄 Restoring documentation portal from backup...");
      fs.copyFileSync(BACKUP_PATH, PORTAL_PATH);
      console.log("✅ Documentation portal restored successfully");
    } else {
      console.log("❌ Backup portal not found at:", BACKUP_PATH);
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Error protecting documentation portal:", error.message);
    process.exit(1);
  }
}

// Run the protection script
protectDocumentationPortal();
