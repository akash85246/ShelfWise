const searchInput = document.getElementById("search-input");
const resultList = document.getElementById("result-list");
let currentPage = 1;

searchInput.addEventListener("input", async function () {
  const query = searchInput.value.trim();
  if (query.length < 3) {
    return;
  }

  try {
    const response = await fetch(
      `/api/search?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const results = await response.json();
    resultList.innerHTML = "";
    resultList.classList.remove("hidden");

    if (results.length === 0) {
      resultList.classList.add("hidden");
      return;
    }
    results.forEach((book) => {
      const listItem = document.createElement("li");
      listItem.className = "result-item";
      listItem.innerHTML = `
        
        <a href="/review/${book.slug}" class="result-details">
          <h3 class="result-title">${book.title}</h3>
          <p class="result-author">${book.author}</p>
        </a>
      `;
      resultList.appendChild(listItem);
    });

    if (results.length === 0) {
      const noResultsItem = document.createElement("li");
      noResultsItem.className = "result-item no-results";
      noResultsItem.textContent = "No results found";
      resultList.appendChild(noResultsItem);
    }
   
    console.log(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    resultList.classList.add("hidden");
  }, 150);
});

// get recent review feed
const recentButton = document.getElementById("recent-button");
const reviewFeed = document.getElementById("recent-reviews");

function renderFeed(books) {
  const container = reviewFeed;
  container.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("li");
    card.className = "review-card";
    card.innerHTML = `
       <div class="review-content">
      <p class="review-author">Review by <a href="/profile/${book.reviewer_slug}" class="reviewe-link"> ${book.reviewer_name} </a> </p>
      <p class="review-title"><a href="/review/${book.slug}" class="reviewe-link">  ${book.title} </a></p>
      <p class="review-description">
        ${
          book.review?.length > 250
            ? book.review.slice(0, 250) + "..."
            : book.review || "No reviews available"
        }
      </p>
    </div>
    <div class="review-image-container">
    <img
      class="review-image"
      src="${book.cover_url}"
      alt="Book Cover"
    />
    </div>
      `;
    container.appendChild(card);
  });
}

async function loadFeed() {

  const page_size = 6;
  

  const paramData = {
    sortBy: "created_at",
    page_size,
    page: currentPage,
  };

  try {
    const res = await axios.get("/api/search", { params: paramData });
    const data = res.data;

    if (data.length === 0) {
      recentButton.classList.add("hidden");
      return;
    }

    renderFeed(data);
    currentPage++;
  } catch (error) {
    console.error("Error loading feed:", error);
  }
}

recentButton.addEventListener("click", async () => {
  
  await loadFeed();
  const recentSection = document.getElementById("recent-reviews");
  if (recentSection) {
    recentSection.scrollIntoView({ behavior: "smooth" });
  }
});

loadFeed()