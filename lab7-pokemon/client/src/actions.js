const createTrainer = (name) => ({
    type: 'CREATE_TRAINER',
    payload: {
        name: name
    }
});
const deleteTrainer = (id) => ({
    type: 'DELETE_TRAINER',
    payload: {
        id: id
    }
});
const selectTrainer = (id) => ({
    type: 'SELECT_TRAINER',
    payload: {
        id: id
    }
});

const catchPokemon = (pid) => ({
    type: 'CATCH_POKEMON',
    payload: {
        pid: pid
    }
});
const releasePokemon = (pid) => ({
    type: 'RELEASE_POKEMON',
    payload: {
        pid: pid
    }
});

module.exports = {
    createTrainer,
    deleteTrainer,
    selectTrainer,
    catchPokemon,
    releasePokemon
}