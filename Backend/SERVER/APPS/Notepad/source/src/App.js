import React from "react";
import Button from "./Button/Buttons";
import saveICON from "./Icons/save.png";
import newICON from "./Icons/new.png";
import openICON from "./Icons/open.jpg";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: undefined,
      content: ""
    };

    this.getQueryParams = this.getQueryParams.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(e){
    this.setState({
      content: e.target.value
    });
  }

  componentWillMount() {
    let query = this.getQueryParams(document.location.search);
    if (query.file !== undefined) {
      this.setState({
        file: query.file
      });
      let url =
        "http://" +
        window.location.hostname +
        ":3031/API/SYSTEM/IO/FILE/read.php?path=" +
        query.file;
      fetch(url)
        .then((response) => response.text())
        .then((text) => {
          this.setState({
            content: text
          });
        });
        // eslint-disable-next-line
      document.title = query.file.replace(/^.*[\\\/]/, "") + " - Notepad";
    } else {
      document.title = "Untitled - Notepad";
    }
  }

  onSave(){
    fetch("http://" + window.location.hostname +":3031/API/SYSTEM/IO/FILE/save.php?path=" + this.state.file, {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
      body: this.state.content
  });
  }

  getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

    while ((tokens = re.exec(qs))) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }

  render() {
    return (
      <div className="App">
        <div className="toolbox">
          <Button icon={newICON} />
          <Button icon={openICON} />
          <Button onClick={this.onSave} icon={saveICON} />
        </div>
        <center>
          <textarea
            value={this.state.content}
            className="TextZone"
            onChange={this.handleContentChange}
          />
        </center>
      </div>
    );
  }
}
