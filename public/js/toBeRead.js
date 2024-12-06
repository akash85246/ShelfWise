
document.addEventListener("DOMContentLoaded", () => {
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
      const response = await axios.post("/api/read-later/create", {
        type,
        title,
        author,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toastr.success('Read later book created successfully');
        window.location.href = "/read-later";
      } else {
        const errorData = await response.json();
        toastr.warning(errorData.message);
      }
    } catch (error) {
      toastr.error('An error occurred, please try again');
    }
  });

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
        toastr.warning('Item deleted successfully');
        window.location.href = "/read-later";
      } else {
        toastr.warning("Failed to delete the item. Please try again.");
      }
    } catch (error) {
      toastr.error('An error occurred, please try again');
    }
  }

  displaySeriesBooks(seriesBooks);
  displayStandaloneBooks(standaloneBooks);
});
