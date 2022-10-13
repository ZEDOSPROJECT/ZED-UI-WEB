import React from 'react';
import FavoriteItem from './FavoriteItem/FavoriteItem';
import './FavoritePages.css';

class FavoritesPages extends React.Component {
    constructor(props){
        super(props);

        // localStorage.setItem('favsList', JSON.stringify(tmpFav));
        if(!localStorage.getItem('favsList')){
            const tmpFav={
                "data": []
            }
            localStorage.setItem('favsList', JSON.stringify(tmpFav));
        }

        this.state={
            favsList: JSON.parse(localStorage.getItem('favsList'))
        }

        this.updateFavs = this.updateFavs.bind(this);

        setInterval(() => {
            this.updateFavs();
        }, 200);
    }

    updateFavs(){
        this.setState({
            favsList: JSON.parse(localStorage.getItem('favsList'))
        });
    }

    render(){
        if(this.props.visible){
            let finalFavs=this.state.favsList.data.map((item, i) => {
                return <FavoriteItem ID={i} onLoadPage={this.props.onLoadPage} TITLE={item.TITLE} URL={item.URL}/>;
            }) 
            return(
                <div className="FavoritesPages">
                    <div className="FavoritesPagesTitle">
                        <b>My Favorites Sites:</b>
                        <div className="FavoritesPagesList">
                            {finalFavs}
                        </div>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
}

export default FavoritesPages