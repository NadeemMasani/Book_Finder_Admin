const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Libaccount = require('../models/libaccount');
const Library = require('../models/library');
const Book = require('../models/books');


const getLibraryById = async (req, res, next) => {
    const lid = req.params.lid;
    // console.log(lid);
    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!library) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ library: library.toObject({ getters: true }) });
};

const getBooksByLibrary = async (req, res, next) => {
    const lid = req.params.lid;
    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!library) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    // console.log(library.books);

    let allbooks = [];
    try {
        for (const book of library.books) {
            const currBook = await Book.findById(book._id);
            if (currBook != null) {
                allbooks.push({
                    id: currBook._id,
                    name: currBook.name,
                    author: currBook.author,
                    category: currBook.category,
                    isbn: currBook.isbn,
                    // publisher: currBook.publisher,
                    count: book.count
                });
            }
        }
        // console.log(allbooks);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong error while getting books for the library',
            404
        );
        return next(err);

    }
    res.json({ books: allbooks });

}


const addBook = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return next(
    //         new HttpError('Invalid inputs passed, please check your data.', 422)
    //     );
    // }

    const { name, author, isbn, category, publisher } = req.body;
    const lid = req.params.lid;
    const intisbn = parseInt(isbn);

    let library;
    try {
        library = await Library.findById(lid);
    } catch (err) {
        const error = new HttpError(
            'Adding book to library failed',
            500
        );
        return next(error);
    }
    if (!library) {
        const error = new HttpError('Could not find Library for provided Library id.', 404);
        return next(error);
    }

    // console.log(library);

    let existingbook;
    try {
        existingbook = await Book.findOne({ isbn: isbn });
    } catch (err) {
        const error = new HttpError(
            'Adding the new Book Faile',
            500
        );
        return next(error);

    }

    if (existingbook) {
        console.log(existingbook.lib);
        console.log(library.id);

        if (existingbook.lib.includes(library.id)) {
            const error = new HttpError('Book already exists in Library', 404);
            return next(error);
        }
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            existingbook.lib.push(library);
            await existingbook.save({ session: sess });
            library.books.push(existingbook);
            await library.save({ session: sess });
            await sess.commitTransaction();

        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could add or create Book.',
                500
            );
            return next(err);

        }

        res.status(200).json({ book: existingbook.toObject({ getters: true }) });
    } else {

        const createdBook = new Book({
            name,
            author,
            isbn: intisbn,
            publisher,
            category,
            lib: lid
        });
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdBook.save({ session: sess });
            library.books.push(createdBook);
            await library.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not create Library.',
                500
            );
            return next(err);
        }

        res.status(200).json({ book: createdBook.toObject({ getters: true }) });
    }



};

const updateBook = async (req, res, next) => {
    const bookId = req.params.bid;

    // const libId = req.params.lid;

    const { name, author, category, publisher, isbn } = req.body;
    let book;
    console.log(bookId);
    try {
        book = await Book.findById(bookId);
    } catch (err) {
        const error = new HttpError(
            'Could not find the library',
            500
        );
        return next(err);
    }
    book.name = name;
    book.author = author;
    book.category = category;
    book.publisher = publisher;
    book.isbn = parseInt(isbn);
    try {
        await book.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        );
        return next(err);
    }
    res.status(200).json({ book: book.toObject({ getters: true }) });
};

const getBookByID = async (req, res, next) => {
    const bid = req.params.bid;
    console.log(bid);
    let book;
    try {
        book = await Book.findById(bid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the library.',
            500
        );
        return next(error);
    }

    if (!book) {
        const error = new HttpError(
            'Could not find Library for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ book: book.toObject({ getters: true }) });

};

const deleteBook = async (req, res, next) => {
    const bookId = req.params.bid;
    const libId = req.params.lid;
    console.log(bookId);
    console.log(libId);

    let book, library;
    try {
        book = await Book.findById(bookId);
        library = await Library.findById(libId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        return next(error);
    }

    if (!book || !library) {
        const error = new HttpError('Could not find place for this id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        book.lib.pull(library);
        await book.save({ session: sess });
        library.books.pull(book);
        await library.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        return next(error);
    }
    res.status(200).json({ message: 'Deleted place.' });
};




exports.updateBook = updateBook;
exports.getLibraryById = getLibraryById;
exports.getBooksByLibrary = getBooksByLibrary;
exports.addBook = addBook;
exports.getBookByID = getBookByID;
exports.deleteBook = deleteBook;