import React from 'react';
import BookItem from './BookItem';
import './BookList.css';

const BookList = props => {
    if (props.items.length === 0) {
        return (
            <div className="no-books">
                <h2>No Books Found Please try a different Search</h2>
            </div>
        )
    }
    return (
        <div>
            <ul className="books-list">
                <h4 className='list-name'> List of Current Books in the Library</h4>
                {props.items.map(book => (
                    <BookItem
                        key={book.id}
                        id={book.id}
                        name={book.name}
                        author={book.author}
                        isbn={book.isbn}
                        category={book.category}
                        onDelete={props.onDeleteBook}
                        publisher={book.publisher}
                    />
                ))}
            </ul>
        </div>
    )
}

export default BookList;