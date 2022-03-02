## Redis-Handlebars Caching App
The goal of this project was to create a client that pulls data from the TVMaze API and caches it in a Redis server before showing it to the client.
Express is used for the routing and middleware, Axios is used to fetch the data, and Handlebars is used to render the data to HTML and display it in the browser.

## To Run this

Install Redis and start a local Redis server.

`npm install` on the root dir for the server
`npm start` to start the express server

Routes will be available on http://localhost:3000.