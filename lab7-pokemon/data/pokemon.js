const axios = require("axios");

const apiUrl = "https://pokeapi.co/api/v2/pokemon/"

const ITEMS_PER_PAGE = 50

module.exports = {
    async getPokemon(id){
        if (typeof(id)!== 'string' ||  isNaN(parseFloat(id)) || parseFloat(id) < 0 || !Number.isInteger(parseFloat(id)) ){
            throw "Invalid ID.";
        }
        try {
            let {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (data){
                return data;
            }else{
                throw "Error: no results!";
            }
        } catch (error) {
            throw error;
        }
        
    },
    async getPokemonPage(pageNum){
        if (typeof(pageNum)!== 'string' ||  isNaN(parseFloat(pageNum)) || parseFloat(pageNum) < 0 || !Number.isInteger(parseFloat(pageNum)) ){
            throw `Invalid pagenum ${pageNum}.`;
        }
        offset = ITEMS_PER_PAGE * parseInt(pageNum);

        
        try {
            let {data} = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
            if (data){
                return data;
            }else{
                throw "Error: no results!";
            }
        } catch (error) {
            throw error;
        }
    }
};