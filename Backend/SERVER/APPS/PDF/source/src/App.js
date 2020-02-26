import React from 'react';
import { PDFReader } from 'reactjs-pdf-reader';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    let path="";
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('path');
    if(myParam  !== null){
      path=myParam;
    }
    let url = "http://"+window.location.hostname + ":3031/API/SYSTEM/IO/FILE/read.php?path=" + path;
    this.state={
      currentPDF: url
    };
  }
  render(){
    return (
      <div className="App">
          <PDFReader
            url={this.state.currentPDF}
            showAllPage={true}
          />
      </div>
    );
  }
}

export default App;
