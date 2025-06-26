/**
 * Landing Page Module
 * Handles upload functionality and coordination of existing modules for the SGPA Calculator landing page
 */

import { ThemeManager } from './modules/themeManager.js';
import { NavigationManager } from './modules/navigationManager.js';
import { NotificationManager } from './modules/notificationManager.js';

class LandingPageManager {
  constructor() {
    this.uploadArea = null;
    this.fileInput = null;
    this.uploadCard = null;

    this.initialize();
  }

  /**
   * Initialize the landing page functionality
   */
  initialize() {
    // Initialize existing modules
    new ThemeManager();
    new NavigationManager();

    // Setup landing page specific functionality
    this.setupUploadArea();
  }

  /**
   * Setup upload area functionality
   */
  setupUploadArea() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.uploadCard = document.getElementById('uploadCard');

    if (this.uploadArea && this.fileInput) {
      // Click to upload
      this.uploadArea.addEventListener('click', () => {
        this.fileInput.click();
      });

      // File input change
      this.fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e.target.files[0]);
      });

      // Drag and drop functionality
      this.setupDragAndDrop();
    }
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    if (!this.uploadArea) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadCard.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      this.uploadArea.addEventListener(eventName, () => {
        this.uploadCard.classList.remove('drag-over');
      });
    });

    // Handle dropped files
    this.uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });
  }

  /**
   * Handle file selection
   * @param {File} file - The selected file
   */
  handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      NotificationManager.showError('Please select a PDF file only.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      NotificationManager.showError('File size should be less than 10MB.');
      return;
    }

    NotificationManager.showInfo(
      'PDF upload feature is coming soon! For now, please use the manual calculator.'
    );

    // In the future, this would process the PDF
    console.log(
      'File selected:',
      file.name,
      'Size:',
      file.size,
      'Type:',
      file.type
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LandingPageManager();
});

// Export for potential use in other modules
export default LandingPageManager;
