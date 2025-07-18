const goToTopButton = document.querySelector(".go-to-top");

//show button after every 5 seconds
setInterval(() => {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    goToTopButton.style.display = "block";
  } else {
    goToTopButton.style.display = "none";
  }
}, 2000);

let currentPage = 1;
let loading = false;
let hasMore = true;

const genreEl = document.getElementById("genre-select");
const formatEl = document.getElementById("format-select");
const sortByEl = document.getElementById("sort-select");
const publishedYearEl = document.getElementById("published-year-select");
const searchInputEl = document.getElementById("search-input");

let genre = null;
let format = null;
let sortBy = null;
let published_year = null;
let searchInput = "";
const userId = document.getElementById("user-id").value;

async function loadMoreBooks() {
  if (loading || !hasMore) return;

  genre = genreEl.value !== "Genre" ? genreEl.value : null;
  format = formatEl.value !== "Format" ? formatEl.value : null;
  sortBy = sortByEl.value !== "Sort by" ? sortByEl.value : null;
  published_year =
    publishedYearEl.value !== "Published Year" ? publishedYearEl.value : null;
  searchInput = searchInputEl.value ? searchInputEl.value.trim() : "";

  const paramData = {
    page: currentPage,
    page_size: 12,
    ...(genre && { genre }),
    ...(format && { format }),
    ...(sortBy && { sort_by: sortBy }),
    ...(published_year && { published_year }),
    ...(searchInput && { search: searchInput }),
    ...(userId && { user_id: userId }),
  };

  loading = true;
  try {
    const res = await axios.get("/api/search", {
      params: paramData,
    });

    const data = res.data;

    if (data.length === 0) {
      hasMore = false;
      document.getElementById("end-message").classList.remove("hidden");
      return;
    }

    renderBooks(data);
    currentPage++;
  } catch (error) {
    console.error("Error loading books:", error);
  } finally {
    loading = false;
  }
}

function renderBooks(books) {
  const container = document.getElementById("books-container");
  // container.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
        <div
          class="book-cover"
          style="background-image: url('${book.cover_url}');"
        ></div>
        <a href="/review/${book.slug.trim()}" class="book-info">
            <p>${book.title}</p>
            <p>${book.author}</p>
        </a>
      `;
    container.appendChild(card);
  });
}

// Event listeners
searchInputEl.addEventListener("input", (e) => {
  searchInput = e.target.value.trim();
  currentPage = 1;
  loading = false;
  hasMore = true;
  document.getElementById("books-container").innerHTML = "";
  document.getElementById("end-message").classList.add("hidden");
  loadMoreBooks();
});

genreEl.addEventListener("change", () => {
  currentPage = 1;
  loading = false;
  hasMore = true;
  document.getElementById("books-container").innerHTML = "";
  document.getElementById("end-message").classList.add("hidden");
  loadMoreBooks();
});

formatEl.addEventListener("change", () => {
  currentPage = 1;
  loading = false;
  hasMore = true;
  document.getElementById("books-container").innerHTML = "";
  document.getElementById("end-message").classList.add("hidden");
  loadMoreBooks();
});

sortByEl.addEventListener("change", () => {
  currentPage = 1;
  loading = false;
  hasMore = true;
  document.getElementById("books-container").innerHTML = "";
  document.getElementById("end-message").classList.add("hidden");
  loadMoreBooks();
});

publishedYearEl.addEventListener("change", () => {
  currentPage = 1;
  loading = false;
  hasMore = true;
  document.getElementById("books-container").innerHTML = "";
  document.getElementById("end-message").classList.add("hidden");
  loadMoreBooks();
});

// Initial load
loadMoreBooks();

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    !loading
  ) {
    loadMoreBooks();
  }
});
