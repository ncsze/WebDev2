import React from 'react';
import './App.css';
import {NavLink} from 'react-router-dom';
import List from './List';
import { useQuery } from '@apollo/client';
import queries from '../queries';

function Posts() {

  const { loading, error, data } = useQuery(
    queries.USER_POSTED_IMAGES,
    {
        fetchPolicy: 'cache-and-network'
    }
  );


  if (data){
    return (
      <div>
        <br />
        <h2>my posts</h2>
        <br />
        <div>
            <NavLink className="button" to="/new-post">
                    make a new post
            </NavLink>
        </div>
        <br />
        <div>
          <List data={data.userPostedImages} delete={true}/>
        </div>
      </div>
      
    );
  }else if (loading){
    return <div><br />Loading...</div>;
  }else if (error){
      return <div><br />{error.message}</div>;
  }

}

export default Posts;
