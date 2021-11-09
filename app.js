// book class- represent a book
class Book{
    constructor(title,author,isbn){
        this.title= title;
        this.author= author;
        this.isbn= isbn;
    }
}

// UI class- handle UI tasks
class UI{
    static displayBooks(){

        const books= store.getBooks();

        books.forEach((book) =>UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list'); // as book-list is id so we used # here... list here represents table...
        const row = document.createElement('tr'); //row of our list contains books,author,isbn and delete button...
        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message,className){
        const div= document.createElement('div');
        div.className= `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        //setting time for alert to remove...
        setTimeout(() => document.querySelector('.alert').remove(),1000);
    }

    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#ISBN').value=''; 
    }
}

// store class- handles storage
class store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books= [];
        }else{
            books= JSON.parse(localStorage.getItem('books')); 
        }
        return books;
    }

    static addBook(book){
        const books= store.getBooks();
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

// Event: 1.display books, 2.add a book, 3.remove a book...
document.addEventListener('DOMContentLoaded',UI.displayBooks);
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    //get form values...
    e.preventDefault();
    const title= document.querySelector('#title').value;
    const author= document.querySelector('#author').value;
    const ISBN= document.querySelector('#ISBN').value;

    if(title=== '' || author=== '' || ISBN=== ''){
        UI.showAlert('Please fill all details properly','danger');
    
    } 
    
    else{
        //instantiate book class
    const book= new Book(title,author,ISBN);
    
    //add books to UI
    UI.addBookToList(book);

    //add book to store
    store.addBook(book);

    //show success message
    UI.showAlert('Book details added','success');

    // method to clear fields
    UI.clearFields();
    }   
});

//Remove a book, imp function as it deleted an element by looking at its target value.
document.querySelector('#book-list').addEventListener('click',(e)=>{
   //remove book from UI.
    UI.deleteBook(e.target);

    //show message when we delete book.
   UI.showAlert('Books details removed','danger');

   //remove book from storage.
   store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});