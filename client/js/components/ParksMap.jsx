import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import { GeoJson, Map, TileLayer } from 'react-leaflet';

import ParkFeatureList from './ParkFeatureList.jsx';


export default class ParksMap extends React.Component {

    onEachFeature(feature, layer) {
        layer.setStyle({
            color: 'rgb(56,158,70)',
            opacity: 1,
            weight: 1,
            fillColor: 'rgb(86,221,84)',
            fillOpacity: 0.5,
        });

        layer.on('click', () => {
            this.props.onSelectPark(feature.id);
        });
    }

    render() {
        var parksGeo = topojson.feature(this.props.parksTopo, this.props.parksTopo.objects.city_of_austin_parks);

        return (
            <div className='row'>
                <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={12} minZoom={10}>
                    <TileLayer
                        url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                        id='drmaples.ipbindf8' />
                    <GeoJson data={parksGeo} onEachFeature={this.onEachFeature.bind(this)} />
                </Map>
            </div>
        );
    }
}

ParksMap.propTypes = {
    parksTopo: React.PropTypes.object.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
