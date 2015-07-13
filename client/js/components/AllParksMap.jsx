import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import { Map, TileLayer, CircleMarker } from 'react-leaflet';

import utils from '../utils';
import GeoJsonUpdatable from './GeoJsonUpdatable.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';


export default class AllParksMap extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userLocation !== this.props.userLocation) {
            this.refs.map.getLeafletElement().setZoomAround(this.props.userLocation, 14).panTo(this.props.userLocation);
        }
        else {
            this.fitBounds();
        }
    }

    fitBounds() {
        var bounds = utils.boundsForFeature(this.getParksGeo());
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

    onEachParkFeature(feature, layer) {
        layer.setStyle({
            color: 'rgb(56,158,70)',
            opacity: 1,
            weight: 1,
            fillColor: 'rgb(86,221,84)',
            fillOpacity: 0.8,
        });

        layer.on('click', () => {
           window.location.hash = feature.id
        });
    }

    getTrailsGeo() {
        return topojson.feature(this.props.trailsTopo, this.props.trailsTopo.objects.pard_trails_nrpa);
    }

    onEachTrailFeature(feature, layer) {
        layer.setStyle({
            color: 'rgb(165,105,9)',
            opacity: 0.8,
            weight: 2,
            fillColor: 'rgb(218,193,145)',
            fillOpacity: 1,
        });
    }

    render() {
        var userLocationMarker = !this.props.userLocation ? null : (
            <CircleMarker
                center={this.props.userLocation}
                radius={8}
                weight={3}
                fillOpacity={1}
                fillColor='rgb(0,172,238)'
                strokeOpacity={1}
                strokeColor='rgb(255,255,255)'
                />
        );

        // FIXME: Only show trails if zoom level is greater than 14

        return (
            <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={12} minZoom={10}>
                <TileLayer
                    url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                    id='drmaples.ipbindf8' />
                <GeoJsonUpdatable data={this.getParksGeo()} onEachFeature={this.onEachParkFeature.bind(this)} />
                <GeoJsonUpdatable data={this.getTrailsGeo()} onEachFeature={this.onEachTrailFeature.bind(this)} />
                {userLocationMarker}
            </Map>
        );
    }
}

AllParksMap.propTypes = {
    visibleParkIds: React.PropTypes.array.isRequired,
    parksTopo: React.PropTypes.object.isRequired,
    trailsTopo: React.PropTypes.object.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
    userLocation: React.PropTypes.array,
};
