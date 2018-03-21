import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import React, { Component } from "react";
import { setLineChartData } from "./Helpers";

class TrackerLineGraph extends Component {

    state = {
        data: null
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: setLineChartData(nextProps.data)})
    }

  render() {
      let data = this.state.data

      if(data){
          return (
            <LineChart
              width={600}
              height={300}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="distance" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="speed"
                stroke="#fd805d"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="altitude" stroke="#82ca9d" />
            </LineChart>
          );
      } else {
          return null
      }
  }
}

export default TrackerLineGraph;
