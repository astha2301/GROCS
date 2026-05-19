const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = 5000;

// ====================================
// MIDDLEWARE
// ====================================

app.use(cors());

app.use(express.json());

// ====================================
// SERVE FRONTEND
// ====================================

app.use(express.static(path.join(__dirname, "FRONTEND")));

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "FRONTEND", "index.html"));
});

// ====================================
// MEMORY STORAGE
// ====================================

let depots = [];

let bins = [];

function distance(a, b) {

    const dx = a.lat - b.lat;

    const dy = a.lng - b.lng;

    return Math.sqrt(dx * dx + dy * dy);
}
function totalDistance(route) {

    let total = 0;

    for (let i = 0; i < route.length - 1; i++) {

        total += distance(route[i], route[i + 1]);
    }

    return total;
}

// ====================================
// ADD DEPOT
// ====================================

app.post("/api/depot", (req, res) => {

    try {

        const { lat, lng } = req.body;

        if (lat === undefined || lng === undefined) {

            return res.status(400).json({
                error: "lat/lng missing"
            });
        }

        const depot = {
            lat: Number(lat),
            lng: Number(lng)
        };

        depots.push(depot);

        console.log("Depot Added:", depot);

        return res.json({
            success: true,
            depots
        });

    } catch (error) {

        console.log("DEPOT ERROR:", error);

        return res.status(500).json({
            error: "Depot failed"
        });
    }
});

// ====================================
// ADD BIN
// ====================================

app.post("/api/bin", (req, res) => {

    try {

        const { lat, lng } = req.body;

        if (lat === undefined || lng === undefined) {

            return res.status(400).json({
                error: "lat/lng missing"
            });
        }

        const bin = {
            lat: Number(lat),
            lng: Number(lng)
        };

        bins.push(bin);

        console.log("Bin Added:", bin);

        return res.json({
            success: true,
            bins
        });

    } catch (error) {

        console.log("BIN ERROR:", error);

        return res.status(500).json({
            error: "Bin failed"
        });
    }
});

// ====================================
// GREEDY ROUTE
// ====================================

app.get("/api/greedy", (req, res) => {

    try {

        if (depots.length === 0 || bins.length === 0) {

            return res.json([]);
        }

        const start = depots[0];

        let unvisited = [...bins];

        let route = [start];

        let current = start;

        while (unvisited.length > 0) {

            let nearestIndex = 0;

            let nearestDistance = Infinity;

            for (let i = 0; i < unvisited.length; i++) {

                const dist = distance(current, unvisited[i]);

                if (dist < nearestDistance) {

                    nearestDistance = dist;

                    nearestIndex = i;
                }
            }

            current = unvisited[nearestIndex];

            route.push(current);

            unvisited.splice(nearestIndex, 1);
        }

        route.push(start);

        console.log("GREEDY ROUTE:", route);

        res.json(route);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Greedy failed"
        });
    }
});
// ====================================
// TSP ROUTE
// ====================================

app.get("/api/tsp", (req, res) => {

    try {

        if (depots.length === 0 || bins.length === 0) {

            return res.json([]);
        }

        const start = depots[0];

        let remaining = [...bins];

        let route = [start];

        let current = start;

        while (remaining.length > 0) {

            let bestIndex = 0;

            let shortest = Infinity;

            for (let i = 0; i < remaining.length; i++) {

                const d = distance(current, remaining[i]);

                if (d < shortest) {

                    shortest = d;

                    bestIndex = i;
                }
            }

            current = remaining[bestIndex];

            route.push(current);

            remaining.splice(bestIndex, 1);
        }

        route.push(start);

        // SIMPLE 2-OPT IMPROVEMENT

        for (let i = 1; i < route.length - 2; i++) {

            for (let j = i + 1; j < route.length - 1; j++) {

                let newRoute = [...route];

                let reversed = newRoute.slice(i, j + 1).reverse();

                newRoute.splice(i, j - i + 1, ...reversed);

                if (totalDistance(newRoute) < totalDistance(route)) {

                    route = newRoute;
                }
            }
        }

        console.log("TSP ROUTE:", route);

        res.json(route);

    } catch (error) {

        console.log("TSP ERROR:", error);

        res.status(500).json({
            error: "TSP failed"
        });
    }
});

// ====================================
// RESET
// ====================================

app.delete("/api/reset", (req, res) => {

    try {

        depots = [];

        bins = [];

        console.log("ALL DATA RESET");

        return res.json({
            success: true
        });

    } catch (error) {

        console.log("RESET ERROR:", error);

        return res.status(500).json({
            error: "Reset failed"
        });
    }
});

// ====================================
// START SERVER
// ====================================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);
});