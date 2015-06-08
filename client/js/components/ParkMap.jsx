
class Park extends React.Component {
    constructor(props) {
        super(props);
        var pID = this.props.parkId;
    }

    render () {
        return <div>hi</div>;
    }
}



function getParks() {
    return $.getJSON("/data/city_of_austin_parks.geojson");
}

function getFeature(parkID, featureType) {
    return $.getJSON(`/data/${featureType}/park_${parkID}.geojson`);
}

    // getFeature(pID, "park")
        // .then((data) => this.setState({park: data}) );
    // getFeature(pID, "amenity")
        // .then((data) => this.setState({amenity: data}) );
    // getFeature(pID, "facility")
        // .then((data) => this.setState({facility: data}) );
    // getFeature(pID, "trail")
        // .then((data) => this.setState({trail: data}) );
