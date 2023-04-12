// Creating the map object
let myMap = L.map("map", {
  // Centering around Medlin & enough to see central and South America
  center: [6.25, -75.57],
  zoom: 4.2
});

// Creating the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Linking the url to API
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// Creating a function that selects a color based on Depth
function chooseColor(depth) {
  if (depth >= 90) return "red";
  else if (depth >= 70) return "goldenrod";
  else if (depth >= 50) return "darkorange";
  else if (depth >= 30) return "yellow";
  else if (depth >= 10) return "chartreuse";
  else return "green";
}


// Creating the initial setup using D3
d3.json(url).then(function(setup) {
//  Logging to check api data features
  console.log(setup);
//  Using geoJson to create the circle marker
  L.geoJson(setup, {
      pointToLayer: (feature) => {
          return new L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], feature.properties.mag*15000);
      },
      style: function(feature) {
          return{
              color: "purple",
              fillColor: chooseColor(feature.geometry.coordinates[2]),
              fillOpacity: 0.65,
              weight:.4
              };
      },
      // Using oneach feature to iterate through each earthquake object
      onEachFeature: function(feature, layer) {
          layer.bindPopup(`<h3>Location:<br> ${feature.properties.place}</h3><hr><p>Date: <br>${new Date(feature.properties.time)}</p>
          <hr><p>Magnitude:<i> <br>${feature.properties.mag}</i>`);
          
      }
  }).addTo(myMap);

  // Creating legend with help from Caleb Steeves in determing HTML format
  let legend = L.control({position: "bottomleft"});
  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "legend info");
      div.innerHTML = [
          "<h3><ins>Earthquake Depth:</ins></h3>",
          "<p class='lt10' >-10 to 10</p>",
          "<p class='lt30' >10 to 30</p>",
          "<p class='lt50' >30 to 50</p>",
          "<p class='lt70' >50 to 70</p>",
          "<p class='lt90' >70 to 90</p>",
          "<p class='gt90' >90 Plus </p>"
      ].join("");

      return div;
  };
  // Add Legend to the Map
  legend.addTo(myMap);

});



