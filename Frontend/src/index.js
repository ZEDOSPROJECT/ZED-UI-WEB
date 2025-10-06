import React from 'react';
import { createRoot } from 'react-dom/client';
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
//             root.render(<OOBE />);
//         }else{
//             root.render(<App />);
//         }
// });

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

registerServiceWorker();
