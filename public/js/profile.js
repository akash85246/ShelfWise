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


    async function loadMoreBooks() {
    if (loading || !hasMore) return;

    const userIdInput = document.getElementById("user-id");
    const userId = userIdInput ? userIdInput.value : null;
    const authorIdInput = document.getElementById("author-id");
    const author_id = authorIdInput ? authorIdInput.value : null;


    const paramData = {
      page: currentPage,
      page_size: 12,
      ...(userId && { user_id: userId }),
      ...(author_id && { author_id: author_id }),
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
    const container = document.getElementById("review-grid");
    // container.innerHTML = "";
    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "review-item";
      card.innerHTML = `
      <div class="review-img" style="background-image: url('${book.cover_url}');"></div>
      <a href="/review/${book.slug.trim()}" class="review-link">
          <p class="review-title">${book.title}</p>
          <p class="review-meta">${book.author}</p>
      </a>

      `;
      container.appendChild(card);
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

