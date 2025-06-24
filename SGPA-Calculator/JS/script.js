// Dark mode initialization
function initializeDarkMode() {
  if (
    localStorage.getItem('darkMode') === 'enabled' ||
    (localStorage.getItem('darkMode') !== 'disabled' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  }
}

// Dark mode toggle
function setupDarkModeToggle() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
  }
}

// Grade point to letter grade mapping
const gradeMapping = {
  10: 'O',
  9: 'A+',
  8: 'A',
  7: 'B+',
  6: 'B',
  5: 'C',
  4: 'P',
  0: 'F'
};

// Letter grade to grade point mapping
const letterGradeMapping = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0
};

// Initialize UI elements
function initializeUI() {
  const subjectTableContainer = document.getElementById(
    'subjectTableContainer'
  );
  const resultDiv = document.getElementById('result');
  if (subjectTableContainer) subjectTableContainer.classList.add('hidden');
  if (resultDiv) resultDiv.classList.add('hidden');
}

// Setup event listeners
function setupEventListeners() {
  document.querySelectorAll('input[name="gradeType"]').forEach((radio) => {
    radio.addEventListener('change', handleInputChange);
  });

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleInputChange);
    submitBtn.addEventListener('click', handleSubmit);
  }

  const branchSelect = document.getElementById('branch');
  if (branchSelect) branchSelect.addEventListener('change', handleInputChange);

  const semesterSelect = document.getElementById('semester');
  if (semesterSelect)
    semesterSelect.addEventListener('change', handleInputChange);
}

// Handle input changes
function handleInputChange() {
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  )?.value;
  const semesterContainer = document.getElementById('semesterContainer');
  const branchContainer = document.getElementById('branchContainer');
  const subjectTableContainer = document.getElementById(
    'subjectTableContainer'
  );
  const resultDiv = document.getElementById('result');
  const semesterSelect = document.getElementById('semester');

  if (subjectTableContainer) subjectTableContainer.innerHTML = '';
  if (resultDiv) resultDiv.innerHTML = '';
  if (subjectTableContainer) subjectTableContainer.classList.add('hidden');
  if (resultDiv) resultDiv.classList.add('hidden');
  if (semesterContainer) semesterContainer.style.display = 'block';
  if (branchContainer) branchContainer.style.display = 'block';

  if (gradeType === 'sgpa' && semesterSelect) {
    const semesterValue = semesterSelect.value;
    if (semesterValue === '1' || semesterValue === '2') {
      if (branchContainer) branchContainer.style.display = 'none';
    } else {
      if (branchContainer) branchContainer.style.display = 'block';
    }
  } else {
    if (semesterContainer) semesterContainer.style.display = 'none';
  }
}

// Handle form submission
function handleSubmit() {
  const semester = document.getElementById('semester')?.value;
  const branch = document.getElementById('branch')?.value;
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  )?.value;

  if (!semester || !branch || !gradeType) {
    showWarningPopup(['Please select all required fields.'], false);
    return;
  }

  if (gradeType === 'sgpa' && semester !== '1' && semester !== '2') {
    fetchSubjects(`resources/${branch}.json`, semester).then(() => {
      scrollToElement('subjectTableContainer');
    });
  } else if (gradeType === 'sgpa' && (semester === '1' || semester === '2')) {
    const currentSemester = semester === '1' ? 'one' : 'two';
    fetchSubjects(`resources/${currentSemester}.json`).then(() => {
      scrollToElement('subjectTableContainer');
    });
  } else {
    handleCGPA(branch).then(() => {
      scrollToElement('subjectTableContainer');
    });
  }
}

// Fetch subjects from JSON file
function fetchSubjects(url, semester = null) {
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
          const subjectTableContainer = document.getElementById(
            'subjectTableContainer'
          );
          if (subjectTableContainer) {
            subjectTableContainer.classList.remove('hidden');
            displaySubjects(subjects);
          }
        } else {
          throw new Error('No subjects found for the selected criteria.');
        }
      } else {
        throw new Error('No data found for the selected criteria.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      const errorMessage = error.message || 'An error occurred while fetching data.';
      
      // Check if it's a data availability issue vs a validation error
      if (errorMessage.includes('No subjects found') || errorMessage.includes('No data found')) {
        showDataNotFoundPopup('Data for this criteria doesn\'t exist.');
      } else {
        showWarningPopup([errorMessage], false);
      }
    });
}

// Handle CGPA calculation
function handleCGPA(branch) {
  // For CGPA, we need to fetch common subjects (one.json and two.json) and branch-specific subjects
  const commonUrls = ['resources/one.json', 'resources/two.json'];
  const branchUrl = `resources/${branch}.json`;

  return Promise.all([
    ...commonUrls.map((url) =>
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }
        return response.json();
      })
    ),
    fetch(branchUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${branchUrl}`);
      }
      return response.json();
    })
  ])
    .then(([oneData, twoData, branchData]) => {
      // Combine all subjects from common semesters and branch-specific semesters
      const allSubjects = [...oneData, ...twoData, ...branchData];

      // Remove duplicates if any (based on subject_code)
      const uniqueSubjects = allSubjects.filter(
        (subject, index, self) =>
          index ===
          self.findIndex((s) => s.subject_code === subject.subject_code)
      );

      const subjectTableContainer = document.getElementById(
        'subjectTableContainer'
      );
      if (subjectTableContainer) {
        subjectTableContainer.classList.remove('hidden');
        displaySubjects(uniqueSubjects);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      const errorMessage = error.message || 'An error occurred while fetching CGPA data.';
      
      // Check if it's a data availability issue vs a validation error
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('No data found')) {
        showDataNotFoundPopup('Data for this criteria doesn\'t exist.');
      } else {
        showWarningPopup([errorMessage], false);
      }
    });
}

// Handle input type change for individual subjects
function handleInputTypeChange(subjectIndex) {
  const inputTypeRadio = document.querySelector(
    `input[name="inputType_${subjectIndex}"]:checked`
  );
  const marksInput = document.getElementById(`marks_${subjectIndex}`);
  const gradeSelect = document.getElementById(`grade_${subjectIndex}`);

  if (inputTypeRadio && inputTypeRadio.value === 'marks') {
    marksInput.style.display = 'block';
    gradeSelect.style.display = 'none';
    marksInput.required = true;
    gradeSelect.required = false;
  } else {
    marksInput.style.display = 'none';
    gradeSelect.style.display = 'block';
    marksInput.required = false;
    gradeSelect.required = true;
  }
}

// Make function globally accessible
window.handleInputTypeChange = handleInputTypeChange;

// Handle default input type change for all subjects
function handleDefaultInputTypeChange() {
  const defaultInputType = document.querySelector(
    'input[name="defaultInputType"]:checked'
  )?.value;
  const subjects = document.querySelectorAll('tbody tr');

  subjects.forEach((row, index) => {
    const marksRadio = document.querySelector(
      `input[name="inputType_${index}"][value="marks"]`
    );
    const gradeRadio = document.querySelector(
      `input[name="inputType_${index}"][value="grade"]`
    );

    if (defaultInputType === 'marks') {
      if (marksRadio) marksRadio.checked = true;
    } else {
      if (gradeRadio) gradeRadio.checked = true;
    }

    // Apply the change
    handleInputTypeChange(index);
  });
}

// Make function globally accessible
window.handleDefaultInputTypeChange = handleDefaultInputTypeChange;

// Handle default input type change for specific semester
function handleSemesterDefaultInputTypeChange(semester) {
  const defaultInputType = document.querySelector(
    `input[name="semesterDefaultInputType_${semester}"]:checked`
  )?.value;
  
  // Find all subjects in this semester
  const subjects = document.querySelectorAll('tbody tr');
  let subjectIndex = 0;
  
  subjects.forEach((row) => {
    const creditInput = row.querySelector('input[name="credits"]');
    
    // Skip rows that don't have credit inputs (semester separator rows)
    if (!creditInput) {
      return;
    }
    
    // Check if this row belongs to the specified semester
    const semesterCell = row.querySelector('td:first-child');
    if (semesterCell && semesterCell.textContent == semester) {
      const marksRadio = document.querySelector(
        `input[name="inputType_${subjectIndex}"][value="marks"]`
      );
      const gradeRadio = document.querySelector(
        `input[name="inputType_${subjectIndex}"][value="grade"]`
      );

      if (defaultInputType === 'marks') {
        if (marksRadio) marksRadio.checked = true;
      } else {
        if (gradeRadio) gradeRadio.checked = true;
      }

      // Apply the change
      handleInputTypeChange(subjectIndex);
    }
    
    subjectIndex++;
  });
}

// Make function globally accessible
window.handleSemesterDefaultInputTypeChange = handleSemesterDefaultInputTypeChange;

// Handle semester-specific default input type change (for CGPA)
function handleSemesterDefaultInputTypeChange(semester) {
  const defaultInputType = document.querySelector(
    `input[name="semesterDefaultInputType_${semester}"]:checked`
  )?.value;
  
  // Find all subject rows for this semester
  const semesterRows = document.querySelectorAll('tbody tr');
  let isInTargetSemester = false;
  let subjectIndex = 0;
  
  semesterRows.forEach((row) => {
    // Check if this is a semester separator row
    const semesterHeader = row.querySelector('td[colspan="6"]');
    if (semesterHeader) {
      const headerText = semesterHeader.textContent;
      isInTargetSemester = headerText.includes(`Semester ${semester}`);
      return;
    }
    
    // If we're in the target semester and this is a subject row
    if (isInTargetSemester && row.querySelector('input[name="credits"]')) {
      const marksRadio = document.querySelector(
        `input[name="inputType_${subjectIndex}"][value="marks"]`
      );
      const gradeRadio = document.querySelector(
        `input[name="inputType_${subjectIndex}"][value="grade"]`
      );

      if (defaultInputType === 'marks') {
        if (marksRadio) marksRadio.checked = true;
      } else {
        if (gradeRadio) gradeRadio.checked = true;
      }

      // Apply the change
      handleInputTypeChange(subjectIndex);
      subjectIndex++;
    } else if (row.querySelector('input[name="credits"]')) {
      // Count other semester subjects to maintain correct indexing
      subjectIndex++;
    }
  });
}

// Make function globally accessible
window.handleSemesterDefaultInputTypeChange = handleSemesterDefaultInputTypeChange;

// Display subjects in the table
function displaySubjects(subjects) {
  const container = document.getElementById('subjectTableContainer');
  if (!container) return;

  container.innerHTML = '';

  if (subjects.length === 0) {
    container.innerHTML = `
      <h2 class="text-xl text-gray-700 dark:text-gray-300 text-center py-6 text-heading">
        No subjects found for selected criteria.
      </h2>`;
    return;
  }

  // Group subjects by semester
  const subjectsBySemester = subjects.reduce((acc, subject) => {
    const semester = subject.semester;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(subject);
    return acc;
  }, {});

  // Sort semesters in ascending order
  const sortedSemesters = Object.keys(subjectsBySemester).sort((a, b) => parseInt(a) - parseInt(b));

  let table = `
  <form id="marksForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 text-heading">Subject Details</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 text-caption">Default Input Type:</span>
          <div class="flex flex-col md:flex-row items-center gap-2">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                name="defaultInputType" 
                value="marks" 
                checked
                onchange="handleDefaultInputTypeChange()"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300 text-body">Marks</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                name="defaultInputType" 
                value="grade"
                onchange="handleDefaultInputTypeChange()"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300 text-body">Grade</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-700">
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs text-caption">Semester</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs text-caption">Code</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl text-caption">Subject Name</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm text-caption">Credits</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm text-caption">Input Type</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl text-caption">Marks/Grade</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">`;

  let globalIndex = 0;
  
  sortedSemesters.forEach((semester, semesterIndex) => {
    const semesterSubjects = subjectsBySemester[semester];
    const gradeType = document.querySelector('input[name="gradeType"]:checked')?.value;
    
    // Add semester separator row for all semesters
    table += `
      <tr class="bg-gradient-to-r from-fuchsia-100 to-purple-100 dark:from-fuchsia-900 dark:to-purple-900 border-t-2 border-fuchsia-300 dark:border-fuchsia-600">
        <td colspan="6" class="px-6 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 flex-1">
              <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
              <span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wider text-caption">
                Semester ${semester}
              </span>
              <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
            </div>
            ${gradeType === 'cgpa' ? `
            <div class="flex items-center space-x-3 ml-4">
              <span class="text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300 text-caption">Default:</span>
              <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-1">
                  <input 
                    type="radio" 
                    name="semesterDefaultInputType_${semester}" 
                    value="marks" 
                    checked
                    onchange="handleSemesterDefaultInputTypeChange(${semester})"
                    class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
                  >
                  <span class="text-xs text-fuchsia-700 dark:text-fuchsia-300 text-caption">Marks</span>
                </label>
                <label class="flex items-center space-x-1">
                  <input 
                    type="radio" 
                    name="semesterDefaultInputType_${semester}" 
                    value="grade"
                    onchange="handleSemesterDefaultInputTypeChange(${semester})"
                    class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
                  >
                  <span class="text-xs text-fuchsia-700 dark:text-fuchsia-300 text-caption">Grade</span>
                </label>
              </div>
            </div>
            ` : ''}
          </div>
        </td>
      </tr>`;

    semesterSubjects.forEach((subject, index) => {
      const rowClass =
        globalIndex % 2 === 0
          ? 'bg-white dark:bg-gray-800'
          : 'bg-gray-50 dark:bg-gray-900';
      table += `
      <tr class="${rowClass}">
        <td class="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-numeric">${subject.semester}</td>
        <td class="px-6 py-4 text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 text-caption">${subject.subject_code}</td>
        <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium text-body">${subject.subject_name}</td>
        <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-semibold text-numeric">${subject.credits}</td>
        <td class="px-6 py-4">
          <div class="flex flex-col space-y-2">
            <label class="flex items-center space-x-1">
              <input 
                type="radio" 
                name="inputType_${globalIndex}" 
                value="marks" 
                checked
                onchange="handleInputTypeChange(${globalIndex})"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
              >
              <span class="text-xs text-gray-700 dark:text-gray-300 text-caption">Marks</span>
            </label>
            <label class="flex items-center space-x-1">
              <input 
                type="radio" 
                name="inputType_${globalIndex}" 
                value="grade"
                onchange="handleInputTypeChange(${globalIndex})"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
              >
              <span class="text-xs text-gray-700 dark:text-gray-300 text-caption">Grade</span>
            </label>
          </div>
        </td>
        <td class="px-6 py-4">
          <input 
            type="number" 
            id="marks_${globalIndex}"
            name="marks" 
            min="0" 
            max="100" 
            required
            class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px] form-text"
            placeholder="Enter marks"
          >
          <select 
            id="grade_${globalIndex}"
            name="grade"
            required
            style="display: none;"
            class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px] form-text"
          >
            <option value="">Select Grade</option>
            <option value="O">O • Outstanding (10)</option>
            <option value="A+">A+ • Excellent (9)</option>
            <option value="A">A • Very Good (8)</option>
            <option value="B+">B+ • Good (7)</option>
            <option value="B">B • Above Average (6)</option>
            <option value="C">C • Average (5)</option>
            <option value="P">P • Pass (4)</option>
            <option value="F">F • Fail (0)</option>
          </select>
        </td>
        <input type="hidden" name="credits" value="${subject.credits}">
      </tr>`;
      globalIndex++;
    });
  });

  table += `
      </tbody>
    </table>
    </div>
    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-end items-center">
        <button 
          type="button" 
          id="calculateBtn"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 shadow-lg hover:shadow-xl transition-all duration-200 text-body"
        >
          Calculate GPA
        </button>
      </div>
    </div>
  </form>`;

  container.innerHTML = table;

  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateGPA);
  }
}

// Calculate GPA
function calculateGPA() {
  const subjects = document.querySelectorAll('tbody tr');
  let totalCredits = 0;
  let totalGradePoints = 0;
  let totalMarks = 0;
  let warnings = [];
  let subjectIndex = 0; // Separate index for actual subject rows

  subjects.forEach((row) => {
    const creditInput = row.querySelector('input[name="credits"]');
    
    // Skip rows that don't have credit inputs (semester separator rows)
    if (!creditInput) {
      return;
    }
    
    const credit = Number.parseFloat(creditInput.value);
    const subjectCode = row.querySelector('td:nth-child(2)')?.textContent || `Subject ${subjectIndex + 1}`;

    const inputTypeRadio = document.querySelector(
      `input[name="inputType_${subjectIndex}"]:checked`
    );
    const marksInput = document.getElementById(`marks_${subjectIndex}`);
    const gradeSelect = document.getElementById(`grade_${subjectIndex}`);

    let gradePoint = 0;
    let markValue = 0;

    if (inputTypeRadio && inputTypeRadio.value === 'marks') {
      if (!marksInput.value) {
        if (credit !== 0) {
          warnings.push(`${subjectCode}: Marks field is empty`);
        }
      } else {
        markValue = Number.parseFloat(marksInput.value);
        if (markValue < 0 || markValue > 100) {
          warnings.push(`${subjectCode}: Marks should be between 0 and 100 (current: ${markValue})`);
          // Use 0 as fallback for invalid marks
          markValue = Math.max(0, Math.min(100, markValue));
        }
        gradePoint = getGradePoint(markValue);
      }
    } else if (inputTypeRadio) {
      if (!gradeSelect.value) {
        if (credit !== 0) {
          warnings.push(`${subjectCode}: Grade not selected`);
        }
      } else {
        gradePoint = letterGradeMapping[gradeSelect.value];
        markValue = getMarksFromGrade(gradePoint);
      }
    } else {
      warnings.push(`${subjectCode}: Input type not selected`);
    }

    if (credit !== 0) {
      totalCredits += credit;
      totalGradePoints += gradePoint * credit;
    }
    totalMarks += markValue;
    
    subjectIndex++; // Increment only for actual subject rows
  });

  // Show warnings if any and stop calculation
  if (warnings.length > 0) {
    showWarningPopup(warnings, false); // false = don't continue with calculation
    return;
  }

  displayResult(totalCredits, totalGradePoints, totalMarks);
  scrollToElement('result');
}

// Show warning popup
function showWarningPopup(warnings, allowContinue = true) {
  const isError = !allowContinue;
  const warningHtml = `
    <div id="warningPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[40rem] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold ${isError ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'} flex items-center text-heading">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-3">
                ${isError ? 
                  '<path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />' :
                  '<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />'
                }
              </svg>
              ${isError ? 'Validation Errors' : 'Validation Warnings'}
            </h3>
            <button id="closeWarning" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-body">
            ${isError ? 
              'Please fix the following issues before calculation can proceed:' : 
              'The following issues were found. Calculation will proceed with adjustments:'
            }
          </p>
          <ul class="space-y-3">
            ${warnings.map(warning => `
              <li class="flex items-start space-x-3">
                <span class="${isError ? 'text-red-500' : 'text-yellow-500'} font-bold text-lg leading-none">•</span>
                <span class="text-sm text-gray-700 dark:text-gray-300 text-body">${warning}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <button id="acknowledgeWarning" class="w-full px-4 py-3 ${isError ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white rounded-xl text-sm font-semibold text-body transition-all duration-200 hover:shadow-lg">
            ${isError ? 'OK, I\'ll Fix These' : 'I Understand, Continue'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', warningHtml);
  
  // Add event listeners
  document.getElementById('closeWarning').onclick = closeWarningPopup;
  document.getElementById('acknowledgeWarning').onclick = closeWarningPopup;
  
  // Close on background click
  document.getElementById('warningPopup').onclick = (e) => {
    if (e.target.id === 'warningPopup') {
      closeWarningPopup();
    }
  };
}

// Close warning popup
function closeWarningPopup() {
  const popup = document.getElementById('warningPopup');
  if (popup) {
    popup.remove();
  }
}

// Show data not found popup
function showDataNotFoundPopup(message) {
  const popupHtml = `
    <div id="dataNotFoundPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center text-heading">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              No Data Available
            </h3>
            <button id="closeDataNotFound" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-blue-500">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600 dark:text-gray-300 text-body">
                ${message}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-caption">
                This combination of semester and branch may not be available in our current database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', popupHtml);
  
  // Add event listeners
  document.getElementById('closeDataNotFound').onclick = closeDataNotFoundPopup;
  document.getElementById('acknowledgeDataNotFound').onclick = closeDataNotFoundPopup;
  
  // Close on background click
  document.getElementById('dataNotFoundPopup').onclick = (e) => {
    if (e.target.id === 'dataNotFoundPopup') {
      closeDataNotFoundPopup();
    }
  };
}

// Close data not found popup
function closeDataNotFoundPopup() {
  const popup = document.getElementById('dataNotFoundPopup');
  if (popup) {
    popup.remove();
  }
}

// Display the calculated result
function displayResult(totalCredits, totalGradePoints, totalMarks) {
  const resultDiv = document.getElementById('result');
  if (!resultDiv) return;

  resultDiv.classList.remove('hidden');

  if (totalCredits > 0) {
    const gpa = totalGradePoints / totalCredits;
    const gradeType = document.querySelector(
      'input[name="gradeType"]:checked'
    )?.value;

    let resultHTML = `
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-display">
        Your ${gradeType.toUpperCase()} is: <span class="text-numeric text-fuchsia-600 dark:text-fuchsia-400">${gpa.toFixed(2)}</span>
      </h2>`;
    
    // Only show total marks for SGPA, not for CGPA
    if (gradeType === 'sgpa') {
      resultHTML += `
        <h3 class="text-xl text-gray-700 dark:text-gray-300 text-heading">
          Total Marks: <span class="text-numeric font-semibold">${totalMarks}</span>
        </h3>`;
    }

    resultDiv.innerHTML = resultHTML;
  } else {
    resultDiv.innerHTML = `
      <h2 class="text-xl text-red-600 dark:text-red-400 font-semibold text-heading">
        Invalid input for calculation.
      </h2>`;
  }
}

// Scroll to element function
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Get grade point based on marks
function getGradePoint(marks) {
  if (marks >= 90 && marks <= 100) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 55) return 6;
  if (marks >= 50) return 5;
  if (marks >= 40) return 4;
  return 0;
}

// Get approximate marks from grade point (for display purposes)
function getMarksFromGrade(gradePoint) {
  switch (gradePoint) {
    case 10:
      return 95; // O: 90-100
    case 9:
      return 85; // A+: 80-89
    case 8:
      return 75; // A: 70-79
    case 7:
      return 65; // B+: 60-69
    case 6:
      return 57; // B: 55-59
    case 5:
      return 52; // C: 50-54
    case 4:
      return 45; // P: 40-49
    default:
      return 20; // F: 0-39
  }
}

// Footer hide/show functionality
function setupFooterScrollBehavior() {
  let lastScrollTop = 0;
  let ticking = false;
  const footer = document.getElementById('footer');
  
  if (!footer) return;

  function updateFooter() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isTabletOrSmaller = window.innerWidth <= 1024; // lg breakpoint in Tailwind
    
    if (isTabletOrSmaller) {
      if (scrollTop <= 10) {
        // At the very top (with small tolerance) - show footer
        footer.style.transform = 'translateY(0)';
      } else {
        // Not at the top - hide footer
        footer.style.transform = 'translateY(100%)';
      }
    } else {
      // Desktop - always show footer
      footer.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateFooter);
      ticking = true;
    }
  }

  // Scroll event listener
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Resize event listener to handle orientation changes
  window.addEventListener('resize', () => {
    requestTick();
  }, { passive: true });
}

// Sidebar menu functionality
function setupSidebarMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const closeSidebar = document.getElementById('closeSidebar');
  
  if (!menuToggle || !sidebarMenu) return;

  function openSidebar() {
    sidebarMenu.classList.remove('opacity-0', 'pointer-events-none');
    sidebarMenu.classList.add('opacity-100');
    const sidebarContent = sidebarMenu.querySelector('div');
    if (sidebarContent) {
      sidebarContent.classList.remove('translate-x-full');
      sidebarContent.classList.add('-translate-x-5');
    }
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeSidebarMenu() {
    const sidebarContent = sidebarMenu.querySelector('div');
    if (sidebarContent) {
      sidebarContent.classList.remove('-translate-x-5');
      sidebarContent.classList.add('translate-x-full');
    }
    
    // Wait for animation, then hide overlay
    setTimeout(() => {
      sidebarMenu.classList.remove('opacity-100');
      sidebarMenu.classList.add('opacity-0', 'pointer-events-none');
      // Restore body scroll
      document.body.style.overflow = '';
    }, 300);
  }

  // Toggle sidebar
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
  });
  
  // Close sidebar
  if (closeSidebar) {
    closeSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebarMenu();
    });
  }
  
  // Close on background click
  sidebarMenu.addEventListener('click', (e) => {
    if (e.target === sidebarMenu) {
      closeSidebarMenu();
    }
  });
  
  // Prevent clicks inside sidebar from closing it
  const sidebarContent = sidebarMenu.querySelector('div');
  if (sidebarContent) {
    sidebarContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sidebarMenu.classList.contains('opacity-0')) {
      closeSidebarMenu();
    }
  });
}

// Initialize the application
function initializeApp() {
  initializeDarkMode();
  setupDarkModeToggle();
  initializeUI();
  setupEventListeners();
  setupFooterScrollBehavior();
  setupSidebarMenu();
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
