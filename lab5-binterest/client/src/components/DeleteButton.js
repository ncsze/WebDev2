import React, {useState} from 'react';
import './App.css';
import { useMutation } from '@apollo/client';
import queries from '../queries';

function DeleteButton (props) { 
    const [disabled, setDisabled] = useState(false);

    const [deleteImage] = useMutation(queries.DELETE_IMAGE);
    const deleteThis = () => { deleteImage( {variables:{id:props.id}} ) };

    return(
        <button disabled={disabled} className='post-button' onClick={() => { deleteThis() ; setDisabled(true)}}> 
                        {!disabled? "trash this post": "trashed!"} 
                    </button>
    );

}

export default DeleteButton;
