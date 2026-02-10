'use strict';

/**
 * This hook allows you to programmatically transform package.json files
 * during installation. This is useful for handling package extensions
 * and fixing problematic packages.
 */
module.exports = {
  hooks: {
    readPackage(packageJson, context) {
      // Fix keytar peer dependencies for electron-rebuild
      if (packageJson.name === 'keytar') {
        packageJson.dependencies = packageJson.dependencies || {};
        // Ensure keytar has the dependencies needed for rebuilding
      }

      // Handle deprecated packages that may cause warnings
      if (packageJson.dependencies) {
        // Example: Replace deprecated packages if needed
      }

      return packageJson;
    }
  }
};
