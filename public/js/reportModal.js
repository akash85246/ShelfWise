function openReportModal(reviewId) {
  document.getElementById("reportModal").classList.toggle("hidden");
}

function closeReportModal() {
  document.getElementById("reportModal").classList.toggle("hidden");
}

document
  .getElementById("reportForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const reviewId = document.getElementById("report-review-id").value;
    const reason = document.getElementById("reason").value;

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        Toastify({
          text: "Report submitted successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
        closeReportModal();
        window.location.reload();
      } else {
        Toastify({
          text: "Failed to submit report",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#f44336",
        }).showToast();
      }
    } catch (err) {
      Toastify({
        text: "Failed to submit report",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();
    }
  });

const reportButtons = document.getElementById("report-btn");
if (reportButtons) {
  reportButtons.addEventListener("click", function () {
    const reviewId = this.getAttribute("data-review-id");
    openReportModal(reviewId);
  });
}

const closebtn = document.querySelectorAll(".cancel-btn");

closebtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    closeReportModal();
  });
});

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("reportModal");
  if (event.target === modal) {
    closeReportModal();
  }
};
// Close modal when pressing the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeReportModal();
  }
});

const deleteReportButton = document.getElementById("delete-report-btn");

const reviewId = document.getElementById("review-id").value;

deleteReportButton?.addEventListener("click", async function () {

  try {
    const res = await axios.delete(`/api/report/${reviewId}`);


    if (res.status === 200) {
      Toastify({
        text: "Report deleted successfully!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
      }).showToast();
      
      window.location.reload();
    } else {
      Toastify({
        text: "Failed to delete report",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();
    }
  } catch (err) {
    
    Toastify({
      text: "Failed to delete report",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
    }).showToast();
  }
});
