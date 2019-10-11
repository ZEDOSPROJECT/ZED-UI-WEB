import React from 'react';
import './CategoryTitle.css';

class CategoryTitle extends React.Component {
    render(){
        return(
            <div className="CategoryTitle">
                <i><b>{this.props.label}</b></i>
                <div className="CategoryTitleBar"></div>
            </div>
        )
    }
}

export default CategoryTitle;