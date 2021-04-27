import React, { useState, useContext } from 'react';
import Card from '../components/UIElements/Card';
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import ErrorModal from '../components/UIElements/ErrorModal';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../util/validators';

import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import './Auth.css'

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    address: undefined,
                    country: undefined,
                    city: undefined,
                    zip: undefined,
                    zip4: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    address: {
                        value: '',
                        isValid: false
                    },

                    country: {
                        value: '',
                        isValid: false
                    },

                    city: {
                        value: '',
                        isValid: false
                    },
                    zip: {
                        value: null,
                        isValid: false
                    },
                    zip4: {
                        value: null,
                        isValid: false
                    },

                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_SERVER_URL}/api/admin/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token, responseData.libId);
            } catch (err) { }
        } else {
            try {

                const responseData = await sendRequest(
                    `${process.env.REACT_APP_SERVER_URL}/api/admin/signup`,
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                        address: formState.inputs.address.value,
                        country: formState.inputs.country.value,
                        city: formState.inputs.city.value,
                        zip: formState.inputs.zip.value,
                        zip4: formState.inputs.zip4.value

                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                // console.log(responseData)
                auth.libId = responseData.libid;
                auth.userId = responseData.userId;
                console.log(responseData);
                auth.login(responseData.userId, responseData.token, responseData.libid);

            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                {isLoginMode ? <h2> Login Required</h2> : <h2>Welcome to SignUp : Book Finder</h2>}
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Library Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="address"
                            type="text"
                            label="Address"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a address."
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />

                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="country"
                            type="text"
                            label="Country"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter country."
                            onInput={inputHandler}
                        />
                    )}

                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="city"
                            type="text"
                            label="city"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter city."
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="zip"
                            type="text"
                            label="zip"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter zip."
                            onInput={inputHandler}
                        />
                    )}

                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="zip4"
                            type="text"
                            label="zip4"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter zip4."
                            onInput={inputHandler}
                        />
                    )}
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>

    )
}

export default Auth
