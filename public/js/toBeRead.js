if (user && user.author === true) {
  const form = document.querySelector(".list-create");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!title) {
      alert("Book Title is required.");
      return;
    }

    if (!author) {
      alert("Book Author is required.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/read-later/create",
        {
          type,
          title,
          author,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toastr.success("Read later book created successfully");
        window.location.href = "/read-later";
      } else {
        const errorData = await response.json();
        toastr.warning(errorData.message);
      }
    } catch (error) {
      toastr.error("An error occurred, please try again");
    }
  });
}
const standaloneList = document.querySelector(".standalone-list");
const seriesList = document.querySelector(".series-list");

function displayStandaloneBooks(standaloneBooks) {
  const standaloneList = document.querySelector(".standalone-list");
  standaloneList.innerHTML = standaloneBooks
    .map((book) => {
      return `
       <li class="list-group-item">
       <input type="checkbox" id="${book.id}" name="standalone" value="${book.id}" class="delete-checkbox">
          <h3>${book.title} <span>-${book.author}</span></h3>
        </li>
      `;
    })
    .join("");
  const checkboxes = document.querySelectorAll(".delete-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const id = event.target.value; // Get the book ID from the checkbox value
      deleteItem(id);
    });
  });
}

function displaySeriesBooks(seriesBooks) {
  const seriesList = document.querySelector(".series-list");
  seriesList.innerHTML = seriesBooks
    .map((book) => {
      return `
         <li class="list-group-item">
      <input type="checkbox" id="${book.id}" name="standalone" value="${book.id}" class="delete-checkbox">
          <h3>${book.title} <span>-${book.author}</span></h3>
        </li>
      `;
    })

    .join("");

  const checkboxes = document.querySelectorAll(".delete-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const id = event.target.value;
      deleteItem(id);
    });
  });
}

async function deleteItem(id) {
  console.log("deleteItem", id);
  try {
    const res = await axios.delete("/api/read-later/delete/" + id);
    if (res.status === 200) {
      toastr.warning("Item deleted successfully");
      window.location.href = "/read-later";
    } else {
      toastr.warning("Failed to delete the item. Please try again.");
    }
  } catch (error) {
    toastr.error("An error occurred, please try again");
  }
}

displaySeriesBooks(seriesBooks);
displayStandaloneBooks(standaloneBooks);



const titleInput = document.getElementById("title");
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
  const authorInput = document.getElementById("author");
  authorInput.value = book.author || "Unknown";
  titleInput.value = book.title;
}

