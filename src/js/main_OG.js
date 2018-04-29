/**
 * mapModule renders data sets with different visual representation.
 * @type {{renderProperties, renderPrisonHeatMap}}
 */

var mapModules = (function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGVuZzJqIiwiYSI6ImNqMmF5aWRmMjAwZzIyd2x2cGNyd3IxeDEifQ.dstUJ-_cgpg4qU3mgImiOg';

    var map = new mapboxgl.Map({
        style: 'mapbox://styles/heng2j/cjgkwpxsr00032so265r204to',
        center: [-74.0066, 40.7135],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        hash: true,
        container: 'map'
    });

    /**
     * Renders Properties in NYC
     */
    function renderProperties() {
        map.on('load', function () {
            map.addControl(new mapboxgl.FullscreenControl());

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "src/data/FY11_BROOKLYN_For_Viz.geojson");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);

                    map.addLayer({
                        "id": "properties",
                        "type": "symbol",
                        "source": {
                            "type": "geojson",
                            "data": data
                        },
                        "layout": {
                            "icon-image": "prison-15",
                            "text-field": "{name}",
                            "text-size": 8,
                            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                            "text-offset": [0, 0.6],
                            "text-anchor": "top"
                        }
                    });

                }
            };

            xhr.send();

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            map.on('click', 'properties', function (e) {
                var property = e.features[0].properties,
                    popOverContet;

                for (prop in property) {
                    popOverContet += property[prop] + '</br>';
                }

                new mapboxgl.Popup()
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML(popOverContet)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'properties', function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'properties', function () {
                map.getCanvas().style.cursor = '';
            });

        });

    }

    /**
     * Renders Properties in NYC with heatmap
     */
    function renderPropertiesHeatMap() {
        map.on('load', function () {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "src/data/FY11_BROOKLYN_For_Viz.geojson");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);

                    renderCluster(data);

                }
            };
            xhr.send();

            function renderCluster(dataSource) {
                //Add a geojson point source.
                //Heatmap layers also work with a vector tile source.
                map.addSource('properties', {
                    "type": "geojson",
                    "data": dataSource
                });

                map.addLayer(     {
                        "id": "fy11-brooklyn-for-viz-df8fz6",
                        "type": "circle",
                        "source": "composite",
                        "source-layer": "FY11_BROOKLYN_For_Viz-df8fz6",
                        "minzoom": 10,
                        "maxzoom": 19.3,
                        "layout": {
                            "visibility": "visible"
                        },
                        "paint": {
                            "circle-color": {
                                "base": 1,
                                "type": "exponential",
                                "property": "FULLVAL",
                                "stops": [
                                    [
                                        100000,
                                        "hsl(89, 78%, 82%)"
                                    ],
                                    [
                                        500000,
                                        "hsl(98, 100%, 81%)"
                                    ],
                                    [
                                        750000,
                                        "hsl(71, 98%, 80%)"
                                    ],
                                    [
                                        1000000,
                                        "hsl(39, 98%, 84%)"
                                    ],
                                    [
                                        1500000,
                                        "hsl(359, 100%, 87%)"
                                    ],
                                    [
                                        2500000,
                                        "hsl(359, 100%, 81%)"
                                    ],
                                    [
                                        5000000,
                                        "hsl(359, 99%, 68%)"
                                    ],
                                    [
                                        10000000,
                                        "hsl(359, 100%, 47%)"
                                    ],
                                    [
                                        55851249,
                                        "hsl(359, 100%, 34%)"
                                    ]
                                ]
                            }
                        }
                    }

                );
            }

        });
    }

    return {
        renderProperties: renderProperties,
        renderPropertiesHeatMap: renderPropertiesHeatMap
    };

})();