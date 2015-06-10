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
                <li onClick={() => this.selectPark(park)} key={park.park_id}>
                    {park.name} ({park.park_id})
                </li>
            );
        });
        return <ul>{parkList}</ul>;
    }
}

ParkList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
