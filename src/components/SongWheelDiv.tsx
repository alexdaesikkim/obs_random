import './SongWheelDiv.scss'

export interface IIDXSong {
    ver: string;
    title: string;
    diff: string;
    bpm: string;
    level: number | string;
}

function SongWheelDiv({songs, ulClass}: {songs: IIDXSong[], ulClass: string}) {
    const fullList = songs.map((song, i) => {
        var itemClass:string = "item-"+i;
        return (
            <li className={itemClass + (song.level === "" ? " empty" : "")}>
                <div className={"level " + song.diff}>
                    {song.level}
                </div>
                <div className="title">
                    {song.title}
                </div>
            </li>
        )
    })
    return(
        <div className="box">
            <ul className={ulClass}>
                {fullList}
            </ul>
        </div>
    )
}

export default SongWheelDiv;