import React from 'react';
const WM = require('simple-window-manager');

class windowManager extends React.Component{
    render(){
        var WM = require('simple-window-manager');

        // this is the window manager with one of the default options changed
        var wm = new WM({ backgroundColorWindow: 'green' });

        // enable window snapping to screen edges and other windows when moving
        wm.snap()

        // create a window    
        var window = wm.createWindow({ width: 500, height: 500, title: 'Test Window' });

        // set content of window
        window.content.style.margin = '10px';
        window.content.innerHTML = 'This is a nifty window.';

        // open the window
        window.open();

        return(
            <div></div>
        );
    } 
} 

export default windowManager;