import React, { Component } from "react";
import AnimatedMap from "./AnimatedMap";
import CalendarHeatmap from "react-calendar-heatmap";
import "../css/App.css";
import TrackerPieChart from "./TrackerPieChart";
import TrackerLineGraph from "./TrackerLineGraph";


class App extends Component {
  state = {
    apiResponse: null,
    values: [],
    cordArray: [[0,0]],
    firebaseData: null,
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

  setCordArray = (firebaseLocation = "-L84VmgCGE-tky50AIL7") => {
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
          firebaseData: data,
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
    const _data = [{name: 0, value: 0}, {name: 1, value: 0},
    {name: 2, value: 0}, {name: 3, value: 0}, {name: 4, value: 0}]

    this.state.values.forEach(x => {
      _data[x.count].value ++
    })
    return (
      <div className="App">
        <AnimatedMap cordArray={this.state.cordArray} geojson={this.state.geojson} timer={0}/>
        <TrackerPieChart data={_data}/>
        <TrackerLineGraph data={this.state.firebaseData}/>
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
