const axios = require("axios");

const apiUrl = "http://api.tvmaze.com/shows";


/*
const apiUrl = "http://api.tvmaze.com/shows";

router.get('/:id', async (req, res) => {
    const id = req.params.id
    if (typeof(id)!== 'string' ||  isNaN(parseFloat(id)) || parseFloat(id) < 0 || !Number.isInteger(parseFloat(id)) ){
        res.status(400).json({message: "invalid ID."});
    }else{
        try {
            const {data} = await axios.get(apiUrl + '/' + id );
            res.json(data);
        } catch (e) {
            res.status(404).json({ message: 'not found!' });
        }
    }
    
});
*/

module.exports = {
    async getMainShows(){
        // NEW FUNCTION: Get the entire API's list of shows for main page.
        let {data} = await axios.get(apiUrl);
        return data;
    },
    async getShowById(id){
        if (typeof(id)!== 'string' ||  isNaN(parseFloat(id)) || parseFloat(id) < 0 || !Number.isInteger(parseFloat(id)) ){
            throw "Invalid ID.";
        }else{
            try {
                const {data} = await axios.get("http://api.tvmaze.com/shows/" + id);
                
                // Yoinked this regex off of: https://stackoverflow.com/questions/1499889/remove-html-tags-in-javascript-with-regex
                if (data.summary !== undefined && typeof(data.summary) === 'string'){
                    data.summary = data.summary.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "");
                }

                return data;
            } catch (error) {
                throw "Not found!";
            }
        }   
    },async getShows(searchTerm){
        //Edit from lab8: don't slice the search results.
        if (typeof(searchTerm)!== 'string'){
            throw "Invalid search term.";
        }if (searchTerm.toString().trim() === ""){
            throw "Search term must be non-empty and include more than spaces.";
        }
        const search = searchTerm.toString().trim();

        let {data} = await axios.get("http://api.tvmaze.com/search/shows?q="+search);

        return data;
    }
}