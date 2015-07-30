import React from 'react';
import when from 'when';
import api from '../utils/api';

export default class ParkPhotos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            photos: [],
            idx: 0
        };
    }

    load() {
      const photosPromise = api.getParkPhotos(this.props.parkId)
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
        const idx = ++this.state.idx % this.state.photos.length;
        this.setState({idx: idx});
    }

    prev() {
        const idx = this.state.idx - 1 < 0 ? this.state.photos.length-1 : --this.state.idx;
        this.setState({idx: idx});
    }

    render() {
        if (!this.state.photos.length) { return (<div></div>); }

        return (
            <div>
                <img className="park-photo" src={this.state.photos[this.state.idx]} />
                <div>
                    <span className="park-photo-pager" onClick={(e) => this.prev(e)}>&lt;</span>
                    <span> {this.state.idx + 1} / {this.state.photos.length} </span>
                    <span className="park-photo-pager" onClick={(e) => this.next(e)}>&gt;</span>
                </div>
            </div>
        );
    }
}
