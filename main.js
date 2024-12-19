const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBookForm = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addBook();
});

searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBooks();
});

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId = +new Date();
  const book = {
    id: bookId,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  books.push(book);
  saveBooks();
  renderBooks();
  bookForm.reset();
}

function renderBooks(filter = "") {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    if (
      filter === "" ||
      book.title.toLowerCase().includes(filter.toLowerCase())
    ) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    }
  }
}

function makeBookElement(book) {
  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-item");
  bookContainer.setAttribute("data-bookid", book.id);
  bookContainer.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.textContent = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.textContent = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.addEventListener("click", function () {
    toggleBookCompletion(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.textContent = "Edit Buku";
  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  buttonContainer.appendChild(toggleButton);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(editButton);
  bookContainer.appendChild(bookTitle);
  bookContainer.appendChild(bookAuthor);
  bookContainer.appendChild(bookYear);
  bookContainer.appendChild(buttonContainer);

  return bookContainer;
}

function toggleBookCompletion(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooks();
  renderBooks();
}

function editBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    const book = books[bookIndex];
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
    deleteBook(bookId);
  }
}

function searchBooks() {
  const searchTitle = searchBookTitle.value;
  renderBooks(searchTitle);
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
}

loadBooks();
