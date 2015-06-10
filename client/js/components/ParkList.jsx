import $ from 'jquery';
import React from 'react';


export default class ParkList extends React.Component {
    constructor(props) {
        super(props);
    }

    selectPark(parkID) {
        this.props.onSelectPark(parkID);
    }

    render() {
        var parkList = this.props.parks.map((park) => {
            var parkID = park.park_id;
            return (
                <li onClick={() => this.selectPark(parkID)} key={parkID}>
                    {park.name} ({parkID})
                </li>
            );
        });
        return <ul>{parkList}</ul>;
    }
}

