import "./styles/app.scss";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import getSongs from "./data";
import { useState, useRef } from "react";

function App() {
  const [songs, setSongs] = useState(getSongs());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const audioRef = useRef("null");

  const timeUpdateHandler = (e) => {
    const { currentTime, duration } = e.target;
    const roundedCurrent = Math.round(currentTime);
    const roundedDuration = Math.round(duration);
    const animationPercentage = Math.round(
      (roundedCurrent / roundedDuration) * 100
    );
    setSongInfo({ ...songInfo, currentTime, duration, animationPercentage });
  };

  const songEndHandler = async () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        songs={songs}
        setSongs={setSongs}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
      />
      <Library
        audioRef={audioRef}
        songs={songs}
        libraryStatus={libraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        setCurrentSong={setCurrentSong}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      />
    </div>
  );
}

export default App;
