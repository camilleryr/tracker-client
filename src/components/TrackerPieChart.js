import React, { Component } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

const COLORS = ['#691e09', '#8d3016', '#b34729', '#dd6442', '#fd805d'];
const RADIAN = Math.PI / 180;                    

class TrackerPieChart extends Component {

  
  render () {
    const data = this.props.data

    return (
    	<PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data} 
          cx={120} 
          cy={200} 
          innerRadius={60}
          outerRadius={80} 
          fill="#8884d8"
          paddingAngle={5}
        >
        	{
          	data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
    )
  }
}
export default TrackerPieChart
