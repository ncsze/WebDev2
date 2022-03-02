import React from 'react';
import './App.css';
import Home from './components/Home';
import PokemonList from './components/PokemonList';
import PokemonInfo from './components/PokemonInfo';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Trainers from './components/Trainers';

const App = () => {
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src='https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi.svg' className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to my cool Poke-API Site <span role="img" aria-label="Sunglasses Emoji">😎</span></h1>
					<Link className='showlink' to='/'>
						Home
					</Link>
					<Link className='showlink' to='/pokemon/page/0'>
					Show Pokemon
					</Link>
					<Link className='showlink' to='/trainers'>
					Trainers
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
          <Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/pokemon/page/:page' component={PokemonList} />
					<Route exact path='/pokemon/:id' component={PokemonInfo} />
					<Route exact path='/trainers' component={Trainers} />
					<Route exact path="/notfound" component={NotFound} status={404} />
					<Route exact path="*" component={NotFound} status={404} />
          </Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
