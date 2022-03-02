import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import PageNavButtons from './PageNavButtons';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';

//CREDIT TO PATRICK HILL for the Grid display code, tweaked by me, and the URL generation code for my axios call.

// Our amount of list entries per page.
const entries_per_page = 24;

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const Characters = (props) => {
    const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ pagevalid, setPageValid] = useState(true);
    const [ charsData, setCharsData ] = useState(undefined);
    const [ next, setNext ] = useState(true);


    useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			//Get current page
            let chars = undefined;
            setLoading(true);
            setNext(true);
            try {
                if (isNaN(parseInt(props.match.params.page))){
                    setPageValid(false);
                }

                const md5 = require('blueimp-md5');
                const publickey = 'c194ac0ded9bdd90df747c0ccc18a73b';
                const privatekey = '5259b5442776cb8b272c28acb1da3759ba16957b';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
                const limit = "&limit=" + entries_per_page.toString();
                const offset = "&offset=" + (entries_per_page * props.match.params.page);
                const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + offset + limit;
                

				const { data } = await axios.get(url);
                chars = data.data.results;
				setCharsData(data.data.results);

                // Check that we got results, invalidate page otherwise
                if (chars === undefined || chars.length === 0){
                    setPageValid(false);
                }
                //See if we have a next page
                if (parseFloat(data.data.total) / entries_per_page <= (parseInt(props.match.params.page)+1)){
                    setNext(false);
                }
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, 
	[props.match.params.page]
	);   
    
    const buildCard = (character) => {
        let thumb = `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`;
        let url = `/characters/${character.id}`;
        let alt = 'image of '+character.name;
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={url}>
							<CardMedia
								className={classes.media}
								component='img'
								image={thumb}
								title={alt}
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{character.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{character.description ? character.description.replace(regex, '').substring(0, 139) + '...' : 'No Description'}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    let card = "";
    if (charsData){
        card = charsData.map( (character) => {return buildCard(character)} );
    }


    if (!pagevalid){
        return (
            <Redirect to='/notfound'/>
        );
    }else if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
                <h2>Page {parseInt(props.match.params.page)+1}</h2>
                <br/>
				<PageNavButtons page={props.match.params.page} next={next} link='characters' />
				<br />
                <Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default Characters;
