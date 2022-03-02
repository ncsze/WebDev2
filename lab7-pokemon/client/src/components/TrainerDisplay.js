import React from 'react';
import '../App.css';
import { useDispatch } from 'react-redux';
import { Link} from 'react-router-dom';
import actions from '../actions';

import { Card, CardActionArea, CardMedia, Grid, makeStyles, Container } from '@material-ui/core';

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

const TrainerDisplay = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();


	return (
		<div>
            <h3>{props.trainer.name}</h3>
            {props.trainer.selected?
                <button className='navlink' disabled={true}>Selected</button>:
                <button className='navlink' onClick={() => { dispatch(actions.selectTrainer(props.trainer.id));}}>Select Trainer</button>
            }

            {props.trainer.selected?
                null:
                <button className='navlink' onClick={() => { dispatch(actions.deleteTrainer(props.trainer.id));}}>Delete Trainer</button>
            }

            <h4>Team</h4>
			<Container>
					
						{props.trainer.pokemon && props.trainer.pokemon.length > 0?
                            <Grid container className={classes.grid} spacing={5}>{props.trainer.pokemon.map((pokemon) => {
                                return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={pokemon}>
                                            <Card className={classes.card} variant='outlined'>
                                                <CardActionArea>
                                                    <Link to={`/pokemon/${pokemon}`}>
                                                        <CardMedia
                                                            className={classes.media}
                                                            component='img'
                                                            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon}.png`}
                                                            title={`image of pokemon of ID ${pokemon}`}
                                                        />
                                                    </Link>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>;	
                            })}</Grid>
                            :<p>No Pokemon Selected Yet</p>
                        }
			</Container>
		</div>
	);
};

export default TrainerDisplay;