function haversine(a, b) {

    const R = 6371;

    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lng - a.lng) * Math.PI / 180;

    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(a.lat * Math.PI / 180) *
        Math.cos(b.lat * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.asin(Math.sqrt(x));
}

function greedyRoute(depots, bins) {

    const start = depots[0];

    const unvisited = [...bins];

    let current = start;

    const route = [start];

    while (unvisited.length > 0) {

        let bestIndex = 0;
        let bestDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {

            const distance = haversine(
                current,
                unvisited[i]
            );

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = i;
            }
        }

        current = unvisited.splice(bestIndex, 1)[0];

        route.push(current);
    }

    route.push(start);

    return route;
}

module.exports = greedyRoute;