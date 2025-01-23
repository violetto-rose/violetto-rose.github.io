// Dark mode initialization
function initializeDarkMode() {
  if (
    localStorage.getItem("darkMode") === "enabled" ||
    (localStorage.getItem("darkMode") !== "disabled" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  }
}

// Dark mode toggle
function setupDarkModeToggle() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const isDark = html.classList.toggle("dark");
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    });
  }
}

// Initialize UI elements
function initializeUI() {
  const subjectTableContainer = document.getElementById(
    "subjectTableContainer"
  );
  const resultDiv = document.getElementById("result");
  if (subjectTableContainer) subjectTableContainer.classList.add("hidden");
  if (resultDiv) resultDiv.classList.add("hidden");
}

// Setup event listeners
function setupEventListeners() {
  document.querySelectorAll('input[name="gradeType"]').forEach((radio) => {
    radio.addEventListener("change", handleInputChange);
  });

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", handleInputChange);
    submitBtn.addEventListener("click", handleSubmit);
  }

  const branchSelect = document.getElementById("branch");
  if (branchSelect) branchSelect.addEventListener("change", handleInputChange);

  const semesterSelect = document.getElementById("semester");
  if (semesterSelect)
    semesterSelect.addEventListener("change", handleInputChange);
}

// Handle input changes
function handleInputChange() {
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  )?.value;
  const semesterContainer = document.getElementById("semesterContainer");
  const branchContainer = document.getElementById("branchContainer");
  const subjectTableContainer = document.getElementById(
    "subjectTableContainer"
  );
  const resultDiv = document.getElementById("result");
  const semesterSelect = document.getElementById("semester");

  if (subjectTableContainer) subjectTableContainer.innerHTML = "";
  if (resultDiv) resultDiv.innerHTML = "";
  if (subjectTableContainer) subjectTableContainer.classList.add("hidden");
  if (resultDiv) resultDiv.classList.add("hidden");
  if (semesterContainer) semesterContainer.style.display = "block";
  if (branchContainer) branchContainer.style.display = "block";

  if (gradeType === "sgpa" && semesterSelect) {
    const semesterValue = semesterSelect.value;
    if (semesterValue === "1" || semesterValue === "2") {
      if (branchContainer) branchContainer.style.display = "none";
    } else {
      if (branchContainer) branchContainer.style.display = "block";
    }
  } else {
    if (semesterContainer) semesterContainer.style.display = "none";
  }
}

// Handle form submission
function handleSubmit() {
  const semester = document.getElementById("semester")?.value;
  const branch = document.getElementById("branch")?.value;
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  )?.value;

  if (!semester || !branch || !gradeType) {
    alert("Please select all required fields.");
    return;
  }

  if (gradeType === "sgpa" && semester !== "1" && semester !== "2") {
    fetchSubjects(`resources/${branch}.json`, semester).then(() => {
      scrollToElement("subjectTableContainer");
    });
  } else if (gradeType === "sgpa" && (semester === "1" || semester === "2")) {
    const currentSemester = semester === "1" ? "one" : "two";
    fetchSubjects(`resources/${currentSemester}.json`).then(() => {
      scrollToElement("subjectTableContainer");
    });
  } else {
    handleCGPA(branch).then(() => {
      scrollToElement("subjectTableContainer");
    });
  }
}

// Fetch subjects from JSON file
function fetchSubjects(url, semester = null) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
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
            "subjectTableContainer"
          );
          if (subjectTableContainer) {
            subjectTableContainer.classList.remove("hidden");
            displaySubjects(subjects);
          }
        } else {
          throw new Error("No subjects found for the selected criteria.");
        }
      } else {
        throw new Error("No data found for the selected criteria.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message || "An error occurred while fetching data.");
    });
}

// Handle CGPA calculation
function handleCGPA(branch) {
  return fetchSubjects(`resources/${branch}.json`);
}

// Display subjects in the table
function displaySubjects(subjects) {
  const container = document.getElementById("subjectTableContainer");
  if (!container) return;

  container.innerHTML = "";

  if (subjects.length === 0) {
    container.innerHTML = `
      <h2 class="text-xl text-gray-700 dark:text-gray-300 text-center py-4">
        No subjects found for selected criteria.
      </h2>`;
    return;
  }

  let table = `
  <form id="marksForm" class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-700">
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">Semester</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">Code</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Subject Name</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">Credits</th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-36">Marks</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">`;

  subjects.forEach((subject, index) => {
    const rowClass =
      index % 2 === 0
        ? "bg-white dark:bg-gray-800"
        : "bg-gray-50 dark:bg-gray-900";
    table += `
    <tr class="${rowClass} hover:bg-fuchsia-200 dark:hover:bg-gray-600">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">${subject.semester}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400">${subject.subject_code}</td>
      <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">${subject.subject_name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">${subject.credits}</td>
      <td class="px-6 py-4">
        <input 
          type="number" 
          name="marks" 
          min="0" 
          max="100" 
          required
          class="block w-full px-2 py-2 rounded-lg border dark:border-gray-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm bg-fuchsia-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
        >
      </td>
      <input type="hidden" name="credits" value="${subject.credits}">
    </tr>`;
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

  const calculateBtn = document.getElementById("calculateBtn");
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateGPA);
  }
}

// Calculate GPA
function calculateGPA() {
  const marks = Array.from(document.querySelectorAll('input[name="marks"]'));
  const credits = Array.from(
    document.querySelectorAll('input[name="credits"]')
  ).map((input) => Number.parseFloat(input.value));

  const nonZeroCreditMarks = marks.filter(
    (_input, index) => credits[index] !== 0
  );
  const zeroCreditMarks = marks.filter((_input, index) => credits[index] === 0);

  if (nonZeroCreditMarks.some((input) => !input.value)) {
    alert("Please enter marks for all subjects");
    return;
  }

  const nonZeroCreditMarksValues = nonZeroCreditMarks.map((input) =>
    Number.parseFloat(input.value)
  );
  if (nonZeroCreditMarksValues.some((mark) => mark < 0 || mark > 100)) {
    alert("Marks should be between 0 and 100");
    return;
  }

  const zeroCreditMarksValues = zeroCreditMarks
    .map((input) => (input.value ? Number.parseFloat(input.value) : null))
    .filter((mark) => mark !== null);

  if (zeroCreditMarksValues.some((mark) => mark < 0 || mark > 100)) {
    alert("Marks should be between 0 and 100");
    return;
  }

  let totalCredits = 0;
  let totalGradePoints = 0;
  let totalMarks = 0;

  nonZeroCreditMarks.forEach((markInput, _index) => {
    const mark = Number.parseFloat(markInput.value);
    const credit = credits[marks.indexOf(markInput)];
    const gradePoint = getGradePoint(mark);
    totalCredits += credit;
    totalGradePoints += gradePoint * credit;
    totalMarks += mark;
  });

  zeroCreditMarks.forEach((markInput) => {
    if (markInput.value) {
      totalMarks += Number.parseFloat(markInput.value);
    }
  });

  displayResult(totalCredits, totalGradePoints, totalMarks);
  scrollToElement("result");
}

// Display the calculated result
function displayResult(totalCredits, totalGradePoints, totalMarks) {
  const resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  resultDiv.classList.remove("hidden");

  if (totalCredits > 0) {
    const gpa = totalGradePoints / totalCredits;
    const gradeType = document.querySelector(
      'input[name="gradeType"]:checked'
    )?.value;

    resultDiv.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Your ${gradeType.toUpperCase()} is: ${gpa.toFixed(2)}
      </h2>
      <h3 class="text-xl text-gray-700 dark:text-gray-300">
        Total Marks: ${totalMarks}
      </h3>`;
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
    element.scrollIntoView({ behavior: "smooth", block: "start" });
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

// Initialize the application
function initializeApp() {
  initializeDarkMode();
  setupDarkModeToggle();
  initializeUI();
  setupEventListeners();
}

// Run the initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
