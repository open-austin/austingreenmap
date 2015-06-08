
class Park extends React.Component {
    constructor(props) {
        super(props);
        var pID = this.props.parkId;
    }

    render () {
        var map = (
            <div id='map-wrapper'>
                <Map id='map' center={[30.267153, -97.743061]} zoom={13}>
                    <TileLayer
                        url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                        id='drmaples.ipbindf8' />
                </Map>
            </div>
        );

        return <div>{map}</div>;
    }
}
