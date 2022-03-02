import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Bin from './Bin';
import Posts from './Posts';
import Form from './Form';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">
              <span role="img" aria-label="Trash Bin Emoji">🗑️</span>Binterest
            </h1>
            <p>
              <NavLink className="navlink" to="/my-bin">
                my bin
              </NavLink>
              <NavLink exact className="navlink" to="/">
                images
              </NavLink>
              <NavLink className="navlink" to="/my-posts">
                my posts
              </NavLink>
            </p>
            
          </header>
          <Route exact path="/" component={Home} />
          <Route exact path="/my-bin" component={Bin} />
          <Route exact path="/my-posts" component={Posts} />
          <Route exact path="/new-post" component={Form} />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
