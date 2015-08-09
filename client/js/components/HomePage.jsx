import React from 'react';

import api from '../utils/api';
import Container from './Container.jsx';
import Navigation from './Navigation.jsx';
import AllParksList from './AllParksList.jsx';
import AllParksMap from './AllParksMap.jsx';
import ParkFilters from './ParkFilters.jsx';



export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            up: false,
            parksTopoJson: null,
            trailsTopoJson: null,
            visibleParkIds: null,
        };

        this.load();
    }

    get parks() {
        if (!this.state.parksTopo) { return; }
        return this.state.parksTopoJson.objects.city_of_austin_parks.geometries;
    }

    load() {
        api.getAllParksTopo()
            .then((data) => this.setState({parksTopoJson: data }));

        api.getAllTrailsTopo()
            .then((data) => this.setState({trailsTopoJson: data}));
    }

    get nearbyParkCount() {
        return this.parks().filter((park) => park.distance && park.distance < 1).length
    }

    render() {
        return (
            <div>
                <Navigation>
                    <ParkFilters setVisibleParkIds={(visibleParkIds) => this.setState({visibleParkIds: visibleParkIds})} />
                </Navigation>
            </div>
        );
    }
}


HomePage.PropTypes = {
    userLatLng: React.PropTypes.array,
};
