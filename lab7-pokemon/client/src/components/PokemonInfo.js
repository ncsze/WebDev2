import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import missing from '../MissingNo.png'
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import CatchButton from './CatchButton';
import '../App.css';

//CREDIT TO PATRICK HILL for the Card display code, tweaked by me

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

const PokemonInfo = (props) => {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
    const [ pagevalid, setPageValid] = useState(true);
    const [ pokemonData, setPokeData ] = useState(undefined);
	const [ id , setID ] = useState("");

    useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			//Get current page
            let pokeman = undefined;
            setLoading(true);
            try {
                const url = "http://localhost:5000/pokemon/"+props.match.params.id;

				const { data } = await axios.get(url);
                pokeman = data;
				setPokeData(data);
				setID(props.match.params.id);

                // Check that we got results, invalidate page otherwise
                if (pokeman === undefined || Object.keys(pokeman).length === 0){
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
		
        let image_url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        let alt = 'image of an '+pokemonData.name;
        return(
            <Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={pokemonData.name} />
				<CardMedia className={classes.media}>
					<img alt={alt} src={image_url} onError={(e)=>{e.target.onerror = null; e.target.src=missing}}/>
				</CardMedia>

				<CardContent>
					<CatchButton id={pokemonData.id} />
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>

							<p>
								<dt className='title'>National Dex ID: </dt>
								{pokemonData.id ? <dd>#{pokemonData.id}</dd>: <dd>N/A</dd>}
							</p>

							<p>
								<dt className='title'>Types: </dt>
								{pokemonData && pokemonData.types && pokemonData.types.length >= 1 ? (
									<span>
										{pokemonData.types.map((type) => {
                                            return <dd key={type.slot}>{type.type.name}</dd>;	
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

							<p>
								<dt className='title'>Abilities: </dt>
								{pokemonData && pokemonData.abilities && pokemonData.abilities.length >= 1 ? (
									<span>
										{pokemonData.abilities.map((ability) => {
                                            if (ability.is_hidden){
                                                return <dd key={ability.ability.name}>{ability.ability.name} (Hidden) </dd>;
                                            } else{
                                                return <dd key={ability.slot}>{ability.ability.name} </dd>;
                                            }
											
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

							<p>
								<dt className='title'>Base Stats: </dt>
								{pokemonData && pokemonData.stats && pokemonData.stats.length >= 1 ? (
									<span>
										{pokemonData.stats.map((stat) => {
                                            return <dd key={stat.stat.name}>{stat.stat.name}: {stat.base_stat} </dd>;	
										})}
									</span>
								) : (
									<dd>N/A</dd>
								)}
							</p>

							<p>
								<dt className='title'>Height: </dt>
								{pokemonData.height ? <dd>{pokemonData.height}</dd>: <dd>N/A</dd>}
							</p>

							<p>
								<dt className='title'>Weight: </dt>
								{pokemonData.weight ? <dd>{pokemonData.weight}</dd>: <dd>N/A</dd>}
							</p>

                           
						</dl>
						<Link className="navlink" to='/'>Back Home</Link>
					</Typography>
				</CardContent>
			</Card>
        )
    }

}

export default PokemonInfo;
