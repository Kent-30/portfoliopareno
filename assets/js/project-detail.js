var projectContent = document.getElementById("projectContent");
var requestedProjectId = Number(new URLSearchParams(window.location.search).get("id"));
var project = Number.isInteger(requestedProjectId)
  ? portfolioProjects[requestedProjectId - 1]
  : null;

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

if (!project) {
  projectContent.innerHTML =
    '<section class="container not-found">' +
      '<p class="eyebrow">PROJECT NOT FOUND</p>' +
      '<h1>We couldn\'t find that project.</h1>' +
      '<p>Choose a project from the portfolio to view its details.</p>' +
      '<a class="btn btn-primary" href="index.html#projects">Back to Projects</a>' +
    '</section>';
} else {
  var features = project.features.map(function (feature) {
    return '<li><i class="fa-solid fa-check"></i> ' + escapeHtml(feature) + "</li>";
  }).join("");
  var technologies = project.technologies.map(function (technology) {
    return "<span>" + escapeHtml(technology) + "</span>";
  }).join("");
  var gallery = project.gallery.map(function (item) {
    var title = item.image.split("/").pop().replace(/\.[^.]+$/, "");
    return '<figure class="project-gallery-item">' +
      '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
      "<figcaption>" + escapeHtml(title) + "</figcaption>" +
      "</figure>";
  }).join("");
  var projectLinks = "";

  if (project.liveUrl) {
    projectLinks += '<a class="btn btn-primary" href="' + escapeHtml(project.liveUrl) + '" target="_blank" rel="noreferrer"><i class="fa-solid fa-globe"></i> Live Website</a>';
  }
  if (project.githubUrl) {
    projectLinks += '<a class="btn btn-outline" href="' + escapeHtml(project.githubUrl) + '" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i> GitHub / Source Code</a>';
  }
  if (project.demoUrl) {
    projectLinks += '<a class="btn btn-outline" href="' + escapeHtml(project.demoUrl) + '" target="_blank" rel="noreferrer"><i class="fa-solid fa-play"></i> Demo</a>';
  }

  document.title = project.title + " | Kent Portfolio";
  document.querySelector('meta[name="description"]').content = project.summary;
  projectContent.innerHTML =
    '<section class="project-detail"><div class="container">' +
      '<article class="project-detail-card">' +
        '<img class="project-detail-image" src="' + escapeHtml(project.image) + '" alt="' + escapeHtml(project.alt) + '">' +
        '<div class="project-detail-copy">' +
          '<p class="eyebrow">' + escapeHtml(project.type) + "</p>" +
          "<h1>" + escapeHtml(project.title) + "</h1>" +
          "<p>" + escapeHtml(project.description) + "</p>" +
          '<div class="project-detail-meta">' +
            '<div class="detail-meta-item"><small>Category</small><strong>' + escapeHtml(project.category) + "</strong></div>" +
            '<div class="detail-meta-item"><small>Year</small><strong>' + escapeHtml(project.year) + "</strong></div>" +
            '<div class="detail-meta-item"><small>Role</small><strong>' + escapeHtml(project.role) + "</strong></div>" +
            '<div class="detail-meta-item"><small>Status</small><strong>' + escapeHtml(project.status) + "</strong></div>" +
          "</div>" +
          (projectLinks ? '<div class="project-detail-links">' + projectLinks + "</div>" : "") +
          '<div class="project-detail-actions">' +
            '<a class="btn btn-outline" href="index.html#contact" data-project="' + escapeHtml(project.title) + '">Ask about this project <i class="fa-solid fa-arrow-right"></i></a>' +
            '<a class="btn btn-outline" href="index.html#projects">Back to Projects</a>' +
          "</div>" +
        "</div>" +
      "</article>" +
      '<div class="problem-solution-grid">' +
        '<div class="problem-solution-card"><div class="ps-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3>Problem</h3><p>' + escapeHtml(project.problem) + "</p></div>" +
        '<div class="problem-solution-card"><div class="ps-icon"><i class="fa-solid fa-lightbulb"></i></div><h3>Solution</h3><p>' + escapeHtml(project.solution) + "</p></div>" +
      "</div>" +
      '<section class="project-features"><h2><i class="fa-solid fa-star"></i> Key Features</h2><ul class="features-list">' + features + "</ul></section>" +
      '<section class="project-tech"><h2><i class="fa-solid fa-code"></i> Technologies Used</h2><div class="tags tags-large">' + technologies + "</div></section>" +
      (gallery ? '<section class="project-gallery" aria-labelledby="projectGalleryTitle"><div class="project-gallery-heading"><p class="eyebrow">MORE FROM THIS PROJECT</p><h2 id="projectGalleryTitle">' + escapeHtml(project.galleryTitle || "Gallery") + '</h2><p>Explore the related designs below.</p></div><div class="project-gallery-grid">' + gallery + "</div></section>" : "") +
    "</div></section>";
}
