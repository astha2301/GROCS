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


// Total Distance
function totalDistance(route) {

    let total = 0;

    for (let i = 0; i < route.length - 1; i++) {

        total += haversine(
            route[i],
            route[i + 1]
        );
    }

    return total;
}


// Nearest Neighbor Initial Route
function nearestNeighbor(start, bins) {

    const unvisited = [...bins];

    let current = start;

    const route = [start];

    while (unvisited.length > 0) {

        let bestIndex = 0;
        let shortest = Infinity;

        for (let i = 0; i < unvisited.length; i++) {

            const distance = haversine(
                current,
                unvisited[i]
            );

            if (distance < shortest) {

                shortest = distance;
                bestIndex = i;
            }
        }

        current = unvisited.splice(bestIndex, 1)[0];

        route.push(current);
    }

    route.push(start);

    return route;
}


// 2-OPT Optimization
function twoOpt(route) {

    let improved = true;

    while (improved) {

        improved = false;

        for (let i = 1; i < route.length - 2; i++) {

            for (let j = i + 1; j < route.length - 1; j++) {

                const newRoute = [...route];

                const reversed = newRoute
                    .slice(i, j + 1)
                    .reverse();

                newRoute.splice(
                    i,
                    j - i + 1,
                    ...reversed
                );

                const currentDistance =
                    totalDistance(route);

                const newDistance =
                    totalDistance(newRoute);

                if (newDistance < currentDistance) {

                    route = newRoute;

                    improved = true;
                }
            }
        }
    }

    return route;
}


// Main TSP Function
function tspRoute(depots, bins) {

    if (depots.length === 0) {
        return [];
    }

    if (bins.length === 0) {
        return depots;
    }

    const start = depots[0];

    // Step 1: Create initial route
    let route = nearestNeighbor(start, bins);

    // Step 2: Optimize route
    route = twoOpt(route);

    return route;
}

module.exports = tspRoute;