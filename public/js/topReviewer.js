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

let sortBy = "reviews_count";
let currentPage = 1;
let loading = false;
let hasMore = true;
const randomProfilePicture = [
  "sampleUser1",
  "sampleUser2",
  "sampleUser3",
  "sampleUser4",
  "sampleUser5",
  "sampleUser6",
  "sampleUser7",
];

function GenerateRandomProfilePicture() {
  const randomIndex = Math.floor(Math.random() * randomProfilePicture.length);
  return `../images/sampleTopUser/${randomProfilePicture[randomIndex]}.png`;
}

const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("reviewer-list");
const endMessage = document.getElementById("end-message");
const userIdInput = document.getElementById("user-id");

function updateReviewerCard(sortBy) {
  let reviewer = {};

  if (sortBy === "reviews_count") {
    reviewer = topReviewers.most_reviewed;
  } else if (sortBy === "highest_rated") {
    reviewer = topReviewers.highest_rated;
  } else {
    reviewer = topReviewers.most_viewed;
  }

  // Update DOM elements
  document.getElementById("reviewerName").textContent =
    reviewer.full_name || "Unnamed Reviewer";
  document.getElementById("reviewerQuote").textContent = `"${
    reviewer.quote || "A good book is a friend that never lets you down."
  }"`;
  document.getElementById("profileLink").href = `/profile/${
    reviewer.slug || "#"
  }`;
  document.getElementById("reviewer-image").src =
    GenerateRandomProfilePicture();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");

    // Set sortBy based on tab ID
    if (tab.id === "review") {
      sortBy = "reviews_count";
    } else if (tab.id === "rated") {
      sortBy = "highest_rated";
    } else {
      sortBy = "most_viewed";
    }

    // Reset state
    currentPage = 1;
    hasMore = true;
    loading = false;
    container.innerHTML = "";
    endMessage.classList.add("hidden");
    updateReviewerCard(sortBy);

    loadMoreProfile();
  });
});

async function loadMoreProfile() {
  if (loading || !hasMore) return;

  const searchTerm = searchInput.value.trim();
  const page_size = 10;
  const user_id = userIdInput ? userIdInput.value : null;

  const paramData = {
    searchTerm,
    sortBy,
    page_size,
    page: currentPage,
    user_id,
  };

  loading = true;

  try {
    const res = await axios.get("/api/search-user", { params: paramData });
    const data = res.data;

    if (data.length === 0) {
      hasMore = false;
      endMessage.classList.remove("hidden");
      return;
    }

    renderProfiles(data);
    currentPage++;
  } catch (error) {
    console.error("Error loading profiles:", error);
  } finally {
    loading = false;
  }
}

function renderProfiles(profiles) {
  profiles.forEach((profile) => {
    const card = document.createElement("li");
    card.className = "reviewer-render-card";
    card.innerHTML = `
      
        <div class="image-container">
          <img src="${
            profile.profile_picture
          }" alt="Reviewer Image" class="profile-image" />
        </div>
      <div class="reviewer-info">
        <a href="/profile/${profile.slug}" class="reviewer-render-name">${
      profile.full_name
    }</a>
         <p class="reviewer-details">
           ${
             profile.quote?.length > 30
               ? profile.quote.slice(0, 30) + "..."
               : profile.quote || "No Quote available"
           }
          </p>
         
        </div>
     
    `;
    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  hasMore = true;
  loading = false;
  container.innerHTML = "";
  endMessage.classList.add("hidden");
  loadMoreProfile();
});

updateReviewerCard(sortBy);
loadMoreProfile();

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreProfile();
  }
});
