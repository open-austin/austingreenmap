import React from 'react';

import Chevron from './Chevron.jsx';
import AllParksList from './AllParksList.jsx';
import AllParksMap from './AllParksMap.jsx';
import ParkFilters from './ParkFilters.jsx';


export default class HomePage extends React.Component {

    slideUp() {
        var contentNode = React.findDOMNode(this.refs.content);
        window.scrollTo(0, contentNode.offsetTop);
    }

    render() {
        return (
            <div>
                <AllParksMap
                    userLocation={this.props.userLocation}
                    visibleParkIds={this.props.visibleParkIds}
                    parksTopo={this.props.allParksTopo}
                    trailsTopo={this.props.allTrailsTopo}
                    onSelectPark={(parkId) => this.props.selectParkWithId(parkId)} />
                <div className='content-wrapper' ref='content'>
                    <Chevron slideUp={() => this.slideUp()} />
                    <ParkFilters
                        amenityLookup={this.props.amenityLookup}
                        facilityLookup={this.props.facilityLookup}
                        setFilter={(filter) => this.props.applyFilters(filter)} />
                    <AllParksList
                        parks={this.props.visibleParks}
                        onSelectPark={(park) => this.props.selectPark(park)} />
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
