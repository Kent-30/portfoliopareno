// ============================================================
// KENT PORTFOLIO - JAVASCRIPT
// All the interactive features for the portfolio website.
// ============================================================

// --- Mobile Menu Toggle ---
var menuToggle = document.getElementById("menuToggle");
var navLinks = document.getElementById("navLinks");
var navItems = document.querySelectorAll(".nav-link");
var backToTop = document.getElementById("backToTop");

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

// Close the mobile menu when a link is clicked
navItems.forEach(function (link) {
  link.addEventListener("click", function () {
    if (navLinks) {
      navLinks.classList.remove("open");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
});

// --- Scroll Spy (highlight the current section in the nav) ---
var sections = document.querySelectorAll("main section[id]");

function updatePageState() {
  var scrollPosition = window.scrollY + 150;
  var current = "home";

  sections.forEach(function (section) {
    if (scrollPosition >= section.offsetTop) {
      current = section.id;
    }
  });

  navItems.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });

  if (backToTop) {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }
}

window.addEventListener("scroll", updatePageState, { passive: true });
updatePageState();

// --- Back to Top Button ---
if (backToTop) {
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Footer Year ---
var yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --- Dark Mode Toggle ---
var themeToggle = document.getElementById("themeToggle");

// Set the correct icon based on the saved theme
function updateThemeIcon() {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  if (themeToggle) {
    themeToggle.innerHTML =
      currentTheme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
  }
}

// Run on page load
updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var newTheme = currentTheme === "dark" ? "light" : "dark";

    // Save the choice in the browser so it stays after refresh
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateThemeIcon();
  });
}

// --- Project "Ask about this" links (prefills the contact subject) ---
document.addEventListener("click", function (event) {
  var link = event.target.closest("[data-project]");
  if (link) {
    var subject = document.getElementById("subject");
    if (subject) {
      subject.value = "Question about " + link.dataset.project;
    }
  }
});

// --- Project Cards & Category Options ---
var projectGrid = document.getElementById("projectGrid");
var categoryFilter = document.getElementById("categoryFilter");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

if (projectGrid && Array.isArray(portfolioProjects)) {
  var categories = [];
  portfolioProjects.forEach(function (project, index) {
    if (categories.indexOf(project.category) === -1) {
      categories.push(project.category);
    }

    var searchableText = [
      project.title,
      project.category,
      project.technologies.join(" "),
      project.year,
      project.summary
    ].join(" ").toLowerCase();
    projectGrid.insertAdjacentHTML("beforeend",
      '<article class="project-card" data-search="' + escapeHtml(searchableText) + '" data-category="' + escapeHtml(project.category.toLowerCase()) + '">' +
        '<a class="project-details-link" href="project.html?id=' + (index + 1) + '">' +
          '<img class="project-image" src="' + escapeHtml(project.image) + '" alt="' + escapeHtml(project.alt) + '" loading="lazy">' +
          '<div class="project-body">' +
            '<div class="project-topline"><span class="project-type">' + escapeHtml(project.type) + '</span><i class="fa-solid fa-arrow-up-right-from-square"></i></div>' +
            '<h3>' + escapeHtml(project.title) + '</h3>' +
            '<p>' + escapeHtml(project.summary) + '</p>' +
            '<div class="project-meta">' +
              '<span class="project-category"><i class="fa-solid fa-folder"></i> ' + escapeHtml(project.category) + '</span>' +
              '<span class="project-year"><i class="fa-solid fa-calendar"></i> ' + escapeHtml(project.year) + '</span>' +
              '<span class="project-status"><i class="fa-solid fa-circle-check"></i> ' + escapeHtml(project.status) + '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '<div class="project-contact"><a class="text-link" href="#contact" data-project="' + escapeHtml(project.title) + '">Ask about this project <i class="fa-solid fa-arrow-right"></i></a></div>' +
      '</article>');
  });

  categories.sort().forEach(function (category) {
    var option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// --- Project Search & Filter ---
var searchInput = document.getElementById("projectSearch");
var projectCards = document.querySelectorAll("#projectGrid .project-card");
var noResults = document.getElementById("noResults");

function filterProjects() {
  var searchText = "";
  var searchCategory = "";

  if (searchInput) {
    searchText = searchInput.value.toLowerCase();
  }
  if (categoryFilter) {
    searchCategory = categoryFilter.value.toLowerCase();
  }

  var visibleCount = 0;

  projectCards.forEach(function (card) {
    var searchableText = card.getAttribute("data-search") || "";
    var category = card.getAttribute("data-category") || "";
    var matchesSearch = searchableText.indexOf(searchText) !== -1;
    var matchesCategory = searchCategory === "" || category === searchCategory;

    // Show or hide the card
    if (matchesSearch && matchesCategory) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show "no results" message if nothing matches
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

// Run the filter when the user types or changes the dropdown
if (searchInput) {
  searchInput.addEventListener("input", filterProjects);
}
if (categoryFilter) {
  categoryFilter.addEventListener("change", filterProjects);
}

// --- Formspree Form Submission ---
function setupFormspreeForm(formId, hintId, successMessage, errorMessage) {
  var form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var submittedForm = event.currentTarget;
    if (!submittedForm.reportValidity()) return;

    var formHint = document.getElementById(hintId);
    var submitButton = submittedForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    formHint.textContent = "Sending...";

    try {
      var response = await fetch(submittedForm.action, {
        method: "POST",
        body: new FormData(submittedForm),
        headers: { Accept: "application/json" }
      });
      var result = await response.json();

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error(result.message || "The email service could not accept your message.");
      }

      formHint.textContent = result.message || successMessage;
      submittedForm.reset();
    } catch (error) {
      console.error("Formspree submission failed:", error);
      formHint.textContent = errorMessage;
    } finally {
      submitButton.disabled = false;
    }
  });
}

setupFormspreeForm(
  "contactForm",
  "formHint",
  "Your message has been sent. Thank you!",
  "Your message could not be sent. Please email kentlewis95@gmail.com directly or try again later."
);
