import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import turf from 'turf';

window.turf = turf;


function onEachFacility(feature, layer) {
    layer.bindPopup(feature.properties.FACILITY_NAME);
}

function onEachAmenity(feature, layer) {
    layer.bindPopup(`
        ${feature.properties.AMENITY_NAME} <br />
        <i>${feature.properties.DESCRIPTION}</i>
    `);
}

function boundsForFeature(geoJson) {
    var extent = turf.extent(geoJson);
    return [
        [extent[1], extent[0]],
        [extent[3], extent[2]],
    ];
}


export default class ParkMap extends React.Component {

    fitBounds() {
        if (this.props.parkGeo) {
            var bounds = boundsForFeature(this.props.parkGeo);
            this.refs.map.getLeafletElement().fitBounds(bounds);
        }
    }

    componentDidMount() {
        this.fitBounds();
    }

    componentDidUpdate(prevProps, prevState) {
        this.fitBounds();
    }

    render () {
        var parkLayer = this.props.parkGeo ? <GeoJson data={this.props.parkGeo} /> : null;
        var amenityLayer = this.props.amenityGeo ? <GeoJson data={this.props.amenityGeo} onEachFeature={onEachAmenity} /> : null;
        var facilityLayer = this.props.facilityGeo ? <GeoJson data={this.props.facilityGeo} onEachFeature={onEachFacility} /> : null;
        var trailLayer = this.props.trailGeo ? <GeoJson data={this.props.trailGeo} /> : null;

        return (
            <div>
                <div className='row'>
                    <h3>{this.props.name}</h3>
                </div>
                <Map id='map' ref='map' center={this.props.center} zoom={15}>
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
    }
}

ParkMap.propTypes = {
    name: React.PropTypes.string.isRequired,
    center: React.PropTypes.array.isRequired,
    parkGeo: React.PropTypes.object,
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    trailGeo: React.PropTypes.object,
};
