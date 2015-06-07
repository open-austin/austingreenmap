import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        var map = (
            <div id='map-wrapper'>
                <Map id='map' center={[30.267153, -97.743061]} zoom={13}>
                    <TileLayer
                    url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                    id='drmaples.ipbindf8' />
                    <Marker position={[30.267153, -97.743061]}>
                        <Popup>
                            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        );

        return <div>{map}</div>;
    }
}

module.exports = App;
