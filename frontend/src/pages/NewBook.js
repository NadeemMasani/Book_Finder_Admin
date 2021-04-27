import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import ErrorModal from '../components/UIElements/ErrorModal';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';

import {
    VALIDATOR_REQUIRE
} from '../util/validators';

import './NewBook.css'


import { useForm } from '..//hooks/form-hook';
import { useHttpClient } from '..//hooks/http-hook';
import { AuthContext } from '../context/auth-context';

const NewBook = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
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

    const history = useHistory();

    const bookSubmitHandler = async event => {
        event.preventDefault();
        try {
            // const formData = new FormData();
            // formData.append('name', formState.inputs.name.value);
            // formData.append('author', formState.inputs.author.value);
            // formData.append('category', formState.inputs.category.value);
            // formData.append('isbn', formState.inputs.isbn.value);
            // formData.append('publisher', formState.inputs.publisher.value);
            console.log("Hi from add");
            console.log(auth.libId);
            await sendRequest(`${process.env.REACT_APP_SERVER_URL}/api/library/${auth.libId}`, 'POST', JSON.stringify({
                name: formState.inputs.name.value,
                author: formState.inputs.author.value,
                category: formState.inputs.category.value,
                isbn: formState.inputs.isbn.value,
                publisher: formState.inputs.publisher.value
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });
            history.push('/');
        } catch (err) { }
    };

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
                    onInput={inputHandler}
                />
                <Input
                    id="author"
                    element="input"
                    label="Author"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="category"
                    element="input"
                    label="Category"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Input
                    id="isbn"
                    element="input"
                    label="ISBN No:"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />

                <Input
                    id="publisher"
                    element="input"
                    label="Publisher"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD Book
                </Button>
            </form>
        </React.Fragment>
    )
}

export default NewBook
