function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const startDate = new Date(review.start_date);
const endDate = new Date(review.end_date);
document.getElementById("startDateDisplay").textContent = formatDate(startDate);
document.getElementById("endDateDisplay").textContent = formatDate(endDate);

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

// Ratings data with defaults
const ratings = {
  setting_rating: review.setting_rating || 0,
  plot_rating: review.plot_rating || 0,
  character_rating: review.character_rating || 0,
  style_rating: review.style_rating || 0,
  engagement_rating: review.engagement_rating || 0,
  final_rating: review.final_rating || 0,
};

// Function to generate star elements dynamically
function renderStars(sectionId, rating) {
  const section = document.getElementById(sectionId);
  const starsContainer = section.querySelector(".rating-stars");

  const starIconFilled = "/icons/ratingStarFilledIcon.png";
  const starIconEmpty = "/icons/ratingStarIcon.svg";

  // Clear previous stars
  starsContainer.innerHTML = "";

  // Add stars dynamically based on the rating
  for (let i = 1; i <= 5; i++) {
    const img = document.createElement("img");
    img.src = i <= rating ? starIconFilled : starIconEmpty;
    img.alt = `Star ${i} of 5 - Rating ${i <= rating ? "Active" : "Inactive"}`;
    img.classList.add("star-icon");
    img.dataset.value = i; // Add a value for interaction
    starsContainer.appendChild(img);
  }

  // Update dataset for the section
  section.dataset.rating = rating;
}

// Function to calculate and update the final rating
function updateFinalRating() {
  const allRatings = Array.from(document.querySelectorAll(".rating-section"))
    .filter((section) => !section.classList.contains("final-rating"))
    .map((section) => parseInt(section.dataset.rating || 0, 10));

  const finalRating = Math.ceil(
    allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length);
  const finalRatingSection = document.querySelector(".final-rating");
  if (finalRatingSection) {
    renderStars(finalRatingSection.id, Math.round(finalRating));
  }
}

document.querySelectorAll(".rating-section").forEach((section) => {
  const rating = parseInt(section.dataset.rating || 0, 10);
  const sectionId = section.id;
  const initialRating = ratings[`${sectionId.replace("-", "_")}`];
  renderStars(sectionId, initialRating || rating);

  
  if (!section.classList.contains("final-rating")) {
    const stars = section.querySelector(".rating-stars");
    stars.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        const newRating = parseInt(e.target.dataset.value, 10);
        renderStars(sectionId, newRating);
        updateFinalRating();
      }
    });
  }
});

const deleteButton = document.getElementById("delete-button");
const saveButton = document.getElementById("save-button");
const loader = document.getElementById("loader");

saveButton.addEventListener("click", async () => {
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
  const quote = document.getElementById("review-quote").value;
  const moment = document.getElementById("review-moment").value;
  const favorite_character = document.getElementById(
    "favourite-character"
  ).value;
  const least_favorite_character = document.getElementById(
    "least-favourite-character"
  ).value;
  const ending = document.getElementById("ending").value;
  const start_date = document.getElementById("startDate").value;
  const end_date = document.getElementById("endDate").value;
  const genre = document.getElementById("genre").value;
  const format = document.getElementById("format").value;
  const moment_page_number =
    document.getElementById("moment-page-number").value;

    saveButton.style.display = "none";
    loader.style.display = "block";
    deleteButton.style.display = "none";
  try {
    const response = await axios.patch(`/api/update-review/${review.slug}`, {
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
    toastr.success('review updated successfully');
    window.location.href = `/review/${response.data.slug}`;
  } catch (error) {
    saveButton.style.display = "block";
    loader.style.display = "none";
    deleteButton.style.display = "block";
    toastr.error('An error occurred, please try again');
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




document.getElementById("delete-button").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent the default anchor behavior
  const slug = e.target.closest('a').getAttribute("data-slug");
  deleteButton.style.display = "none";
  loader.style.display = "block";
  saveButton.style.display = "none";
  try {
    const response = await fetch(`/api/delete-review/${slug}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toastr.warning('Review deleted successfully');
      window.location.href = "/";
    } else {
      deleteButton.style.display = "block";
      loader.style.display = "none";
      saveButton.style.display = "block";
      toastr.warning('Failed to delete review');
    }
  } catch (error) {
    deleteButton.style.display = "block";
      loader.style.display = "none";
      saveButton.style.display = "block";
    toastr.error('An error occurred, please try again');
  }
});