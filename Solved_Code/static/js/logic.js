var myMap = L.map("map", {
    center : [
        37.09, -95.71
    ],
    zoom: 3
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

let dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function colorDepths(color) {
    return color < 0 ? "rgb(255, 255, 255)" :
           color < 10 ? "rgb(220, 220, 255)" :
           color < 20 ? "rgb(200, 200, 255)" :
           color < 30 ? "rgb(170, 170, 255)" :
           color < 40 ? "rgb(125, 125, 255)" :
           color < 50 ? "rgb(100, 100, 255)" :
           color < 60 ? "rgb(70, 70, 255)" :
           color < 70 ? "rgb(40, 40, 255)" :
           "rgb(0, 0, 255)";
};

function features(earthquakeData) {
    L.geoJSON(earthquakeData, {
        onEachFeature : ((earthquakeData, layer) => layer.bindPopup("<h3>" + earthquakeData.properties.place + "<h3><hr><p>Depth: " + earthquakeData.geometry.coordinates[2] + "<p><hr><p>Magnitude: " + earthquakeData.properties.mag)),
        pointToLayer : function(feature, latlng) {
            let r = Math.floor(255 - (3 * feature.geometry.coordinates[2]));
            let g = Math.floor(255 - (3 * feature.geometry.coordinates[2]));
            let b = 255;
            let color = "rgb("+r+" ,"+g+","+ b+")";
            return L.circleMarker(latlng, {
                radius : 3 * feature.properties.mag,
                fillColor : color,
                color : "white",
                weight : 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(myMap);

    let legend = L.control({position : "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var depths =[0, 10, 20, 30, 40, 50, 60, 70, 80]
        
        div.innerHTML += "<strong>Earthquake Depths</strong><br>";

        for (i = 0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + colorDepths(depths[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
};

d3.json(dataUrl).then((data) => features(data.features));