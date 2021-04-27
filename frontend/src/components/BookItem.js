import React, { useState, useContext } from 'react'

import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import Card from './UIElements/Card';
import Button from './FormElements/Button';
import Modal from '../components/UIElements/Modal';

import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import './BookItem.css';

const BookItem = props => {
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_SERVER_URL}/api/library/book/${auth.libId}/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            props.onDelete(props.id);
        } catch (err) { }
    };

    return (
        <React.Fragment>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </React.Fragment>
                }
            >
                <p>
                    Do you want to proceed and delete this place? Please note that it
                    can't be undone thereafter.
            </p>
            </Modal>
            <li className='book_item'>
                <Card>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='book-position'>
                        <div className='align-left'>
                            <span>{props.name}</span>
                            <br />
                            <span>Author :  {props.author} </span>
                            <br />
                            <span>Category: {props.category}</span>
                            <br />
                            <span>ISBN No: {props.isbn}</span>
                            <br />
                        </div>
                        <div className='align-right'>
                            <Button to={`/book/${props.id}`}> Update Book</Button>
                            <Button danger onClick={showDeleteWarningHandler}> Delete Book</Button>
                        </div>
                    </div>
                </Card>
            </li >
        </React.Fragment>
    )
}

export default BookItem
