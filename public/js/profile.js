document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    const deleteButton = document.getElementById("deleteButton");
    const logoutModal = document.getElementById("logoutModal");
    const deleteModal = document.getElementById("deleteModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
  
    // Show logout modal
    logoutButton.addEventListener("click", () => {
      logoutModal.classList.remove("hidden");
    });
  
    // Hide logout modal
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.add("hidden");
    });
  
    // Confirm logout action
    confirmLogout.addEventListener("click", () => {
      // Perform logout logic
      window.location.href = "/logout";
    });
  
    // Show delete modal
    deleteButton.addEventListener("click", () => {
      deleteModal.classList.remove("hidden");
    });
  
    // Hide delete modal
    cancelDelete.addEventListener("click", () => {
      deleteModal.classList.add("hidden");
    });
  
    // Confirm delete action
    confirmDelete.addEventListener("click", () => {
      // Perform delete account logic
      window.location.href = "/delete";
    });
  });