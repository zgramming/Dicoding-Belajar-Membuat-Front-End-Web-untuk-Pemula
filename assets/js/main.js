const STORAGE_KEY = "BOOKS_APPS";

let books = [];

function generateId() {
  return +new Date();
}

function addBooks() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isCompleted = document.getElementById("is_completed").checked;
  const obj = {
    id: generateId(),
    title: title,
    author: author,
    year: year,
    isCompleted: isCompleted ? 1 : 0,
  };

  /// Save to local storage
  if (isStorageExist()) {
    books.push(obj);
    saveToStorage();
    appendBooks(books);
  }
}

function removeBook(id) {
  const book = books.find((val, index) => val.id == id);
  if (!confirm(`Apakah kamu yakin ingin menghapus buku ${book.title}`)) {
    return false;
  }

  books = books.filter((value, index) => value.id != id);
  saveToStorage();
  appendBooks(books);
}

function markAsCompleted(id) {
  const book = books.find((value, index) => value.id == id);
  book.isCompleted = 1;
  saveToStorage();
  appendBooks(books);
}
function markAsUnCompleted(id) {
  const book = books.find((value, index) => value.id == id);
  book.isCompleted = 0;
  saveToStorage();
  appendBooks(books);
}

function appendBooks(items = []) {
  const tbodyCompletedBooks = document.getElementById("tbody-completed-books");
  const tbodyUncompletedBooks = document.getElementById(
    "tbody-uncompleted-books"
  );
  tbodyCompletedBooks.innerHTML = "";
  tbodyUncompletedBooks.innerHTML = "";

  items.forEach((value, index) => {
    const buttonToggleBook =
      value.isCompleted == 1
        ? `<button type='button' onclick = "markAsUnCompleted('${value.id}')">Belum dibaca</button> `
        : `<button type='button' onclick = "markAsCompleted('${value.id}')">Sudah dibaca</button> `;
    const buttonRemove = `<button type='button' id = 'btn-remove' onclick="removeBook('${value.id}')">Hapus</button> `;
    const html = `<tr id ='tr-${value.id}'>
	  <td>${index + 1}</td>
	  <td>${value.title}</td>
	  <td>${value.author}</td>
	  <td>${value.year}</td>
	  <td>
	 	<div class='form-group-horizontal' style='justify-content : center;'>
			${buttonRemove}
			${buttonToggleBook}
		</div> 
	  </td>
  </tr>`;

    if (value.isCompleted == 1) {
      tbodyCompletedBooks.insertAdjacentHTML("beforeend", html);
    } else {
      tbodyUncompletedBooks.insertAdjacentHTML("beforeend", html);
    }
  });
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveToStorage() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStrorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  appendBooks(books);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-books");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });

  if (isStorageExist()) {
    loadDataFromStrorage();
  }
});

/// Search
const buttonSearch = document.getElementById("btn-search");

buttonSearch.addEventListener("click", function () {
  const query = document.getElementById("search").value;
  const filteredBooks = books.filter((val, index) =>
    val.title.toLowerCase().includes(query.toLowerCase())
  );
  appendBooks(filteredBooks);
});
