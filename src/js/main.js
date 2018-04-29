/**
 * mapModule renders data sets with different visual representation.
 * @type {{renderPrisons, renderPrisonHeatMap}}
 */
var mapModules = (function () {
    mapboxgl.accessToken = ' ';

    var map = new mapboxgl.Map({
        style: 'mapbox://styles/heng2j/cjgkwpxsr00032so265r204to',
        center: [-73.9612, 40.6405],
        zoom: 11.95,
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
            xhr.open('GET',  "src/data/FY11_BROOKLYN_For_Viz.geojson");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);

                   console.log(data);

                    map.addLayer({
                        "id": "properties",
                        "type": "circle",
                        "source": {
                            "type": "geojson",
                            "data": data
                        },
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
                    });

                }
            };
            xhr.send();

            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            map.on('click', 'properties', function (e) {
                var property = e.features[0].properties,
                    popOverContet;

                    console.log(property);

                for (prop in property) {

                    console.log(prop);
                    console.log(property[prop]);

                    popOverContet += prop  + ': '  + property[prop] + '</br>';
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
     * Renders Properties in USA with heatmap
     */
    function renderPropertiesHeatMap() {
        map.on('load', function () {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "src/data/us_prisons.geojson");
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
                map.addSource('prisons', {
                    "type": "geojson",
                    "data": dataSource
                });

                map.addLayer({
                    "id": "prisons-heat",
                    "type": "heatmap",
                    "source": "prisons",
                    "maxzoom": 9,
                    "paint": {
                        //Increase the heatmap weight based on frequency and property magnitude
                        "heatmap-weight": {
                            "property": "mag",
                            "type": "exponential",
                            "stops": [
                                [0, 0],
                                [6, 1]
                            ]
                        },
                        //Increase the heatmap color weight weight by zoom level
                        //heatmap-ntensity is a multiplier on top of heatmap-weight
                        "heatmap-intensity": {
                            "stops": [
                                [0, 1],
                                [9, 3]
                            ]
                        },
                        //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        //Begin color ramp at 0-stop with a 0-transparancy color
                        //to create a blur-like effect.
                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0, "#f7f7f7",
                            0.2, "#d9d9d9",
                            0.4, "#bdbdbd",
                            0.6, "#969696",
                            0.8, "#636363",
                            1, "#252525"
                        ],
                        //Adjust the heatmap radius by zoom level
                        "heatmap-radius": {
                            "stops": [
                                [0, 2],
                                [9, 20]
                            ]
                        },
                        //Transition from heatmap to circle layer by zoom level
                        "heatmap-opacity": {
                            "default": 1,
                            "stops": [
                                [7, 1],
                                [9, 0]
                            ]
                        }
                    }
                });
            }

        });
    }

    return {
        renderProperties: renderProperties,
        renderPropertiesHeatMap: renderPropertiesHeatMap
    };

})();
