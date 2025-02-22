let sortBy = "";
let bookByGenre = "";
let recommendation = "";
let currentPage = 1;
let totalPages = 0;
const limit = 8;
const visiblePages = 5;
const sidebar = document.getElementById("sidebar-container");
const toggleButton = document.getElementById("sidebar-toggle");
const toggleCloseButton = document.getElementById("sidebar-close-toggle");
const home_book_container = document.querySelector(".home-book-container");
const home_container = document.getElementById("home-container");
const sidebarIcon = document.querySelector("#sidebar-toggle>img");
const selectedContainerDiv = document.querySelector("#selected-container");
const gridContainer = document.querySelector(".home-sub-container > div");

let isSidebarOpen = false;

function displayRecommendedBooks() {
  const recommendedBooksContainer =
    document.getElementById("recommended-books");

  recommendedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card group perspective";

    // Generate star rating HTML
    const totalStars = 5;
    const filledStars = Math.round(book.final_rating);
    const emptyStars = totalStars - filledStars;
    const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(
        filledStars
      )}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(
        emptyStars
      )}
    `;

    const truncatedNote =
    book.note.length > 250 ? `${book.note.substring(0, 150)}...` : book.note;

  bookCard.innerHTML = `
    <div class="inner-card transform-style">
      <div class="front-card">
          <img src="${book.cover_url}" alt="${book.title}" />
      
      </div>
      <div class="back-card">
        <div class="book-rating">
          ${starRating} <span>(${book.views})</span>
        </div>
        <p class="book-author">-${book.author}</p>
        <p class="book-isbn">${book.isbn}</p>
        <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">..read more</a></p>
        
      </div>
    </div>
  `;

    recommendedBooksContainer.appendChild(bookCard);
  });
}

function displayPopularBooks() {
  const popularBooksContainer = document.getElementById("popular-books");

  popularBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card group perspective";

    // Generate star rating HTML
    const totalStars = 5;
    const filledStars = Math.round(book.final_rating);
    const emptyStars = totalStars - filledStars;
    const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(
        filledStars
      )}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(
        emptyStars
      )}
    `;
    const truncatedNote =
      book.note.length > 250 ? `${book.note.substring(0, 150)}...` : book.note;

    bookCard.innerHTML = `
      <div class="inner-card transform-style">
        <div class="front-card">
            <img src="${book.cover_url}" alt="${book.title}" />
        
        </div>
        <div class="back-card">
          <div class="book-rating">
            ${starRating} <span>(${book.views})</span>
          </div>
          <p class="book-author">-${book.author}</p>
          <p class="book-isbn">${book.isbn}</p>
          <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">..read more</a></p>
          
        </div>
      </div>
    `;
    popularBooksContainer.appendChild(bookCard);
  });
}

function displayLatestBooks() {
  const latestBooksContainer = document.getElementById("latest-books");

  recentBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card group perspective";
    // Generate star rating HTML
    const totalStars = 5;
    const filledStars = Math.round(book.final_rating);
    const emptyStars = totalStars - filledStars;
    const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(
        filledStars
      )}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(
        emptyStars
      )}
    `;

    const truncatedNote =
      book.note.length > 250 ? `${book.note.substring(0, 150)}...` : book.note;

    bookCard.innerHTML = `
      <div class="inner-card transform-style">
        <div class="front-card">
            <img src="${book.cover_url}" alt="${book.title}" />
        
        </div>
        <div class="back-card">
          <div class="book-rating">
            ${starRating} <span>(${book.views})</span>
          </div>
          <p class="book-author">-${book.author}</p>
          <p class="book-isbn">${book.isbn}</p>
          <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">..read more</a></p>
          
        </div>
      </div>
    `;
    latestBooksContainer.appendChild(bookCard);
  });
}

function displayLikedBooks() {
  const likedBooksContainer = document.getElementById("liked-books");

  likedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card group perspective";
    // Generate star rating HTML
    const totalStars = 5;
    const filledStars = Math.round(book.final_rating);
    const emptyStars = totalStars - filledStars;
    const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(
        filledStars
      )}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(
        emptyStars
      )}
    `;

    // Truncate book.note to 100 characters
    const truncatedNote =
      book.note.length > 250 ? `${book.note.substring(0, 150)}...` : book.note;

    bookCard.innerHTML = `
      <div class="inner-card transform-style">
        <div class="front-card">
            <img src="${book.cover_url}" alt="${book.title}" />
        
        </div>
        <div class="back-card">
          <div class="book-rating">
            ${starRating} <span>(${book.views})</span>
          </div>
          <p class="book-author">-${book.author}</p>
          <p class="book-isbn">${book.isbn}</p>
          <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">..read more</a></p>
          
        </div>
      </div>
    `;
    likedBooksContainer.appendChild(bookCard);
  });
}

displayLatestBooks();
displayLikedBooks();
displayPopularBooks();
displayRecommendedBooks();

async function handleSelection(category, value, element) {
  const defaultContainers = document.querySelectorAll(".default-container");
  const selectedContainer = document.querySelector(".selected-container");

  if (category === "sortBy") {
    sortBy = value;
  } else if (category === "bookByGenre") {
    bookByGenre = value;
    recommendation = "";
  } else if (category === "recommendation") {
    if (value == "Artist of the Month") {
      recommendation = "artist";
    } else if (value == "Book of the Year") {
      recommendation = "year";
    } else if (value == "Top Genre") {
      recommendation = "genre";
    } else if (value == "Trending") {
      recommendation = "trending";
    }
    bookByGenre = "";
  }

  document
    .querySelectorAll(
      `.sidebar-section[data-category="${category}"] .sidebar-item`
    )
    .forEach((item) => {
      item.classList.remove("active");
    });

  if (category == "recommendation") {
    document
      .querySelectorAll(
        `.sidebar-section[data-category="bookByGenre"] .sidebar-item`
      )
      .forEach((item) => {
        item.classList.remove("active");
      });
  }
  if (category == "bookByGenre") {
    document
      .querySelectorAll(
        `.sidebar-section[data-category="recommendation"] .sidebar-item`
      )
      .forEach((item) => {
        item.classList.remove("active");
      });
  }

  element.classList.add("active");

  if (
    sortBy ||
    bookByGenre ||
    (recommendation && !(recommendation && bookByGenre))
  ) {
    defaultContainers.forEach(
      (container) => (container.style.display = "none")
    );
    selectedContainer.style.display = "grid";
    selectedContainerDiv.style.display = "grid";
    getBooks(1, limit);
  } else {
    defaultContainers.forEach(
      (container) => (container.style.display = "grid")
    );
    selectedContainer.style.display = "none";
  }
}

document.querySelectorAll(".sidebar-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    const category = item
      .closest(".sidebar-section")
      .getAttribute("data-category");
    const value = item.textContent.trim();
    console.log(category, value, item);
    handleSelection(category, value, item);
  });
});

document.getElementById("clearFilter").addEventListener("click", () => {
  sortBy = "";
  bookByGenre = "";
  recommendation = "";
  const defaultContainers = document.querySelectorAll(".default-container");
  const selectedContainer = document.querySelector(".selected-container");
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
  defaultContainers.forEach((container) => (container.style.display = "block"));
  selectedContainer.style.display = "none";
});

async function displaySelectedBooks(bookList) {
  if (bookList.length > 0) {
    const selectedBooksContainer =
      document.getElementById("selected-container");
    selectedBooksContainer.innerHTML = "";
    bookList.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card group perspective";
      // Generate star rating HTML
      const totalStars = 5;
      const filledStars = Math.round(book.final_rating);
      const emptyStars = totalStars - filledStars;
      const starRating = `
      ${'<img src="/icons/ratingStarFilledIcon.png" alt="Filled Star" class="star" />'.repeat(
        filledStars
      )}
      ${'<img src="/icons/ratingStarIcon.svg" alt="Empty Star" class="star" />'.repeat(
        emptyStars
      )}
    `;

    const truncatedNote =
    book.note.length > 250 ? `${book.note.substring(0, 150)}...` : book.note;

  bookCard.innerHTML = `
    <div class="inner-card transform-style">
      <div class="front-card">
          <img src="${book.cover_url}" alt="${book.title}" />
      
      </div>
      <div class="back-card">
        <div class="book-rating">
          ${starRating} <span>(${book.views})</span>
        </div>
        <p class="book-author">-${book.author}</p>
        <p class="book-isbn">${book.isbn}</p>
        <p class="book-description">${truncatedNote}<a class="read-more" href="/review/${book.slug}">..read more</a></p>
        
      </div>
    </div>
  `;
      selectedBooksContainer.appendChild(bookCard);
    });
  } else {
    const selectedBooksContainer =
      document.getElementById("selected-container");
    selectedBooksContainer.innerHTML = "<h3>No books found</h3>";
  }
}

async function getBooks(page, limit) {
  console.log(sortBy, bookByGenre, recommendation);
  console.log(page, limit);
  try {
    const response = await axios.get("/api/review/filter", {
      params: {
        sortBy: sortBy,
        bookByGenre: bookByGenre,
        recommendation: recommendation,
        page: page,
        limit: limit,
      },
    });
    console.log(response.data);
    totalPages = response.data.totalPages;
    currentPage = response.data.page;
    updatePagination(currentPage, totalPages);
    displaySelectedBooks(response.data.data);
  } catch (error) {
    const selectedBooksContainer =
      document.getElementById("selected-container");
    selectedBooksContainer.innerHTML = "<h3>No books found</h3>";
  }
}

function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("page-numbers");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  paginationContainer.innerHTML = "";

  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);
  console.log("currentPage", currentPage);
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement("button");
    pageNumber.textContent = i;
    pageNumber.className = `Page${i}`;
    pageNumber.onclick = () => {
      currentPage = i;
      getBooks(currentPage, limit);
      updatePagination(currentPage, totalPages);
    };
    paginationContainer.appendChild(pageNumber);
  }

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  prevBtn.enabled = currentPage > 1;
  nextBtn.enabled = currentPage < totalPages;
  prevBtn.style.display = currentPage > 1 ? "block" : "none";
  nextBtn.style.display = currentPage < totalPages ? "block" : "none";
  prevBtn.onclick = () => {
    console.log("prev clicked", currentPage, visiblePages);
    if (currentPage > 1) {
      currentPage = Math.max(1, currentPage - visiblePages);
      console.log("prev clicked", currentPage, visiblePages);
      getBooks(currentPage, limit);
      updatePagination(currentPage, totalPages);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage = Math.min(totalPages, currentPage + visiblePages);
      getBooks(currentPage, limit);
      updatePagination(currentPage, totalPages);
    }
  };

  document.querySelector(`.Page${currentPage}`).classList.add("activePage");
}

function toggleNav() {
  console.log(selectedContainerDiv);
  if (isSidebarOpen) {
    sidebar.style.width = "0";
    if (window.matchMedia("(min-width: 600px)").matches) {
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
    selectedContainerDiv.style.gridTemplateColumns = "1fr 1fr 1fr";
    }else{
    gridContainer.style.gridTemplateColumns = "1fr 1fr ";
    selectedContainerDiv.style.gridTemplateColumns = "1fr 1fr ";}
    sidebarIcon.src = "/icons/filterIcon.png";
    // toggleButton.style.display = "block";
    // home_container.style.marginLeft = "0";
  } else {
    sidebar.style.width = "40vw";if (window.matchMedia("(min-width: 600px)").matches) {
    gridContainer.style.gridTemplateColumns = "1fr 1fr";
    selectedContainerDiv.style.gridTemplateColumns = "1fr 1fr";
    }else{
    gridContainer.style.gridTemplateColumns = "1fr";
    selectedContainerDiv.style.gridTemplateColumns = "1fr";}
    sidebarIcon.src = "/icons/closefilterIcon.png";
  }
  isSidebarOpen = !isSidebarOpen;
}

toggleButton.addEventListener("click", toggleNav);

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", async (e) => {
  await axios
    .get("/api/review/search", {
      params: {
        query: e.target.value,
      },
    })
    .then((response) => {
      if (response.data.length === 0) {
        const searchContainer = document.getElementById("search-content");
        searchContainer.style.display = "none";
      } else {
        const searchContainer = document.getElementById("search-content");
        searchContainer.style.display = "block";
        searchContainer.innerHTML = "";
        response.data.forEach((book) => {
          const bookCard = document.createElement("a");
          bookCard.className = "search-card";
          bookCard.href = `/review/${book.slug}`;
          bookCard.innerHTML = `
          <h3>${book.title} <span>${book.author}</span></h3>`;
          searchContainer.appendChild(bookCard);
        });
      }
    })
    .catch((error) => {
      toastr.info("No books found");
    });
});

searchInput.addEventListener("focusout", () => {
  setTimeout(() => {
    const searchContainer = document.getElementById("search-content");
    searchContainer.style.display = "none";
  }, 500);
});

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
if (totalPages < 2) {
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
}
