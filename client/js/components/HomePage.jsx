import React from 'react';

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
        };
    }

    render() {
        var nearbyParkCount = this.props.visibleParks.filter((park) => park.distance && park.distance < 1).length;
        var containerTitle = `${this.props.visibleParks.length} parks`;
        containerTitle = !nearbyParkCount ? containerTitle : `${containerTitle}, ${nearbyParkCount} within 1 mi`;

        return (
            <div>
                <AllParksMap
                    userLocation={this.props.userLocation}
                    visibleParkIds={this.props.visibleParkIds}
                    parksTopo={this.props.allParksTopo}
                    trailsTopo={this.props.allTrailsTopo}
                    onSelectPark={(parkId) => this.props.selectParkWithId(parkId)} />
                <Navigation>
                    <ParkFilters
                        amenityLookup={this.props.amenityLookup}
                        facilityLookup={this.props.facilityLookup}
                        applyFilters={this.props.applyFilters} />
                </Navigation>
                <Container title={containerTitle}>
                    <AllParksList
                        parks={this.props.visibleParks}
                        onSelectPark={(park) => this.props.selectPark(park)} />
                </Container>
            </div>
        );
    }
}


HomePage.PropTypes = {
    userLocation: React.PropTypes.array,
    allParksTopo: React.PropTypes.object.isRequired,
    allTrailsTopo: React.PropTypes.object.isRequired,
    amenityLookup: React.PropTypes.object.isRequired,
    facilityLookup: React.PropTypes.object.isRequired,
    visibleParkIds: React.PropTypes.array.isRequired,
    visibleParks: React.PropTypes.array.isRequired,

    selectPark: React.PropTypes.func.isRequired,
    selectParkWithId: React.PropTypes.func.isRequired,
    applyFilters: React.PropTypes.func.isRequired,
};
