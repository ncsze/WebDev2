import React, {useEffect, useState} from 'react';
import './App.css';
import List from './List';

import { useLazyQuery } from '@apollo/client';
import queries from '../queries';

function Home() {
  const [pageNum, setPageNum] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);

  const [call_unsplash, { loading, error, data }] = useLazyQuery(queries.UNSPLASH_IMAGES , { fetchPolicy: 'cache-and-network' });

  useEffect( () => {
    setFirstLoad(true);
    try{
      console.log("on load useeffect");
      call_unsplash({ variables: { pageNum:pageNum } });
      setFirstLoad(false);
    }catch(e){
      console.log(e);
    }
    

  },[call_unsplash, pageNum]);

  if (data){
    return (
      <div>
        <br />
        <h2>images from outside the bin</h2>
        <br />
        <div>
          <List data={data.unsplashImages} delete={false}/>
        </div>
        <br/>
        <button className='button' onClick = {() => {setPageNum(pageNum+1); call_unsplash({ variables: { pageNum:pageNum } })}}>Load More Images</button>
        <br/>
      </div>
      
    );
  }if (firstLoad || loading){
    return <div><br />Loading...</div>;
  }else if (error){
      return <div><br />{error.message}</div>;
  }else{
    return <div><br />Rendering Error.</div>
  }

}

export default Home;
