import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/auth-context';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';
import ErrorModal from '../components/UIElements/ErrorModal';
import BookList from '../components/BookList';
import './Library.css';
import ReactPaginate from 'react-paginate';



const Library = ({ library }) => {

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    // console.log(books);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_SERVER_URL}/api/library/${auth.libId}/books`
                );
                setBooks(responseData.books);
            } catch (err) { }
        };
        fetchBooks();
    }, [sendRequest, auth.libId]);

    const bookDeletedHandler = bookDeleteId => {
        setBooks(prevBooks =>
            prevBooks.filter(book => book.id !== bookDeleteId)
        );
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentBooks = books.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => {
        setCurrentPage(pageNumber.selected + 1);
        console.log(pageNumber);
    };

    return (
        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />
            <div className='lib-name'>
                <h4>Current Library Account : {library.name}</h4>
                <span>Library Address : {library.address}, {library.city}, {library.zip}</span>
            </div>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}

            {!isLoading && books && books.length > 0 && (<BookList items={currentBooks} onDeleteBook={bookDeletedHandler} />)}
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(books.length / 10)}
                marginPagesDisplayed={3}
                pageRangeDisplayed={5}
                onPageChange={paginate}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-link'}
                previousClassName={'prev-link'}
                nextClassName={'next-link'}
                pageLinkClassName={'a-link'}
            />
        </React.Fragment>
    )
}

export default Library
