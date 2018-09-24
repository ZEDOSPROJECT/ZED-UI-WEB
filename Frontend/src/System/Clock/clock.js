import React from 'react';
import './clock.css';

class Clock extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            time: new Date()
        }
    }

    componentDidMount() {
        setInterval(this.update, 1000)       
    }

    update = () => { 
        this.setState({
            time: new Date()
        })   
    };

    render(){
		const h = this.state.time.getHours()
        const mn = this.state.time.getMinutes()
        return(
            <div className='Clock'>
                <div>{h % 12}:{(mn < 10 ? '0' + mn : mn)}</div>
            </div>
        );
    }
}

export default Clock;