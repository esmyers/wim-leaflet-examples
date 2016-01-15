
/////////////////////////////////////////////////////////
//This example clusters points all the way to max zoom
//Clicking a cluster will spiderfy the points at zoom 4 to max


/////////////////////////////////////////////////////////


$( document ).ready(function() {

    //for jshint
    'use strict';

    /* create map */
    var map = L.map('mapDiv').setView([44.833333, -85.583333], 6);
    var layer = L.esri.basemapLayer('Gray').addTo(map);
    var layerLabels;

    //var oms = new OverlappingMarkerSpiderfier(map);

    $('#mapDiv').height($('body').height());
    map.invalidateSize();

    $.ajax({
        dataType: "json",
        url: "https://sigldev.wim.usgs.gov/LaMPServicesTest/sites/siteView.json",
        success: function (json) {

            console.log(json);

            var markers = L.markerClusterGroup({
                spiderfyDistanceMultiplier:3, 
                maxClusterRadius: 50,
                zoomToBoundsOnClick: false
            });


            for (var i = 0; i < json.length; i++) {
                var a = json[i];

                var marker = L.circleMarker(new L.LatLng(a['LATITUDE'], a['LONGITUDE']), {
                    radius: 4,
                    fillOpacity: 0.95
                });

                //Baro
                if (a.LAKE == "Huron") {
                    marker.setStyle({color: '#FFFF00'});
                }
                //meteorological
                if (a.LAKE == "Superior") {
                    marker.setStyle({color: '#FFC0CB'});
                }
                //rapid deploy gage
                if (a.LAKE == "Ontario") {
                    marker.setStyle({color: '#32BF32'});
                }
                //storm tide
                if (a.LAKE == "Erie") {
                    marker.setStyle({color: '#FF0000'});
                }
                //wave height
                if (a.LAKE == "Michigan") {
                    marker.setStyle({color: '#800080'});
                }

                marker.bindPopup("Site ID: " + a.NAME);
                markers.addLayer(marker);
                //oms.addMarker(marker);
            }
            map.addLayer(markers);

            markers.on('click', function (a) {
                console.log('marker ' + a.NAME);
            });

            //ISSUE: handles spiderfy click ONLY when clusters visible -- not a solution for overlapping points.
            markers.on('clusterclick', function (a) {
                if (map.getZoom() <= 6){
                    a.layer.spiderfy();
                }
                
                //console.log('cluster ' + a.layer.getAllChildMarkers().length);
            });

        }
    });
});

