import Leaflet from 'leaflet';
import LeafletLabel from 'leaflet.label';
import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import {Map, TileLayer, CircleMarker} from 'react-leaflet';

import utils from '../utils';
import GeoJsonUpdatable from './GeoJsonUpdatable.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';
import ParkBaseTileLayer from './ParkBaseTileLayer.jsx';

// A warning:
// I tried adding zoomLevel to this.state and upating it in zoomEnd
// This lead to funky rerenders happening when leaflet trigges a zoom
// :O

export default class AllParksMap extends React.Component {

    componentDidMount() {
        var map = window.allParksMap = this.refs.map.getLeafletElement();

        // FIXME: in componentDidMount react-leaflet adds the trails to map
        // https://github.com/PaulLeCam/react-leaflet/blob/1877b58eaa3ee24f588680cbcea5079c0333329b/src/MapLayer.js#L8
        // We can avoid this flash of unstyled content by subclassing the GeoJson class
        // and in componentDidMount just don't call this.props.map.addLayer(this.leafletElement);
        if (this.refs.trails) {
            map.removeLayer(this.refs.trails.leafletElement);
        }

        map.on('zoomend', () => this.onZoomEnd());

        this._parkLabelsGroup = Leaflet.layerGroup();
        // this._parkTrailsGroup = Leaflet.layerGroup();

        setTimeout(() => this.onZoomEnd(), 1000);
    }

    componentWillUnmount() {
        // FIXME: prbyl need to do thigns here
        // map.off zoomend maybe?
        // delete the layer groups arrays maybe?
    }

    componentDidUpdate(prevProps, prevState) {
        var map = this.refs.map.getLeafletElement();

        if (prevProps.userLocation !== this.props.userLocation) {
            map.setZoomAround(this.props.userLocation, 14);
            map.panTo(this.props.userLocation);
        }
        else {
            var bounds = utils.boundsForFeature(this.getVisibleParks());
            map.fitBounds(bounds);
        }
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

    getTrailsGeoJson() {
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

    onZoomEnd() {
        var map = this.refs.map.getLeafletElement();

        if (map.getZoom() >= 16) {
            map.addLayer(this._parkLabelsGroup);
            map.addLayer(this.refs.trails.leafletElement);
        }
        else {
            map.removeLayer(this._parkLabelsGroup);
            map.removeLayer(this.refs.trails.leafletElement);
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
            fillOpacity: 0.4,
        };

        var parkTrailStyle = {
            color: 'rgb(165,105,9)',
            opacity: 0.8,
            weight: 2,
            fillColor: 'rgb(218,193,145)',
            fillOpacity: 1,
        };

        return (
            <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={12} minZoom={10} maxBounds={[[30.05, -98.3], [30.6, -97.2]]}>
                <ParkBaseTileLayer />
                <GeoJsonUpdatable data={this.getVisibleParks()} style={parkLayerStyle} onEachFeature={(feature, layer) => this.onEachParkFeature(feature, layer)} />
                <GeoJsonUpdatable ref='trails' data={this.getTrailsGeoJson()} style={parkTrailStyle} />
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
