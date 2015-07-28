import _ from 'lodash';
import L from 'leaflet';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { GeoJsonCluster } from 'react-leaflet-geojson-cluster';

import utils from '../utils';
import ParkFeatureList from './ParkFeatureList.jsx';
import icons from '../utils/icons.json';


function onEachFacility(feature, layer) {
    layer.bindPopup(feature.properties.FACILITY_NAME);
}

function onEachAmenity(feature, layer) {
    layer.bindPopup(`
        ${feature.properties.AMENITY_NAME} <br />
        <i>${feature.properties.DESCRIPTION}</i>
    `);
}

function onEachPark(feature, layer) {
    layer.setStyle({
        color: 'rgb(56,158,70)',
        opacity: 1,
        weight: 1,
        fillColor: 'rgb(86,221,84)',
        fillOpacity: 0.5,
    });
}

function onEachTrail(feature, layer) {
    layer.setStyle({
        color: 'rgb(165,105,9)',
        opacity: 1,
        weight: 4,
        fillColor: 'rgb(218,193,145)',
        fillOpacity: 0.5,
    });
}

function pointToLayer(feature, latlng) {
    var icon = icons[feature.properties.AMENITY_TYPE || feature.properties.FACILITY_TYPE];
    var iconURL = icon === '?' ? 'images/deciduous_tree.png' : `images/icons/${icon}-18@2x.png`;

    var iconLayer = L.icon({
        iconSize: [18, 18],
        iconAnchor: [12, 17],
        popupAnchor:  [1, -16],
        iconUrl: iconURL,
    });

    return L.marker(latlng, {icon: iconLayer});
}

function clusterIcon (cluster) {
    // majority feature wins
    var group = _.groupBy(cluster.getAllChildMarkers(), function (c) {
        return icons[c.feature.properties.AMENITY_TYPE || c.feature.properties.FACILITY_TYPE];
    });

    var icon = _.max(Object.keys(group), function (k) {
        return group[k].length;
    });

    var iconURL = icon === '?' ? 'images/deciduous_tree.png' : `images/icons/${icon}-18@2x.png`;

    return L.icon({
        iconSize: [18, 18],
        iconAnchor: [12, 17],
        popupAnchor:  [1, -16],
        iconUrl: iconURL,
    });
}

export default class ParkMap extends React.Component {

    componentDidMount() {
        this.fitBounds();
    }

    componentDidUpdate(prevProps, prevState) {
        this.fitBounds();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.selectedFeatureId !== this.props.selectedFeatureId) {
            this.showFeatureInMap(nextProps.selectedFeatureId);
        }
    }

    fitBounds() {
        if (this.props.parkGeo) {
            var bounds = utils.boundsForFeature(this.props.parkGeo);
            this.refs.map.getLeafletElement().fitBounds(bounds);
        }
    }

    showMarkerCluster (props) {
        if (!props) return null;
        var group = _.groupBy(props.features, (f) => {
            return f.properties.AMENITY_TYPE || f.properties.FACILITY_TYPE;
        });

        return _.map(Object.keys(group), (f) => {
            return (
                <GeoJsonCluster
                    data={ { "type": "FeatureCollection", "features": group[f] }}
                    disableClusteringAtZoom={18}
                    onEachFeature={onEachAmenity}
                    pointToLayer={pointToLayer} i
                    iconCreateFunction={clusterIcon} />
            );
        });
    }

    showFeatureInMap(featureID) {
        var leafletElement = this.refs.map.leafletElement;
        var matchingLayer = _.find(leafletElement._layers, (layer) => layer.feature && layer.feature.id === featureID);

        if (!matchingLayer) {
            console.error('No layer for', featureID);
            return;
        }
        var mapNode = React.findDOMNode(this.refs.map);
        window.scrollTo(0, mapNode.parentNode.offsetTop + mapNode.offsetTop);

        matchingLayer.openPopup();
        leafletElement.setZoom(leafletElement.getMaxZoom());
        leafletElement.setView(matchingLayer._latlng);
    }

    render() {
        return (
            <Map id='map' ref='map' center={this.props.center} minZoom={10}>
                <TileLayer
                    url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                    id='drmaples.ipbindf8' />
                {this.props.parkGeo ? <GeoJson data={this.props.parkGeo} onEachFeature={onEachPark} /> : null}
                {this.showMarkerCluster(this.props.amenityGeo)}
                {this.showMarkerCluster(this.props.facilityGeo)}
                {this.props.trailGeo ? <GeoJson data={this.props.trailGeo} onEachFeature={onEachTrail} /> : null}
                <TileLayer
                    url='https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a>'
                    id='drmaples.ipbindf8' />
            </Map>
        );
    }
}

ParkMap.propTypes = {
    center: React.PropTypes.array.isRequired,
    parkGeo: React.PropTypes.object,
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    trailGeo: React.PropTypes.object,
    selectedFeatureId: React.PropTypes.number,
};
