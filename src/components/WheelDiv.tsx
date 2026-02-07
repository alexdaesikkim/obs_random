import './WheelDiv.scss'

function WheelDiv({items, ulClass}: {items: String[], ulClass: string}) {
    const fullList = items.map((item, _) => {
        return (
            <li>
                <div className="content">
                    {item}
                </div>
            </li>
        )
    })
    return(
        <div>
            <div className="gaugeWheelBox">
                <ul className={ulClass}>
                    {fullList}
                </ul>
            </div>
        </div>
    )
}

export default WheelDiv;