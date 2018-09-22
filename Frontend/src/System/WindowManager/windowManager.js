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
    } 

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    sendToFront(){
        // let data=this.state.openedWindows;
        // data.forEach(function(item,i){
        // if(item.UUID === uuid ){
        //         data.splice(i, 1);
        //         data.unshift(item);
        //     }
        // });
        // this.setState({ openedWindows:  data })
        this.setState({ maxZIndex:  this.state.maxZIndex+10 })
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
                    sendToFront={this.sendToFront} 
                    maxZIndex={this.state.maxZIndex} 
            />
        )});
        this.setState({ openedWindows: newList });
        this.setState({ maxZIndex:  this.state.maxZIndex+10 });
    } 
    
    render() {
        const windowList=this.state.openedWindows.map((item) => {
            return(
                <p>{item['WINDOW'] } </p>
            );
        })
        console.log(windowList);
        return (
            <div className="windowArea">
                <button onClick={event => (this.createWindow("http://zedos.esy.es/","TESTE","http://www.bluemed-project.eu/wp-content/uploads/2016/12/Logo-5.png"))} >OK</button>
                {windowList}
            </div>
        );
    }
}

export default WindowManager;