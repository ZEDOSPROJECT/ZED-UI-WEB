import React from 'react';
import './NewTab.css';

class NewTab extends React.Component {
    render(){
        return(<div onClick={this.props.newTab} className="NewTab"><b>+</b></div>)
    }
}

export default NewTab;