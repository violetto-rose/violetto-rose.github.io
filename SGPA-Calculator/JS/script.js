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
    container.innerHTML = "<h2>No subjects found for selected semester.</h2>";
    if (resolve) resolve(); // Resolve promise if provided
    return;
  }

  let table = '<form id="marksForm"><table><thead><tr><th>Semester</th><th>Subject Number</th><th>Subject Code</th><th>Subject Name</th><th>Credits</th><th>Marks</th></tr></thead><tbody>';
  subjects.forEach((subject) => {
    table += `<tr>
            <td>${subject.semester}</td>
            <td>${subject.subject_number}</td>
            <td>${subject.subject_code}</td>
            <td>${subject.subject_name}</td>
            <td>${subject.credits}</td>
            <td><input type='number' name='marks' min='0' max='100'></td>
            <input type='hidden' name='credits' value='${subject.credits}'>
        </tr>`;
  });
  table += '</tbody></table><div><button type="button" id="calculateBtn">Calculate</button></div></form>';
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
    resultDiv.innerHTML = `<h2>Your SGPA is: ${sgpa.toFixed(2)}</h2>`;
    
    // Display total marks only for SGPA
    resultDiv.innerHTML += `<h3>Total Marks: ${totalMarks}</h3>`;
    
    allSGPAs.push(sgpa); // Store SGPA for CGPA calculation
  } else {
    resultDiv.innerHTML = "<h2>Invalid input for SGPA calculation.</h2>";
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
