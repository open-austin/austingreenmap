import $ from 'jquery';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default class ParkMap extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        var center = this.props.center;
        var makeElem = (p) => {
            return this.props[p] ? <GeoJson data={this.props[p]} /> : null;
        };
        // FIXME: Seems like this doesn't render markers / shapes sometimes
        var map = (
            <div id='map-wrapper'>
                <Map id='map' center={center} zoom={15}>
                    <TileLayer
                        url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                        id='drmaples.ipbindf8' />
                    {makeElem("park")}
                    {makeElem("amenity")}
                    {makeElem("facility")}
                    {makeElem("trail")}
                </Map>
            </div>
        );

        return <div>{map}</div>;
    }
}
