# SGPA Calculator - Modular JavaScript Architecture

This document describes the modular architecture of the SGPA Calculator JavaScript application.

## 🏗️ Architecture Overview

The application has been refactored from a monolithic `script.js` file into a modular architecture for better maintainability, readability, and code organization.

## 📁 Module Structure

```
JS/
├── main.js                    # Manual calculator entry point
├── landing.js                 # Landing page functionality
├── modules/
│   ├── themeManager.js        # Dark mode and theme management
│   ├── uiManager.js           # UI interactions and subject display
│   ├── dataManager.js         # Data fetching and processing
│   ├── gpaCalculator.js       # GPA calculation logic
│   ├── gradeUtils.js          # Grade conversion utilities
│   ├── popupManager.js        # Warning and error popups
│   ├── notificationManager.js # Toast notifications
│   └── navigationManager.js   # Sidebar and footer behavior
└── README.md                  # This file
```

## 🌟 Application Structure

### Landing Page (`index.html`)

- **Smart Upload Interface**: Drag & drop PDF upload area (NLP-powered PDF reading coming soon)
- **Dynamic Hero Section**: Animated gradient background with floating elements
- **Method Selection**: Choose between smart upload or manual entry
- **Feature Showcase**: Highlights calculator capabilities and benefits
- **Modern UI**: Glass morphism design with smooth animations

### Manual Calculator (`calculator.html`)

- **Traditional Input**: Manual subject entry with branch/semester selection
- **Full Functionality**: Complete SGPA/CGPA calculation with all original features
- **Consistent Design**: Matches the new design language
- **Easy Navigation**: Quick access back to landing page

## 📋 Module Descriptions

### `main.js`

- **Purpose**: Manual calculator entry point and orchestrator
- **Responsibilities**:
  - Initialize all modules for the manual calculator
  - Coordinate module interactions
  - Set up global accessibility for HTML event handlers
  - Handle application-level errors

### `landing.js`

- **Purpose**: Landing page functionality and interactions
- **Responsibilities**:
  - Handle PDF upload area with drag & drop
  - Manage theme switching on landing page
  - Handle sidebar navigation
  - File validation and user notifications
  - Smooth animations and transitions

### `modules/themeManager.js`

- **Purpose**: Theme and dark mode management
- **Responsibilities**:
  - Initialize dark mode based on user preference or system setting
  - Handle dark mode toggle functionality
  - Persist theme preferences in localStorage

### `modules/uiManager.js`

- **Purpose**: User interface management and interactions
- **Responsibilities**:
  - Initialize UI elements
  - Handle form interactions and input changes
  - Display subjects in tables
  - Generate dynamic HTML for subject display
  - Handle input type changes (marks vs. grades)

### `modules/dataManager.js`

- **Purpose**: Data fetching and processing
- **Responsibilities**:
  - Fetch subject data from JSON files
  - Handle SGPA and CGPA data requirements
  - Process and filter subject data
  - Error handling for data operations

### `modules/gpaCalculator.js`

- **Purpose**: Core GPA calculation logic
- **Responsibilities**:
  - Calculate SGPA and CGPA from form inputs
  - Validate user inputs
  - Display calculation results
  - Handle calculation errors and warnings

### `modules/gradeUtils.js`

- **Purpose**: Grade conversion utilities and mappings
- **Responsibilities**:
  - Define grade-to-point mappings
  - Convert marks to grade points
  - Convert grade points to approximate marks
  - Provide grade conversion functions

### `modules/popupManager.js`

- **Purpose**: User feedback and error handling
- **Responsibilities**:
  - Display warning and error popups
  - Handle data not found scenarios
  - Manage popup interactions and dismissal
  - Provide user feedback for validation errors

### `modules/notificationManager.js`

- **Purpose**: Simple toast notifications
- **Responsibilities**:
  - Display toast notifications for user feedback
  - Support different notification types (success, error, warning, info)
  - Handle notification animations and auto-dismissal
  - Provide convenient static methods for common notifications

### `modules/navigationManager.js`

- **Purpose**: Navigation and layout behavior
- **Responsibilities**:
  - Handle sidebar menu functionality
  - Manage footer scroll behavior
  - Handle responsive navigation interactions
  - Manage keyboard shortcuts (ESC to close sidebar)

## 🔧 Benefits of Modular Architecture

### **Maintainability**

- Each module has a single responsibility
- Easier to locate and fix bugs
- Cleaner code organization
- Better separation of concerns

### **Reusability**

- Modules can be imported and used independently
- Functions are more focused and reusable
- Easier to extend functionality

### **Testing**

- Individual modules can be tested in isolation
- Easier to write unit tests
- Better test coverage possible

### **Collaboration**

- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear module boundaries

### **Performance**

- ES6 modules enable tree shaking
- Only necessary code is loaded
- Better browser caching

## 🚀 Usage

The application automatically initializes when the DOM is loaded. The main entry point is `main.js`, which:

1. Imports all necessary modules
2. Initializes each module in the correct order
3. Sets up global accessibility for HTML event handlers
4. Provides error handling for initialization

## 🔄 Data Flow

![](..//dataflow.svg)

## 🌐 Global Accessibility

Some static methods are made globally accessible for HTML onclick handlers:

- `UIManager.handleInputTypeChange()`
- `UIManager.handleDefaultInputTypeChange()`
- `UIManager.handleSemesterDefaultInputTypeChange()`

## 📝 Future Enhancements

This modular structure makes it easy to:

- Add new calculation methods
- Implement new themes
- Add data persistence features
- Integrate with external APIs
- Add more sophisticated error handling
- Implement unit testing
- Add TypeScript support

## 🔧 Development Guidelines

When extending the application:

1. Keep modules focused on single responsibilities
2. Use ES6 import/export syntax
3. Add proper JSDoc documentation
4. Handle errors appropriately
5. Maintain consistent coding style
6. Update this README when adding new modules
