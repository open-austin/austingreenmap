import _ from 'lodash';
import React from 'react';
import turf from 'turf';

import api from '../utils/api';
import utils from '../utils';
import ParkMap from './ParkMap.jsx';
import ParksList from './ParksList.jsx';
import ParksMap from './ParksMap.jsx';
import Navigation from './Navigation.jsx';


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allParks: null,
            allParksTopo: null,
            park: null,
            parkGeo: null,
            amenityGeo: null,
            facilityGeo: null,
            trailGeo: null,
            userLocation: null,
        };

        api.getAllParks()
            .then((data) => this.setState({allParks: data}));

        api.getAllParksTopo()
            .then((data) => this.setState({allParksTopo: data}));

        utils.getUserLocation()
            .tap((latLng) => this.setUserLocation(latLng))
            .catch((err) => console.error(err));
    }

    selectParkWithId(parkId) {
        var park = _.find(this.state.allParks, (park) => park.park_id === parkId);
        this.selectPark(park);
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
        else if (this.state.allParks && this.state.allParksTopo) {
            content = (
                <div>
                    <ParksMap
                        parksTopo={this.state.allParksTopo}
                        onSelectPark={(parkId) => this.selectParkWithId(parkId)} />
                    <ParksList
                        parks={this.state.allParks}
                        onSelectPark={(park) => this.selectPark(park)} />
                </div>
            );
        }
        return (
            <div>
              <div className='container'>
                  <Navigation />
                  {content}
              </div>
            </div>
          );
    }
}
