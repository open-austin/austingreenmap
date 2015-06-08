import $ from 'jquery';
import React from 'react';


export default class ParkList extends React.Component {
    constructor(props) {
        super(props);
    }

    // FIXME: How do we figure out which was clicked? Searching by name is
    // horrible
    handle(ev) {
        console.log(this.props.parks);
        var names = this.props.parks.map((x) => x.name);
        var idx = names.indexOf(ev.target.innerHTML);
        this.props.onSelectPark(this.props.parks[idx].park_id);
    }

    render() {
        var parkList = this.props.parks.map((park) => {
            var pID = park.park_id;
            return (
                <li onClick={this.handle.bind(this)} key={pID}>
                    {park.name}
                </li>
            );
        });
        return <ul>{parkList}</ul>;
    }
}

