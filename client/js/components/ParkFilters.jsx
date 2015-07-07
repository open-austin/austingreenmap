import _ from 'lodash';
import React from 'react';
import Select from 'react-select';

import api from '../utils/api';

export default class ParkFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: '',
        };
    }

    onSelect(filter, filters) {
        filters = filters.map(f => f.value);
        this.updateFilters(filters);
    }

    updateFilters(filters) {
        this.setState({selectedFilters: filters});
        this.props.applyFilters(filters);
    }

    render() {
        var options = Object.keys(this.props.amenityLookup)
            .concat(Object.keys(this.props.facilityLookup))
            .sort()
            .map( k => ({ value: k, label: k }) );

        return (
            <div className='park-filters'>
                <Select
                    name='park-filter-select'
                    id='park-filter-select'
                    multi={true}
                    value={this.state.selectedFilters}
                    options={options}
                    onChange={this.onSelect.bind(this)}
                    placeholder="Find parks with" />
                <div className='filter-icons'>
                    <button className={this.state.selectedFilter === 'Restroom' ? 'active icon' : 'icon'} onClick={() => this.updateFilters(['Restroom'])}><img alt="Restroom" src="images/icons/toilets-24@2x.png" /></button>
                    <button className={this.state.selectedFilter === 'Mutt Mitt' ? 'active icon' : 'icon'} onClick={() => this.updateFilters(['Mutt Mitt'])}><img alt="Mutt Mitt" src="images/icons/dog-park-24@2x.png" /></button>
                    <button className={this.state.selectedFilter === 'Parking Lot' ? 'active icon' : 'icon'} onClick={() => this.updateFilters(['Parking Lot'])}><img alt="Parking Lot" src="images/icons/parking-24@2x.png" /></button>
                </div>
            </div>
        );
    }
}

ParkFilters.propTypes = {
    amenityLookup: React.PropTypes.object.isRequired,
    facilityLookup: React.PropTypes.object.isRequired,
    applyFilters: React.PropTypes.func.isRequired,
};
