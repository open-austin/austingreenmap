import $ from 'jquery';
import React from 'react';
import { GeoJson, Map, Marker, Popup, TileLayer } from 'react-leaflet';


function getParksJson() {
    return $.getJSON("/data/parks.json");
}

function getFeatureGeoJson(parkID, featureType) {
    return $.getJSON(`/data/${featureType}/park_${parkID}.geojson`);
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {park: null,
                      parkList: []};
        getParksJson().then((data) => this.setState({parkList: data}));
    }

    render() {
        var parkList = this.state.parkList.map((park) => {
            return <li>{park.name}</li>;
        });
        return <ul>{parkList}</ul>;
    }
    // getFeature(pID, "park")
        // .then((data) => this.setState({park: data}) );
    // getFeature(pID, "amenity")
        // .then((data) => this.setState({amenity: data}) );
    // getFeature(pID, "facility")
        // .then((data) => this.setState({facility: data}) );
    // getFeature(pID, "trail")
        // .then((data) => this.setState({trail: data}) );
}

// [{"address": "7515 Step Down Cv., Austin, Texas 78731", "name": "Barrow Nature Preserve", "center": [-97.7688127885669, 30.3715875145322], "park_id": 112, "acres": 7.03700011},
