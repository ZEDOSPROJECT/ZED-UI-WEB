import React from 'react'
import invert from 'invert-color';
import _ from 'lodash';
import favorite from '../../../Icons/ModernXP (8).png';
import { REST_URL } from './../../../REST_URL';
import './appCard.css';

class appCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isFavorite: false
        };
        this.addToFavorites = this.addToFavorites.bind(this);
        this.findIfIsFavorite = this.findIfIsFavorite.bind(this);
        this.checkFavoriteStatus = this.checkFavoriteStatus.bind(this);
    }

    componentDidMount() {
        this.checkFavoriteStatus();
        
        // Check internet status more frequently
        this.internetCheckInterval = setInterval(() => {
            this.forceUpdate();
        }, 500); // Check every 500ms for faster response
    }

    componentWillUnmount() {
        if (this.internetCheckInterval) {
            clearInterval(this.internetCheckInterval);
        }
    }

    checkFavoriteStatus() {
        if(localStorage[localStorage.currentLAN+"|favoriteIcons"]){
            var tmpFavorites=JSON.parse(localStorage[localStorage.currentLAN+"|favoriteIcons"]).favorites;
            var tmpObject={};
            tmpObject['WindowSize']=this.props.windowSize;
            tmpObject['Icon']=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
            tmpObject['Name']=this.props.appName;
            tmpObject['RequireInternet']=this.props.requireInternet;

            const isFav = this.findIfIsFavorite(tmpObject,tmpFavorites) >= 0;
            if (this.state.isFavorite !== isFav) {
                this.setState({ isFavorite: isFav });
            }
        } else {
            if (this.state.isFavorite !== false) {
                this.setState({ isFavorite: false });
            }
        }
    }

    findIfIsFavorite(newObj,list){
        let found=-1;
        let id=0;
        list.forEach(element => {
            if(_.isEqual(element, newObj)){
                found=id;
            }
            id++;
        });
        return found;
    }

    addToFavorites(){
        var tmpFavorites = [];
        let tmpFinalFav={};
        var tmpObject={};

        if(localStorage[localStorage.currentLAN+"|favoriteIcons"]){
            tmpFavorites=JSON.parse(localStorage[localStorage.currentLAN+"|favoriteIcons"]).favorites;
        }
        tmpObject['WindowSize']=this.props.windowSize;
        tmpObject['Icon']=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        tmpObject['Name']=this.props.appName;
        tmpObject['RequireInternet']=this.props.requireInternet;

        let favoriteID=this.findIfIsFavorite(tmpObject,tmpFavorites);
        if(favoriteID<0){
            tmpFavorites.push(tmpObject);
            tmpFinalFav["favorites"]=tmpFavorites;
            localStorage[localStorage.currentLAN+"|favoriteIcons"]=JSON.stringify(tmpFinalFav);
            this.setState({ isFavorite: true });
        }else{
            tmpFavorites.splice(favoriteID, 1);
            tmpFinalFav["favorites"]=tmpFavorites;
            localStorage[localStorage.currentLAN+"|favoriteIcons"]=JSON.stringify(tmpFinalFav);
            this.setState({ isFavorite: false });
        }
        // Não chama mais forceRefreshApps - apenas atualiza o estado local
    }

    render(){
        const appIcon=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        const appName=this.props.appName;
        const windowSize=this.props.windowSize;
        const style = this.state.isFavorite ? "isAppFavorite" : "isAppNotFavorite";

        if(this.props.requireInternet.toString() === "true"){
            let finalIR = "false"; // Default to false
            if(localStorage.hasInternet !== undefined){
                finalIR = localStorage.hasInternet;
            }
            
            if(finalIR === "true"){
                return(
                    <div className="appCard" onClick={(event) => {this.props.onClickApp(event,REST_URL+"/APPS/"+appName+"/",appName,REST_URL+"/APPS/"+appName+"/favicon.png",windowSize,false)}}>
                        <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIcon" src={appIcon}  />
                        <div className="appCardTitle">{appName}</div>
                        <div onClick={(e) => {e.stopPropagation(); this.addToFavorites();}} className="addToDeskop">
                            <img draggable="false" alt="" className={style} src={favorite}/>
                        </div>
                    </div>
                );
            }else{
                return(
                    <div className="appCardOffline">
                        <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIconOffline" src={appIcon}  />
                        <div className="appCardTitle">{appName}</div>
                        <div onClick={(e) => {e.stopPropagation(); this.addToFavorites();}} className="addToDeskop">
                            <img draggable="false" alt="" className={style} src={favorite}/>
                        </div>
                    </div>
                );
            }
        }else{
            return(
                <div className="appCard" onClick={(event) => {this.props.onClickApp(event,REST_URL+"/APPS/"+appName+"/",appName,REST_URL+"/APPS/"+appName+"/favicon.png",windowSize,false)}}>
                    <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIcon" src={appIcon}  />
                    <div className="appCardTitle">{appName}</div>
                    <div onClick={(e) => {e.stopPropagation(); this.addToFavorites();}} className="addToDeskop">
                        <img draggable="false" alt="" className={style} src={favorite}/>
                    </div>
                </div>
            );  
        }
    }
}    

export default appCard;