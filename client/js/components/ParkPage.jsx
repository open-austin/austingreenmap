import _ from 'lodash';
import React from 'react';
import when from 'when';

import utils from '../utils';
import api from '../utils/api';
import Chevron from './Chevron.jsx';
import ParkMap from './ParkMap.jsx';
import ParkSummary from './ParkSummary.jsx';
import ParkFeatureList from './ParkFeatureList.jsx';


export default class ParkPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selectedFeatureId: null,
            parkGeo: null,
            amenityGeo: null,
            facilityGeo: null,
            trailGeo: null,
        };
    }

    load() {
        this.setState({loading: true});
        console.log('Loading')

        var parkPromise = api.getFeatureGeoJson(this.props.parkId, 'park')
            .tap((data) => this.setState({parkGeo: data}));

        var amenityPromise = api.getFeatureGeoJson(this.props.parkId, 'amenity')
            .tap((data) => this.setState({amenityGeo: data}));

        var facilityPromise = api.getFeatureGeoJson(this.props.parkId, 'facility')
            .tap((data) => this.setState({facilityGeo: data}));

        var trailPromise = api.getFeatureGeoJson(this.props.parkId, 'trail')
            .tap((data) => this.setState({trailGeo: data}));

        when.settle([parkPromise, amenityPromise, facilityPromise, trailPromise])
            .then(() => {
                console.log('Done loading')
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

        return (
            <div>
                <ParkMap
                    selectedFeatureId={this.state.selectedFeatureId}
                    center={this.props.center}
                    parkGeo={this.state.parkGeo}
                    amenityGeo={this.state.amenityGeo}
                    facilityGeo={this.state.facilityGeo}
                    trailGeo={this.state.trailGeo} />
                <div className='content-wrapper container' ref='content'>
                    <Chevron slideUp={() => this.slideUp()} />
                    <h3>{this.props.name}</h3>
                    <ParkSummary parkGeo={this.state.parkGeo} />
                    <ParkFeatureList
                        amenityGeo={this.state.amenityGeo}
                        facilityGeo={this.state.facilityGeo}
                        selectFeature={(featureId) => this.setState({selectedFeatureId: featureId})} />
                </div>
            </div>
        );
    }
}

ParkPage.propTypes = {
    parkId: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    center: React.PropTypes.array.isRequired,
    parkGeo: React.PropTypes.object,
    amenityGeo: React.PropTypes.object,
    facilityGeo: React.PropTypes.object,
    trailGeo: React.PropTypes.object,
};
