import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import allSongs from './data/level12.json'
import SongWheelDiv from './components/SongWheelDiv.tsx'
import type { IIDXSong } from './components/SongWheelDiv.tsx'
import './App.css'

interface SongStatus extends IIDXSong {
    clear: string;
}

function App() {
  const [unselectedSongs, setUnselectedSongs] = useState<IIDXSong[]>(allSongs);
  const [selectedSongs, setSelectedSongs] = useState<SongStatus[]>([]);
  const [ulClassName, setUlClassName] = useState("start");
  
  const [songWheelSongs, setSongWheelSongs] = useState<IIDXSong[]>([
    {
        ver: "",
        title: "",
        diff: "",
        bpm: "",
        level: "",
    }, {
        ver: "",
        title: "Random Song Selector",
        diff: "",
        bpm: "",
        level: "",
    }, allSongs[0]
  ]);
  const [prevSong, setPrevSong] = useState<IIDXSong>({
        ver: "",
        title: "",
        diff: "",
        bpm: "",
        level: "",
    });
  const [lastSelectedSong, setLastSelectedSong] = useState<IIDXSong>({
        ver: "",
        title: "Random Song Selector",
        diff: "",
        bpm: "",
        level: "",
    });
  const [afterSong, setAfterSong] = useState<IIDXSong>(allSongs[0]);
  const clicked = useRef(false);
  const [resultAdded, setResultAdded] = useState<boolean>(true);

  useEffect(()=> {
    console.log(ulClassName === "none" && clicked.current)
    if(ulClassName === "none" && clicked.current){
        randomizeSongs();
    }
  }, [ulClassName])

  function updateSong(clearStatus:string) {
    let songList = selectedSongs;
    let currentSong = lastSelectedSong as SongStatus;
    currentSong.clear = clearStatus;
    setResultAdded(true);
    songList.push(currentSong);
    setSelectedSongs(songList);
    removeList();
  }

  function removeList() {
    let wheelSongList:IIDXSong[] = [];
    wheelSongList.push(prevSong);
    wheelSongList.push(lastSelectedSong);
    wheelSongList.push(afterSong);
    setSongWheelSongs(wheelSongList);
    setUlClassName("reset");
  }

  function changeClass () {
    console.log(changeClass);
    clicked.current = true;
    setUlClassName("none");
  }

  function randomizeSongs () {
    let wheelSongList = songWheelSongs;
    let songList = unselectedSongs;
    var i = songList.length;
    while(--i > 0){
        var j = Math.floor(Math.random()*(i+1));
        var temp = songList[j];
        songList[j] = songList[i];
        songList[i] = temp;
    }
    let selectedSong = songList.splice(98, 1)[0];
    console.log(songList.slice(3, 98));
    wheelSongList = wheelSongList.concat(songList.slice(3, 98));
    console.log(wheelSongList);
    wheelSongList.push(selectedSong);
    wheelSongList.push(songList[99]);
    setResultAdded(false);
    setPrevSong(songList[97]);
    setAfterSong(songList[99]);
    setLastSelectedSong(selectedSong);
    setUnselectedSongs(songList);
    setSongWheelSongs(wheelSongList);
    setUlClassName("animate");
  }

  return (
    <>
      <SongWheelDiv
        songs={songWheelSongs}
        ulClass={ulClassName}
      />
      <div>
        Number of songs played: {selectedSongs.length}
      </div>
      <div>
        <button disabled={!resultAdded} onClick={() => changeClass()}>Roll</button>
        <button disabled={resultAdded} onClick={() => updateSong("cleared")}>Cleared</button>
        <button disabled={resultAdded} onClick={() => updateSong("failed")}>Failed</button>
      </div>
    </>
  )
}

export default App
