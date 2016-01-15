/**
 * Created by bdraper on 8/19/2015.
 */
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////Example 7: sandy sensors from plain json, clustered, symbolized by type (235 sites, symbolized by category in attributes)
//// this example demonstrates display of 235 clustered points, with multiple, attribute-dependent symbols, presented as a single layer, with a single cluster symbol
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                disableClusteringAtZoom: 8

            });


            for (var i = 0; i < json.length; i++) {
                var a = json[i];

                var marker = L.circleMarker(new L.LatLng(a['LATITUDE'], a['LONGITUDE']), {
                    radius: 3,
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
                console.log('marker ' + a.layer);
            });

        }
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
////end sandy sensors from plain json, clustered, symbolized by type
//////////////////////////////////////////////////////////////////////////////////////////////////////////
