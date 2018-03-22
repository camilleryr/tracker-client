import React, { Component } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

const COLORS = ["#691e09", "#8d3016", "#b34729", "#dd6442", "#fd805d"];
const RADIAN = Math.PI / 180;

class TrackerPieChart extends Component {
  render() {
    const data = this.props.data;

    return (
      <PieChart
        width={225}
        height={300}
        onMouseEnter={this.onPieEnter}
        >
        <Pie
        startAngle={0+(this.props.heatValue*60)}
        endAngle={365+(this.props.heatValue*60)}
          data={data}
          cx={100}
          cy={100}
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={15}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}
export default TrackerPieChart;
