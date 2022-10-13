import React from 'react';
import './NewTab.css';

class NewTab extends React.Component {
    constructor(props){
        super(props)

        this.OnNewTab = this.OnNewTab.bind(this);
    }

    OnNewTab(){
        this.props.newTab("");
    }

    render(){
        return(<div onClick={this.OnNewTab} className="NewTab"><b>+</b></div>)
    }
}

export default NewTab;