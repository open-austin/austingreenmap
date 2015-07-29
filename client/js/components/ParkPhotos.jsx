import React from 'react';
import when from 'when';
import api from '../utils/api';
import Slider from 'react-slick';

export default class ParkPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            photos: []
        };
    }

    load() {
      var photosPromise = api.getParkPhotos(this.props.parkId)
          .tap((data) => this.setState({photos: data}));

      when.settle([photosPromise])
          .then(() => {
              this.setState({loading: false});
          });
    }

    componentDidMount() {
        this.load();
    }

    next() {
        let photos = this.state.photos;
        photos.unshift(photos.pop());
        this.setState({photos: photos});
    }

    prev() {
        let photos = this.state.photos;
        photos.push(photos.shift());
        this.setState({photos: photos});
    }

    render() {
        if (!this.state.photos.length) return (<div></div>);

        return (
            <div>
              <img src={this.state.photos[0]} />
              <div>
                <span onClick={() => this.prev()}>&lt;</span>
                <span onClick={() => this.next()}>&gt;</span>
              </div>
            </div>
        );
    }
}
