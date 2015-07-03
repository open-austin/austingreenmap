import _ from 'lodash';
import React from 'react';

import api from '../utils/api';


export default class ParkFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: '',
        };
    }

    onSelect(filter) {
        console.log(filter);
        this.setState({selectedFilter: filter});
        this.props.setFilter(filter);
    }

    render() {
        var options = Object.keys(this.props.amenityLookup)
            .concat(Object.keys(this.props.facilityLookup))
            .sort()
            .map((k) => <option key={k}>{k}</option>);

        return (
            <div className='park-filters row'>
                Find parks with
                <select onChange={(e) => this.onSelect(e.target.value)} value={this.state.selectedFilter}>
                    <option defaultValue></option>
                    {options}
                </select>
                <div className='filter-icons'>
                    <button className={this.state.selectedFilter === 'Restroom' ? 'active icon' : 'icon'} onClick={() => this.onSelect('Restroom')}><img alt="Restroom" src="images/icons/toilets-24@2x.png" /></button>
                    <button className={this.state.selectedFilter === 'Mutt Mitt' ? 'active icon' : 'icon'} onClick={() => this.onSelect('Mutt Mitt')}><img alt="Mutt Mitt" src="images/icons/dog-park-24@2x.png" /></button>
                    <button className={this.state.selectedFilter === 'Parking Lot' ? 'active icon' : 'icon'} onClick={() => this.onSelect('Parking Lot')}><img alt="Parking Lot" src="images/icons/parking-24@2x.png" /></button>
                </div>
            </div>
        );
    }
}

ParkFilters.propTypes = {
    amenityLookup: React.PropTypes.object.isRequired,
    facilityLookup: React.PropTypes.object.isRequired,
    setFilter: React.PropTypes.func.isRequired,
};
