import React, {Component} from 'react';
import Window from './Window/window';
import './windowManager.css';


function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

class WindowManager extends Component {
    constructor(props){
        super(props)
        this.state = {
            openedWindows:[],
            maxZIndex: 1,
        };
        this.createWindow = this.createWindow.bind(this);
        this.uuidv4 = this.uuidv4.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
        this.onClose = this.onClose.bind(this);
    } 

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    sendToFront(i){
        if(i<=this.state.maxZIndex){
            return true;
        } else {
            this.setState({ maxZIndex:  i })
            return false;
        } 
    } 

    onClose(uuid){
        let newData = this.state.openedWindows;
        let i=0;
        newData.forEach(element => {
            if( element.UUID === uuid ){
                console.log(i);
                newData.splice(i, 1);
            } 
            i++;
        });
        this.setState({ openedWindows: newData });
    } 

    createWindow(url,title,icon){
        const uuid = this.uuidv4();
        var newList = this.state.openedWindows;
        newList.push({ 'UUID'  : uuid, 'WINDOW' : (
            <Window 
                    url={url}  
                    title={title}  
                    icon={icon}
                    uuid={uuid}   
                    onClose={this.onClose} 
                    sendToFront={this.sendToFront} 
                    maxZIndex={this.state.maxZIndex+1} 
            />
        )});
        this.setState({ openedWindows: newList });
        this.setState({ maxZIndex:  this.state.maxZIndex+1 });
    } 
    
    render() {
        const windowList=this.state.openedWindows.map((item) => {
            return(
                item['WINDOW']
            );
        })
        return (
            <div className="windowArea">
                <button onClick={event => (this.createWindow("http://zedos.esy.es/","TESTE","http://www.bluemed-project.eu/wp-content/uploads/2016/12/Logo-5.png"))} >OK</button>
                {windowList}
            </div>
        );
    }
}

export default WindowManager;