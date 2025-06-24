/**
 * Data Manager Module
 * Handles fetching and processing subject data from JSON files
 */

import { PopupManager } from './popupManager.js';

export class DataManager {
  /**
   * Fetch subjects from JSON file
   * @param {string} url - The URL of the JSON file
   * @param {string|null} semester - Optional semester filter
   * @returns {Promise<any[]>} Array of subjects
   */
  static fetchSubjects(url, semester = null) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const subjects = semester
            ? data.filter((subject) => subject.semester == semester)
            : data;
          if (subjects.length > 0) {
            return subjects;
          } else {
            throw new Error('No subjects found for the selected criteria.');
          }
        } else {
          throw new Error('No data found for the selected criteria.');
        }
      })
      .catch((error) => {
        console.error(error);
        const errorMessage =
          error.message || 'An error occurred while fetching data.';

        // Check if it's a data availability issue vs a validation error
        if (
          errorMessage.includes('No subjects found') ||
          errorMessage.includes('No data found')
        ) {
          PopupManager.showDataNotFoundPopup(
            "Data for this criteria doesn't exist."
          );
        } else {
          PopupManager.showWarningPopup([errorMessage], false);
        }
        throw error;
      });
  }

  /**
   * Handle CGPA data fetching - only combines 1st and 2nd semester subjects
   * @param {string} branch - The branch code (ignored for CGPA calculation)
   * @returns {Promise<any[]>} Array of subjects for CGPA calculation (only 1st and 2nd semester)
   */
  static fetchCGPAData(branch) {
    // For CGPA, we only fetch common subjects (one.json and two.json) - ignore branch-specific data
    const commonUrls = ['data/one.json', 'data/two.json'];

    return Promise.all(
      commonUrls.map((url) =>
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return response.json();
          })
          .then((data) => {
            // Check if JSON is empty or invalid
            if (!Array.isArray(data) || data.length === 0) {
              console.warn(`${url} is empty or invalid, ignoring...`);
              return []; // Return empty array for empty/invalid JSON
            }
            return data;
          })
          .catch((error) => {
            console.warn(`Failed to fetch ${url}, ignoring...`, error);
            return []; // Return empty array if fetch fails
          })
      )
    )
      .then((dataArrays) => {
        // Filter out empty arrays and combine valid data
        const validDataArrays = dataArrays.filter((data) => data.length > 0);

        if (validDataArrays.length === 0) {
          throw new Error('No valid data found for CGPA calculation.');
        }

        // Combine all subjects from valid semester data
        const allSubjects = validDataArrays.flat();

        // Remove duplicates if any (based on subject_code)
        const uniqueSubjects = allSubjects.filter(
          (subject, index, self) =>
            index ===
            self.findIndex((s) => s.subject_code === subject.subject_code)
        );

        return uniqueSubjects;
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage =
          error.message || 'An error occurred while fetching CGPA data.';

        // Check if it's a data availability issue vs a validation error
        if (
          errorMessage.includes('No valid data found') ||
          errorMessage.includes('No data found')
        ) {
          PopupManager.showDataNotFoundPopup(
            'No valid data available for CGPA calculation. Please ensure 1st and 2nd semester data files exist.'
          );
        } else {
          PopupManager.showWarningPopup([errorMessage], false);
        }
        throw error;
      });
  }
}
