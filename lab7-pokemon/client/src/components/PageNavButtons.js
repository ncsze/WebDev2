import React from 'react';
import { Link } from "react-router-dom";

const PageNavButtons = (props) =>{
    // This component requires three inputs: page(int), link(string), next(bool) 
    let link = "/page/";
    let prevUrl = "";
    let nextUrl = "";
    if (props.link){
        link = "/" + props.link + link; // -> "/characters/"
    }

    if (props.page){
        let pgNum = parseInt(props.page)
        prevUrl = link+((pgNum-1).toString());
        nextUrl = link+((pgNum+1).toString());

    }
    return (
        <div>
            { (props.page && props.page > 0) ?
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