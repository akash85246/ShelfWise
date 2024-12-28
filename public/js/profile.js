let currentPage = 1;
let totalPages = 0; // Update this dynamically based on your book list
const limit = 6; // Number of books per page
const visiblePages = 5; // Number of pages visible in the pagination bar

const viewList = document.querySelector('.view-list');
const pagination = document.querySelector('.pagination');

// Function to update pagination
function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("page-numbers");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Clear previous pagination
  paginationContainer.innerHTML = "";

  // Calculate start and end pages
  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  // Generate page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement("button");
    pageNumber.textContent = i;
    pageNumber.className = `Page${i}`;
    pageNumber.onclick = () => {
      currentPage = i;
      displaySelectedBooks(viewHistory.slice((i - 1) * limit, i * limit));
      updatePagination(currentPage, totalPages);
    };
    paginationContainer.appendChild(pageNumber);
  }

  // Enable/disable prev and next buttons
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
prevBtn.style.display = currentPage <= 1 ? "none" : "block";
nextBtn.style.display = currentPage >= totalPages ? "none" : "block";
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displaySelectedBooks(viewHistory.slice((currentPage - 1) * limit, currentPage * limit));
      updatePagination(currentPage, totalPages);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displaySelectedBooks(viewHistory.slice((currentPage - 1) * limit, currentPage * limit));
      updatePagination(currentPage, totalPages);
    }
  };

  const activePage = document.querySelector(".activePage");
  if (activePage) activePage.classList.remove("activePage");
  document.querySelector(`.Page${currentPage}`).classList.add("activePage");
}

// Function to display selected books
async function displaySelectedBooks(bookList) {

  if (bookList.length > 0) {
    viewList.innerHTML = ""; // Clear previous content
    bookList.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card group perspective";
      // Generate star rating HTML
    const totalStars = 5; 
    const filledStars = Math.round(book.final_rating); 
    const emptyStars = totalStars - filledStars; 
    const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(filledStars)}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(emptyStars)}
    `;

    // Truncate book.note to 100 characters
    const truncatedNote = book.note.length > 100
      ? `${book.note.substring(0, 100)}...`
      : book.note;

    bookCard.innerHTML = `
      <div class="inner-card transform-style">
        <div class="front-card">
          <a href="/review/${book.slug}">
            <img src="${book.cover_url}" alt="${book.title}" />
          </a>
        </div>
        <div class="back-card">
          <div class="book-rating">
            ${starRating} <span>(${book.views})</span>
          </div>
          <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">Read more</a></p>
          
        </div>
      </div>
    `;
      viewList.appendChild(bookCard);
    });
  } else {
    viewList.innerHTML = "<h3>No books found</h3>";
  }
}

// Initialize pagination and display books
document.addEventListener("DOMContentLoaded", () => {
  totalPages = Math.ceil(viewHistory.length / limit); 
  if (totalPages > 1) {
    updatePagination(currentPage, totalPages);
  } else {
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
  }
  displaySelectedBooks(viewHistory.slice(0, limit)); // Display the first page of books
});

// Select buttons and popouts
const logoutButton = document.getElementById("logout");
const deleteButton = document.getElementById("delete");
const loader = document.querySelector(".loader");

const logoutPopout = document.getElementById("logout-popout");
const deletePopout = document.getElementById("delete-popout");

const logoutCancel = document.getElementById("logout-cancel");
const logoutConfirm = document.getElementById("logout-confirm");

const deleteCancel = document.getElementById("delete-cancel");
const deleteConfirm = document.getElementById("delete-confirm");

// Utility function to toggle popout visibility
function togglePopout(popout, show) {
  if (show) {
    popout.classList.add("active");
    popout.classList.remove("hidden");
  } else {
    popout.classList.remove("active");
    setTimeout(() => popout.classList.add("hidden"), 300); // Allow fade-out
  }
}

// Show Logout Popout
logoutButton.addEventListener("click", () => {
  togglePopout(logoutPopout, true);
});

// Cancel Logout
logoutCancel.addEventListener("click", () => {
  togglePopout(logoutPopout, false);
});

// Confirm Logout
logoutConfirm.addEventListener("click",async () => {
  try {
    logoutConfirm.style.display = "none";
    loader.style.display = "block";
    const response = await axios.get("/logout");
    if (response.status === 200) {
      console.log("User logged out");
      togglePopout(logoutPopout, false);
      window.location.href = "/";
    } else {
      logoutConfirm.style.display = "block";
      loader.style.display = "none";
      console.error("Logout failed: Unexpected response", response);
    }
  } catch (error) {
    logoutConfirm.style.display = "block";
    loader.style.display = "none";
    console.error("Error logging out:", error);
  }
});

// Show Delete Popout
deleteButton.addEventListener("click", () => {
  togglePopout(deletePopout, true);
});

// Cancel Delete
deleteCancel.addEventListener("click", () => {
  togglePopout(deletePopout, false);
});

// Confirm Delete
deleteConfirm.addEventListener("click", async () => {
  try {
    deleteConfirm.style.display = "none";
    loader.style.display = "block";
    const response = await axios.delete("/api/delete");
    if (response.status === 200) {
      console.log("User deleted");
      togglePopout(deletePopout, false);
      window.location.href = "/";
    } else {
      deleteConfirm.style.display = "block";
      loader.style.display = "none";
      console.error("Delete failed: Unexpected response", response);
    }
  } catch (error) {
    deleteConfirm.style.display = "block";
      loader.style.display = "none";
    console.error("Error deleting user:", error);
    
  }
});