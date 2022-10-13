import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import OOBE from './OOBE/OOBE';
import registerServiceWorker from './registerServiceWorker';
// import { REST_URL } from './REST_URL';



// TEMPORARY OOBE
// fetch(REST_URL+'/API/SYSTEM/SETTINGS/USER/getPaths.php')
//     .then(response => response.json())
//     .then(json => {
//         if(json['username']==="zed"){
//             ReactDOM.render(<OOBE />, document.getElementById('root'));
//         }else{
//             ReactDOM.render(<App />, document.getElementById('root'));
//         }
// });

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
