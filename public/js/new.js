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
  const SearchResult = await axios.get(`/api/book-cover?title=${title.value}`);

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
    toastr.success('Review book created successfully');
    window.location.href = "/review/" + response.data.slug;
  } catch (error) {
    toastr.error('An error occurred, please try again');
  }
});

const title = document.getElementById("review-title");

title.addEventListener("input", async () => {
  await axios
    .get(`/api/book-cover?title=${title.value}`)
    .then((response) => {
      const bookCover = document.getElementById("book-cover");
      const author = document.getElementById("review-author");
      const genre = document.getElementById("genre");
      const reviewPublisher = document.getElementById("review-publisher");
      const reviewPublishYear = document.getElementById("review-publish-year");
      const isbn = document.getElementById("isbn");
      bookCover.src = response.data.coverUrl;
      bookCover.alt = `Book Cover for ${title.value}`;
      author.value = response.data.author;
      genre.value = response.data.genres;
      reviewPublisher.innerHTML = response.data.publishers;
      reviewPublishYear.innerHTML = response.data.publishYear;
      isbn.value = response.data.isbn;
    })
    .catch((error) => {
      toastr.info('No books found');
      return;
    });
});
