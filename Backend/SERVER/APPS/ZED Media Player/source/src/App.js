import React from 'react';
import MPlayer from 'react-player';
import Controls from './Components/Controls/Controls';
import placeholder from './Images/placeholder.png';
import './App.css';

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      url:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      loop:true,
      playing:false,
      currentTime:0
    }
    this.handlePlayerClick=this.handlePlayerClick.bind(this);
    this.onProgress=this.onProgress.bind(this);
    this.goToTime = this.goToTime.bind(this);
  }

  handlePlayerClick(e){
    this.setState({
      playing: !this.state.playing
    })
  }

  onProgress(e){
    this.setState({
      currentTime: e.played
    })
  }

  goToTime(e){
    this.player.seekTo(e.target.value);
  }

  ref = player => {
    this.player = player
  }
  
  render(){
    return(<div>
      <MPlayer
        ref={this.ref}
        className="MPlayer"
        width="100%"
        height="100%"
        light={placeholder}
        playing={this.state.playing}
        onClick={this.handlePlayerClick}
        loop={this.state.loop}
        onProgress={this.onProgress}
        controls={false}
        url={this.state.url}
      />
      <Controls
        handlePlayerClick={this.handlePlayerClick}
        currentTime={this.state.currentTime}
        goToTime={this.goToTime}
        playing={this.state.playing}
      />
    </div>)
  }
}
