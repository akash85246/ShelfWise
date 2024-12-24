let sortBy = "";
let bookByGenre = "";
let recommendation = "";
let currentPage = 1;
let totalPages = 100;
const limit = 8;
const visiblePages = 5;

function displayRecommendedBooks() {
  const recommendedBooksContainer =
    document.getElementById("recommended-books");

  recommendedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card group perspective";

    bookCard.innerHTML = `
      <div class="inner-card transform-style">
        <div class="front-card">
          <a href="/review/${book.slug}">
            <img src="${book.cover_url}" alt="${book.title}" />
          </a>
        </div>
        <div class="back-card">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <a href="/review/${book.slug}">read more</a>
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
    bookCard.innerHTML = `
     <div class="inner-card transform-style">
     <div class="front-card">
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
    </div>
    <div class="back-card">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <a href="/review/${book.slug}">read more</a>
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
    bookCard.innerHTML = `
        <div class="inner-card transform-style">
        <div class="front-card">
        <a href="/review/${book.slug}">
        <img src="${book.cover_url}" alt="${book.title}" />
        </a>
        </div>
        <div class="back-card">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <a href="/review/${book.slug}">read more</a>
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
    bookCard.innerHTML = `
      <div class="inner-card transform-style">
      <div class="front-card">
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
    </div>
    <div class="back-card">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <a href="/review/${book.slug}">read more</a>
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
    recommendation="";
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

    if(category=="recommendation"){
      document.querySelectorAll(
        `.sidebar-section[data-category="bookByGenre"] .sidebar-item`
      )
      .forEach((item) => {
        item.classList.remove("active");
      });
    }
    if(category=="bookByGenre"){
      document.querySelectorAll(
        `.sidebar-section[data-category="recommendation"] .sidebar-item`
      )
      .forEach((item) => {
        item.classList.remove("active");
      });
    }

  element.classList.add("active");

  if (sortBy || bookByGenre || recommendation && !(recommendation&&bookByGenre)) {
    defaultContainers.forEach(
      (container) => (container.style.display = "none")
    );
    selectedContainer.style.display = "grid";
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
  defaultContainers.forEach((container) => (container.style.display = "grid"));
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
      bookCard.innerHTML = `
      <div class="inner-card transform-style">
      <div class="front-card">
    <a href="/review/${book.slug}">
      <img src="${book.cover_url}" alt="${book.title}" />
      </a>
    </div>
    <div class="back-card">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <a href="/review/${book.slug}">read more</a>
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
}

function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("page-numbers");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  paginationContainer.innerHTML = "";

  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);
console.log("currentPage",currentPage);
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
    console.log("prev clicked",currentPage,visiblePages,);
    if (currentPage > 1) {
      currentPage = Math.max(1, currentPage - visiblePages);
      console.log("prev clicked",currentPage,visiblePages,);
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

const sidebar = document.getElementById("sidebar-container");
const toggleButton = document.getElementById("sidebar-toggle");
const toggleCloseButton = document.getElementById("sidebar-close-toggle");
const home_book_container = document.querySelector(".home-book-container");
const home_container = document.getElementById("home-container");

let isSidebarOpen = false;

function toggleNav() {
  if (isSidebarOpen) {
    sidebar.style.width = "0";
    toggleButton.style.display = "block";
    // home_container.style.marginLeft = "0";
  } else {
    sidebar.style.width = "40vw";
    toggleButton.style.display = "none";
    // home_container.style.marginLeft = "40vw";
  }
  isSidebarOpen = !isSidebarOpen;
}

toggleButton.addEventListener("click", toggleNav);
toggleCloseButton.addEventListener("click", toggleNav);

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
      toastr.info("No books found");
    });
});
