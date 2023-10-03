export default function Tile(props) {
    const styles = props.hidden ? { color: 'transparent' } : { color: '#ffffff' }
    return (
        <div className="item">
            <div className="item--no" onClick={() => props.handleUnknown(props.id)}>Unknown</div>
            <div className="item--tile" key={props.id} align="left" onClick={() => props.handleUnhide(props.id)}><span style={styles}>{props.wordEng} | {props.pron}</span><span>{props.wordPol}</span><span style={styles}>{props.sentEng}</span><span>{props.sentPol}</span></div>
            <div className="item--yes" onClick={() => props.handleKnown(props.id)}>Known</div>
        </div>

    )
}