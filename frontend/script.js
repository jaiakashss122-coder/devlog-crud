const BACKEND_URL = "http://localhost:3000";

const form = document.getElementById("bug-form");
const bugList = document.getElementById("bug-list");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const message = document.getElementById("message");

const bugId = document.getElementById("bug-id");
const title = document.getElementById("title");
const technology = document.getElementById("technology");
const description = document.getElementById("description");
const solution = document.getElementById("solution");
const date = document.getElementById("date");

const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");

async function loadBugs() {
  loading.style.display = "block";
  error.textContent = "";

  try {
    const response = await fetch(`${BACKEND_URL}/bugs`);

    if (!response.ok) {
      throw new Error("Failed to load bugs");
    }

    const bugs = await response.json();
    displayBugs(bugs);
  } catch (err) {
    error.textContent = "Unable to connect to the backend.";
  } finally {
    loading.style.display = "none";
  }
}

function displayBugs(bugs) {
  bugList.innerHTML = "";

  if (bugs.length === 0) {
    bugList.innerHTML = "<p>No bugs saved yet.</p>";
    return;
  }

  bugs.forEach((bug) => {
    const div = document.createElement("div");
    div.className = "bug";

    div.innerHTML = `
      <h3>${escapeHtml(bug.title)}</h3>
      <p class="meta">
        ${escapeHtml(bug.technology)} · ${escapeHtml(bug.date)}
      </p>
      <p><strong>Problem:</strong><br>${escapeHtml(bug.description)}</p>
      <p><strong>Solution:</strong><br>${escapeHtml(bug.solution)}</p>

      <div class="actions">
        <button class="edit" onclick="editBug(${bug.id})">Edit</button>
        <button class="delete" onclick="deleteBug(${bug.id})">Delete</button>
      </div>
    `;

    bugList.appendChild(div);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Saving...";

  const data = {
    title: title.value.trim(),
    technology: technology.value.trim(),
    description: description.value.trim(),
    solution: solution.value.trim(),
    date: date.value
  };

  try {
    const id = bugId.value;

    const response = await fetch(
      id ? `${BACKEND_URL}/bugs/${id}` : `${BACKEND_URL}/bugs`,
      {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Request failed");
    }

    message.textContent = id
      ? "Bug updated successfully!"
      : "Bug saved successfully!";

    resetForm();
    loadBugs();
  } catch (err) {
    message.textContent = err.message;
  }
});

async function editBug(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/bugs`);
    const bugs = await response.json();

    const bug = bugs.find((item) => item.id === id);

    if (!bug) {
      return;
    }

    bugId.value = bug.id;
    title.value = bug.title;
    technology.value = bug.technology;
    description.value = bug.description;
    solution.value = bug.solution;
    date.value = bug.date;

    formTitle.textContent = "Edit Bug";
    submitButton.textContent = "Update Bug";
    cancelButton.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    error.textContent = "Could not load bug.";
  }
}

async function deleteBug(id) {
  if (!confirm("Delete this bug?")) {
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/bugs/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    loadBugs();
  } catch (err) {
    error.textContent = "Could not delete the bug.";
  }
}

cancelButton.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  bugId.value = "";
  formTitle.textContent = "Add a Bug";
  submitButton.textContent = "Save Bug";
  cancelButton.classList.add("hidden");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadBugs();
