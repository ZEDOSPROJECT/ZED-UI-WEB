import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import OOBE from './OOBE/OOBE';
import registerServiceWorker from './registerServiceWorker';


if(localStorage.OOBE){
    ReactDOM.render(<App />, document.getElementById('root'));
}else{
    ReactDOM.render(<OOBE />, document.getElementById('root'));
}
registerServiceWorker();
