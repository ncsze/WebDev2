const blogRoutes = require("./blog.js");
const userRoutes = require("./users.js");
const commentRoutes = require("./comments.js");

const constructorMethod= app=>{
    app.use(userRoutes);
    app.use(blogRoutes);
    app.use(commentRoutes);

    app.use("*", (req,res) =>{
        res.status(404).json({error: "Not found"});
    })
};

module.exports = constructorMethod;