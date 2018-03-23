import React, { Component } from "react";
import { Link } from 'react-router-dom'
import DeckGLOverlayMap from "./DeckGlMap/DeckGLOverlayMap";
import "../css/Splash.css";


class Splash extends Component {
    
    render() {
        return (
            <div className="Splash">
                <DeckGLOverlayMap className="deckGLMap"/>   
                <Link className="enterButton" to="/tracker-client/Visualize">
                    <div>ENTER</div>
                </Link>
            </div>
        )
    }
}

export default Splash