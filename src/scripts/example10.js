//Added by Erik Myers, USGS WiM 1/21/2016
//EXAMPLE 10 using marker styled with custom CSS icon to appear as a circle
//divIcons are set according to each marker's LAKE attribute.
//spiderfy in use here from the original github repo:  https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet
//Auxiliary polygon layers brought in using ESRI-LEAFLET
//MUCH SLOWER than circlemarker implementation, but does work with original spiderfy library 

$( document ).ready(function() {

    //for jshint
    'use strict';

    /* create map */
    var map = L.map('mapDiv').setView([44.833333, -85.583333], 6);
    var layer = L.esri.basemapLayer('Gray').addTo(map);
    var layerLabels;

    var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied:true});

    //return the appropriate class for each point
    function setDivIcon(Lake){
        switch(Lake){
            case "Superior":
                return new L.divIcon({className:'superiorDivicon'});
                break;
            case "Michigan":
                return new L.divIcon({className:'michiganDivicon'});
                break;
            case "Huron":
                return new L.divIcon({className:'huronDivicon'});
                break;
            case "Erie":
                return new L.divIcon({className:'erieDivicon'});
                break;
            case "Ontario":
                return new L.divIcon({className:'ontarioDivicon'});
                break;
            default:
                return new L.divIcon({className: 'otherLakeDivicon'})
        }
    }

    $('#mapDiv').height($('body').height());
    map.invalidateSize();

    //startLoading();

    //ISSUE: figure out hex keys and add them
   L.esri.featureLayer({
        url: "http://sigl.wim.usgs.gov:6080/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3",
        simplifyFactor: 0.5,
        precision: 5,
        style: function(feature){
            if (feature.properties.LAKE == "ls"){
                return {color: 'DarkCyan', weight:0};
            }
            if (feature.properties.LAKE == "lm"){
                return {color: 'DarkKhaki', weight:0};
            }
            if (feature.properties.LAKE == "lh"){
                return {color: 'IndianRed', weight:0};
            }
            if (feature.properties.LAKE == "le"){
                return {color: 'Olive', weight:0};
            }
            if (feature.properties.LAKE == "lo"){
                return {color: 'MediumPurple', weight:0};
            }
        }
    }).addTo(map);

   L.esri.featureLayer({
        url: "http://sigl.wim.usgs.gov:6080/arcgis/rest/services/SIGL/SIGLMapper/MapServer/1",
        simplifyFactor: 0.5,
        precision: 5,
        style: function(){
            return {color: 'DarkOrange', weight: 1 };
        }
    }).addTo(map);

    $.ajax({
        dataType: "json",
        url: "https://sigldev.wim.usgs.gov/LaMPServicesTest/sites/siteView.json",
        success: function (json) {

            console.log(json);

            var markers = L.markerClusterGroup({
                zoomToBoundsOnClick: true,
                disableClusteringAtZoom:10
            });

            for (var i = 0; i < json.length; i++) {
                var a = json[i];

                //create marker divIcon class styles in main.css
                var marker = L.marker(new L.LatLng(a['LATITUDE'], a['LONGITUDE']), {icon: setDivIcon(a.LAKE)});

                marker.bindPopup("<b>Site Name:</b> " + a.NAME + "<br/><b>Site ID:</b> " + a.SITE_ID + "<br/> <b>Description: </b>" + a.DESCRIPTION);
                markers.addLayer(marker);
                oms.addMarker(marker);

            }
            map.addLayer(markers);

            //map.on('ready', finishedLoading);

            map.on("click", function(event){
                console.log(event);
            });

            markers.on('click', function (a) {
                console.log('marker ' + a.layer);
            });
        }
    });

    /*function startLoading(){
        loader.className = "";
    }

    function finishedLoading(){
        loader.className = "done";
        setTimeout(function(){
            loader.className = "hide";
        }, 500);
    }*/
});
