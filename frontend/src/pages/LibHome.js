import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/auth-context';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';
import ErrorModal from '../components/UIElements/ErrorModal';
import Library from '../components/Library';

const LibHome = (props) => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [library, setLibrary] = useState();
    console.log(props.lid);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_SERVER_URL}/api/library/${auth.libId}`
                );

                setLibrary(responseData.library);
            } catch (err) { }
        };
        fetchLibrary();
        console.log("Hello");
    }, [sendRequest, auth.libId]);


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && library && (<Library library={library} />)}
        </React.Fragment>
    )
}
export default LibHome