import React, { Component } from 'react';
import styles from '../css/body.module.css'

class Body extends Component {
  render() {
    return (
      <div className={styles.body}>
       <Playlist/>
      </div>
    )
  }
}

class Playlist extends Component {
  constructor(props) {
    super(props)
    this.playlistURL = 'http://localhost:8090/'
    this.youtubeBaseURL = 'https://www.youtube.com/watch?v='
    this.state = { results: null }

    this.updatePlayer = this.updatePlayer.bind(this)
    this.fetchPlaylist = this.fetchPlaylist.bind(this)
  }

  componentDidMount() {
    fetch(this.playlistURL, {mode: 'cors'})
      .then(response => response.json())
      .then(result => this.setState(
        {
          results: result,
          current: result.items[0].contentDetails.videoId,
          nextPageToken: result.nextPageToken,
        }))
        .then(console.log(this.state))
      .catch(error => error)
  }

  fetchPlaylist() {
    let nextPageToken = this.state.nextPageToken
    console.log(nextPageToken)
    if (nextPageToken) {
      let url = this.playlistURL + '?nextPageToken=' + nextPageToken
      fetch(url, {mode: 'cors'})
        .then(response => response.json())
        .then(result => this.setState(
          {
            results: {
              ...this.state.results, 
              ...result,
            nextPageToken: result.nextPageToken
            }
          }))
        .then(console.log(this.state))
        .catch(error => error)   
    }
  }

  updatePlayer(videoId) {
    if (videoId !== this.state.current) {
      this.setState({current: videoId})
    }
  }

  render() {
    let videos = this.state.results
  
    if (videos) {
      return (
        <div className={styles.playlist}>
          <div className={styles.videoPanel}>
            <VideoPanel 
              videos={videos} 
              updatePlayer={this.updatePlayer}
              fetchMore={this.fetchPlaylist}
            /> 
          </div>
          <div className={styles.videoPlayer}>
            <VideoPlayer video={this.state.current}/>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}


class VideoPanel extends Component {
  constructor(props) {
    super(props)
    this.fetchMore = props.fetchMore
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }
 
  isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight
  } 
  
  trackScrolling = () => {
    const wrappedElement = document.getElementById('videoPanel')
    if (this.isBottom(wrappedElement)) {
      console.log("Bottom has been reached")
      this.fetchMore()
    }
  }

  render() {
    let {videos, updatePlayer} = this.props
    return (
      <div id="videoPanel">
        {videos.items.map(video => 
          <VideoCell 
            image={video.snippet.thumbnails.default}
            url={this.youtubeBaseURL+video.contentDetails.videoId}
            description={video.snippet.description}
            title={video.snippet.title}
            onClick={(videoId) => updatePlayer(videoId)}
            id={video.contentDetails.videoId}
            key={video.contentDetails.videoId}
          />      
        )}
      </div>
    )
  }

}


const VideoCell = ({ image, url, description, title, onClick, id}) =>
    <div className={styles.videoCell} onClick={() => onClick(id)}>
      <div className={styles.image}>
        <img src={image.url} 
             height={image.height} 
             width={image.width}
             alt={title}/>
      </div>
      <div className={styles.title}>
        {title.substring(0,70)}
      </div>
      <div className={styles.description}>
        {(description.length < 100) ? description : description.substring(0,96) + ' ...'}
      </div>
    </div>




class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.init();
    
    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = false;
      this.player = new window['YT'].Player('player', {
        videoId: this.props.video,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            if (!this.reframed) {
              this.reframed = true;
              reframe(e.target.a);
            }
          }
        }
      });
    };
  }


  render() {
    if (this.player) {
      this.player.loadVideoById(this.props.video)
    }

    const style = `.max-width-1024 { max-width: 1024px; margin: 0 auto; }`;
    return (
      <div>
        <style>{style}</style>
        <div className="max-width-1024">
          <div className="embed-responsive embed-responsive-16by9" id="player">
          </div>
        </div>
      </div>
    );
  }

  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  onPlayerStateChange(event) {
    console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    };
  };
  //utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };
}



function reframe(e,t){
  var i = "string" == typeof e ? document.querySelectorAll(e) : e, n = t ||"js-reframe";"length"in i||(i=[i]);
  for(var o=0;o<i.length;o+=1){
    var r = i[o];
    if(-1 !== r.className.split(" ").indexOf(n))
      return;
    var f = r.offsetHeight/r.offsetWidth*100, d = document.createElement("div");
    d.className = n;
    var a = d.style;
    a.position = "relative";
    a.width = "100%";
    a.paddingTop = f+"%";
    var s=r.style;
    s.position="absolute";s.width="100%";s.height="100%";s.left="0";s.top="0";r.parentNode.insertBefore(d,r);r.parentNode.removeChild(r);d.appendChild(r);
  }
};




export default Body
