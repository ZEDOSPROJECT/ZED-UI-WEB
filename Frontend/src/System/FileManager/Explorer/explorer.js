import React from "react";
import Icon from "./Icon/icon";
import "./explorer.css";

class Explorer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let indents 
    if(this.props.listDir!=undefined){
      indents=this.props.listDir.map(data => {
        return (
          <Icon
            onIClick={this.props.onIClick}
            onDBClick={this.props.onDBClick}
            selected={this.props.selected}
            key={data.name}
            data={data}
          />
        );
      });  
    }else {
      indents=<div>Loading . . .</div>;
    } 
    return <div className="fExplorer"> {indents}</div>;
  }
}

export default Explorer;
