import { v4 as uuid } from 'uuid';
const initalState = [
  {
    id: uuid(),
    name: 'Trainer Red',
    pokemon: [],
    selected: true
  }
];

let copyState = null;
let index = 0;

const trainerReducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CREATE_TRAINER':
      return [
        ...state,
        { id: uuid(), name: payload.name, pokemon: [], selected: false }
      ];
    case 'DELETE_TRAINER':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id.toString() === payload.id.toString());
      if (copyState[index].selected !== true){
        copyState.splice(index, 1);
      }
      return [...copyState];

    case 'SELECT_TRAINER':
        copyState = [...state];
        index = copyState.findIndex((x) => x.id.toString() === payload.id.toString());
        copyState.forEach( (trainer) =>{
          trainer.selected = false;
        });
        copyState[index].selected = true;
        return [...copyState];

    case 'CATCH_POKEMON':
        copyState = [...state];
        index = copyState.findIndex((x) => x.selected === true);
        if (copyState[index].pokemon.length < 6 && !copyState[index].pokemon.includes(payload.pid)){
            copyState[index].pokemon.push(payload.pid)
        }
        return [...copyState];

    case 'RELEASE_POKEMON':
        copyState = [...state];
        let target_id = "";

        copyState.forEach(trainer => {
          if (trainer.selected){
            target_id = trainer.id;
          }
        });

        index = copyState.findIndex((x) => x.id.toString() === target_id.toString());


        let pokemonIndex = copyState[index].pokemon.findIndex((p) => p === payload.pid.toString());
        let newPokemon = [...copyState[index].pokemon]
        newPokemon.splice(pokemonIndex, 1);

        copyState[index].pokemon = newPokemon;
          
        
        return copyState;
    default:
      return state;
  }
};

export default trainerReducer;