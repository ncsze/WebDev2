import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

const Home = () => {
	return (
		<div>
			<p>
				This shows everything Marvel has ever done. I had to give them my email for this; do not tell them I showed you all their deeply hidden secrets.
				<br />
				By using this site, you agree to our Terms of Service, our Privacy Policy, and our Binding Legal Document Nobody Has Read Yet.
			</p>

			<p>
				<Link className='navlink' to='/characters/page/0'>
					Characters
				</Link>
                <Link className='navlink' to='/comics/page/0'>
					Comics
				</Link>
                <Link className='navlink' to='/series/page/0'>
					Series
				</Link>
			</p>
		</div>
	);
};

export default Home;
