import React from 'react';
import { render } from "react-dom";
 
import $ from 'jquery';
import "./Music.scss";
 // get our fontawesome imports
import { faPlay,faStepForward,faPause} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Music extends React.Component {
  state = { 
    url: "",
    imageUrl: "",
    name: "",
    artist: "",
    isPlaying :false,
  }
  
  currentSongIndex = 0
  songs = [
    {
      url: "http://s85.youtaker.com/other/2017/8-19/mp3239272886136a7f94f1bc49608987bf4d777ac57e85.mp3",
      imageUrl: "http://imge.kugou.com/stdmusic/20170810/20170810111013866169.jpg",
      name: "打上花火",
      artist: "DAOKO、米津玄師",
    },
    {
      url: "https://music.163.com/song/media/outer/url?id=1399534395.mp3",
      imageUrl: "http://imge.kugou.com/stdmusic/20170810/20170810111013866169.jpg",
      name: "世界美好与你环环相扣",
      artist: "unknown",
    },
    {
      url: "http://mp3.dwjgrw.cn/down/21353.mp3",
      imageUrl: "http://mp3.dwjgrw.cn/images/geshou/90.jpg",
      name: "漫步人生路",
      artist: "邓丽君",
    }
  ]

  nextSong() {
    this.currentSongIndex++;
    this.setState({
      url: this.songs[this.currentSongIndex % this.songs.length].url,
      imageUrl: this.songs[this.currentSongIndex % this.songs.length].imageUrl,
      name: this.songs[this.currentSongIndex % this.songs.length].name,
      artist: this.songs[this.currentSongIndex % this.songs.length].artist,
    })
  }

  componentDidMount() {
    var playNext = (e) => {
      $(".nextAnimation").addClass("col-md-12");
      if (e === true) {
        $(".playErrorInfo").css("display", "block");
        $(".nextAnimation").removeClass("col-md-12");
        $(".nextAnimation").addClass("col-md-9");
      }
      $(".playInfo").css("display", "flex").hide().fadeIn("1").delay(1000).fadeOut("1", ()=>{
        $(".nextAnimation").removeClass("col-md-12");
        $(".nextAnimation").removeClass("col-md-9");
        $(".playErrorInfo").css("display", "none");  
      });
      var index = 1;
      for(var i = 0; i < 8; i++){
        setTimeout(()=>{
          console.log($("#next"+(index++)).fadeTo(500, 1).delay(500).fadeTo(500, 0));
        }, i*64);
      }

      setTimeout(()=>{
        this.nextSong();
        $("#player")[0].load();
      //  $("#player")[0].play();
      }, 1000);
      setTimeout(() => {
        if (document.getElementById("player").readyState === 0) {
          playNext(true);
        }
      }, 5000)
    }

    var r = this;

    $(".audio-player-small").css("display", "flex").hide().slideDown(2500, function () {
      console.log("FadeinDone")
    });

    if (r.props.song != undefined && r.props.song.length > 0) {
      var isfound = false;
      for (var i = 0; i < this.songs.length; i++) {
        if (this.songs[i].name === r.props.song) {
          isfound = true;
          this.currentSongIndex = i;
          this.setState({  
            url: this.songs[i].url,
            imageUrl: this.songs[i].imageUrl,
            name: this.songs[i].name,
            artist: this.songs[i].artist,
          })
          break;
        }
      }
      if (!isfound) playNext();
    } else {
      playNext();
    }
    var jQuery = $;

    setTimeout(() => {
      if (document.getElementById("player").readyState === 0) {
        playNext(true);
      }
    }, 5000)

    $("#player").on("timeupdate", () => {
      initProgressBar();
    }).on("ended", ()=> {
      this.nextSong();
      $("#player")[0].load();
      $("#player")[0].play();
      console.log($("#player")[0].duration)
    })
    $("#next").on("click", () => {
      playNext();
    })
    $(".close").on("click",()=>{
      $(".audio-player-small").hide();
    })
    initPlayers(jQuery('#player-container').length);
    function calculateTotalValue(length) {
      var minutes = Math.floor(length / 60),
        seconds_int = length - minutes * 60,
        seconds_str = seconds_int.toString(),
        seconds = seconds_str.substr(0, 2),
        time = minutes + ':' + seconds
      return time;
    }

    function calculateCurrentValue(currentTime) {
      var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

      return current_time;
    }


 
    function initProgressBar() {

      var player = document.getElementById('player');
      var length = player.duration
      if (!length) return;
      if (!$('#play-btn').hasClass("pause") && player.paused === false) {
        $('#play-btn').addClass("pause")
      }
      var current_time = player.currentTime;

       
      // calculate total length of value
      var totalLength = calculateTotalValue(length)
      jQuery(".end-time").html(totalLength);

      // calculate current value time
      var currentTime = calculateCurrentValue(current_time);
      jQuery(".start-time").html(currentTime);

      $(".done").css("width", (player.currentTime / player.duration) * 100 + "%")
      document.getElementById('barBg').addEventListener("click", seek);
      var progressbar = document.getElementById('seekObj');
      progressbar.value = (player.currentTime / player.duration);
      progressbar.addEventListener("click", seek);

      if (player.currentTime == player.duration) {
        $('#play-btn').removeClass('pause');
      }

      function seek(evt) {
        console.log("clicked")
        var percent = evt.offsetX / this.offsetWidth;
        console.log(percent)

        player.currentTime = percent * player.duration;
        progressbar.value = percent / 100;
        $(".done").css("width", (player.currentTime / player.duration) * 100 + "%")

      }
    };

    function initPlayers(num) {
      // pass num in if there are multiple audio players e.g 'player' + i

      for (var i = 0; i < num; i++) {
        (function () {

          // Variables
          // ----------------------------------------------------------
          // audio embed object
           
           var player = document.getElementById('player');
           var isPlaying = false;
           var playBtn = document.getElementById('play-btn');

          // Controls Listeners
          // ----------------------------------------------------------
          if (playBtn != null) {
            playBtn.addEventListener('click', function () {
              togglePlay()
            });
          }

          // Controls & Sounds Methods
          // ----------------------------------------------------------
          function togglePlay() {
             
            if (player.paused) {
              player.play();
              $('#play-btn').addClass('pause');
              isPlaying = true;

            } else {
              player.pause();
              isPlaying = false;
              $('#play-btn').removeClass('pause');
            }
          }
        }());
      }
    }
  }

  render() {
    return (   
      <div>   
        <FontAwesomeIcon icon={["fal", "coffee"]} />
        <div className="audio-player-small ">
          {this.isPlaying ? 
             <FontAwesomeIcon id="play-btn" icon = {faPause} /> :
             <FontAwesomeIcon id="play-btn" icon = {faPlay } />
          }
          <FontAwesomeIcon id="play-btn" icon = {faPause} />
          <FontAwesomeIcon id="next" icon={faStepForward} />

          <div className="audio-wrapper" id="player-container"  >
            <audio id="player"  >
              <source src={this.state.url} type="audio/mp3" />
            </audio>
          </div>
          <div className="player-controls scrubber  overflow-hidden d-sm-none d-md-block ">
            {
              <p>{this.state.name} <small>by</small> {this.state.artist}
                <small style={{ marginLeft: "15px" }} className="start-time"></small>/
          <small style={{}} className="end-time"></small></p>
            }
            <div id="seekObjContainer">
              <progress id="seekObj" value="0" max="1">
              </progress>
              <div className="barBg " id="barBg">
                <div className="done  ">
                  <div className="spinner "></div>
                </div>
              </div>
            </div>

            <br />

          </div>
          <div className="album-image" style={{ backgroundImage: "url(" + this.state.imageUrl + ")" }}></div>

          <div className="playInfo row">
            <div className="playErrorInfo col-md-3">
              <p id="playErrorInfo">播放失败</p>
            </div>
            <div className="nextAnimation">
              <p>
                Next Song
              <span style={{ opacity: 0 }} className="nexti" id="next1">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next2">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next3">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next4">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next5">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next6">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next7">></span>
                <span style={{ opacity: 0 }} className="nexti" id="next8">></span>
              </p>
            </div>
          </div>
          <div id="close" type="button" className="close"></div>

          <div className="album-image" style={{ backgroundImage: "url(" + this.state.imageUrl + ")" }}></div>
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>

    )
  }
}

export default Music;