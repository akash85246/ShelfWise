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
  
    const finalRating =
      allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
  
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
  
    // Add click event listeners to stars (except the final rating section)
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
  

  
const saveButton = document.getElementById("save-button");

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
  console.log(end_date, start_date);
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

    alert(`Server says: ${response.data.message}`);
  } catch (error) {
    console.error("Error:", error);
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
      const reviewSubject = document.getElementById("review-subject");
      const reviewPublisher = document.getElementById("review-publisher");
      const reviewPublishYear = document.getElementById("review-publish-year");
      bookCover.src = response.data.coverUrl;
      bookCover.alt = `Book Cover for ${title.value}`;
      author.value = response.data.author;
      genre.value = response.data.genres;
      reviewPublisher.innerHTML = response.data.publishers;
      reviewPublishYear.innerHTML = response.data.publishYear;
      reviewSubject.value = response.data.subjects;
    })
    .catch((error) => {
      return;
    });
});
