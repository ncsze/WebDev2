import React from 'react';
import { useSelector } from 'react-redux';
import TrainerDisplay from './TrainerDisplay';
import AddTrainer from './AddTrainer';
import '../App.css';

const Trainers = () => {
    const allTrainers = useSelector( (state) => state.trainers );
	return (
		<div className="todo-wrapper">
          <h2>Trainers</h2>
          <br />
          <AddTrainer />
          <br />
          {allTrainers.map((trainer) => {
            return <TrainerDisplay key={trainer.id} trainer={trainer} />;
          })}
        </div>


	);
};

export default Trainers;