import React, { Component } from 'react';
import TaskBar from './System/Taskbar/taskbar';
import './App.css';
import StartMenu from './System/StartMenu/startMenu';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      Process: [],
      showMenu: false
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(){
      this.setState({
          showMenu: !this.state.showMenu,
      });
  }

  render() {
    return (
      <div className="App">
        <TaskBar toggleMenu={this.toggleMenu}/>
        <StartMenu toggleMenu={this.toggleMenu} visible={this.state.showMenu}/>
      </div>
    );
  }
}

export default App;
