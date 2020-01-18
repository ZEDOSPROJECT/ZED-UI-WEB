import React from 'react';
import PageIcon from '../../../../Icons/ModernXP (68).png';
import DeleteIcon from '../../../../Icons/240.ico';
import './FavoriteItem.css';

class FavoriteItem extends React.Component {
    constructor(props){
        super(props);
        this.state={
            ID: this.props.ID
        }
        this.onLoadPage = this.onLoadPage.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    onLoadPage(){
        this.props.onLoadPage(this.props.URL);
    }
    

    onRemove(){
        let tmpJ=JSON.parse(localStorage.getItem('favsList'));
        tmpJ.data.splice(this.state.ID, 1);
        localStorage.setItem('favsList', JSON.stringify(tmpJ));
    }

    render(){
        return(
            <div className="FavoriteItem" title={this.props.TITLE}>
                <img src={PageIcon} alt="" className="FavoriteItemIcon"/>
                <div onClick={this.onLoadPage} className="FavoriteItemLabel">
                    {this.props.TITLE}
                </div>
                <img className="deleteIconFav" onClick={this.onRemove} src={DeleteIcon} />
                <br/ >
            </div>
        );
    }
}

export default FavoriteItem;