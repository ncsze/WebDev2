import React from 'react';
import { Link } from "react-router-dom";

const PageNavButtons = (props) =>{
    let link = "/shows/page/";
    let prevUrl = link + "0";
    let nextUrl = link + "0";
    if (props.pagenum){
        let pgNum = parseInt(props.pagenum)
        prevUrl = link+((pgNum-1).toString());
        nextUrl = link+((pgNum+1).toString());

    }
    return (
        <div>
            { (props.pagenum && props.pagenum > 0) ?
                <Link className='navlink' to={prevUrl}>Previous Page</Link>
            : null}
            {props.next ?
                <Link className='navlink' to={nextUrl}>Next Page</Link>
            : null}
            <br />
        </div>
    );
}

export default PageNavButtons;