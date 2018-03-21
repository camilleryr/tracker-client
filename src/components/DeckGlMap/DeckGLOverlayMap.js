/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiY2FtaWxsZXJ5ciIsImEiOiJjamVyY2ZjY2owa2tjMzJwN29mOHd6NGc3In0.4M2-XhGyCx69BJZOFOUllg";

// Source data CSV
const DATA_URL = {
  TRIPS: 'https://trackmyrun-41804.firebaseio.com/.json' 
};

class DeckGLOverlayMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 110,
        height: 110
      },
      buildings: {},
      trips: null,
      time: 0
    };

    requestJson(DATA_URL.TRIPS, (error, response) => {
      if (!error) {
        let valueArray = Object.values(response);
        let trips = valueArray.map((activity, index) => {
          let incrementor = index*75  
          activity = activity.reverse();
          let time = activity[0].timestamp;
          return {
            "vendor": 0,
            "segments":activity.map(position => {
              return [position.coords.longitude, position.coords.latitude, (((position.timestamp - time) / 1000) + incrementor)]
            })
          }
        });
        this.setState({trips: trips});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      let map = this.mapRef.getMap()
      map.remove()
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const timestamp = Date.now();
    const loopLength = 3000;
    const loopTime = 60000;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, buildings, trips, time} = this.state;

    return (
      <MapGL
        {...viewport}
        ref={map => (this.mapRef = map)}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          buildings={buildings}
          trips={trips}
          trailLength={180}
          time={time}
          />
      </MapGL>
    );
  }
}

export default DeckGLOverlayMap