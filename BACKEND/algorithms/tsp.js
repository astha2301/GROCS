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

function tspRoute(depots, bins) {

    const start = depots[0];

    let route = [...bins];

    let improved = true;

    while (improved) {

        improved = false;

        for (let i = 0; i < route.length - 1; i++) {

            for (let j = i + 1; j < route.length; j++) {

                const newRoute = [...route];

                newRoute.splice(
                    i,
                    j - i + 1,
                    ...route.slice(i, j + 1).reverse()
                );

                if (
                    totalDistance(newRoute) <
                    totalDistance(route)
                ) {
                    route = newRoute;
                    improved = true;
                }
            }
        }
    }

    return [start, ...route, start];
}

module.exports = tspRoute;