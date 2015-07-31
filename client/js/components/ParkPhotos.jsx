import React from 'react';
import when from 'when';
import api from '../utils/api';
import Slider from 'react-slick';

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
      // TODO handle thumbnail size upstream / interop with zoom.js
      const photosPromise = api.getParkPhotos(this.props.parkId)
          .tap((data) => this.setState({photos: data.map((url) => url.replace('.jpg', '_q.jpg'))}));

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

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            centerMode: true,
            arrows: true,
            responsive: [
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 961, settings: { slidesToShow: 3 } },
                { breakpoint: 1024, settings: { slidesToShow: 4 } },
                { breakpoint: 100000, settings: { slidesToShow: 5 } }
            ]
        };

        const contents = this.state.photos.map( (photo) =>
            ( <div><img src={photo} /></div> )
        );

        return (
            <Slider className="park-photos" {...settings}>
                {contents}
            </Slider>
        );
    }
}
