import React from 'react';
import './App.css';
import Home from './components/Home';
import Characters from './components/Characters';
import CharacterInfo from './components/CharacterInfo.js';
import Comics from './components/Comics.js';
import ComicInfo from './components/ComicInfo';
import Series from './components/Series';
import SeriesInfo from './components/SeriesInfo';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const App = () => {
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src='https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg' className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to my cool Marvel API Site <span role="img" aria-label="Sunglasses Emoji">😎</span></h1>
					<Link className='showlink' to='/'>
						Home
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
          <Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/characters/page/:page' component={Characters} />
					<Route exact path='/characters/:id' component={CharacterInfo} />
          <Route exact path='/comics/page/:page' component={Comics} />
          <Route exact path='/comics/:id' component={ComicInfo} />
          <Route exact path='/series/page/:page' component={Series} />
          <Route exact path='/series/:id' component={SeriesInfo} />
          <Route exact path="/notfound" component={NotFound} status={404} />
          <Route exact path="*" component={NotFound} status={404} />
          </Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
