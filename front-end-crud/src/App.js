import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home/Home';
import React from 'react';
import Notify from './Notify';
import Dashboard from './Dashboard/Dashboard';
import Privateroute from './Privateroute';
import store from './store';
import { Provider } from 'react-redux';

function App() {

  return (
      <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={
          <Privateroute>
            <Dashboard />
          </Privateroute>

        } />
      </Routes>

      <Notify />
    </BrowserRouter>
      </Provider>
  );
}

export default App;
