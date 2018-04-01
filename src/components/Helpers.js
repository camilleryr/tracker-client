export function toTwoPoints(double) {
    return (Math.floor(double*10))/10
}

export function setLineChartData(cordsArray) {
    
    if(!cordsArray || cordsArray.length < 12) { 
        return null 
    }

    let totalDistance = 0
    let startTime = cordsArray[0].timestamp
    
    return breakApartCoordArray(cordsArray).map((segment,index) => {
        
        let segmentDistance = segment.reduce( (total, currentValue, currentIndex, arr) => {
            return total + ((currentIndex === arr.length-1) 
                ? 0
                : _distance(currentValue.coords.latitude, currentValue.coords.longitude, arr[currentIndex+1].coords.latitude, arr[currentIndex+1].coords.longitude))
        }, 0 )

        let arrayLength = segment.length
        let _altitude = segment.reduce((accumulator, currentValue) => accumulator + currentValue.coords.altitude, 0) / arrayLength

        let segmentTime = ((segment[segment.length-1].timestamp - segment[0].timestamp)/3600000)
        let _speed = segmentDistance / segmentTime
        
        totalDistance += segmentDistance
        
        return {
            name:`Point ${index}`,
            distance: toTwoPoints(totalDistance),
            altitude: toTwoPoints(_altitude),
            speed: toTwoPoints(_speed)
        }
    })
};

function breakApartCoordArray (cordsArray) {
    cordsArray = cordsArray.sort((a,b) => a.timestamp - b.timestamp)

    let segmentLength = Math.floor(cordsArray.length / 12)

    let _cordsArray = Object.assign([], cordsArray)

    return [...Array(12).keys()].map(x => 
        _cordsArray.splice(0, segmentLength + ( cordsArray.length % segmentLength > x ? 1 : 0 ))
    ) 
}

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