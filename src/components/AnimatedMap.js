/* global window,document */
import React from "react";
import MAPBOXGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";

const mapStyle = "mapbox://styles/mapbox/dark-v9";
MAPBOXGL.accessToken =
  "pk.eyJ1IjoiY2FtaWxsZXJ5ciIsImEiOiJjamV5a2w2anowNGk2MnFub200ZmgwOHUwIn0.GRIIDhgliuWuJpiruHOMWg";

// default level of zoom for the map
const defaultZoom = 8.5;

class AnimatedMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 36.19040514343143,
        longitude: -86.69760664018014,
        zoom: 16,
        width: 1375,
        height: 525,
        startDragLngLat: null,
        isDragging: null,
        pitch: 60,
        bearing: -8
      },
    };
  }

  // added the map will not properly resize without it, it will 'stick' in the first setting
  animate = map => {

    var speedFactor = 20; // number of frames per longitude degree
    var animation; // to store and cancel the animation
    var startTime = 0;
    var progress = 0; // progress = timestamp - startTime
    var resetTime = false; // indicator of whether time reset is needed for the animation
    var pauseButton = document.getElementById("pause");

    startTime = performance.now();

    let aniIndex = 0;
    let timer = 0;
    
    const animateLine = timestamp => {
      if (timer === 0) {
        if (aniIndex === this.props.cordArray.length) {
          resetTime = false;
          this.props.geojson.features[0].geometry.coordinates = [];
          aniIndex = 0;
        } else {
          progress = timestamp - startTime;
        }
        let currentCord = this.props.cordArray[aniIndex];
        this.props.geojson.features[0].geometry.coordinates.push(currentCord);
        
        // then update the map
        map.panTo(currentCord);
        map
        .getSource("point")
        .setData({ type: "Point", coordinates: currentCord });
        map.getSource("line-animation").setData(this.props.geojson);
        
        aniIndex++;
        timer++;
      } else {
        timer = 0;
      }
      
      // debugger
      // Request the next frame of the animation.
      animation = requestAnimationFrame(animateLine);
    };
    animateLine();
  };

  componentDidMount = () => {
    let map = this.mapRef.getMap();

    map.on("load", () => {
      // add the line which will be modified in the animation
      map.addLayer({
        id: "line-animation",
        type: "line",
        source: {
          type: "geojson",
          data: this.props.geojson
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#fd805d",
          "line-width": 5,
          "line-opacity": 0.5
        }
      });

      map.addLayer({
        id: "point",
        source: {
          type: "geojson",
          data: {
            type: "Point",
            coordinates: [this.props.cordArray[0]]
          }
        },
        type: "circle",
        paint: {
          "circle-radius": 4,
          "circle-color": "#fd805d"
        }
      });

      map.addSource("dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb"
      });
      map.addLayer({
        id: "hillshading",
        source: "dem",
        type: "hillshade"
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
      });

      this.animate(map);
    });
  };

  componentWillUnmount() {
    let map = this.mapRef.getMap();
    map.remove()
  }

  _onChangeViewport = newViewport => {
    const viewport = Object.assign({}, this.state.viewport, newViewport);
    this.setState({ viewport });
  };

  render() {
    const { viewport } = this.state;

    return (
      <div>
        <MAPBOXGL
          mapboxApiAccessToken={MAPBOXGL.accessToken}
          onViewportChange={this._onChangeViewport}
          mapStyle={mapStyle}
          ref={map => (this.mapRef = map)}
          {...viewport}
        />
      </div>
    );
  }
}

export default AnimatedMap;
