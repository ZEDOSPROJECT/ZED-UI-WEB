import React from "react";
import ReactButton from '../ToolBox/Button/Button';
import png_Back from "../ToolBox/Icons/back.png";
import png_Forward from "../ToolBox/Icons/forward.png";
import png_Refresh from "../ToolBox/Icons/refresh.png";
import "../ToolBox/ToolBox.css";
import "./BrowserContainer.css";

class BrowserContainer extends React.Component {
  constructor(props) {
    super(props);
    let URL="";
    if(this.props.URL!=="" && this.props.URL!==undefined){
      URL=this.props.URL;
    }else{
      URL="https://google.com/";
    }
    this.state = {
      currentURL: URL,
      inputURL: URL,
      uuid: this.props.id
    };
  }

  handleUrlChange = e => {
    this.setState({ inputURL: e.target.value });
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      let tmpURL = this.state.inputURL;
      if (!tmpURL.includes("https://") || !tmpURL.includes("http://")) {
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

        this.webview.addEventListener('page-title-updated', (e) => {
            this.props.OnTitleChange(this.state.uuid,e.title);
            this.forceUpdate();
        });

        this.webview.addEventListener('page-favicon-updated', (e) => {
          this.props.onFavChange(this.state.uuid,e.favicons[0]);
          this.forceUpdate();
      });

        this.webview.addEventListener('did-navigate', (e) => {
          let newUrl=e.url.toString();
          this.setState(
            {
              inputURL: newUrl
            }
          );
        });

        this.webview.addEventListener('new-window', (e) => {
          this.props.newTab(e.url);
        });
        
    }
  }

  render() {
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
                value={this.state.inputURL}
                onChange={this.handleUrlChange}
                onKeyDown={this._handleKeyDown}
              />
            </td>
            <td style={{ width: 20 }} />
          </tr>
        </tbody>
      </table>
        <webview
          useragent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3626.120 Safari/537.36"
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
