let status_book = null;
let currentPage = 1;
let loading = false;
let hasMore = true;

const tabs = document.querySelectorAll(".tab");

const insight_published = document.getElementById("insight-published");
const review_list = document.getElementById("book-review-list");
const userId = document.getElementById("user-id").value;

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");

    const id = tab.id;

    // Extract status_book from ID
    if (id === "publish-review-button") {
      status_book = "published";
    } else if (id === "draft-review-button") {
      status_book = "draft";
    } else {
      status_book = null;
    }

    currentPage = 1;
    hasMore = true;
    loading = false;
    review_list.innerHTML = "";

    loadMoreBooks();
  });
});

async function loadMoreBooks() {
  if (loading || !hasMore) return;

  const paramData = {
    page: currentPage,
    page_size: 12,
    user_id: userId,
    author_id: userId,
    ...(status_book && { status_book }),
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

    insight_published.innerHTML = `${
  status_book === "published"
    ? "Published Review"
    : status_book === "draft"
    ? "Draft Review"
    : "Total Review"
}: ${data.length}`;

    renderBooks(data);
    currentPage++;
  } catch (error) {
    console.error("Error loading books:", error);
  } finally {
    loading = false;
  }
}

function renderBooks(books) {
  review_list.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("li");
    card.className = "review-card";
    card.innerHTML = `
  <div class="review-content">
    <a href="/review/${book.slug}" class="review-info" data-review-slug="${book.slug}">
      <p class="review-title">${book.title}</p>
      <p class="review-subtitle">By ${book.author} • ${book.publisher}</p>
      <div class="review-meta">
        <span>${new Date(book.created_at).toLocaleDateString()}</span>
        <span>• ${book.genre}</span>
        <span>• ${book.format || "Not available"}</span>
        <span>• ${book.published_year || "Not available"}</span>
      </div>
    </a>
    <a href="/edit/${book.slug}" class="edit-button">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z">
          </path>
        </svg>
      </span>
      Edit
    </a>
  </div>
  <img src="${book.cover_url}" alt="Book Cover" class="book-cover">
`;
    review_list.appendChild(card);
  });
}

loadMoreBooks();

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    !loading
  ) {
    loadMoreBooks();
  }
});
