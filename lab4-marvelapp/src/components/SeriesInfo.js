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
    const [ seriesData, setSeriesData ] = useState(undefined);

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
                const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
                const id = props.match.params.id
                const url = baseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                //console.log(url);
				const { data } = await axios.get(url);
                chars = data.data.results;
				setSeriesData(data.data.results);

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
        let series = seriesData[0];
        let thumb = `${series.thumbnail.path}/portrait_xlarge.${series.thumbnail.extension}`;
        let alt = 'sample cover of '+series.name;

        return(
            <Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={series.title} />
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
								{series.description ? <dd>{series.description.replace(regex, '')}</dd>: <dd>No Description</dd>}
							</p>

                            <p>
								<dt className='title'>Start Year: </dt>
								{series.startYear ? <dd>{series.startYear}</dd> : <dd>N/A</dd>}
							</p>

                            <p>
								<dt className='title'>End Year: </dt>
								{series.endYear ? <dd>{series.endYear}</dd> : <dd>N/A</dd>}
							</p>
							
                            <p>
								<dt className='title'>Creators: </dt>
								{series && series.creators.items && series.creators.items.length >= 1 ? (
									<span>
										{series.creators.items.map((creator) => {
                                            let lastSlashIndex = creator.resourceURI.lastIndexOf('/');
                                            let creatorId = creator.resourceURI.substring(lastSlashIndex + 1);
                                            if (series.creators.items.length > 1){
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
								<dt className='title'>Comics: </dt>
								{series && series.comics.items && series.comics.items.length >= 1 ? (
									<span>
										{series.comics.items.map((comic) => {
                                            let lastSlashIndex = comic.resourceURI.lastIndexOf('/');
                                            let comicId = comic.resourceURI.substring(lastSlashIndex + 1);
                                            let url = `/comics/${comicId}`;
                                            if (series.comics.items.length > 1){
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
								<dt className='title'>Characters: </dt>
								{series && series.characters.items && series.characters.items.length >= 1 ? (
									<span>
                                    {series.characters.items.map((character) => {
                                        let lastSlashIndex = character.resourceURI.lastIndexOf('/');
                                        let characterId = character.resourceURI.substring(lastSlashIndex + 1);
                                        let url = `/characters/${characterId}`;
                                        if (series.characters.items.length > 1){
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
								{series && series.stories.items && series.stories.items.length >= 1 ? (
									<span>
										{series.stories.items.map((story) => {
                                            let lastSlashIndex = story.resourceURI.lastIndexOf('/');
                                            let storyId = story.resourceURI.substring(lastSlashIndex + 1);
                                            if (series.stories.items.length > 1){
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
								{series && series.events.items && series.events.items.length >= 1 ? (
									<span>
										{series.events.items.map((event) => {
                                            let lastSlashIndex = event.resourceURI.lastIndexOf('/');
                                            let eventId = event.resourceURI.substring(lastSlashIndex + 1);
                                            if (series.events.items.length > 1){
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
								{series && series.urls && series.urls.length >= 1 ? (
									<span>
                                        {series.urls.map((url) => {
                                            let title = capitalize(url.type);
                                            if (series.urls.length > 1){
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
