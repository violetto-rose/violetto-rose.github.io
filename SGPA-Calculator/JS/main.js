/**
 * Main Application Module
 * Coordinates all modules and initializes the application
 */

import { ThemeManager } from './modules/themeManager.js';
import { UIManager } from './modules/uiManager.js';
import { NavigationManager } from './modules/navigationManager.js';

/**
 * Application Class
 * Main application controller that initializes all modules
 */
class Application {
  constructor() {
    this.themeManager = null;
    this.uiManager = null;
    this.navigationManager = null;
  }

  /**
   * Initialize the application
   */
  initialize() {
    try {
      // Initialize theme management
      this.themeManager = new ThemeManager();

      // Initialize UI management
      this.uiManager = new UIManager();

      // Initialize navigation management
      this.navigationManager = new NavigationManager();

      // Make UIManager methods globally accessible for HTML onclick handlers
      window.UIManager = UIManager;
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }
}

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.initialize();
});
