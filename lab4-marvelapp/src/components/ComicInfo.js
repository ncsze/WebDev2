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
    const [ comicData, setComicData ] = useState(undefined);

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
                const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
                const id = props.match.params.id
                const url = baseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                //console.log(url);
				const { data } = await axios.get(url);
                chars = data.data.results;
				setComicData(data.data.results);

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
        let comic = comicData[0];
        let thumb = `${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`;
        let alt = 'sample cover of '+comic.name;
        let seriesId = comic.series?(comic.series.resourceURI.substring(comic.series.resourceURI.lastIndexOf('/') + 1)) : "";
        let seriesUrl = '/series/'+seriesId;

        return(
            <Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={comic.title} />
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
								{comic.description ? <dd>{comic.description.replace(regex, '')}</dd>: <dd>No Description</dd>}
							</p>
							
                            <p>
								<dt className='title'>Creators: </dt>
								{comic && comic.creators.items && comic.creators.items.length >= 1 ? (
									<span>
										{comic.creators.items.map((creator) => {
                                            let lastSlashIndex = creator.resourceURI.lastIndexOf('/');
                                            let creatorId = creator.resourceURI.substring(lastSlashIndex + 1);
                                            if (comic.creators.items.length > 1){
                                                return <dd key={creatorId}>{capitalize(creator.role)}: {creator.name},</dd>;
                                            } else{
                                                return <dd key={creatorId}>{capitalize(creator.role)}: {creator.name}</dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

                            <p>
								<dt className='title'>Series: </dt>
								{comic && comic.series ? (
									<dd key={seriesId}><Link class='infolink' to={seriesUrl} >{comic.series.name}</Link></dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>

                            <p>
								<dt className='title'>Characters: </dt>
								{comic && comic.characters.items && comic.characters.items.length >= 1 ? (
									<span>
                                    {comic.characters.items.map((character) => {
                                        let lastSlashIndex = character.resourceURI.lastIndexOf('/');
                                        let characterId = character.resourceURI.substring(lastSlashIndex + 1);
                                        let url = `/characters/${characterId}`;
                                        if (comic.characters.items.length > 1){
                                            return <dd key={characterId}><Link class='infolink' to={url} >{character.name},</Link></dd>;
                                        } else{
                                            return <dd key={characterId}><Link class='infolink' to={url} >{character.name}</Link></dd>;
                                        }
                                        
                                    })}
                                </span>
								) : (
									<dd>N/A</dd>
								)}
							</p>    

                            <p>
								<dt className='title'>Stories: </dt>
								{comic && comic.stories.items && comic.stories.items.length >= 1 ? (
									<span>
										{comic.stories.items.map((story) => {
                                            let lastSlashIndex = story.resourceURI.lastIndexOf('/');
                                            let storyId = story.resourceURI.substring(lastSlashIndex + 1);
                                            if (comic.stories.items.length > 1){
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
								{comic && comic.events.items && comic.events.items.length >= 1 ? (
									<span>
										{comic.events.items.map((event) => {
                                            let lastSlashIndex = event.resourceURI.lastIndexOf('/');
                                            let eventId = event.resourceURI.substring(lastSlashIndex + 1);
                                            if (comic.events.items.length > 1){
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
								{comic && comic.urls && comic.urls.length >= 1 ? (
									<span>
                                        {comic.urls.map((url) => {
                                            let title = capitalize(url.type);
                                            if (comic.urls.length > 1){
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
