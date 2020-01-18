import React from 'react';
import Progress from 'react-progressbar';
import copyAnimation from './copy.gif';
import { REST_URL } from '../../../REST_URL';
import './copy.css';

class Copy extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            uuid: this.props.uuid,
            percentage: '0',
            currentFile: ''
        }
        this.readyRequest=true;  

        fetch(REST_URL+'/API/SYSTEM/IO/copy.php?uuid='+this.props.UUID+"&from="+this.props.from+"&to="+this.props.to)
        .then(response => response.text())
        .then(text => {
            setInterval(() => {
                fetch(REST_URL+'/API/SYSTEM/IO/getCopy.php?uuid='+this.props.UUID)
                .then(response => response.text())
                .then(progress => {
                    if(progress==="FINISHED"){
                        this.props.onClose();
                    }else{
                        const data=progress.split("|");
                        this.setState({
                            currentFile: data[0],
                            percentage: data[1]
                        })
                        this.props.onTitleChange("Copying "+data[1]+"%");
                    }
                });
            }, 1400);
        });

    }
    render(){  
        return(<div className="copyForm">
            <img className="copyAnimation" alt="" draggable="false" style={{width: "380px", height: 'auto'}} src={copyAnimation}/>
            <div className="copyStatus">
                Copying {this.state.currentFile}
            </div>
            <Progress className="copyProgress" color="midnightblue" completed={Number(this.state.percentage)} />
        </div>)
    }
}

export default Copy;