document.querySelectorAll('input[name="gradeType"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const semesterContainer = document.getElementById("semesterContainer");
    const container = document.getElementById("subjectTableContainer");
    const resultDiv = document.getElementById("result");

    // Clear the subject table and results when changing the radio button
    container.innerHTML = "";
    resultDiv.innerHTML = ""; // Clear results

    if (this.value === "sgpa") {
      semesterContainer.style.display = "block"; // Show semester selection
    } else {
      semesterContainer.style.display = "none"; // Hide semester selection
    }
  });
});

document.getElementById("submitBtn").addEventListener("click", function () {
  const semester = document.getElementById("semester").value;
  const gradeType = document.querySelector(
    'input[name="gradeType"]:checked'
  ).value;

  if (gradeType === "sgpa") {
    fetch("resources/data.json")
      .then((response) => response.json())
      .then((data) => {
        const subjects = data.filter((subject) => subject.semester == semester);
        displaySubjects(subjects);
      });
  } else {
    handleCGPA(); // Call handleCGPA to display all subjects
  }
});

function handleCGPA() {
  // Fetch all subjects from the JSON data
  fetch("resources/data.json")
    .then((response) => response.json())
    .then((data) => {
      displaySubjects(data); // Display all subjects for CGPA
    });
}

function displaySubjects(subjects, resolve) {
  const container = document.getElementById("subjectTableContainer");
  container.innerHTML = "";

  if (subjects.length === 0) {
    container.innerHTML = "<h2 class='text-red-500'>No subjects found for selected semester.</h2>";
    if (resolve) resolve(); // Resolve promise if provided
    return;
  }

  let table = '<form id="marksForm"><table class="min-w-full bg-white shadow-md rounded"><thead><tr class="bg-gray-200 text-gray-600"><th class="py-2 px-4">Semester</th><th class="py-2 px-4">Subject Number</th><th class="py-2 px-4">Subject Code</th><th class="py-2 px-4">Subject Name</th><th class="py-2 px-4">Credits</th><th class="py-2 px-4">Marks</th></tr></thead><tbody>';
  subjects.forEach((subject) => {
    table += `<tr>
            <td class="border px-4 py-2">${subject.semester}</td>
            <td class="border px-4 py-2">${subject.subject_number}</td>
            <td class="border px-4 py-2">${subject.subject_code}</td>
            <td class="border px-4 py-2">${subject.subject_name}</td>
            <td class="border px-4 py-2">${subject.credits}</td>
            <td class="border px-4 py-2"><input type='number' name='marks' min='0' max='100' class="border rounded px-2 py-1"></td>
            <input type='hidden' name='credits' value='${subject.credits}'>
        </tr>`;
  });
  table += '</tbody></table><div class="flex justify-center mt-4 mb-4"><button type="button" id="calculateBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">Calculate</button></div></form>';
  container.innerHTML = table;

  document.getElementById("calculateBtn").addEventListener("click", calculateSGPA);
  if (resolve) resolve(); // Resolve promise if provided
}

function calculateSGPA() {
  const marks = Array.from(
    document.querySelectorAll('input[name="marks"]')
  ).map((input) => parseFloat(input.value));
  const credits = Array.from(
    document.querySelectorAll('input[name="credits"]')
  ).map((input) => parseFloat(input.value));

  let totalCredits = 0;
  let totalGradePoints = 0;
  let totalMarks = 0; // Initialize total marks

  marks.forEach((mark, index) => {
    const gradePoint = getGradePoint(mark);
    totalCredits += credits[index];
    totalGradePoints += gradePoint * credits[index];
    totalMarks += mark; // Accumulate total marks
  });

  const resultDiv = document.getElementById("result");
  if (totalCredits > 0) {
    const sgpa = totalGradePoints / totalCredits;
    resultDiv.innerHTML = `<h2 class="text-green-500">Your SGPA is: ${sgpa.toFixed(2)}</h2>`;
    
    // Display total marks only for SGPA
    resultDiv.innerHTML += `<h3 class="text-gray-600">Total Marks: ${totalMarks}</h3>`;
    
    allSGPAs.push(sgpa); // Store SGPA for CGPA calculation
  } else {
    resultDiv.innerHTML = "<h2 class='text-red-500'>Invalid input for SGPA calculation.</h2>";
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
