import _ from 'lodash';
import React from 'react';
import turf from 'turf';

import api from '../utils/api';
import utils from '../utils';
import ParkMap from './ParkMap.jsx';
import HomePage from './HomePage.jsx';
import ParkPage from './ParkPage.jsx';


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userLatLng: null,
        };

        utils.getUserLocation()
            .tap((latLng) => this.setState({userLocation: latLng}))
            .catch((err) => console.error(err));
    }

    render() {
        if (this.props.parkId) {
            return <ParkPage parkId={this.props.parkId} userLatLng={this.state.userLatLng} />;
        }
        else {
            return <HomePage userLatLng={this.state.userLatLng} />;
        }
    }
}

App.propTypes = {
    parkId:  React.PropTypes.string,
};
