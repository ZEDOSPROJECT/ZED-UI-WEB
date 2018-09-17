import React, {Component} from 'react';
import Window from './Window/window';
import './windowManager.css';

class WindowManager extends Component {
    constructor(props){
        super(props)
        this.state = {
            openedWindows:  [] 
        };
    } 
    
    render() {
        return (
            <div className="windowArea">
                <Window 
                    url="http://zedos.esy.es/"
                    title="TESTE"
                    icon="http://www.bluemed-project.eu/wp-content/uploads/2016/12/Logo-5.png"
                />
            </div>
        );
    }
}

export default WindowManager;