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
    alert('Please select all required fields.');
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
      alert(error.message || 'An error occurred while fetching data.');
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
      alert(error.message || 'An error occurred while fetching CGPA data.');
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

// Display subjects in the table
function displaySubjects(subjects) {
  const container = document.getElementById('subjectTableContainer');
  if (!container) return;

  container.innerHTML = '';

  if (subjects.length === 0) {
    container.innerHTML = `
      <h2 class="text-xl text-gray-700 dark:text-gray-300 text-center py-4">
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
  <form id="marksForm" class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Subject Details</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Input Type:</span>
          <div class="flex items-center space-x-3">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                name="defaultInputType" 
                value="marks" 
                checked
                onchange="handleDefaultInputTypeChange()"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">Marks</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                name="defaultInputType" 
                value="grade"
                onchange="handleDefaultInputTypeChange()"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">Grade</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-700">
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs">Semester</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-xs">Code</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl">Subject Name</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm">Credits</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-sm">Input Type</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-3xl">Marks/Grade</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">`;

  let globalIndex = 0;
  
  sortedSemesters.forEach((semester, semesterIndex) => {
    const semesterSubjects = subjectsBySemester[semester];
    
    // Add semester separator row for all semesters
    table += `
      <tr class="bg-gradient-to-r from-fuchsia-100 to-purple-100 dark:from-fuchsia-900 dark:to-purple-900 border-t-2 border-fuchsia-300 dark:border-fuchsia-600">
        <td colspan="6" class="px-6 py-3 text-center">
          <div class="flex items-center justify-center space-x-2">
            <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
            <span class="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300 uppercase tracking-wider">
              Semester ${semester}
            </span>
            <div class="h-0.5 flex-1 bg-fuchsia-300 dark:bg-fuchsia-600"></div>
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
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">${subject.semester}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400">${subject.subject_code}</td>
        <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">${subject.subject_name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">${subject.credits}</td>
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
              <span class="text-xs text-gray-700 dark:text-gray-300">Marks</span>
            </label>
            <label class="flex items-center space-x-1">
              <input 
                type="radio" 
                name="inputType_${globalIndex}" 
                value="grade"
                onchange="handleInputTypeChange(${globalIndex})"
                class="form-radio text-fuchsia-600 focus:ring-fuchsia-500 text-xs"
              >
              <span class="text-xs text-gray-700 dark:text-gray-300">Grade</span>
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
            class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px]"
            placeholder="Enter marks"
          >
          <select 
            id="grade_${globalIndex}"
            name="grade"
            required
            style="display: none;"
            class="block w-full px-3 py-2.5 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none min-w-[180px]"
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
  </form>
  <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
    <div class="flex justify-end items-center">
      <button 
        type="button" 
        id="calculateBtn"
        class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 shadow-sm"
      >
        Calculate GPA
      </button>
    </div>
  </div>`;

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
  let hasEmptyInputs = false;

  subjects.forEach((row, index) => {
    const creditInput = row.querySelector('input[name="credits"]');
    const credit = Number.parseFloat(creditInput.value);

    const inputTypeRadio = document.querySelector(
      `input[name="inputType_${index}"]:checked`
    );
    const marksInput = document.getElementById(`marks_${index}`);
    const gradeSelect = document.getElementById(`grade_${index}`);

    let gradePoint = 0;
    let markValue = 0;

    if (inputTypeRadio.value === 'marks') {
      if (!marksInput.value) {
        if (credit !== 0) {
          hasEmptyInputs = true;
          return;
        }
      } else {
        markValue = Number.parseFloat(marksInput.value);
        if (markValue < 0 || markValue > 100) {
          alert('Marks should be between 0 and 100');
          return;
        }
        gradePoint = getGradePoint(markValue);
      }
    } else {
      if (!gradeSelect.value) {
        if (credit !== 0) {
          hasEmptyInputs = true;
          return;
        }
      } else {
        gradePoint = letterGradeMapping[gradeSelect.value];
        markValue = getMarksFromGrade(gradePoint);
      }
    }

    if (credit !== 0) {
      totalCredits += credit;
      totalGradePoints += gradePoint * credit;
    }
    totalMarks += markValue;
  });

  if (hasEmptyInputs) {
    alert(
      'Please enter marks or select grades for all subjects with non-zero credits'
    );
    return;
  }

  displayResult(totalCredits, totalGradePoints, totalMarks);
  scrollToElement('result');
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
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Your ${gradeType.toUpperCase()} is: ${gpa.toFixed(2)}
      </h2>`;
    
    // Only show total marks for SGPA, not for CGPA
    if (gradeType === 'sgpa') {
      resultHTML += `
        <h3 class="text-xl text-gray-700 dark:text-gray-300">
          Total Marks: ${totalMarks}
        </h3>`;
    }

    resultDiv.innerHTML = resultHTML;
  } else {
    resultDiv.innerHTML = `
      <h2 class="text-xl text-red-600 dark:text-red-400 font-medium">
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

// Initialize the application
function initializeApp() {
  initializeDarkMode();
  setupDarkModeToggle();
  initializeUI();
  setupEventListeners();
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
