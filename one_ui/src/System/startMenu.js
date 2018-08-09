import React from 'react';
import './startMenu.css';

class StartMenu extends React.Component {
    render(){
        return(
            <div className={this.props.visible ? 'startMenuOpen' :'startMenu'}>
                <div className="leftPanel">
                    <img alt="" className="menuIcon" src="https://www.rit.edu/science/sites/rit.edu.science/files/root/man-placeholder_27.jpg" />
                </div>
            </div>
        );
    }
}

export default StartMenu;