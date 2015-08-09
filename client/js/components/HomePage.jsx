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
            visibleParkIds: [],
            visibleParks: [],
        };

        this.load();
    }

    get parks() {
        if (!this.state.parksTopoJson) { return; }
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

    setVisibleParks(visibleParkIds) {
        console.log('Setting visibleParkIds to', visibleParkIds);
        this.setState({visibleParkIds: visibleParkIds});

        console.log(this.parks.map((p) => p.id))
        var visibleParks = this.parks.filter((park) => visibleParkIds.indexOf(park.id) !== -1);

        console.log('Setting visibleParks to', visibleParks);
        this.setState({visibleParks: visibleParks});
    }

    render() {
        return (
            <div>
                <Navigation>
                    <ParkFilters setVisibleParkIds={(visibleParkIds) => this.setVisibleParks(visibleParkIds)} />
                </Navigation>
                <Container title={'Fuck u'}>
                    <AllParksList
                        parks={this.state.visibleParks}
                        userLatLng={this.props.userLatLng} />
                </Container>
            </div>
        );
    }
}


HomePage.PropTypes = {
    userLatLng: React.PropTypes.array,
};
