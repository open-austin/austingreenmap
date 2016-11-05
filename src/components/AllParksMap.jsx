import Leaflet from 'leaflet';
import LeafletLabel from 'leaflet.label';
import React from 'react';
import topojson from 'topojson';
import turf from 'turf';  // FIXME: replace with turf-extent
import {Map, TileLayer, CircleMarker} from 'react-leaflet';

import {boundsForFeature} from '../utils';
import api from '../utils/api';
import GeoJsonUpdatable from './GeoJsonUpdatable.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';
import ParkBaseTileLayer from './ParkBaseTileLayer.jsx';

// A warning:
// I tried adding zoomLevel to this.state and upating it in zoomEnd
// This lead to funky rerenders happening when leaflet trigges a zoom
// :O

export default class AllParksMap extends React.Component {
    constructor(props) {
        super(props);
        this._parkLabelsGroup = Leaflet.layerGroup();

        this.state = {
            parksGeo: null,
            trailsGeo: null,
        }
        this.load();
    }

    load() {
        api.getAllParksTopo()
            .then((topo) => {
                var geo = topojson.feature(topo, topo.objects.city_of_austin_parks)
                this.setState({parksGeo: geo});
            });

        api.getAllTrailsTopo()
            .then((topo) => {
                var geo = topojson.feature(topo, topo.objects.pard_trails_nrpa);
                this.setState({trailsGeo: geo});
            });
    }

    componentDidMount() {
        var map = window.allParksMap = this.refs.map.getLeafletElement();

        // FIXME: in componentDidMount react-leaflet adds the trails to map
        // https://github.com/PaulLeCam/react-leaflet/blob/1877b58eaa3ee24f588680cbcea5079c0333329b/src/MapLayer.js#L8
        // We can avoid this flash of unstyled content by subclassing the GeoJson class
        // and in componentDidMount just don't call this.props.map.addLayer(this.leafletElement);
        if (this.refTrails) {
            map.removeLayer(this.refTrails.leafletElement);
        }

        map.on('zoomend', () => this.onZoomEnd());

        setTimeout(() => this.onZoomEnd(), 1000);
    }

    componentWillUnmount() {
        // FIXME: prbyl need to do thigns here
        // map.off zoomend maybe?
        // delete the layer groups arrays maybe?
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userLatLng !== this.props.userLatLng) {
            let map = this.refs.map.getLeafletElement();

            map.setZoomAround(this.props.userLatLng, 15);
            map.panTo(this.props.userLatLng);
        }
    }

    onEachParkFeature(feature, layer) {
        layer.on('click', () => {
            // so we need to check if the layer is visible before routing
            if (this.props.visibleParkIds.indexOf(feature.id) !== -1) {
                console.log('Clicked on', feature.id);
                window.location.hash = `park/${feature.id}`
            }
            else {
                console.log('onEachParkFeature: Not firing click event for hidden park');
            }
        });
    }

    onZoomEnd() {
        var map = this.refs.map.getLeafletElement();

        if (map.getZoom() >= 15) {
            map.addLayer(this._parkLabelsGroup);
            // FIXME: maybe we should hide/show through the opacity property, that way the opacity can be 0 initially
            this.refTrails && map.addLayer(this.refTrails.leafletElement);
        }
        else {
            map.removeLayer(this._parkLabelsGroup);
            this.refTrails && map.removeLayer(this.refTrails.leafletElement);
        }
    }

    render() {
        var userLocationMarker = !this.props.userLatLng ? null : (
            <CircleMarker
                center={this.props.userLatLng}
                radius={8}
                weight={3}
                fillOpacity={1}
                fillColor='rgb(0,172,238)'
                strokeOpacity={1}
                strokeColor='rgb(255,255,255)' />
        );

        var parkLayer;
        if (this.state.parksGeo) {
            let style = {
                color: 'rgb(56,158,70)',
                opacity: 1,
                weight: 2,
                fillColor: 'rgb(86,221,84)',
                fillOpacity: 0.4,
            };

            parkLayer = (
                <GeoJsonUpdatable
                    data={this.state.parksGeo}
                    visibleIds={this.props.visibleParkIds}
                    onEachFeature={(feature, layer) => this.onEachParkFeature(feature, layer)}
                    style={style} />
            );
        }

        var trailLayer;
        if (this.state.trailsGeo) {
            let style = {
                color: 'rgb(165,105,9)',
                opacity: 0.8,
                weight: 2,
                fillColor: 'rgb(218,193,145)',
                fillOpacity: 1,
            };

            trailLayer = (
                <GeoJsonUpdatable
                    ref={(node) => this.refTrails = node}
                    data={this.state.trailsGeo}
                    style={style} />
            );
        }


        return (
            <Map id='map' ref='map' center={[30.267153, -97.743061]} zoom={15} minZoom={10} maxBounds={[[30.05, -98.3], [30.6, -97.2]]}>
                <ParkBaseTileLayer />
                {parkLayer}
                {trailLayer}
                {userLocationMarker}
            </Map>
        );
    }
}

AllParksMap.propTypes = {
    visibleParkIds: React.PropTypes.array.isRequired,
    userLatLng: React.PropTypes.array,
};
