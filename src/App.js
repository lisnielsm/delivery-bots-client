import React from 'react';
import "./App.css";

import Menu from './components/Menu';
import Header from './components/Header';
import Deliveries from './components/Deliveries';
import NewDelivery from './components/NewDelivery';
import EditDelivery from './components/EditDelivery';
import Bots from './components/Bots';
import NewBot from './components/NewBot';
import EditBot from './components/EditBot';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

function App() {
	return (
		<Router>
			<Provider store={store}>
				<div className="d-flex flex-column justify-content-between w-100 h-100">
					<div>
						<Header />

						<div className="container mt-5">
							<Menu />

							<Routes>
								<Route path='/' element={<Deliveries />} />
								<Route path='/deliveries/new' element={<NewDelivery />} />
								<Route path='/deliveries/edit/:id' element={<EditDelivery />} />
								<Route path='/bots' element={<Bots />} />
								<Route path='/bots/new' element={<NewBot />} />
								<Route path='/bots/edit/:id' element={<EditBot />} />
							</Routes>
						</div>
					</div>
					<div>
						<footer className="footer">
							<div className="d-flex justify-content-center align-items-center">
								<div><span>{'\u00A9'}</span> 2022 Lisniel Sánchez Morales</div>
							</div>
						</footer>
					</div>
				</div>
			</Provider>
		</Router>
	);
}

export default App;
