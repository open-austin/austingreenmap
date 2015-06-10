import $ from 'jquery';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default class ParkMap extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        var parkLayer = this.props.parkGeo ? <GeoJson data={this.props.parkGeo} /> : null;
        var amenityLayer = this.props.amenityGeo ? <GeoJson data={this.props.amenityGeo} /> : null;
        var facilityLayer = this.props.facilityGeo ? <GeoJson data={this.props.facilityGeo} /> : null;
        var trailLayer = this.props.trailGeo ? <GeoJson data={this.props.trailGeo} /> : null;

        var map = (
            <div id='map-wrapper'>
                <Map id='map' center={this.props.center} zoom={15}>
                    <TileLayer
                        url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                        id='drmaples.ipbindf8' />
                    {parkLayer}
                    {amenityLayer}
                    {facilityLayer}
                    {trailLayer}
                </Map>
            </div>
        );

        return <div>{map}</div>;
    }
}

ParkMap.propTypes = {
    center:  React.PropTypes.array.isRequired,
    parkGeo: React.PropTypes.object,
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    trailGeo: React.PropTypes.object,
};
