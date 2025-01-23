if (
  localStorage.getItem("darkMode") === "enabled" ||
  (localStorage.getItem("darkMode") !== "disabled" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

document.getElementById("subjectTableContainer").classList.add("hidden");
document.getElementById("result").classList.add("hidden");

document.querySelectorAll('input[name="gradeType"]').forEach((radio) => {
  radio.addEventListener("change", handleInputChange);
});
document
  .getElementById("submitBtn")
  .addEventListener("click", handleInputChange);
document.getElementById("branch").addEventListener("change", handleInputChange);
document
  .getElementById("semester")
  .addEventListener("change", handleInputChange);

function handleInputChange() {
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  ).value;
  const semesterContainer = document.getElementById("semesterContainer");
  const branchContainer = document.getElementById("branchContainer");
  const container = document.getElementById("subjectTableContainer");
  const resultDiv = document.getElementById("result");

  container.innerHTML = "";
  resultDiv.innerHTML = "";
  container.classList.add("hidden");
  resultDiv.classList.add("hidden");
  semesterContainer.style.display = "block";
  branchContainer.style.display = "block";

  if (gradeType === "sgpa") {
    if (
      document.getElementById("semester").value === "1" ||
      document.getElementById("semester").value === "2"
    ) {
      branchContainer.style.display = "none";
    } else {
      branchContainer.style.display = "block";
    }
  } else {
    semesterContainer.style.display = "none";
  }
}

document.getElementById("submitBtn").addEventListener("click", function () {
  const semester = document.getElementById("semester").value;
  const branch = document.getElementById("branch").value;
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  ).value;

  if (gradeType === "sgpa" && semester !== "1" && semester !== "2") {
    fetch(`resources/${branch}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const subjects = data.filter(
            (subject) => subject.semester == semester
          );
          document
            .getElementById("subjectTableContainer")
            .classList.remove("hidden");
          displaySubjects(subjects);
        } else {
          alert("No subjects found for the selected branch.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Data doesn't exist.");
      });
  } else if (gradeType === "sgpa" && (semester === "1" || semester === "2")) {
    const currentSemester = semester === "1" ? "one" : "two";
    fetch(`resources/${currentSemester}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          document
            .getElementById("subjectTableContainer")
            .classList.remove("hidden");
          displaySubjects(data);
        } else {
          alert("No subjects found for the selected semester.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Data doesn't exist.");
      });
  } else {
    handleCGPA(branch);
  }
});

function handleCGPA(branch) {
  fetch(`resources/${branch}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 1) {
        document
          .getElementById("subjectTableContainer")
          .classList.remove("hidden");
        displaySubjects(data);
      } else {
        alert("No subjects found for the selected branch.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Data doesn't exist.");
    });
}

function displaySubjects(subjects, resolve) {
  const container = document.getElementById("subjectTableContainer");
  container.innerHTML = "";

  if (subjects.length === 0) {
    container.innerHTML = `
      <h2 class="text-xl text-gray-700 text-center py-4">
        No subjects found for selected semester.
      </h2>`;
    if (resolve) resolve();
    return;
  }

  let table = `
  <form id="marksForm" class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-700">
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">
            Semester
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">
            Code
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Subject Name
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">
            Credits
          </th>
          <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-36">
            Marks
          </th>
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
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
        ${subject.semester}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400">
        ${subject.subject_code}
      </td>
      <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
        ${subject.subject_name}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
        ${subject.credits}
      </td>
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
        Calculate SGPA
      </button>
    </div>
  </div>`;

  container.innerHTML = table;

  document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateSGPA);
  if (resolve) resolve();
}

function calculateSGPA() {
  const marks = Array.from(document.querySelectorAll('input[name="marks"]'));
  const credits = Array.from(
    document.querySelectorAll('input[name="credits"]')
  ).map((input) => parseFloat(input.value));

  const nonZeroCreditMarks = marks.filter(
    (_input, index) => credits[index] !== 0
  );
  const zeroCreditMarks = marks.filter((_input, index) => credits[index] === 0);

  if (nonZeroCreditMarks.some((input) => !input.value)) {
    alert("Please enter marks for all subjects");
    return;
  }

  const nonZeroCreditMarksValues = nonZeroCreditMarks.map((input) =>
    parseFloat(input.value)
  );
  if (nonZeroCreditMarksValues.some((mark) => mark < 0 || mark > 100)) {
    alert("Marks should be between 0 and 100");
    return;
  }

  const zeroCreditMarksValues = zeroCreditMarks
    .map((input) => (input.value ? parseFloat(input.value) : null))
    .filter((mark) => mark !== null);

  if (zeroCreditMarksValues.some((mark) => mark < 0 || mark > 100)) {
    alert("Marks should be between 0 and 100");
    return;
  }

  let totalCredits = 0;
  let totalGradePoints = 0;
  let totalMarks = 0;

  nonZeroCreditMarks.forEach((markInput, index) => {
    const mark = parseFloat(markInput.value);
    const credit = credits[marks.indexOf(markInput)];
    const gradePoint = getGradePoint(mark);
    totalCredits += credit;
    totalGradePoints += gradePoint * credit;
    totalMarks += mark;
  });

  zeroCreditMarks.forEach((markInput) => {
    if (markInput.value) {
      totalMarks += parseFloat(markInput.value);
    }
  });

  const resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");

  if (totalCredits > 0) {
    const sgpa = totalGradePoints / totalCredits;
    const gradeType = document.querySelector(
      'input[name="gradeType"]:checked'
    ).value;

    if (gradeType === "sgpa") {
      resultDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Your SGPA is: ${sgpa.toFixed(2)}
        </h2>
        <h3 class="text-xl text-gray-700 dark:text-gray-300">
          Total Marks: ${totalMarks}
        </h3>`;
    } else {
      resultDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Your CGPA is: ${sgpa.toFixed(2)}
        </h2>`;
    }
  } else {
    resultDiv.innerHTML = `
      <h2 class="text-xl text-red-600 dark:text-red-400 font-medium">
        Invalid input for calculation.
      </h2>`;
  }
}

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
