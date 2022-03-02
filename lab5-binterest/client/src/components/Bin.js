import React from 'react';
import './App.css';
import List from './List';
import { useQuery } from '@apollo/client';
import queries from '../queries';

function Bin() {

  const { loading, error, data } = useQuery(
    queries.BINNED_IMAGES,
    {
        fetchPolicy: 'cache-and-network'
    }
  );

  if (data){
    return (
      <div>
        <br />
        <h2>my bin</h2>
        <br />
        <div>
          <List data={data.binnedImages} delete={false}/>
        </div>
      </div>
      
    );
  }else if (loading){
    return <div><br />Loading...</div>;
  }else if (error){
      return <div><br />{error.message}</div>;
  }


}

export default Bin;
