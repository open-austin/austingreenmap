import $ from 'jquery';
import React from 'react';


export default class ParkList extends React.Component {
    constructor(props) {
        super(props);
    }

    selectPark(park_id) {
        this.props.onSelectPark(park_id);
    }

    render() {
        var parkList = this.props.parks.map((park) => {
            var park_id = park.park_id;
            return (
                <li onClick={() => this.selectPark(park_id)} key={park_id}>
                    {park.name}
                </li>
            );
        });
        return <ul>{parkList}</ul>;
    }
}

