import React, { Component } from 'react';
import TaskBar from './System/taskbar';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      Process: []
    }
  }

  render() {
    return (
      <div className="App">
        <TaskBar/>
      </div>
    );
  }
}

export default App;
