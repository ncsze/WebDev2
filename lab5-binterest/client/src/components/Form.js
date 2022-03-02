import React, {useState} from 'react';
import './App.css';
import { useMutation} from '@apollo/client';
import queries from '../queries';

function isURL(str) {
  // I grabbed this regex off of Stack Exchange. Thank you, Stack Exchange.
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}

function Form(){
    const [validurl,setValidUrl] = useState(false);
    const [nameValid, setNameValid] = useState(false);
    const [uploadPost] = useMutation(queries.UPLOAD_IMAGE);

    let description,url,posterName;

    const checkName = (event) =>{
      setNameValid(false);
      const posterName = event.target;
      if(posterName.value && posterName.value.trim().length > 0){
        setNameValid(true);
      }
    }

    const checkUrl = (event) =>{
      setValidUrl(false);
      const url = event.target;
      if(url.value && isURL(url.value)){
        setValidUrl(true);
      }
    }

    return (
        <div>
            <h2>post new image</h2>
            <br/>
            <form
                className="form"
                id="uploadImage"
                onSubmit={(e)=>{
                    e.preventDefault();

                    document.getElementById('formSuccess').hidden = true;

                    let urlError = document.getElementById('urlError');
                    let nameError = document.getElementById('nameError');
                    
                    if(!validurl){
                        urlError.hidden = false;
                    }
                    if(!nameValid) nameError.hidden = false;

                    if(validurl && nameValid){
                        uploadPost({
                            variables:{
                                description: description.value,
                                url: url.value,
                                posterName:posterName.value
                            }
                        });
                        description.value='';
                        url.value = '';
                        posterName.value='';
                        setValidUrl(false);
                        setNameValid(false);
                        document.getElementById('formSuccess').hidden = false;
                        document.getElementById('uploadImage').reset();
                    }
                }}>
                    

                    <div className="form-group">
                        <label>
                            Image URL:
                            <br />
                            <input id="url"
                            onChange={checkUrl}
                            ref={(node) => {
                                url = node;
                            }}
                            required
                            />
                        </label>
                        <div id="urlError" hidden>
                            <p>
                                Invalid URL provided.
                            </p>
                        </div>
                    </div>
                    <br />

                    <div className="form-group">
                        <label>
                            Poster Name:
                            <br />
                            <input id="posterName"
                            onChange={checkName}
                            ref={(node) => {
                                posterName = node;
                            }}
                            required
                            />
                        </label>
                        <div id="nameError" hidden>
                            <p>
                                Invalid name provided.
                            </p>
                        </div>
                    </div>
                    <br />

                    <div className="form-group">
                        <label>
                            Description (Optional):
                            <br />
                            <input id="description"
                            ref={(node) => {
                                description = node;
                            }}
                            autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />

                    <button className="button" type="submit">
                        Submit
                    </button>
                    <br />

                    <div id="formSuccess" hidden>
                        <p>
                            Image posted!
                        </p>
                    </div>
            </form>
        </div>
    );
}

export default Form;