function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const today = new Date();
document.getElementById("startDateDisplay").textContent = formatDate(today);
document.getElementById("endDateDisplay").textContent = formatDate(today);

document.getElementById("startDateDisplay").addEventListener("click", () => {
  const startDateInput = document.getElementById("startDate");
  document.getElementById("startDateDisplay").style.display = "none";
  startDateInput.hidden = false;
  startDateInput.focus();
});

document.getElementById("endDateDisplay").addEventListener("click", () => {
  const endDateInput = document.getElementById("endDate");
  document.getElementById("endDateDisplay").style.display = "none";
  endDateInput.hidden = false;
  endDateInput.focus();
});

document.getElementById("startDate").addEventListener("change", function () {
  const formattedDate = formatDate(this.value);
  document.getElementById("startDateDisplay").textContent = formattedDate;
  document.getElementById("startDateDisplay").style.display = "block";
  this.hidden = true;
});

document.getElementById("endDate").addEventListener("change", function () {
  const formattedDate = formatDate(this.value);
  document.getElementById("endDateDisplay").textContent = formattedDate;
  document.getElementById("endDateDisplay").style.display = "block";
  this.hidden = true;
});

const textarea = document.querySelector(".review-note > textarea ");

function adjustRows() {
  if (window.innerWidth <= 435) {
    textarea.setAttribute("rows", "25");
  } else if (window.innerWidth <= 768) {
    textarea.setAttribute("rows", "25");
  } else if (window.innerWidth <= 1037) {
    textarea.setAttribute("rows", "18");
  } else {
    textarea.setAttribute("rows", "24");
  }
}

window.addEventListener("resize", adjustRows);

adjustRows();

const ratingSections = document.querySelectorAll(".rating-section");

ratingSections.forEach((section) => {
  const stars = section.querySelectorAll(".star-icon");
  const isFinalRating = section.classList.contains("final-rating");

  if (isFinalRating) return;

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      updateStars(section, index + 1);
      updateFinalRating();
    });
  });
});

// Update stars for a section based on the rating
function updateStars(section, rating) {
  const stars = section.querySelectorAll(".star-icon");
  const starIconActive = "/icons/ratingStarFilledIcon.png";
  const starIconInactive = "/icons/ratingStarIcon.svg";
  stars.forEach((star, index) => {
    if (index < rating) {
      star.src = starIconActive;
    } else {
      star.src = starIconInactive;
    }

    star.alt = `Star ${index + 1} of 5 - Rating ${
      index < rating ? "Active" : "Inactive"
    }`;
  });

  section.dataset.rating = rating;
}

// Calculate and update the final rating
function updateFinalRating() {
  const allRatings = Array.from(document.querySelectorAll(".rating-section"))
    .filter((section) => !section.classList.contains("final-rating"))
    .map((section) => parseInt(section.dataset.rating || 0, 10));

  const finalRating =
    allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
  const finalRatingSection = document.querySelector(".final-rating");

  if (finalRatingSection) {
    updateStars(finalRatingSection, Math.round(finalRating));
  }
}

const postButton = document.getElementById("post-button");

postButton.addEventListener("click", async () => {
  const title = document.getElementById("review-title").value;
  const author = document.getElementById("review-author").value;
  const setting_rating =
    document.getElementById("setting-rating").dataset.rating;
  const plot_rating = document.getElementById("plot-rating").dataset.rating;
  const character_rating =
    document.getElementById("character-rating").dataset.rating;
  const style_rating = document.getElementById("style-rating").dataset.rating;
  const engagement_rating =
    document.getElementById("engagement-rating").dataset.rating;
  const note = document.getElementById("review-notes").value;
  const quote = document.getElementById("review-quote").value || null;
  const moment = document.getElementById("review-moment").value || null;
  const favorite_character = document.getElementById(
    "favourite-character"
  ).value || null;
  const least_favorite_character = document.getElementById(
    "least-favourite-character"
  ).value || null;
  const ending = document.getElementById("ending").value || null;
  const start_date = document.getElementById("startDate").value;
  const end_date = document.getElementById("endDate").value;
  const genre = document.getElementById("genre").value;
  const format = document.getElementById("format").value || null;
  const moment_page_number =
    document.getElementById("moment-page-number").value || null;
  if(!title){
    toastr.error("Title is required");
    return;
  }
  if(!genre){
    toastr.error("genre is required");
    return;
  }
  if(!note){
    toastr.error("Note is required");
    return;
  }
  if(!start_date){
    toastr.error("Start date is required");
    return;
  }
  if(!end_date){
    toastr.error("End date is required");
    return;
  }
  if(!setting_rating && !plot_rating && !character_rating && !style_rating && !engagement_rating){
    toastr.error("Ratings are required");
    return;
  }

  try {
    const response = await axios.post("/api/create-review", {
      title,
      author,
      setting_rating,
      plot_rating,
      character_rating,
      style_rating,
      engagement_rating,
      note,
      quote,
      moment,
      favorite_character,
      least_favorite_character,
      ending,
      start_date,
      end_date,
      genre,
      format,
      moment_page_number,
    });
    toastr.success("Review book created successfully");
    window.location.href = "/review/" + response.data.slug;
  } catch (error) {
    toastr.error("An error occurred, please try again");
  }
});

const title = document.getElementById("review-title");

const titleInput = document.getElementById("review-title");
const suggestionList = document.getElementById("book-suggestions");

titleInput.addEventListener("input", async () => {
  const titleValue = titleInput.value.trim();
  // Clear suggestions if the input is empty
  if (!titleValue) {
    suggestionList.innerHTML = "";
    suggestionList.classList.add("hidden");
    return;
  }

  try {
    const response = await axios.get(`/api/book-cover?title=${titleValue}`);
    const books = response.data;

    // If no books found, hide the suggestions
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
  }, 100);
}
);

function selectBook(book) {
  suggestionList.classList.add("hidden");
  const bookCover = document.getElementById("book-cover");
  const author = document.getElementById("review-author");
  const genre = document.getElementById("genre");
  const reviewPublisher = document.getElementById("review-publisher");
  const reviewPublishYear = document.getElementById("review-publish-year");
  const isbn = document.getElementById("isbn");

  bookCover.src = book.coverUrl || "/images/image 42.png";
  bookCover.alt = `Book Cover for ${book.title}`;
  author.value = book.author || "Unknown";
  genre.value = book.genres || "Not available";
  reviewPublisher.innerHTML = book.publishers || "Not available";
  reviewPublishYear.innerHTML = book.publishYear || "Unknown";
  isbn.value = book.isbn || "Not available";
  titleInput.value = book.title;
}
