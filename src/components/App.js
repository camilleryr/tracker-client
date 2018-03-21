import React, { Component } from "react";
import AnimatedMap from "./AnimatedMap";
import CalendarHeatmap from "react-calendar-heatmap";
import "../css/App.css";

class App extends Component {
  state = {
    apiResponse: null,
    values: [],
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

  componentDidMount() {
    fetch("http://danko.mit.edu/api/activities")
      .then(x => x.json())
      .then(y => {

        let longestDistance = y.map(x => x.distance).sort((a,b) => b-a)[0]

        let _values = y.map(x => {
          let z = x.distance / longestDistance
          return {
            "date":x.startTime.substring(0,10),
            "count": ((z < .2) ? 0
                    : (z < .4) ? 1
                    : (z < .6) ? 2
                    : (z < .8) ? 3
                               : 4),
            "firebaseLocation": x.firebaseLocation
          }})
          
        this.setState({ apiResponse: y, values:_values });
      });

  }

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
        <AnimatedMap cordArray={this.state.cordArray} geojson={this.state.geojson} timer={0}/>
        {/* <button onClick={this.handleClick}>Test</button> */}
        <CalendarHeatmap
          onClick={value => {this.setCordArray(value.firebaseLocation)}}
          values={this.state.values}
          classForValue={value => {
            if (!value) {
              return "color-empty";
            }
            return `color-scale-${value.count}`;
          }}
        />
      </div>
    );
  }
}

export default App;
