import React from "react";
import ReactButton from '../ToolBox/Button/Button';
import png_Back from "../ToolBox/Icons/back.png";
import png_Forward from "../ToolBox/Icons/forward.png";
import png_Refresh from "../ToolBox/Icons/refresh.png";
import png_Favorite from "../ToolBox/Icons/favorite.png";
import png_addFavorite from '../ToolBox/Icons/addFavs.png';
import FavoritePages from '../FavoritePages/FavoritePages';
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
      uuid: this.props.id,
      FavoritePagesVisible: false,
      currentTITLE: ""
    };

    this.handleSwitchFavorites = this.handleSwitchFavorites.bind(this);
    this.onLoadPage = this.onLoadPage.bind(this);
    this.isFavorite = this.isFavorite.bind(this);
    this.addToFavs = this.addToFavs.bind(this);
  }

  handleSwitchFavorites(){
    this.setState({
      FavoritePagesVisible: !this.state.FavoritePagesVisible
    })
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

  isFavorite(){
    const favJ=JSON.parse(localStorage.getItem('favsList'));
    let found=false;
    favJ.data.forEach(element => {
      if(element.URL === this.state.currentURL){
        found=true;
      }
    });
    return found;
  }

  componentDidMount(){
    if(this.webview){
        this.webview.addEventListener('dom-ready', (e) => {
            this.setState({ currentURL: this.webview.getURL()})
            this.forceUpdate();
        });

        this.webview.addEventListener('page-title-updated', (e) => {
            this.props.OnTitleChange(this.state.uuid,e.title);
            this.setState({
              currentTITLE: e.title
            })
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

  onLoadPage(url){
    this.setState({ currentURL: url, inputURL: url,FavoritePagesVisible: false });
  }

  addToFavs(){
    if(!this.isFavorite()){
      let tmpJ=JSON.parse(localStorage.getItem('favsList'));
      let tmpOBJ={
        "TITLE":this.state.currentTITLE,
        "URL":this.state.currentURL
      }
      tmpJ.data.push(tmpOBJ);
      localStorage.setItem('favsList', JSON.stringify(tmpJ));
    }
  }


  render() {
    let addFavoriteRender=<ReactButton DISBALED={this.isFavorite} onClick={this.addToFavs} icon={png_addFavorite}/>
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
            <td style={{ width: 60 }}>
              <ReactButton icon={png_Favorite} onClick={this.handleSwitchFavorites}/>
              {addFavoriteRender}
            </td>
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
        <FavoritePages onLoadPage={this.onLoadPage} visible={this.state.FavoritePagesVisible}/>
      </div>
    );
  }
}

export default BrowserContainer;
