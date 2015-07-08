import React from 'react';

import Chevron from './Chevron.jsx';
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


    slideUp() {
        this.setState({up: !this.state.up});
    }

    render() {
        var allParksList;

        if (this.state.up) {
            allParksList = (
                <AllParksList
                    parks={this.props.visibleParks}
                    onSelectPark={(park) => this.props.selectPark(park)} />
            );
        }

        var nearbyParkCount = this.props.visibleParks.filter((park) => park.distance && park.distance < 1).length;

        return (
            <div>
                <AllParksMap
                    userLocation={this.props.userLocation}
                    visibleParkIds={this.props.visibleParkIds}
                    parksTopo={this.props.allParksTopo}
                    trailsTopo={this.props.allTrailsTopo}
                    onSelectPark={(parkId) => this.props.selectParkWithId(parkId)} />
                <ParkFilters
                    amenityLookup={this.props.amenityLookup}
                    facilityLookup={this.props.facilityLookup}
                    applyFilters={this.props.applyFilters} />
                <div className={this.state.up ? 'park-list-container container up' : 'park-list-container container down'} ref='content'>
                    <div className='park-count u-clickable' onClick={() => this.slideUp()}>
                        <Chevron up={this.state.up} />
                        <div className='count'>{this.props.visibleParks.length}&nbsp;parks{nearbyParkCount > 0 ? `, ${nearbyParkCount} within 1 mi` : null} </div>
                    </div>
                    {allParksList}
                </div>
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
