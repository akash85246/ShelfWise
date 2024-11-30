function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return new Date(date).toLocaleDateString("en-US", options);
}

const startDateElement = document.getElementById("startDateDisplay");
const endDateElement = document.getElementById("endDateDisplay");

const startDateFull = startDateElement.getAttribute("data-full-date");
const endDateFull = endDateElement.getAttribute("data-full-date");

startDateElement.querySelector("#formattedStartDate").textContent =
  formatDate(startDateFull);
endDateElement.querySelector("#formattedEndDate").textContent =
  formatDate(endDateFull);

  
// Ratings data
const ratings = {
  setting_rating: review.setting_rating,
  plot_rating: review.plot_rating,
  character_rating: review.character_rating,
  style_rating: review.style_rating,
  engagement_rating: review.engagement_rating,
  final_rating: review.final_rating,
};

function getStars(rating) {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push("/icons/ratingStarFilledIcon.png");
    } else {
      stars.push("/icons/ratingStarIcon.svg");
    }
  }
  return stars;
}

// Function to update the stars for a specific rating section
function updateStars(ratingSectionId, rating) {
  const starsContainer = document.querySelector(
    `#${ratingSectionId} .rating-stars`
  );
  const stars = getStars(rating);
  starsContainer.innerHTML = ""; // Clear previous stars
  stars.forEach((starSrc) => {
    const img = document.createElement("img");
    img.src = starSrc;
    img.alt = "Star of 5 - Rating";
    img.classList.add("star-icon");
    starsContainer.appendChild(img);
  });
}

// Update all rating sections based on the ratings object
updateStars("setting-rating", ratings.setting_rating);
updateStars("plot-rating", ratings.plot_rating);
updateStars("character-rating", ratings.character_rating);
updateStars("style-rating", ratings.style_rating);
updateStars("engagement-rating", ratings.engagement_rating);
updateStars("final-rating", ratings.final_rating);
