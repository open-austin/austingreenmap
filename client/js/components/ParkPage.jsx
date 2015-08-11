import _ from 'lodash';
import React from 'react';
import when from 'when';

import api from '../utils/api';
import Container from './Container.jsx';
import Navigation from './Navigation.jsx';
import ParkMap from './ParkMap.jsx';
import ParkSummary from './ParkSummary.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';


export default class ParkPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            selectedFeatureId: null,
            parkGeo: null,
            amenityGeo: null,
            facilityGeo: null,
            trailGeo: null,
        };

        this.load();
    }

    load() {
        this.setState({loading: true});
        console.log('ParkPage: Loading')

        var parkPromise = api.getFeatureGeoJson(this.props.parkId, 'park')
            .tap((data) => this.setState({parkGeo: data}));

        var amenityPromise = api.getFeatureGeoJson(this.props.parkId, 'amenity')
            .tap((data) => this.setState({amenityGeo: data}));

        var facilityPromise = api.getFeatureGeoJson(this.props.parkId, 'facility')
            .tap((data) => this.setState({facilityGeo: data}));

        var trailPromise = api.getFeatureGeoJson(this.props.parkId, 'trail')
            .tap((data) => this.setState({trailGeo: data}));

        when.settle([parkPromise, amenityPromise, facilityPromise, trailPromise])
            .then((descriptors) => {
                descriptors.forEach((d) => {
                    if (d.state === 'rejected') {
                        console.error(d.reason);
                    }
                    else {
                        console.log('success')
                    }
                });
                console.log('ParkPage: Done loading')
                this.setState({loading: false});
            });
    }

    componentDidMount() {
        this.load();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.parkId !== nextProps.parkId) {
            this.load();
        }
    }

    slideUp() {
        var contentNode = React.findDOMNode(this.refs.content);
        window.scrollTo(0, contentNode.offsetTop);
    }

    render() {
        if (this.state.loading) {
            return <div className='loading'>Loading</div>;
        }

        console.log('this.st', this.state.parkGeo);

        return (
            <div>
                <ParkMap
                    selectedFeatureId={this.state.selectedFeatureId}
                    center={null}
                    parkGeo={this.state.parkGeo}
                    amenityGeo={this.state.amenityGeo}
                    facilityGeo={this.state.facilityGeo}
                    trailGeo={this.state.trailGeo} />
                <Navigation />
                <Container title={this.state.parkGeo.properties.PARK_NAME}>
                    <ParkSummary parkGeo={this.state.parkGeo} />
                    <ParkFeatureList
                        amenityGeo={this.state.amenityGeo}
                        facilityGeo={this.state.facilityGeo}
                        selectFeature={(featureId) => this.setState({selectedFeatureId: featureId})} />
                </Container>
            </div>
        );
    }
}

ParkPage.propTypes = {
    parkId: React.PropTypes.number.isRequired,
};
