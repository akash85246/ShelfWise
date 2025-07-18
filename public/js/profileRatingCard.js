document.querySelectorAll(".rating").forEach((ratingEl) => {
  const reviewerId = ratingEl.dataset.reviewerId;
  let currentRating = parseInt(ratingEl.dataset.initialRating);

  const stars = ratingEl.querySelectorAll(".star");

  function updateStars(value) {
    stars.forEach((star, i) => {
      star.innerHTML = i < value ? "&#9733;" : "&#9734;";
    });
  }


  updateStars(currentRating);

  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => updateStars(index + 1));
    star.addEventListener("mouseleave", () => updateStars(currentRating));

    star.addEventListener("click", async () => {
      currentRating = index + 1;
      updateStars(currentRating);

      try {
        const res = await axios.patch("/api/update-rating", {
          rated_user_id: reviewerId,
          rating: currentRating,
        });

        const result = res.data;
        if (!result || result.error) {
          throw new Error(result?.message || "Failed to rate");
        }
        Toastify({
          text: "Rating submitted successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
      } catch (err) {
        Toastify({
          text: `Error submitting rating. Try again later.`,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#f44336",
        }).showToast();
      }
    });
  });
});