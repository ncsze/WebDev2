import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import actions from '../actions';
import '../App.css';

function CatchButton (props) {
    const [caught, setCaught] = useState(false);
    const [trainerFull, setTrainerFull] = useState(false);
    const allTrainers = useSelector( (state) => state.trainers );
    const dispatch = useDispatch();
    const id = props.id.toString();

    useEffect(() => {
        setTrainerFull(false);
		console.log('on load useeffect');
		allTrainers.forEach(trainer => {
            if (trainer.pokemon.includes(props.id.toString())){
                setCaught(true);
            }
            if (trainer.selected){
                if (trainer.pokemon.length >= 6){
                    setTrainerFull(true);
                }
            }
        });
		
	}, 
	[props.id, allTrainers, trainerFull]
	);

    const catchPokemon = () =>{
        setCaught(true);
        dispatch(actions.catchPokemon(id));
        console.log(allTrainers);
    };

    const releasePokemon = () =>{
        setCaught(false);
        dispatch(actions.releasePokemon(id));
        console.log(allTrainers);
    };

    if (caught){
        return(<button className="navlink" onClick={() => {releasePokemon()}}>Release</button>);
    }else if (trainerFull){
        return(<button className="navlink" disabled={true} >Party Full</button>);
    }else{
        return(<button className="navlink" onClick={() => {catchPokemon()}}>Catch</button>);
    }   

}

export default CatchButton;