const dbConnection = require('./mongoConnection');

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
//I did, thank you very much
//Credit: Patrick Hill
//https://github.com/stevens-cs546-cs554/CS-546/blob/master/lecture_04/code/mongoCollections.js

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  blog: getCollectionFn('blog'),
  users : getCollectionFn('users')
};