import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import {Map, TileLayer, CircleMarker} from 'react-leaflet';
import Leaflet from 'leaflet';
import LeafletLabel from 'leaflet.label';

import utils from '../utils';
import GeoJsonUpdatable from './GeoJsonUpdatable.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';


export default class AllParksMap extends React.Component {

    componentDidMount() {
        var map = this.refs.map.getLeafletElement();
        map.on('zoomend', () => this.onZoomEnd());

        this._parkLabelsGroup = Leaflet.layerGroup();
        // this._parkTrailsGroup = Leaflet.layerGroup();

        setTimeout(() => this.onZoomEnd(), 1000)
    }

    componentWillUnmount() {
        // FIXME: prbyl need to do thigns here
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userLocation !== this.props.userLocation) {
            this.refs.map.getLeafletElement().setZoomAround(this.props.userLocation, 14).panTo(this.props.userLocation);
        }
        else {
            this.fitBounds();
        }
    }

    fitBounds() {
        var bounds = utils.boundsForFeature(this.getVisibleParks());
        this.refs.map.getLeafletElement().fitBounds(bounds);
    }

    getVisibleParks() {
        // FIXME: instead of doing the filtering here to show the park layers, maybe we can use the filter option
        // filter: function(feature, layer) {
        //     return feature.properties.show_on_map;
        // }
        var parksGeo = topojson.feature(this.props.parksTopo, this.props.parksTopo.objects.city_of_austin_parks);

        var visibleParksGeo = {
            type: parksGeo.type,
            features: parksGeo.features.filter((feature) => {
                return this.props.visibleParkIds.indexOf(feature.id) !== -1;
            })
        };

        return visibleParksGeo;
    }

    getVisibleTrails() {
        return topojson.feature(this.props.trailsTopo, this.props.trailsTopo.objects.pard_trails_nrpa);
    }

    onEachParkFeature(feature, layer) {
        var parkLabel = Leaflet.marker(feature.properties.center, {
            icon: Leaflet.divIcon({
                className: 'park-label',
                html: feature.properties.PARK_NAME
            }),
            draggable: false,
            zIndexOffset: 0
        });

        this._parkLabelsGroup.addLayer(parkLabel);

        layer.on('click', () => {
            window.location.hash = `park/${feature.id}`;
        });
    }

    onEachTrailFeature(feature, layer) {
        // this._parkTrailsGroup.addLayer(layer);
    }

    onZoomEnd() {
        var map = this.refs.map.getLeafletElement();

        if (map.getZoom() >= 16) {
            map.addLayer(this._parkLabelsGroup);
            // map.addLayer(this._parkTrailsGroup);
        }
        else {
            map.removeLayer(this._parkLabelsGroup);
            // map.removeLayer(this._parkTrailsGroup);
        }
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
                strokeColor='rgb(255,255,255)' />
        );

        var parkLayerStyle = {
            color: 'rgb(56,158,70)',
            opacity: 1,
            weight: 1,
            fillColor: 'rgb(86,221,84)',
            fillOpacity: 0.8,
        };

        var parkTrailStyle = {
            color: 'rgb(165,105,9)',
            opacity: 0.8,
            weight: 2,
            fillColor: 'rgb(218,193,145)',
            fillOpacity: 1,
        };

        return (
            <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={12} minZoom={10}>
                <TileLayer
                    url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                    id='drmaples.ipbindf8' />
                <GeoJsonUpdatable data={this.getVisibleParks()} style={parkLayerStyle} onEachFeature={(feature, layer) => this.onEachParkFeature(feature, layer)} />
                <GeoJsonUpdatable data={this.getVisibleTrails()} style={parkTrailStyle} onEachFeature={(feature, layer) => this.onEachTrailFeature(feature, layer)} />
                {userLocationMarker}
            </Map>
        );
    }
}

AllParksMap.propTypes = {
    visibleParkIds: React.PropTypes.array.isRequired,
    parksTopo: React.PropTypes.object.isRequired,
    trailsTopo: React.PropTypes.object.isRequired,
    userLocation: React.PropTypes.array,
};
