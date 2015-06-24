import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import { Map, TileLayer } from 'react-leaflet';

import utils from '../utils';
import GeoJsonUpdatable from './GeoJsonUpdatable.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';


export default class AllParksMap extends React.Component {

    componentDidMount() {
        this.fitBounds();
    }

    componentDidUpdate(prevProps, prevState) {
        this.fitBounds();
    }

    onEachParkFeature(feature, layer) {
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

    fitBounds() {
        var bounds = utils.boundsForFeature(this.getGeo());
        this.refs.map.getLeafletElement().fitBounds(bounds);
    }

    getParksGeo() {
        var parksGeo = topojson.feature(this.props.parksTopo, this.props.parksTopo.objects.city_of_austin_parks);

        var visibleParksGeo = {
            type: parksGeo.type,
            features: parksGeo.features.filter((feature) => {
                return this.props.visibleParkIds.indexOf(feature.id) !== -1;
            })
        };

        return visibleParksGeo;
    }

    getTrailsGeo() {
        return topojson.feature(this.props.trailsTopo, this.props.trailsTopo.objects.pard_trails_nrpa);
    }

    onEachTrailFeature(feature, layer) {
        layer.setStyle({
            color: 'rgb(165,105,9)',
            opacity: 1,
            weight: 2,
            fillColor: 'rgb(218,193,145)',
            fillOpacity: 1,
        });
    }

    render() {
        return (
            <div className='row'>
                <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={12} minZoom={10}>
                    <TileLayer
                        url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                        attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                        id='drmaples.ipbindf8' />
                    <GeoJsonUpdatable data={this.getTrailsGeo()} onEachFeature={this.onEachTrailFeature.bind(this)} />
                    <GeoJsonUpdatable data={this.getParksGeo()} onEachFeature={this.onEachParkFeature.bind(this)} />
                </Map>
            </div>
        );
    }
}

AllParksMap.propTypes = {
    visibleParkIds: React.PropTypes.array.isRequired,
    parksTopo: React.PropTypes.object.isRequired,
    trailsTopo: React.PropTypes.object.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
