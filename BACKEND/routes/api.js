const express = require("express");

const router = express.Router();

const database = require("../data/database");

const greedyRoute = require("../algorithms/greedy");

const tspRoute = require("../algorithms/tsp");


// ADD DEPOT
router.post("/depot", (req, res) => {

    database.depots.push(req.body);

    res.json({
        message: "Depot added",
        depots: database.depots
    });
});


// ADD BIN
router.post("/bin", (req, res) => {

    database.bins.push(req.body);

    res.json({
        message: "Bin added",
        bins: database.bins
    });
});


// GET ALL DATA
router.get("/data", (req, res) => {

    res.json(database);
});


// GREEDY
router.get("/greedy", (req, res) => {

    const route = greedyRoute(
        database.depots,
        database.bins
    );

    res.json(route);
});


// TSP
router.get("/tsp", (req, res) => {

    const route = tspRoute(
        database.depots,
        database.bins
    );

    res.json(route);
});


// RESET
router.delete("/reset", (req, res) => {

    database.depots = [];
    database.bins = [];

    res.json({
        message: "Reset complete"
    });
});

module.exports = router;