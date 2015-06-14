import React from 'react';
import turf from 'turf';

import api from '../utils/api';
import utils from '../utils';
import ParkMap from './ParkMap.jsx';
import ParkList from './ParkList.jsx';
import Navigation from './Navigation.jsx';


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allParks: [],
            park: null,
            parkGeo: null,
            amenityGeo: null,
            facilityGeo: null,
            trailGeo: null,
            userLocation: null,
        };

        api.getAllParks()
            .then((parks) => this.setState({allParks: parks}));

        utils.getUserLocation()
            .tap((latLng) => this.setUserLocation(latLng))
            .catch((err) => console.error(err));
    }

    selectPark(park) {
        this.setState({park: park});

        api.getFeatureGeoJson(park.park_id, 'park')
            .tap((data) => this.setState({parkGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'amenity')
            .tap((data) => this.setState({amenityGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'facility')
            .tap((data) => this.setState({facilityGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'trail')
            .tap((data) => this.setState({trailGeo: data}));
    }

    setUserLocation(userLocation) {
        var parksWithDistance = this.state.allParks.map((park) => {
            var toPoint = turf.point([userLocation[1], userLocation[0]]);
            var fromPoint = turf.point([park.center[1], park.center[0]]);

            park.distance = turf.distance(toPoint, fromPoint, 'miles');

            return park;
        });

        this.setState({
            allParks: parksWithDistance,
            userLocation: userLocation
        });
    }

    render() {
        var content;

        if (this.state.park) {
            content = (
                <ParkMap
                    name={this.state.park.name}
                    center={this.state.park.center}
                    parkGeo={this.state.parkGeo}
                    facilityGeo={this.state.facilityGeo}
                    amenityGeo={this.state.amenityGeo}
                    trailGeo={this.state.trailGeo} />
            );
        }
        else {
            content = (
                <ParkList
                    parks={this.state.allParks}
                    onSelectPark={(park) => this.selectPark(park)} />
            );
        }
        return (
            <div>
              <Navigation />
              <div className='container'>{content}</div>
            </div>
          );
    }
}
