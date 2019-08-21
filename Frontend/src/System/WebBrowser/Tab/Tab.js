import React from "react";
import noFavicon from './noFavicon.png';
import "./Tab.css";

class Tab extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      id: this.props.id
    }

    this.handleClick = this.handleClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleClick(){
    this.props.switchTab(this.props.id);
  }

  onClose() {
    this.props.closeTab(this.state.id);
  }

  render() {
    let favIcoURL;
    if(this.props.favIcoURL!==undefined){
      favIcoURL=this.props.favIcoURL;
    }
    else{
      favIcoURL=noFavicon;
    }
    if(this.props.selected)
      return <div title={this.props.title} onClick={this.handleClick} className="TabSelected">
              <img alt="" className="favIcon" src={favIcoURL} />
              {this.props.title}
            </div>;
    else
      return <div title={this.props.title} onClick={this.handleClick} className="Tab">
                <img alt="" className="favIcon" src={favIcoURL} />
                {this.props.title}
                <div className="closeBTN" onClick={this.onClose}>X</div>
              </div>;
  }
}

export default Tab;
