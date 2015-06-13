import _ from 'lodash';
import React from 'react';

import ParkFeatureListItem from './ParkFeatureListItem.jsx';


export default class ParkFeatureList extends React.Component {
    render() {
        var amenityList = 'No amenities';

        if (this.props.amenityGeo) {
            var sortedAmenity = _.sortBy(this.props.amenityGeo.features, 'properties.AMENITY_TYPE');

            amenityList = sortedAmenity.map((feature) => {
                return <ParkFeatureListItem
                    showFeatureInMap={this.props.showFeatureInMap}
                    id={feature.id}
                    name={feature.properties.AMENITY_NAME}
                    type={feature.properties.AMENITY_TYPE}
                    description={feature.properties.DESCRIPTION}
                    indoorOutdoor={feature.properties.INDOOR_OUTDOOR}
                    status={feature.properties.STATUS}
                    reservations={feature.properties.RESERVATIONS}
                    accessibilityStatus={feature.properties.ACCESSIBILITY_STATUS} />;
            });
        }

        var facilityList = 'No facilities';
        if (this.props.facilityGeo) {
            var sortedFacility = _.sortBy(this.props.facilityGeo.features, 'properties.FACILITY_TYPE');

            facilityList = sortedFacility.map((feature) => {
                return <ParkFeatureListItem
                    showFeatureInMap={this.props.showFeatureInMap}
                    id={feature.id}
                    name={feature.properties.FACILITY_NAME}
                    type={feature.properties.FACILITY_TYPE}
                    description={feature.properties.DESCRIPTION}
                    indoorOutdoor={feature.properties.INDOOR_OUTDOOR}
                    status={feature.properties.STATUS}
                    reservations={feature.properties.RESERVATIONS}
                    accessibilityStatus={feature.properties.ACCESSIBILITY_STATUS} />;
            });
        }

        return (
            <div>
                <h4>Amenities</h4>
                {amenityList}
                <h4>Facilities</h4>
                {facilityList}
            </div>
        );
    }
}

ParkFeatureList.propTypes = {
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    showFeatureInMap: React.PropTypes.func.isRequired,
};
