import React from 'react';

import api from '../utils/api';
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
            amentityGeo: null,
            facilityGeo: null,
            trailGeo: null,
        };

        api.getAllParks()
            .then((parks) => this.setState({allParks: parks}));
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
