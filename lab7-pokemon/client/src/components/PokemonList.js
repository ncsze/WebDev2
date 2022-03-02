import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import PageNavButtons from './PageNavButtons';
import CatchButton from './CatchButton';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Container } from '@material-ui/core';
import '../App.css';
import missing from '../MissingNo.png'

//CREDIT TO PATRICK HILL for the Grid display code, tweaked by me

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

const PokemonList = (props) => {
	const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ pagevalid, setPageValid] = useState(true);
    const [ pageData, setPageData ] = useState(undefined);
    const [ next, setNext ] = useState(true);


    useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			//Get current page
            let pokemans = undefined;
            setLoading(true);
            setNext(true);
            try {
                if (isNaN(parseInt(props.match.params.page))){
                    setPageValid(false);
                }

                const url = "http://localhost:5000/pokemon/page/"+props.match.params.page; //Using port 5000 for backend
				const { data } = await axios.get(url);
				pokemans = data.results
				setPageData(data.results);

                // Check that we got results, invalidate page otherwise
                if (pokemans === undefined || pokemans.length === 0){
                    setPageValid(false);
                }
                //See if we have a next page
                if ( data.next === null ){
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
    
    const buildCard = (pokemon) => {

		// Example url: "https://pokeapi.co/api/v2/pokemon/1/"
		// This mess below (credit to some Stack Exchange threads I cobbled together) gets the ID.
		let id = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/','').replace(/\/$/, "");
		let desc = "Pokedex #"+id;

		let image_url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
		let image_desc = `Spritework for the pokemon ${pokemon.name}`
        let url = `/pokemon/${id}`;
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={url}>
						<CardMedia className={classes.media}>
							<img className={classes.media} alt={image_desc} src={image_url} onError={(e)=>{e.target.onerror = null; e.target.src=missing}}/>
						</CardMedia>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{pokemon.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{desc}
								</Typography>
								
							</CardContent>
						</Link>
						<CatchButton id={id} />
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    let card = "";
    if (pageData){
        card = pageData.map( (pokemon) => {return buildCard(pokemon)} );
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
				<PageNavButtons page={props.match.params.page} next={next} link='pokemon' />
				<br />
				<Container>
					<Grid container className={classes.grid} spacing={5}>
						{card}
					</Grid>
				</Container>
			</div>
		);
	}
};

export default PokemonList;
