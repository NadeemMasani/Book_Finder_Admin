import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import Card from '../components/UIElements/Card';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';
import {
    VALIDATOR_REQUIRE
} from '../util/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import './NewBook.css';

const UpdateBook = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const bookId = useParams().bid;
    const [loadedBook, setLoadedBook] = useState();
    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: '',
                isValid: false
            },
            author: {
                value: '',
                isValid: false
            },
            category: {
                value: '',
                isValid: false
            },
            isbn: {
                value: null,
                isValid: false
            },
            publisher: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_SERVER_URL}/api/library/book/${bookId}`
                );
                setLoadedBook(responseData.book);
                setFormData({
                    name: {
                        value: responseData.book.name,
                        isValid: true
                    },
                    author: {
                        value: responseData.book.author,
                        isValid: true
                    },
                    category: {
                        value: responseData.book.category,
                        isValid: true
                    },
                    isbn: {
                        value: responseData.book.isbn,
                        isValid: true
                    },
                    publisher: {
                        value: responseData.book.publisher,
                        isValid: true
                    }
                },
                    true
                );
            } catch (err) {
                console.log(err);
            }
        };
        fetchBook();
    }, [sendRequest, bookId, setFormData]);

    const bookSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_SERVER_URL}/api/library/book/${bookId}`,
                'PATCH',
                JSON.stringify({
                    name: formState.inputs.name.value,
                    author: formState.inputs.author.value,
                    category: formState.inputs.category.value,
                    isbn: formState.inputs.isbn.value,
                    publisher: formState.inputs.publisher.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/');
        } catch (err) { }
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedBook && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find Book!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={bookSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="name"
                    element="input"
                    type="text"
                    label="Book Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    initialValue={loadedBook.name}
                    onInput={inputHandler}
                />
                <Input
                    id="author"
                    element="input"
                    label="Author"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                    initialValue={loadedBook.author}
                />
                <Input
                    id="category"
                    element="input"
                    label="Category"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                    initialValue={loadedBook.category}
                />
                <Input
                    id="isbn"
                    element="input"
                    label="ISBN No:"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                    initialValue={loadedBook.isbn}
                />

                <Input
                    id="publisher"
                    element="input"
                    label="Publisher"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                    initialValue={loadedBook.publisher}
                />
                <Button type="submit" disabled={formState.isValid}>
                    ADD Book
                </Button>
            </form>
        </React.Fragment>
    );
}

export default UpdateBook
