const addRatingButton = document.querySelector(".add-rating-btn");
const ratingList = document.querySelector(".rating-list");

const existingRatings = window.existingRatings || [];


existingRatings.forEach(({ title, rating }) => {
  if (ratingList.children.length >= 5) {
    addRatingButton.classList.add("hidden");
    return;
  }
  ratingList.classList.remove("hidden");
  addRatingButton.classList.remove("hidden");

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("rating-container");

  const ratingItem = document.createElement("div");
  ratingItem.classList.add("rating-item");

  const ratingInput = document.createElement("input");
  ratingInput.type = "text";
  ratingInput.name = "rating_title[]";
  ratingInput.placeholder = "Rating title";
  ratingInput.required = true;
  ratingInput.classList.add("form-input");
  ratingInput.id = "rating";
  ratingInput.value = title;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.classList.add("remove-rating-btn");

  removeButton.addEventListener("click", () => {
    ratingList.removeChild(ratingContainer);
    if (ratingList.children.length < 5) {
      addRatingButton.classList.remove("hidden");
    }
  });

  ratingItem.appendChild(ratingInput);
  ratingItem.appendChild(removeButton);

  const starsDiv = document.createElement("div");
  starsDiv.classList.add("rating-stars");

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = i <= rating ? "&#9733;" : "&#9734;";
    star.classList.add("star-icon");
    star.dataset.value = i;
    starsDiv.appendChild(star);
  }

  const ratingValueInput = document.createElement("input");
  ratingValueInput.type = "hidden";
  ratingValueInput.name = "rating_value[]";
  ratingValueInput.classList.add("rating-value");
  ratingValueInput.value = rating;

  ratingContainer.appendChild(ratingItem);
  ratingContainer.appendChild(starsDiv);
  ratingContainer.appendChild(ratingValueInput);
  ratingList.appendChild(ratingContainer);

  if (ratingList.children.length >= 5) {
    addRatingButton.classList.add("hidden");
  }
});

addRatingButton.addEventListener("click", () => {
  ratingList.classList.remove("hidden");

  if (ratingList.children.length >= 5) {
    alert("You can only add up to 5 ratings.");
    addRatingButton.classList.add("hidden");
    return;
  }

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("rating-container");

  const ratingItem = document.createElement("div");
  ratingItem.classList.add("rating-item");

  const ratingInput = document.createElement("input");
  ratingInput.type = "text";
  ratingInput.name = "rating_title[]";
  ratingInput.placeholder = "Rating title";
  ratingInput.required = true;
  ratingInput.classList.add("form-input");
  ratingInput.id = "rating";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.classList.add("remove-rating-btn");

  removeButton.addEventListener("click", () => {
    ratingList.removeChild(ratingContainer);
    if (ratingList.children.length < 5) {
      addRatingButton.classList.remove("hidden");
    }
  });

  ratingItem.appendChild(ratingInput);
  ratingItem.appendChild(removeButton);

  const starsDiv = document.createElement("div");
  starsDiv.classList.add("rating-stars");

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "&#9734;"; // ☆
    star.classList.add("star-icon");
    star.dataset.value = i;
    starsDiv.appendChild(star);
  }

  const ratingValueInput = document.createElement("input");
  ratingValueInput.type = "hidden";
  ratingValueInput.name = "rating_value[]";
  ratingValueInput.classList.add("rating-value");

  ratingContainer.appendChild(ratingItem);
  ratingContainer.appendChild(starsDiv);
  ratingContainer.appendChild(ratingValueInput);
  ratingList.appendChild(ratingContainer);

  if (ratingList.children.length >= 5) {
    addRatingButton.classList.add("hidden");
  }
});

// Star click handler using Unicode stars
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("star-icon")) {
    const clickedStar = e.target;
    const starsContainer = clickedStar.parentElement;
    const ratingContainer = starsContainer.closest(".rating-container");
    const stars = Array.from(starsContainer.querySelectorAll(".star-icon"));
    const value = parseInt(clickedStar.dataset.value);

    stars.forEach((star, i) => {
      star.innerHTML = i < value ? "&#9733;" : "&#9734;"; // ★ or ☆
    });

    const hiddenInput = ratingContainer.querySelector("input.rating-value");
    if (hiddenInput) {
      hiddenInput.value = value;
    }
  }
});

const titleInput = document.getElementById("title");
const suggestionList = document.getElementById("book-suggestions");

titleInput.addEventListener("input", async () => {
  const titleValue = titleInput.value.trim();

  if (!titleValue) {
    suggestionList.innerHTML = "";
    suggestionList.classList.add("hidden");
    return;
  }

  try {
    const response = await axios.get(`/api/book-cover?title=${titleValue}`);
    const books = response.data;

    if (books.length === 0) {
      suggestionList.innerHTML = "";
      suggestionList.classList.add("hidden");
      toastr.info("No books found");
      return;
    }

    suggestionList.innerHTML = "";
    books.forEach((book) => {
      const listItem = document.createElement("li");
      listItem.classList.add("suggestion-item");
      listItem.innerHTML = `<strong>${book.title}</strong> by ${
        book.author || "Unknown"
      }`;
      listItem.addEventListener("click", () => selectBook(book));
      suggestionList.appendChild(listItem);
    });
    suggestionList.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching book suggestions:", error);
    toastr.error("Unable to fetch book suggestions");
    suggestionList.innerHTML = "";
    suggestionList.classList.add("hidden");
  }
});

titleInput.addEventListener("focusout", () => {
  setTimeout(() => {
    suggestionList.classList.add("hidden");
  }, 1000);
});

function selectBook(book) {
  suggestionList.classList.add("hidden");
  const bookCover = document.getElementById("book-cover");
  const author = document.getElementById("author");
  const genre = document.getElementById("genre");
  const isbn = document.getElementById("isbn");
  const reviewPublisher = document.getElementById("reviewPublisher");
  const reviewPublishYear = document.getElementById("reviewPublishYear");

  bookCover.src = book.coverUrl || "/images/image 42.png";
  bookCover.alt = `Book Cover for ${book.title}`;
  author.value = book.author || "Unknown";
  genre.value = book.genres || "Not available";
  reviewPublisher.value = book.publishers || "Not available";
  reviewPublishYear.value = book.publishYear || "Unknown";
  isbn.value = book.isbn || "";

  titleInput.value = book.title;
}
