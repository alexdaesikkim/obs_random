import { useState, useEffect, useRef } from 'react'
import allSongs from './data/level12.json'
import SongWheelDiv from './components/SongWheelDiv.tsx'
import type { IIDXSong } from './components/SongWheelDiv.tsx'
import gaugeOptions from './data/gauge.json'
import './App.css'

interface SongStatus extends IIDXSong {
    clear: string;
}

function App() {
  const [unselectedSongs, setUnselectedSongs] = useState<IIDXSong[]>(allSongs);
  const [selectedSongs, setSelectedSongs] = useState<SongStatus[]>([]);
  const [ulClassName, setUlClassName] = useState("start");
  const [swAni, setSwAni] = useState(false);
  
  const [songWheelSongs, setSongWheelSongs] = useState<IIDXSong[]>([
    allSongs[allSongs.length-1], {
        ver: "",
        title: "Random Song Selector",
        diff: "",
        bpm: "",
        level: "",
    }, allSongs[0]
  ]);
  const [prevSong, setPrevSong] = useState<IIDXSong>({
        ver: "",
        title: "----------------------------------------",
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
  const [resultAdded, setResultAdded] = useState<boolean>(true);
  
  const [gaugeList, setGaugeList] = useState<String[]>([]);
  const [gaugeWheel, setGaugeWheel] = useState<String[]>(["", "Gauge", ""]);
  const gaugeWeights:number[] = [0, 2, 30, 0, 0, 0, 12, 6]
  const [prevGauge, setPrevGauge] = useState<String>("");
  const [currentGauge, setCurrentGauge] = useState<String>("Gauge");
  const [afterGauge, setAfterGauge] = useState<String>("");

  const [clearSpeedValue, setClearSpeedValue] = useState<number>(0);

  const clicked = useRef(false);

  useEffect(() => {
    let rawGaugeList:String[] = [];
    let multNum:number = Math.ceil((100 / gaugeWeights.reduce((x:number, y:number) => (x + y))));
    gaugeWeights.forEach((item, i) => {
        for(var x = 0; x < item*multNum; x++) rawGaugeList.push(gaugeOptions[i]);
    })
    setGaugeList(rawGaugeList);
  }, [])

  useEffect(()=> {
    if(ulClassName === "none" && clicked.current){
        randomizeSongs();
        randomizeGauge();
    }
  }, [ulClassName])

  function updateSong(clearStatus:string) {
    setSwAni(false);
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
    let wheelGaugeList:String[] = [];
    wheelGaugeList.push(prevGauge);
    wheelGaugeList.push(currentGauge);
    wheelGaugeList.push(afterGauge);
    setSongWheelSongs(wheelSongList);
    setGaugeWheel(wheelGaugeList);
    document.getElementById("clearedSongsText") !== null ?
        setClearSpeedValue(document.getElementById("clearedSongsText")!.offsetWidth / 30) : setClearSpeedValue(0);
    setUlClassName("reset");
  }

  function changeClass () {
    setSwAni(true);
    clicked.current = true;
    setUlClassName("none");
  }

  function SWAniFinish () {
    setSwAni(false);
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
    wheelSongList = wheelSongList.concat(songList.slice(3, 98));
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

  function randomizeGauge () {
    let gWheel = gaugeWheel;
    let gList = gaugeList;
    var i = gList.length;
    while(--i > 0){
        var j = Math.floor(Math.random()*(i+1));
        var temp = gList[j];
        gList[j] = gList[i];
        gList[i] = temp;
    }
    gWheel = gWheel.concat(gList.slice(3, 100));
    setPrevGauge(gWheel[97]);
    setAfterGauge(gWheel[99]);
    setCurrentGauge(gWheel[98]);
    setGaugeList(gList);
    setGaugeWheel(gWheel);
  }

  let clearWidthSpeed = {
    '--clearSpeed': clearSpeedValue.toString() + "s"
  } as React.CSSProperties;

  return (
    <>
      <div className="wheelDiv">
        <div className="songWheel">
            <SongWheelDiv
                songs={songWheelSongs}
                ulClass={ulClassName}
                gauges={gaugeWheel}
                animationEnd={SWAniFinish}
            />
        </div>
      </div>
      <div>
        <div className="cleared">
            <div className="clearedTitle">
                {"CLEARS (" + selectedSongs.filter(i => i.clear === "cleared").length + "):"}
            </div>
            <div className={"clearedSongs"}>
                <span id="clearedSongsText" className={selectedSongs.length > 1 ? "songOverflow" : ""} style={clearWidthSpeed}>
                    {   
                        selectedSongs.length > 0 ? 
                            selectedSongs.filter(i => i.clear === "cleared").map((item, _) => {
                                return item.title + " (" + item.diff + ") ";
                            })
                        :
                        ""
                    }
                </span>
            </div>
        </div>
        <div className="actionButtons">
            <button disabled={!resultAdded} onClick={() => changeClass()}>Roll</button>
            <button disabled={swAni || resultAdded} onClick={() => updateSong("cleared")}>Cleared</button>
            <button disabled={swAni || resultAdded} onClick={() => updateSong("failed")}>Failed</button>
        </div>
        <div className="failed">
            <div className="failedSongs">
                <span className="failedTitle">
                    DEATH BY
                </span>
                {
                    selectedSongs.filter(i => i.clear === "failed").map((item, _) => {
                        return (
                            <div className="failedSong">
                                {item.title + " (" + item.diff + ") "}
                            </div>
                        )
                    })
                }
            </div>
        </div>
      </div>
    </>
  )
}

export default App
