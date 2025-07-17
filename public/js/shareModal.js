const modal = document.getElementById("shareModal");
const shareInput = document.getElementById("shareUrl");

function openShareModal() {
  modal.classList.remove("hidden");
}

function closeShareModal() {
  modal.classList.add("hidden");
}

function outsideClick(e) {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
}

function copyToClipboard() {
  shareInput.select();
  shareInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Link copied to clipboard!");
    closeShareModal();
}

document.getElementById("share-modal-button").addEventListener("click", openShareModal);

document.getElementById("closeShareModal").addEventListener("click", closeShareModal);
document.addEventListener("click", outsideClick);

document.getElementById("copyShareLink").addEventListener("click", copyToClipboard);