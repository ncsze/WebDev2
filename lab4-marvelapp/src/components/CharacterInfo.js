import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';

//CREDIT TO PATRICK HILL for the Card display code, tweaked by me, and the URL generation code for my axios call.

const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const CharacterInfo = (props) => {
    const regex = /(<([^>]+)>)/gi;
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ pagevalid, setPageValid] = useState(true);
    const [ characterData, setCharData ] = useState(undefined);

    useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			//Get current page
            let chars = undefined;
            setLoading(true);
            try {
                const md5 = require('blueimp-md5');
                const publickey = 'c194ac0ded9bdd90df747c0ccc18a73b';
                const privatekey = '5259b5442776cb8b272c28acb1da3759ba16957b';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
                const id = props.match.params.id
                const url = baseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                //console.log(url);
				const { data } = await axios.get(url);
                chars = data.data.results;
				setCharData(data.data.results);

                // Check that we got results, invalidate page otherwise
                if (chars === undefined || chars.length === 0){
                    setPageValid(false);
                }
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, 
	[props.match.params.id]
	);  

    if (!pagevalid){
        return (
            <Redirect to='/notfound'/>
        );
    }

    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	
    }else{
        //Render the page.
        function capitalize(string) {
            return string[0].toUpperCase() + string.slice(1);
        }
        let character = characterData[0];
        let thumb = `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`;
        let alt = 'image of '+character.name;
        return(
            <Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={character.name} />
				<CardMedia
					className={classes.media}
					component='img'
					image={thumb}
					title={alt}
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
								<dt className='title'>Description: </dt>
								{character.description ? <dd>{character.description.replace(regex, '')}</dd>: <dd>No Description</dd>}
							</p>
							

							<p>
								<dt className='title'>Comics: </dt>
								{character && character.comics.items && character.comics.items.length >= 1 ? (
									<span>
										{character.comics.items.map((comic) => {
                                            let lastSlashIndex = comic.resourceURI.lastIndexOf('/');
                                            let comicId = comic.resourceURI.substring(lastSlashIndex + 1);
                                            let url = `/comics/${comicId}`;
                                            if (character.comics.items.length > 1){
                                                return <dd key={comicId}><Link class='infolink' to={url} >{comic.name},</Link></dd>;
                                            } else{
                                                return <dd key={comicId}><Link class='infolink' to={url} >{comic.name}</Link></dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

                            <p>
								<dt className='title'>Series: </dt>
								{character && character.series.items && character.series.items.length >= 1 ? (
									<span>
										{character.series.items.map((series) => {
                                            let lastSlashIndex = series.resourceURI.lastIndexOf('/');
                                            let seriesId = series.resourceURI.substring(lastSlashIndex + 1);
                                            let url = `/series/${seriesId}`;
                                            if (character.series.items.length > 1){
                                                return <dd key={seriesId}><Link class='infolink' to={url} >{series.name},</Link></dd>;
                                            } else{
                                                return <dd key={seriesId}><Link class='infolink' to={url} >{series.name}</Link></dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

                            <p>
								<dt className='title'>Stories: </dt>
								{character && character.stories.items && character.stories.items.length >= 1 ? (
									<span>
										{character.stories.items.map((story) => {
                                            let lastSlashIndex = story.resourceURI.lastIndexOf('/');
                                            let storyId = story.resourceURI.substring(lastSlashIndex + 1);
                                            if (character.stories.items.length > 1){
                                                return <dd key={storyId}>{story.name},</dd>;
                                            } else{
                                                return <dd key={storyId}>{story.name}</dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

                            <p>
								<dt className='title'>Events:</dt>
								{character && character.events.items && character.events.items.length >= 1 ? (
									<span>
										{character.events.items.map((event) => {
                                            let lastSlashIndex = event.resourceURI.lastIndexOf('/');
                                            let eventId = event.resourceURI.substring(lastSlashIndex + 1);
                                            if (character.events.items.length > 1){
                                                return <dd key={eventId}>{event.name},</dd>;
                                            } else{
                                                return <dd key={eventId}>{event.name}</dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>
                            
							<p>
								<dt className='title'>Links:</dt>
								{character && character.urls && character.urls.length >= 1 ? (
									<span>
                                        {character.urls.map((url) => {
                                            let title = capitalize(url.type);
                                            if (character.urls.length > 1){
                                                return <dd key={url.type}><a href={url.url}>{title},</a></dd>;
                                            } else{
                                                return <dd key={url.type}><a href={url.url}>{title}</a></dd>;
                                            }
											
										})}
                                    </span>
								) : (
									<dd>N/A</dd>
								)}
							</p>
						</dl>
						<Link to='/'>Back to home.</Link>
					</Typography>
				</CardContent>
			</Card>
        )
    }

}

export default CharacterInfo;
