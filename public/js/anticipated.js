const isAuthor = user && user.author === true;

if (isAuthor) {
  document
    .getElementById("cover-photo")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const previewImage = document.getElementById("preview-image");
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
          const selectCoverPhoto = document.querySelector(".upload-box>p");
          selectCoverPhoto.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });

  const emojiInput = document.getElementById("emoji-input");
  const emojiContainer = document.getElementById("emoji-container");

  emojiInput.addEventListener("click", () => {
    emojiContainer.style.display =
      emojiContainer.style.display === "block" ? "none" : "block";
  });

  const emojis = [
    "",
    "😊",
    "😂",
    "❤️",
    "🔥",
    "👍",
    "🎉",
    "🙌",
    "✨",
    "😎",
    "😢",
  ];
  emojiContainer.innerHTML = emojis
    .map((emoji) => `<span>${emoji}</span>`)
    .join("");

  emojiContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN") {
      emojiInput.value = e.target.textContent;
      emojiContainer.style.display = "none";
    }
  });

  const createAnticipatedPopupBtn = document.querySelector(
    ".create-anticipated"
  );
  const createAnticipatedPopup = document.querySelector(
    ".anticipated-popout-container"
  );

  createAnticipatedPopupBtn.addEventListener("click", async () => {
    createAnticipatedPopup.classList.toggle("hidden");
  });

  createAnticipatedPopup.addEventListener("click", (e) => {
    if (e.target === createAnticipatedPopup) {
      createAnticipatedPopup.classList.toggle("hidden");
    }
  });

  const anticipatedSubmitBtn = document.getElementById("anticipated-submit");

  anticipatedSubmitBtn.addEventListener("click", async () => {
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const releaseDate = document.getElementById("book-releases").value;
    const emoji = document.getElementById("emoji-input").value;
    const coverPhoto = document.getElementById("cover-photo").files[0];

    if (!title || !author || !releaseDate || !coverPhoto) {
      return alert("Please fill in all fields!");
    }

    const formData = new FormData();
    formData.append("image", coverPhoto);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("releaseDate", releaseDate);
    formData.append("emoji", emoji);

    try {
      const response = await axios.post("/api/anticipated/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toastr.success("Aniticipated book created successfully");
      window.location.href = "/anticipated";
    } catch (error) {
      toastr.error("An error occurred, please try again");
    }
  });
}
const anticipatedContainer = document.querySelector(".anticipated-container");

function displayAnticipatedBooks(anticipatedBooks) {
  const anticipatedContainer = document.querySelector("#anticipated-container");

  Array.from(anticipatedContainer.children).forEach((child) => {
    if (!child.classList.contains("create-anticipated")) {
      anticipatedContainer.removeChild(child);
    }
  });

  const fragment = document.createDocumentFragment();

  anticipatedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "anticipated-card";
    bookCard.innerHTML = `
      <img src="${book.cdn_link}" alt="Book cover" class="cdn-link" />
      <div class="anticipated-card-details">
        <h3 class="anticipated-title">
          ${book.title} <span class="anticipated-author"> - ${book.author}</span>
        </h3>
        <p class="anticipated-date">${formatDate(book.release_date)}</p>
        <p class="anticipated-emoji">${book.emoji}</p>
      </div>
    `;

    fragment.appendChild(bookCard);
  });

  // Append the new books to the container
  anticipatedContainer.appendChild(fragment);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; 

  const maxVisiblePages = 5;
  const startPage = Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  // Create Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.className = "prev-btn";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchAnticipatedBooks(currentPage - 1);
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Create dynamic page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = `page-btn${i} page-btn`;
    
    pageBtn.addEventListener("click", () => {
      fetchAnticipatedBooks(i);
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Create Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.className = "next-btn";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.style.display = currentPage === totalPages ? "none" : "block";
  nextBtn.addEventListener("click", () => {
    currentPage = parseInt(currentPage);
    if (currentPage < totalPages) {
      fetchAnticipatedBooks(currentPage + 1);
    }
  });
  paginationContainer.appendChild(nextBtn);
  document.querySelector(`.page-btn${currentPage}`).classList.add("activePage");
  if(currentPage == totalPages) {
    nextBtn.style.display = "none";
  }
  if(currentPage == 1) {
    prevBtn.style.display = "none";
  }
}

// Function to fetch books dynamically for the selected page
async function fetchAnticipatedBooks(page) {
  try {
    const response = await fetch(`/api/anticipated/search?page=${page}&limit=9`);
    if (!response.ok) {
      throw new Error("Failed to fetch books.");
    }
    const data = await response.json();
    displayAnticipatedBooks(data.books);
    renderPagination(data.currentPage, data.totalPages);
  } catch (error) {
    
  }
}

// Initialize the display and pagination
document.addEventListener("DOMContentLoaded", () => {
  fetchAnticipatedBooks(currentPage); 
});