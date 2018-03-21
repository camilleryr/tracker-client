import React, { Component } from "react";
import AnimatedMap from "./AnimatedMap";
import "../css/App.css";

class App extends Component {
  state = {
    cordArray: [[0,0]],
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [0,0]
          }
        }
      ]
    }
  };

  setCordArray = (firebaseLocation = "-L75bqpa9c1m_92jzDHd") => {
    fetch(`https://trackmyrun-41804.firebaseio.com/${firebaseLocation}.json`)
      .then(r => r.json())
      .then(data => {
        let _cordArray = data
          .map(GeoLocation => {
            return [GeoLocation.coords.longitude, GeoLocation.coords.latitude];
          })
          .reverse();

        // Create a GeoJSON source with an empty lineString.
        var _geojson = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [_cordArray[0]]
              }
            }
          ]
        };
        this.setState({
          cordArray: _cordArray,
          geojson: _geojson
        });
      });
  };

  handleClick = () => {
    console.log("click")
    this.setCordArray("-L7maugvTaJnQd-kHmLl")
  }

  componentWillMount() {
    this.setCordArray()
  }

  render() {
    return (
      <div className="App">
        {/* <AnimatedMap cordArray={this.state.cordArray} geojson={this.state.geojson} timer={0}/>
        <button onClick={this.handleClick}>Test</button> */}
      </div>
    );
  }
}

export default App;
