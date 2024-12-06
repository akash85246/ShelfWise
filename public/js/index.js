let sortBy = "";
let bookByGenre = "";
let recommendation = "";
let currentPage = 1;
let totalPages = 100;
const limit = 6;
const visiblePages = 5;

function displayRecommendedBooks() {
  const recommendedBooksContainer =
    document.getElementById("recommended-books");

  recommendedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    bookCard.innerHTML = `
      <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;
    recommendedBooksContainer.appendChild(bookCard);
  });
}

function displayPopularBooks() {
  const popularBooksContainer = document.getElementById("popular-books");

  popularBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;
    popularBooksContainer.appendChild(bookCard);
  });
}

function displayLatestBooks() {
  const latestBooksContainer = document.getElementById("latest-books");

  recentBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
        <a href="/review/${book.slug}">
        <img src="${book.cover_url}" alt="${book.title}" />
        </a>
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        `;
    latestBooksContainer.appendChild(bookCard);
  });
}

function displayLikedBooks() {
  const likedBooksContainer = document.getElementById("liked-books");

  likedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
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
  } else if (category === "recommendation") {
    recommendation = value;
  }

  document
    .querySelectorAll(
      `.sidebar-section[data-category="${category}"] .sidebar-item`
    )
    .forEach((item) => {
      item.classList.remove("active");
    });

  element.classList.add("active");

  if (sortBy || bookByGenre || recommendation) {
    defaultContainers.forEach(
      (container) => (container.style.display = "none")
    );
    selectedContainer.style.display = "grid";
    getBooks(1, 6);
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
    handleSelection(category, value, item);
  });
});

async function displaySelectedBooks(bookList) {
  if (bookList.length > 0) {
    const selectedBooksContainer =
      document.getElementById("selected-container");
    selectedBooksContainer.innerHTML = "";
    bookList.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
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
  const response = await axios.get("/api/review/filter", {
    params: {
      sortBy: sortBy,
      bookByGenre: bookByGenre,
      recommendation: recommendation,
      page: page,
      limit: limit,
    },
  });

  totalPages = 10;
  updatePagination(currentPage, totalPages);
  displaySelectedBooks(response.data.data);
}

function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("page-numbers");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  paginationContainer.innerHTML = "";

  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement("button");
    pageNumber.textContent = i;
    pageNumber.className = i === currentPage ? "active" : "";
    pageNumber.onclick = () => {
      currentPage = i;
      getBooks(currentPage, limit);
      updatePagination(currentPage, totalPages);
    };
    paginationContainer.appendChild(pageNumber);
  }

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage = Math.max(1, currentPage - visiblePages);
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
}

const sidebar = document.getElementById("sidebar-container");
const toggleButton = document.getElementById("sidebar-toggle");
const home_book_container = document.querySelector(".home-book-container");
toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  toggleButton.classList.toggle("hidden");
});

const close_sidebar = document.getElementById("close-sidebar-toggle");
close_sidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  toggleButton.classList.toggle("hidden");
});

const checkScreenSize = () => {
  if (window.innerWidth <= 1234) {
    sidebar.classList.add("hidden");
  } else {
    sidebar.classList.remove("hidden");
  }
};

checkScreenSize();

window.addEventListener("resize", checkScreenSize);

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", async (e) => {
  await axios
    .get("/api/review/search", {
      params: {
        query: e.target.value,
      },
    })
    .then((response) => {
      const searchContainer = document.getElementById("search-content");
      searchContainer.style.display = "block";
      searchContainer.innerHTML = "";
      response.data.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "search-card";
        bookCard.innerHTML = `
    <a href="/review/${book.slug}">
      <h3>${book.title} <span>${book.author}</span></h3>
     
      </a>
      
    `;
        searchContainer.appendChild(bookCard);
      });
    })
    .catch((error) => {
      toastr.info('No books found');
    });
});
