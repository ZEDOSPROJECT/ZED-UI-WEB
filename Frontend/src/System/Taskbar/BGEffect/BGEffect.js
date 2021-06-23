import React from 'react';
import './BGEffect.css';

export default class BGEffect extends React.PureComponent {
    shouldComponentUpdate(nextProps, nextState) {
        return true;
      }
    render(){
        return(<div className="BGEffect">
            
        </div>)
    }
}