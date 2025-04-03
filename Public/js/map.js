mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // ID of the container element
style: 'mapbox://styles/mapbox/streets-v12', // Map style
center: listing.geometry.coordinates, // Starting position [longitude, latitude] (coordinates for Hyderabad)
zoom: 8 // Starting zoom level
 });

//  console.log(coordinate);
const popup = new mapboxgl.Popup({ offset: 25, closeButton: true, className: "marker-popup" },  ).setHTML(
     `<div style="
      text-align: center;
      border-radius: 50%; 
      background-color: #040303; 
      height:180px; 
      width: 180px;
      background: rgba(203, 150, 150, 0.2); /* Light transparent pink */
      backdrop-filter: blur(10px); /* Glassy effect */
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
      padding:20px;
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      "> 
      <i class="fa-solid fa-compass" style="font-size: 40px; color: #fe424d; ";></i> <p> <b>Have a happy journey</b></P>
     </div>`
   

);

 const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates) // listing.geometry.coordnates
    .setPopup(popup)
    .addTo(map);

    const size = 200;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        }
    };

    map.on('load', () => {
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

        map.addSource('dot-point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': listing.geometry.coordinates // icon position [lng, lat]
                        }
                    }
                ]
            }
        });
        map.addLayer({
            'id': 'layer-with-pulsing-dot',
            'type': 'symbol',
            'source': 'dot-point',
            'layout': {
                'icon-image': 'pulsing-dot'
            }
        });
    });