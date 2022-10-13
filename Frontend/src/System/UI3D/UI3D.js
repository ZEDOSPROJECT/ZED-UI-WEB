import React from 'react';
import { REST_URL } from '../../REST_URL';
import './UI3D.css';

export default class UI3D extends React.PureComponent {

    componentDidMount(){
        
        if(this.webview){
            this.webview.addEventListener('console-message', (e) => {
                let windowSystemSize={};
                windowSystemSize['Width']=0;
                windowSystemSize['Height']=0;

                if(e.message.includes("3DOPEN|")){
                    let command=e.message.split("|")[1];
                    if(command==="My Computer"){
                        this.props.onClickApp(null,"","MyComputer",REST_URL+"/Icons/ModernXP (35).png",windowSystemSize,true);
                    }else{
                        this.props.onClickApp(null,REST_URL+"/APPS/"+command+"/",command,REST_URL+"/APPS/"+command+"/favicon.png",windowSystemSize,false)
                    }
                }   
            });
        }
    }

    render(){
        return(<webview 
                    className="UI3D"
                    ref={(input) => { this.webview = input; }}
                    src={REST_URL+"/3DUI/ZED_3D.html"}
                />)
    }    
}