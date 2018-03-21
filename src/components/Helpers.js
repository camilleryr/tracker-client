
export function setLineChartData(cordsArray) {
    
    if(!cordsArray || cordsArray.length < 12) { 
        return null 
    }

    let totalDistance = 0
    let startTime = cordsArray[0].timestamp
    
    let segmentLength = Math.floor(cordsArray.length / 12)
    
    let segmentedArray = []
    do{
        segmentedArray.push(cordsArray.splice(0, segmentLength))
    } while (cordsArray.length > 0)
    
    let returnArray = []
    
    segmentedArray.forEach((segment,index) => {
        
        let segmentDistance = 0

        for (let index = 0; index < segment.length-1; index++) {
            let a = segment[index].coords
            let b = segment[index+1].coords
            segmentDistance += _distance(a.latitude, a.longitude, b.latitude, b.longitude)
        }

        let arrayLength = segment.length
        let _altitude = segment.reduce((accumulator, currentValue) => accumulator + currentValue.coords.altitude, 0) / arrayLength
        let segmentTime = ((segment[0].timestamp - segment[segment.length-1].timestamp)/3600000)
        let _speed = segmentDistance / segmentTime
        
        totalDistance += segmentDistance
        
        returnArray.push({
            name:`Point ${index}`,
            distance: totalDistance,
            altitude: _altitude,
            speed: _speed 
        })
    })
    return returnArray
};

function _distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    return dist
}