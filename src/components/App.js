import React, { Component } from "react";
import AnimatedMap from "./AnimatedMap";
import CalendarHeatmap from "react-calendar-heatmap";
import TrackerPieChart from "./TrackerPieChart";
import TrackerLineGraph from "./TrackerLineGraph";
import { Grid, Row, Col } from "react-bootstrap";
import "../css/App.css";
import "../css/HeatMap.css";
import Sidebar from "./Sidebar";
import { toTwoPoints } from "./Helpers";

class App extends Component {
  state = {
    heatMapQuantifier: "distance",
    apiResponse: null,
    cordArray: [[0, 0]],
    values: [],
    firebaseData: null,
    selectedAPILocation: null,
    selected: null,
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [0, 0]
          }
        }
      ]
    },
    heatmapData: [
      { name: 0, value: 0 },
      { name: 1, value: 0 },
      { name: 2, value: 0 },
      { name: 3, value: 0 },
      { name: 4, value: 0 }
    ]
  };

  generateHeatmapData = (onLoad = false) => {
    let sortedArray = this.state.apiResponse
      .map(x => x[this.state.heatMapQuantifier])
      .sort((a, b) => b - a);
    let min = sortedArray[sortedArray.length - 1];
    let max = sortedArray[0];
    let difference = max - min;

    let _values = this.state.apiResponse.map(x => {
      let z = (x[this.state.heatMapQuantifier] - min) / difference;
      // debugger
      return {
        date: x.startTime.substring(0, 10),
        count: z < 0.2 ? 0 : z < 0.4 ? 1 : z < 0.6 ? 2 : z < 0.8 ? 3 : 4,
        firebaseLocation: x.firebaseLocation,
        apiLocation: x.id
      };
    });

    let _heatmapData = Object.assign([], this.state.heatmapData);

    _values.forEach(x => {
      _heatmapData[x.count].value++;
    });
    
    this.setState({ values: _values, heatmapData: _heatmapData }, () => {
      if(onLoad) {this.setCordArray()};
    });
  };

  componentWillMount() {
    fetch("http://danko.mit.edu/api/activities")
      .then(x => x.json())
      .then(y => {
        this.setState({ apiResponse: y }, () => {
          this.generateHeatmapData(true);
        });
      });
  }

  setCordArray = (value = this.state.values[this.state.values.length - 1]) => {
    fetch(
      `https://trackmyrun-41804.firebaseio.com/${value.firebaseLocation}.json`
    )
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
          geojson: _geojson,
          selectedHeatValue: value.count,
          selected: this.state.apiResponse.find(x => x.id === value.apiLocation)
        });
      });
  };

  onRadioChange = event => {
    this.setState({heatMapQuantifier: event.target.value}, this.generateHeatmapData())
  }

  handleClick = value => {
    console.log("click");
    if (value) {
      this.setCordArray(value);
    }
  };

  RenderText = () => {
    if (this.state.selected) {
      return (
        <h4 className="dashboard--description">
          Date : {this.state.selected.startTime.substring(0, 10)} | Distance :{" "}
          {toTwoPoints(this.state.selected.distance)} | Pace :{" "}
          {toTwoPoints(this.state.selected.pace)}
        </h4>
      );
    }
  };

  render() {
    return (
      <div className="dashboard">
        <Sidebar />
        <Grid className="dashboard--grid" fluid>
          <Row>
            <Col md={12}>
              <AnimatedMap
                className="dashboard--animatedMap"
                cordArray={this.state.cordArray}
                geojson={this.state.geojson}
                timer={0}
              />
            </Col>
          </Row>

          <Row className="bottomRow">
            <Col md={3}>
              <div className="dashboard--lineGraph">
                <TrackerLineGraph data={this.state.firebaseData} />
              </div>
            </Col>

            <Col md={7}>
              <div className="dashboard--heatmap">
                <span className="heatmap--text">Distace :&nbsp;</span>
                <input
                  type="radio"
                  name="Distance"
                  value="distance"
                  checked={this.state.heatMapQuantifier === "distance"}
                  onChange={event => this.onRadioChange(event)}
                />
                <span className="heatmap--text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pace :&nbsp;</span>
                <input
                  type="radio"
                  name="Pace"
                  value="pace"
                  checked={this.state.heatMapQuantifier === "pace"}
                  onChange={event => this.onRadioChange(event)}
                />
                <CalendarHeatmap
                  onClick={value => this.handleClick(value)}
                  values={this.state.values}
                  classForValue={value => {
                    if (!value) {
                      return "color-empty";
                    }
                    return `color-scale-${value.count}`;
                  }}
                />
              </div>

              {this.RenderText()}
            </Col>
            <Col md={2}>
              <div className="dashboard--pieChart">
                <TrackerPieChart
                  data={this.state.heatmapData}
                  heatValue={this.state.selectedHeatValue}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
