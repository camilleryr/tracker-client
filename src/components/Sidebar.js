import React from "react";
import "../css/Sidebar.css";


const Sidebar = () => (

    <div className="sidebar">

        <div className="sidebar-block">
            <img className="sidebar-logo" src={require("../assets/vectorpaint2.svg")} alt="logo" />    
        </div>

        <div className="sidebar-header">
            <h3>Chris Tracker</h3>
        </div>
        
    </div>
    
);

export default Sidebar;
