 const toggleBtn = document.getElementById("toggle-sidebar-btn");
  const sidebar = document.querySelector(".show-subcontainer2");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    toggleBtn.style.display = "none";
  });

  document.addEventListener("click", (event) => {
    const isClickInside = sidebar.contains(event.target) || toggleBtn.contains(event.target);
    if (!isClickInside && sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
      toggleBtn.style.display = "block";
    }
  });

  async function editReview(slug) {
    window.location.href = `/edit/${slug}`;
  }
  document.getElementById("edit-review-btn").addEventListener("click", function() {
    const slug = this.getAttribute("data-slug");
    editReview(slug);
  });