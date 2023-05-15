// Book class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode((message)));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        // Make go in 3 sec
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);

    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
// Store class: handles storage
class Store{
    static getBooks(){
        let books;
        console.log(localStorage.getItem('books'));
        if (localStorage.getItem('books') === null) {
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn){
        const books = Store.getBooks();

        books.forEach((book,index) =>{
            if (book.isbn === isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get from values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title == '' || author == '' || isbn == '') {
        // document.querySelector('#error-mess').innerHTML = "<span class='text-danger'>Please enter all fields</span>";
        UI.showAlert('Please fill all the fields', 'danger');
    } else {
        // Instatiate book
        const book = new Book(title, author, isbn);
        console.log(book);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to UI
        Store.addBooks(book);

        // Show success message
        UI.showAlert('Book Added','success');

        // Clear fields
        UI.clearFields();
    }


});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    console.log(e.target);
    // Remove book from UI
    UI.deleteBook(e.target);
    console.log(e.target.parentElement.previousElementSibling.textContent)
    // Remove books from shore
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent); 

    // Show delete message
    UI.showAlert('Book Removed','success');
});