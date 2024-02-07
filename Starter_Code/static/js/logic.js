// Creating Map with centered at the geographical centre of United States
var myMap = L.map("map", {
    center: [39.82, -98.58],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data of earthquakes in the last 7 days.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to choose color based on earthquake depth
function chooseColor(depth) {
    if (depth < 10) return "yellow";
    else if (depth < 30) return "red";
    else if (depth < 50) return "orange";
    else if (depth < 70) return "green";
    else if (depth < 90) return "purple";
    else return "black";
}

// Function to create features
function createFeatures(earthquakeData) {
    // Function to define what happens on each feature
    function onEachFeature(feature, layer) {
        // Giving each feature a popup with information pertinent to it
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    }

    // Function to create a circle marker
    function pointToLayer(feature, latlng) {
        var markerOptions = {
            radius: feature.properties.mag * 4, // Scale the radius by earthquake magnitude
            fillColor: chooseColor(feature.geometry.coordinates[2]), // Choose color based on depth
            color: "white",
            weight: 1.5,
            opacity: 0.75,
            fillOpacity: 0.75
        };
        return L.circleMarker(latlng, markerOptions);
    }

    // Creating a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    }).addTo(myMap);
}

// Getting our GeoJSON data
d3.json(link).then(function (data) {
    // Sending the data.features object to the createFeatures function
    createFeatures(data.features);
});