import React from 'react'
import invert from 'invert-color';
import _ from 'lodash';
import favorite from '../../../Icons/ModernXP (8).png';
import { REST_URL } from './../../../REST_URL';
import './appCard.css';

class appCard extends React.Component{
    constructor(props){
        super(props);
        this.addToFavorites = this.addToFavorites.bind(this);
        this.findIfIsFavorite = this.findIfIsFavorite.bind(this);
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
        }else{
            tmpFavorites.splice(favoriteID, 1);
            tmpFinalFav["favorites"]=tmpFavorites;
            localStorage[localStorage.currentLAN+"|favoriteIcons"]=JSON.stringify(tmpFinalFav);
        }
        this.props.forceRefreshApps();
    }

    render(){
        const appIcon=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
        const appName=this.props.appName;
        const windowSize=this.props.windowSize;
        let style="isAppNotFavorite";

        if(localStorage[localStorage.currentLAN+"|favoriteIcons"]){
            var tmpFavorites=JSON.parse(localStorage[localStorage.currentLAN+"|favoriteIcons"]).favorites;
            var tmpObject={};
            tmpObject['WindowSize']=this.props.windowSize;
            tmpObject['Icon']=REST_URL+"/APPS/"+this.props.appName+"/favicon.png";
            tmpObject['Name']=this.props.appName;
            tmpObject['RequireInternet']=this.props.requireInternet;

            if(this.findIfIsFavorite(tmpObject,tmpFavorites)>=0){
                style="isAppFavorite";
            }
        }
        if(this.props.requireInternet.toString() === "true"){
            let finalIR = "true";
            if(localStorage !== undefined){
                finalIR=localStorage.hasInternet;
            }
            if(finalIR === "true"){
                return(
                    <div>
                        <div onClick={(event) => (this.props.onClickApp(event,REST_URL+"/APPS/"+appName+"/",appName,REST_URL+"/APPS/"+appName+"/favicon.png",windowSize,false))} className="appCard">
                            <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIcon" src={appIcon}  /><div className="appCardTitle">{appName} </div>
                        </div>
                        <div onClick={this.addToFavorites} className="addToDeskop"><img draggable="false" alt="" className={style} src={favorite}/></div>
                    </div>
                );
            }else{
                return(
                    <div>
                        <div className="appCardOffline ">
                            <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIconOffline" src={appIcon}  /><div className="appCardTitle">{appName} </div>
                        </div>
                        <div onClick={this.addToFavorites} className="addToDeskop"><img draggable="false" alt="" className={style} src={favorite}/></div>
                    </div>
                );
            }
        }else{
            return(
                <div>
                    <div onClick={(event) => (this.props.onClickApp(event,REST_URL+"/APPS/"+appName+"/",appName,REST_URL+"/APPS/"+appName+"/favicon.png",windowSize,false))} className="appCard">
                        <img draggable="false" alt="" style={{ color: invert(window.systemColor0, true)}} className="appCardIcon" src={appIcon}  /><div className="appCardTitle">{appName} </div>
                    </div>
                    <div onClick={this.addToFavorites} className="addToDeskop"><img draggable="false" alt="" className={style} src={favorite}/></div>
                </div>
            );  
        }
    }
}    

export default appCard;