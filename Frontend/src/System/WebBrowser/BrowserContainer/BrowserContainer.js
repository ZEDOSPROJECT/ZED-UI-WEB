import React from "react";
import ReactButton from '../ToolBox/Button/Button';
import png_Back from "../ToolBox/Icons/back.png";
import png_Forward from "../ToolBox/Icons/forward.png";
import png_Refresh from "../ToolBox/Icons/refresh.png";
import "../ToolBox/ToolBox.css";
import "./BrowserContainer.css";

class BrowserContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      currentURL: "https://google.com",
      inputURL: "https://google.com"
    };
  }

  handleUrlChange = e => {
    this.setState({ inputURL: e.target.value });
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      let tmpURL = this.state.inputURL;
      if (!tmpURL.includes("https://")) {
        tmpURL = "https://" + tmpURL;
      }
      this.setState({ currentURL: tmpURL, inputURL: tmpURL });
    }
  };

  select = e => {
    e.target.select();
  };

  onRefresh = () => {
    this.webview.reload();
  };

  onBack = () => {
    this.webview.goBack();
  }

  onForward = () => {
    this.webview.goForward();
  }

  componentDidMount(){
    if(this.webview){
        this.webview.addEventListener('dom-ready', (e) => {
            this.setState({ currentURL: this.webview.getURL()})
            this.forceUpdate();
        });
    }
}

  render() {
    console.log(this.props.x);
    return (
      <div className="BrowserContainer">
        <table className="ToolBox">
        <tbody>
          <tr>
            <td style={{ width: 90 }}>
              <ReactButton icon={png_Back} onClick={this.onBack} />
              <ReactButton icon={png_Forward} onClick={this.onForward} />
              <ReactButton icon={png_Refresh} onClick={this.onRefresh} />
            </td>
            <td>
              <input
                className="WebAdress"
                placeholder=" Address . . ."
                type="text"
                defaultValue="https://google.com"
                onClick={this.select}
                value={this.inputURL}
                onChange={this.handleUrlChange}
                onKeyDown={this._handleKeyDown}
              />
            </td>
            <td style={{ width: 20 }} />
          </tr>
        </tbody>
      </table>
        <webview
          src={this.state.currentURL}
          className="WebFrame"
          ref={input => {
            this.webview = input;
          }}
        />
      </div>
    );
  }
}

export default BrowserContainer;
