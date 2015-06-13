import React from 'react';


export default class ParkFeatureList extends React.Component {

    render () {

        var amenityList = 'No amenities';

        if (this.props.amentityGeo) {
            amenityList = this.props.amentityGeo.features.map((feature) => {
                var addressURL = `http://maps.google.com/?q=${feature.properties.ADDRESS}`;
                return (
                    <div className='row' key={feature.properties.AMENITY_ID}>
                        <div className='name six columns'>
                            {feature.properties.AMENITY_NAME}
                        </div>
                        <div className='address six columns'>
                            <a href={addressURL} target="_blank">{feature.properties.ADDRESS}</a>
                        </div>
                        <i>{feature.properties.DESCRIPTION}</i>
                    </div>
                );
            });
        }

        var facilityList = 'No facilities';

        if (this.props.facilityGeo) {
            amenityList = this.props.facilityGeo.features.map((feature) => {
                var addressURL = `http://maps.google.com/?q=${feature.properties.ADDRESS}`;
                return (
                    <div className='row' key={feature.properties.FACILITY_ID}>
                        <div className='name six columns'>
                            {feature.properties.FACILITY_NAME}
                        </div>
                        <div className='address six columns'>
                            <a href={addressURL} target="_blank">{feature.properties.ADDRESS}</a>
                        </div>
                        <i>{feature.properties.DESCRIPTION}</i>
                    </div>
                );
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
};
