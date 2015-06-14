import React from 'react';


export default class ParkList extends React.Component {
    constructor(props) {
        super(props);
    }

    selectPark(park) {
        this.props.onSelectPark(park);
    }

    render() {
        var parkList = this.props.parks.map((park) => {
            return (
                <div className='row u-clickable' onClick={() => this.selectPark(park)} key={park.park_id}>
                    <div className='name ten columns'>{park.name}</div>
                    <div className='id two columns'>{park.park_id}</div>
                </div>
            );
        });
        return (
            <div>
                <div className='row'>
                    <select>
                        <option defaultValue>Neighborhood</option>
                        <option>Downtown</option>
                        <option>Hyde Park</option>
                    </select>
                    <select>
                        <option defaultValue>Activity</option>
                        <option>BBQ Pit</option>
                        <option>Restroom</option>
                    </select>
                    <input type='text' placeholder='Name' />
                </div>
                <div className='row'>
                    <div className='ten columns'><h6>Park Name</h6></div>
                    <div className='two columns'><h6>Park ID</h6></div>
                </div>
                {parkList}
            </div>
        );
    }
}

ParkList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
