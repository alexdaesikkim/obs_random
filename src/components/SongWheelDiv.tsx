import './SongWheelDiv.scss'

export interface IIDXSong {
    ver: string;
    title: string;
    diff: string;
    bpm: string;
    level: number | string;
}

function SongWheelDiv({songs, gauges, ulClass, animationEnd}: {songs: IIDXSong[], gauges: String[], ulClass: string, animationEnd: () => any}) {
    const fullList = songs.map((song, i) => {
        var itemClass:string = "item-"+i;
        return (
            <li className={"wheelbox " + itemClass}>
                <div className={"level " + song.diff}>
                    {song.level}
                </div>
                <div className="title">
                    {song.title}
                </div>
                <div className="gauge">
                    {gauges[i]}
                </div>
            </li>
        )
    })
    return(
        <div className="box" onAnimationEnd={animationEnd}>
            <ul className={ulClass}>
                {fullList}
            </ul>
        </div>
    )
}

export default SongWheelDiv;