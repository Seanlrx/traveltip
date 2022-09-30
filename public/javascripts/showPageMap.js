// showPageMap4. get the mapToken from show.ejs
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: attraction.geometry.coordinates, // starting position [lng, lat] and get the attraction varible from show.ejs
    zoom: 10 // set the start point of zoom in
});

map.addControl(new mapboxgl.NavigationControl());

// showPageMap4.3. add the marker on the map based on the documentation from Mapbox GL JS
// showPageMap4.4. get the attraction information from show.ejs (variable from ejs)
// showPageMap4.5. show the popup information and set the HTML information showing on the pop up
new mapboxgl.Marker()
    .setLngLat(attraction.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${attraction.title}</h3><p>${attraction.location}</p>`
            )
    )
    .addTo(map)

