let inside = 0;
let outside = 0;
let polygonPoints = [];
    let reqpolygon = null;
    let removePolygon = null;
    let removePolygon_points = [];
    let markers = [];
    let polygons = [];
    let polygonPrice = [];
    let polygonSum = []
    let freespacefair = [
        {
            "distance": 1,
            "price": 11.95
        },
        {
            "distance": 6,
            "price": 3.35
        },
        {
            "distance": 5000,
            "price": 2.95
        }
    ]
    const dataJSON = localStorage.getItem('freespacefair');

// Parse the JSON string back into an array of objects
const data = JSON.parse(dataJSON);

if(data!=null)
{
    freespacefair=data;

}

    let summaryresult = [];
    let removeall = [];
document.addEventListener("DOMContentLoaded", function () {

    adjustDropdownPosition();
    showexistingbasefare();
    // Initialize the map

    for (var i = 0; i < freespacefair.length; i++) {
        var distance = freespacefair[i].distance;
        var price = freespacefair[i].price;

        // Create a new table row
        var newRow = $("<tr>");

        // Add input fields for distance and price with the existing data
        newRow.append("<td><input type='number' class='form-control' style='width: 100px;' placeholder='Distance' value='" + distance + "'></td>");
        newRow.append("<td><input type='number' class='form-control' style='width: 100px;' placeholder='Price' value='" + price + "'></td>");

        // Add a button to remove the row
        newRow.append("<td><button class='btn btn-danger btn-sm remove-row'>Remove</button></td>");

        // Append the new row to the table
        $("#quote-table tbody").append(newRow);
    }

    const map = L.map("map").setView([51.505, -0.09], 13); // Initial view coordinates

    // Create a tile layer for the map
    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
    var accessToken = 'pk.eyJ1Ijoic2F5YW5lOSIsImEiOiJjbG5lcmlsb2QwajB0MnFtajduNWczenQ5In0.XCiEQ6jzqvmkifZpXmgLaA';
    var mapboxTileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + accessToken;

    L.tileLayer(mapboxTileUrl, {
        attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11', // Change this to your desired Mapbox style
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    showalltheexistingpolygon();

    showallpolygondetails();


    const collapsibleButtons = document.querySelectorAll(".collapsible");
    const polygonContainer = document.querySelectorAll(".polygon-details-container");
    const removepoly= document.querySelectorAll(".remove-poly");
    console.log("poy-detils",polygonContainer);
    collapsibleButtons.forEach((button,index) => {
        button.addEventListener("click", function () {
            if (polygonContainer[index].style.display === "block") {
                polygonContainer[index].style.display = "none";
            } else {
                polygonContainer[index].style.display = "block";
            }
        });
    });

    removepoly.forEach((button,index) => {
        button.addEventListener("click", function (event) {
            console.log("remove button pressed");
            const polygonId = event.target.getAttribute("data-polygon-id");
            //call remove function with id
            removePoly(polygonId);
            console.log(polygonId);
        });
    });


   function showexistingbasefare(){

   }



    function removePoly(id){

        const existingPolygonDataJSON = localStorage.getItem('polygonData');
        const existingPolygonData = JSON.parse(existingPolygonDataJSON);
        const polyafter=[];
        if (existingPolygonData != null) {
            for (var i = 0; i < existingPolygonData.length; i++) {
                const ans = JSON.parse(existingPolygonData[i]);
                const number = parseInt(ans.properties.id);
                if(number!=id)
                {
                    polyafter.push(JSON.stringify(ans));
                  
                }
                else{
                    // const polygonPoints = ans._latlngs[0].map(item => [item.lat, item.lng]);
                    // const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));
                    // const poly = L.polygon(latLngPoints);
                    // console.log(poly);
                    // // map.removeLayer(poly);
                    // poly.addTo(map);
                    location.reload();
                }

            }
            const polyafterstringify=JSON.stringify(polyafter);
            localStorage.setItem('polygonData', polyafterstringify);
            // showalltheexistingpolygon();

              showallpolygondetails();
        }

    }
   
    function showallpolygondetails() {
        function generatePolygonDetails(polygon) {
            
            const removeid=polygon.id;
            let detailsHTML = `<button class="collapsible">${polygon.name}</button>`;
            detailsHTML += '<div class="polygon-details-container">'; // Change the class name here
            detailsHTML += `<h5>Polygon ID: ${polygon.id}</h5>`;
            detailsHTML += `<p>Name: ${polygon.name}</p>`;
            detailsHTML += '<h5>Price Slabs</h5>';
            detailsHTML += generatePriceSlabsTable(polygon.priceSlabs);
            detailsHTML += `<button type="button" class="btn btn-danger btn-sm remove-poly" data-polygon-id="${removeid}">Remove</button>`;
            detailsHTML += '</div>';
            return detailsHTML;
        }
        
        // Function to generate the HTML table for price slabs
        function generatePriceSlabsTable(priceSlabs) {
            let tableHTML = '<table class="table">';
            tableHTML += '<thead><tr><th>Distance</th><th>Price</th></tr></thead>';
            tableHTML += '<tbody>';

            priceSlabs.forEach((slab) => {
                tableHTML += `<tr><td>${slab.distance}</td><td>${slab.price}</td></tr>`;
            });

            tableHTML += '</tbody></table>';
            return tableHTML;
        }

        // Loop through the polygons and display their details

        // Clear previously added data
        const polygonDetailsContainer = document.getElementById("polygon-details");
        while (polygonDetailsContainer.firstChild) {
            polygonDetailsContainer.removeChild(polygonDetailsContainer.firstChild);
        }




        const existingPolygonDataJSON = localStorage.getItem('polygonData');
        const existingPolygonData = JSON.parse(existingPolygonDataJSON);
        if (existingPolygonData != null) {
            for (var i = 0; i < existingPolygonData.length; i++) {
                const ans = JSON.parse(existingPolygonData[i]);
                const polygonPoints = ans._latlngs[0].map(item => [item.lat, item.lng]);
                const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));
                const polygon = L.polygon(latLngPoints);
                polygon.properties = ans.properties;
                const polygonContainer = document.createElement('div');
                polygonContainer.classList.add('polygon-details');
                polygonContainer.innerHTML = generatePolygonDetails(polygon.properties);
                document.getElementById("polygon-details").appendChild(polygonContainer);
                if (i !== existingPolygonData.length - 1) {
                    // Add a separator between polygons
                    const separator = document.createElement('hr');
                    separator.classList.add('separator');
                    document.getElementById("polygon-details").appendChild(separator);
                }

            }
        }




    }

      
       
  

    // Function to adjust the position of #map-dropdown for desktop view
    function adjustDropdownPosition() {
        // Calculate the height of the dynamic content
        if (window.innerWidth <= 769) {
            var dynamicContentHeight = $('#quote-container').height();
            console.log("dynamicContentHeight", dynamicContentHeight)

            // Update the top position of #map-dropdown
            $('#map-dropdown').css('top', dynamicContentHeight + 500); // Adjust 50 as needed
        } else {

            $('#map-dropdown').css('top', '100px');
        }

    }

    // Call the function initially
    // adjustDropdownPosition();
    function showPolygonDetailsOnHover(map) {
        map.eachLayer(function (layer) {
            if (layer instanceof L.Polygon) {
                layer.on('mouseover', function (e) {
                    // Get the polygon properties and format them
                    const properties = e.target.properties;
                    let details = '';
                    for (const key in properties) {
                       
                        if(key !="priceSlabs")
                        {
                            details += `<strong>${key}:</strong> ${properties[key]}<br>`;
                        }
                        
                    }
    
                    // Create a tooltip and open it
                    const tooltip = L.tooltip({
                        direction: 'top',
                        opacity: 1
                    })
                        .setContent(details)
                        .setLatLng(e.latlng)
                        .addTo(map);
    
                    // Update the tooltip position on mousemove
                    layer.on('mousemove', function (e) {
                        tooltip.setLatLng(e.latlng);
                    });
    
                    // Close the tooltip on mouseout
                    layer.on('mouseout', function () {
                        map.closeTooltip(tooltip);
                    });
                });
    
                // Remove the tooltip on mouseout
                layer.on('mouseout', function () {
                    map.closeTooltip();
                });
            }
        });
    }
    
    function showalltheexistingpolygon() {
        const existingPolygonDataJSON = localStorage.getItem('polygonData');
        const existingPolygonData = JSON.parse(existingPolygonDataJSON);
        if (existingPolygonData != null) {
            for (var i = 0; i < existingPolygonData.length; i++) {
                const ans = JSON.parse(existingPolygonData[i]);
                const polygonPoints = ans._latlngs[0].map(item => [item.lat, item.lng]);
                const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));
                const poly = L.polygon(latLngPoints);
                poly.properties = ans.properties;
                poly.addTo(map);
            }
        }
    
        // Call the function to show details on hover after adding polygons
        showPolygonDetailsOnHover(map);
    }
    

   

    // Attach an event listener to the window resize event
    $(window).on('resize', function () {
        // Check if the current screen width is wider than 768px
        if (window.innerWidth <= 769) {
            // Call the function to adjust the position
            adjustDropdownPosition();
        } else {
            // Reset the top position if the screen width is less than 769px
            $('#map-dropdown').css('top', '100px'); // Adjust the initial top position
        }
    });

    // Toggle the visibility of the #map-dropdown
    $("#map-dropdown-button").on('click', function () {
        $("#map-dropdown").slideToggle();
    });


    // Create a custom button control
    // Create a custom button control
    var customButton = L.Control.extend({
        options: {
            position: 'topright' // You can change the position of the button
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');

            // Add your button content and functionality here
            container.innerHTML = '<button id="addPolygonButton">Add Polygon</button>';

            // Add a click event to the button
            L.DomEvent.addListener(container, 'click', function (e) {
                // Prevent the click event from propagating to the map
                L.DomEvent.stopPropagation(e);





                // Toggle the visibility of the polygon form container
                $("#map-dropdown").slideToggle();
            });

            return container;
        }
    });

    // Add the custom button control to the map
    map.addControl(new customButton());




    // Initialize the routing control
    const control = L.Routing.control({
        waypoints: [],
        routeWhileDragging: false
    }).addTo(map);


        $("#quote-journey-btn").click(function () {
            // Create a new table row
            var newRow = $("<tr>");

            // Add input fields for distance and price
            newRow.append("<td><input type='number' class='form-control' style='width: 100px;' placeholder='Distance'></td>");
            newRow.append("<td><input type='number' class='form-control' style='width: 100px;' placeholder='Price'></td>");

            // Add a button to remove the row
            newRow.append("<td><button class='btn btn-danger btn-sm remove-row'>Remove</button></td>");

            // Append the new row to the table
            $("#quote-table tbody").append(newRow);
            adjustDropdownPosition();
        });
        // Function to remove a row
        $("#quote-table").on("click", ".remove-row", function () {
            $(this).closest("tr").remove();
        });

        // Function to submit the form (you can customize this based on your needs)
        $("#submit-btn").click(function () {
            // Retrieve and process the data from the table
            var flag = true;
            var data = [];
            $("#quote-table tbody tr").each(function () {
                var distance = $(this).find("input:eq(0)").val();
                var price = $(this).find("input:eq(1)").val();

                if (distance != '' && price != '') {
                    data.push({ distance: distance, price: price });
                }
                else {
                    flag = false;
                    alert("please add data to the blank field")
                }

            });
            if (data.length != 0 && flag == true) {
                // You can perform further processing or send the data as needed
                freespacefair = data;
                console.log(data);
                const dataJSON = JSON.stringify(data);

// Store the JSON string in local storage
localStorage.setItem('freespacefair', dataJSON);
                // $("#quote-table tbody").empty();
                alert("success")
            }
            else {
                alert("please add price/mile")
            }


        });


        function myFunction() {
            polygonPoints = [];//req
            map.removeLayer(tempPolygon);//req
            map.removeLayer(marker);
            // alert("The 'Esc' key was pressed!");
            console.log(polygonPoints);
          }
          
          // Add an event listener to the document to listen for the "keydown" event
          document.addEventListener("keydown", function(event) {
            // Check if the pressed key is the "Escape" key
            if (event.key === "Escape") {
              // Call your function when "Esc" is pressed
              myFunction();
            }
          });
          
        

    let marker = null;

    // Create a temporary polygon layer
    let tempPolygon = L.polygon([], { dashArray: '5, 5', color: 'black' });

    // Event handler for the map click
    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        console.log(lat, lng);

        if (polygonPoints.length === 0) {
            // Add the first point only once
            marker = L.marker([lat, lng]).addTo(map);

            // polygonPoints.push([lat, lng]);
        }

        polygonPoints.push([lat, lng]);

        // Update the temporary polygon layer with the latest set of points
        tempPolygon.setLatLngs(polygonPoints);

        // Add the temporary polygon to the map
        tempPolygon.addTo(map);

        // Add a marker at the clicked location (optional)
        // const marker = L.marker([lat, lng]).addTo(map);
        // markers.push(marker);
    });

    const priceSlabsTable = document.getElementById("priceSlabsTable");
    const addRowButton = document.getElementById("addRow");
    addRowButton.addEventListener("click", function () {
        const newRow = priceSlabsTable.insertRow();
        const distanceCell = newRow.insertCell(0);
        const priceCell = newRow.insertCell(1);
        const actionCell = newRow.insertCell(2);

        distanceCell.innerHTML = '<input type="number" placeholder="Distance" />';
        priceCell.innerHTML = '<input type="number" placeholder="Price" />';
        actionCell.innerHTML = '<button type="button" class="remove-row">Remove</button>';

        const removeButtons = document.querySelectorAll(".remove-row");
        removeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const row = this.parentNode.parentNode;
                row.parentNode.removeChild(row);
            });
        });
    });

    // Event handler for the "Create Polygon" button click
    document.getElementById('createPolygonButton').addEventListener('click', function (event) {
        event.preventDefault();
        console.log(polygonPoints.length);
        if (polygonPoints.length >= 3) { // Check for at least three points to create a polygon
            // Convert your points to Leaflet LatLng objects
            const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));

            // Create a Leaflet polygon
            const polygon = L.polygon(latLngPoints);//req
            const polygonPointsturfcreated = polygon._latlngs[0].map(item => [item.lng, item.lat]);
            polygonPointsturfcreated.push(polygonPointsturfcreated[0])
            const polygonturf = turf.polygon([polygonPointsturfcreated]);
            reqpolygon = polygon;
            console.log("polygon");
            console.log(polygon);
            removePolygon = polygon;

            // Add the polygon to the map




            // Clear the polygonPoints array and remove the temporary polygon layer
            removePolygon_points = polygonPoints;
            polygonPoints = [];//req
            map.removeLayer(tempPolygon);//req
             let flag=true;
            const existingPolygonDataJSON = localStorage.getItem('polygonData');
        const existingPolygonData = JSON.parse(existingPolygonDataJSON);
        if (existingPolygonData != null) {
            for (var i = 0; i < existingPolygonData.length; i++) {
                const ans = JSON.parse(existingPolygonData[i]);
                const polygonPoints = ans._latlngs[0].map(item => [item.lat, item.lng]);
                const polygonPointsturf = ans._latlngs[0].map(item => [item.lng, item.lat]);
                polygonPointsturf.push(polygonPointsturf[0]);
                const polyturf = turf.polygon([polygonPointsturf]);
                // const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));
                // const poly = L.polygon(latLngPoints);
                // const latLngPoints1 = poly.getLatLngs().map(latlng => [latlng.lng, latlng.lat]);
                // const latLngPoints2 = poly.getLatLngs().map(latlng => [latlng.lng, latlng.lat]);
            if(turf.booleanOverlap(polyturf, polygonturf))
            {
               flag=false;
               break;
            }
            }
        }

        if(flag==true)
        {
     
            const polygonName = document.getElementById('polygonName').value;
            const polygonId = document.getElementById('polygonId').value;

            const priceSlabs = [];

            const rows = priceSlabsTable.getElementsByTagName("tr");

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName("td");
                const distance = cells[0].querySelector("input").value;
                const price = cells[1].querySelector("input").value;

                if (distance && price) {
                    priceSlabs.push({ distance, price });
                }
            }

            if (polygonName && polygonId && priceSlabs.length > 0) {
                // Add the details to the polygon object
                polygon.properties = {
                    name: polygonName,
                    id: polygonId,
                    priceSlabs: priceSlabs
                };


                // Step 1: Remove circular references before storing
                function removeCircularReferences(obj) {
                    const seen = new WeakSet();

                    function replacer(key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (seen.has(value)) {
                                return undefined; // Remove circular reference
                            }
                            seen.add(value);
                        }
                        return value;
                    }

                    return JSON.stringify(obj, replacer);
                }

                // Step 2: Store the modified object in local storage
                // Step 2: Retrieve existing polygon data from local storage (if any)
                const existingPolygonDataJSON = localStorage.getItem('polygonData');
                const existingPolygonData = existingPolygonDataJSON
                    ? JSON.parse(existingPolygonDataJSON)
                    : [];

                // Step 3: Add the new polygon data to the array
                existingPolygonData.push(removeCircularReferences(polygon));

                // Step 4: Store the updated array in local storage
                const updatedPolygonDataJSON = JSON.stringify(existingPolygonData);
                localStorage.setItem('polygonData', updatedPolygonDataJSON);
                polygons.push(polygon);
                console.log(polygons);
                console.log("polygons");
                map.removeLayer(marker);
                polygon.addTo(map);//req
                $("#map-dropdown").hide();
                showallpolygondetails();
                location.reload();

            } else {
                map.removeLayer(marker);
                map.removeLayer(tempPolygon);//req
                polygonPoints = [];//req
                alert('Please fill in all required fields.');
            }
        }
        else{
            map.removeLayer(marker);
            map.removeLayer(tempPolygon);//req
            polygonPoints = [];//req
            alert('Polygons overlapping');
        }

        } else {
            map.removeLayer(marker);
            map.removeLayer(tempPolygon);//req
            polygonPoints = [];//req
            alert('Please select at least three points to create a polygon.');
        }
    });




    // Handle form submission
    const form = document.getElementById("routing-form");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        polygonPrice = [];
        polygonSum = [];
        summaryresult = []
        console.log(polygons);
        console.log("hey listen to me");
        removeall.forEach(req => { map.removeLayer(req) });
        console.log(removeall);
        console.log("remove all/..")
        removeall = [];

        const startAddress = document.getElementById("start").value;
        const destinationAddress = document.getElementById("destination").value;
        // Convert start address to coordinates
        const startCoordinates = await geocodeAddress(startAddress);
        // Convert destination address to coordinates
        const destinationCoordinates = await geocodeAddress(destinationAddress);
        // Add waypoints to the routing control using the coordinates
        control.setWaypoints([
            L.Routing.waypoint(startCoordinates, startAddress),
            L.Routing.waypoint(destinationCoordinates, destinationAddress)
        ]);




    });


    control.on("routesfound", function (e) {
        const route = e.routes[0];
        console.log(route);
        console.log("route");

        //to find the length of routestringline
        const turfcordroute = route.coordinates.map(coord => [coord.lng, coord.lat]);
        console.log(turfcordroute);
        var line = turf.lineString(turfcordroute);
        var length = turf.length(line, { units: 'miles' });
        console.log("length is", length);


        // if (polygons.length == 0) {
        //     alert("No Zone Created!");
        // }

        if (route) {








            const existingPolygonDataJSON = localStorage.getItem('polygonData');
            const existingPolygonData = JSON.parse(existingPolygonDataJSON);
            if (existingPolygonData != null) {
                for (var i = 0; i < existingPolygonData.length; i++) {
                    const ans = JSON.parse(existingPolygonData[i]);
                    console.log(ans);
                    const polygonPoints = ans._latlngs[0].map(item => [item.lat, item.lng]);
                    const latLngPoints = polygonPoints.map(point => L.latLng(point[0], point[1]));
                    const poly = L.polygon(latLngPoints);
                    poly.properties = ans.properties;
                    console.log(poly);
                    // console.log(polygons[i]);
                    // const intersects = checkRouteIntersection(route,polygons[i] );
                    const intersects = checkRouteIntersection(route, poly);
                }
            }

            console.log("polygon sum array");
            console.log(polygonPrice);
            console.log(polygonSum);
            let sumintersects = 0;
            let totalpriceindidepolygon = 0;
            for (var i = 0; i < polygonSum.length; i++) {
                totalpriceindidepolygon = totalpriceindidepolygon + polygonSum[i];
            }
            for (var i = 0; i < polygonPrice.length; i++) {
                sumintersects = sumintersects + polygonPrice[i];
            }
            const polygonCoords = route.coordinates.map(coord => [coord.lng, coord.lat]);
           const lineintersect = turf.lineString(polygonCoords);
           const lengthintersect = turf.length(lineintersect, { units: 'miles' });
            console.log(lengthintersect);
            let freespace = ((lengthintersect) - sumintersects);
            // let freespace = ((route.summary.totalDistance / 1609) - sumintersects);
            console.log("freespace...", freespace);



            function calculateTotalPrice(distancePriceObjects, distance) {
                let totalPrice = 0;

                for (const slab of distancePriceObjects) {
                    const slabDistance = slab.distance;
                    const slabPrice = slab.price;

                    if (distance <= slabDistance) {
                        totalPrice += distance * slabPrice;
                        break;
                    } else {
                        totalPrice += slabDistance * slabPrice;
                        console.log("free price");
                        console.log(slabDistance, slabPrice)
                        distance -= slabDistance;
                    }
                }

                return totalPrice;
            }


            const totalPrice = calculateTotalPrice(freespacefair, freespace);
            console.log(`price for freespace  is ${totalPrice}`);
            const totalride = totalPrice + totalpriceindidepolygon;
            console.log(`total ride price is ${totalride}`);
            summaryresult.push(`price for freespace ${freespace} miles is ${totalPrice} £`)


            summaryresult.push(`total ride price is ${totalride} £`);
            console.log(summaryresult);


            const resultContainer = document.getElementById("result-container");
            while (resultContainer.firstChild) {
                resultContainer.removeChild(resultContainer.firstChild);
            }
            // Create a Bootstrap card element
            const card = document.createElement("div");
            card.classList.add("card");
            card.style.width = "width: 100%";

            // Create a card body
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            // Create a card title
            const cardTitle = document.createElement("h2");
            cardTitle.classList.add("card-title");
            cardTitle.textContent = "";

            // Create an unordered list with Bootstrap classes
            const ul = document.createElement("ul");
            ul.classList.add("list-group", "list-group-flush");

            // Iterate through the `summaryresult` array and create list items
            summaryresult.forEach((result, index) => {
                // Create a list item with Bootstrap classes
                const li = document.createElement("li");
                li.classList.add("list-group-item");

                // Create a <strong> element to make the text bold
                const strong = document.createElement("strong");
                strong.textContent = result;

                if (index === summaryresult.length - 1) {
                    strong.style.color = "red";
                }

                // Append the <strong> element to the list item
                li.appendChild(strong);

                // Append the list item to the unordered list
                ul.appendChild(li);
            });

            // Append the title and unordered list to the card body
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(ul);

            // Append the card body to the card
            card.appendChild(cardBody);

            // Append the card to the result container
            resultContainer.appendChild(card);



        }
        else{
            alert("NO ROUTES FOUND!!")
        }
    });

    // Function to geocode an address to coordinates using OpenStreetMap Nominatim API
    async function geocodeAddress(address) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        } else {
            alert("Address not found. Please check your input.");
            return null;
        }
    }

    function checkRouteIntersection(route, polygon) {
        const routeCoordinates = route.coordinates;

        // Convert the route coordinates to a GeoJSON LineString
        const routeLineString = turf.lineString(routeCoordinates);
        console.log(routeLineString);

        // Convert the Leaflet polygon to a Turf-compatible polygon
        const polygonCoords = polygon.getLatLngs()[0].map(coord => [coord.lng, coord.lat]);


        // Ensure the polygon is closed (first and last coordinates are the same)
        if (
            polygonCoords[0][0] !== polygonCoords[polygonCoords.length - 1][0] ||
            polygonCoords[0][1] !== polygonCoords[polygonCoords.length - 1][1]
        ) {
            polygonCoords.push(polygonCoords[0]); // Close the loop
        }

        // Check if the polygon has at least 3 distinct coordinates to be valid
        if (polygonCoords.length < 4) {
            console.error("Invalid polygon. It must have at least 3 distinct coordinates.");
            return false;
        }

        const turfPolygon = turf.polygon([polygonCoords]);

        console.log(routeLineString);
        console.log("above is the route string");




        console.log(routeLineString.geometry.coordinates);
        // const newCoordinates =routeLineString.geometry.coordinates.map(coord => {
        //     return { lng: coord.lng, lat: coord.lat };
        //   });
        const newCoordinates = routeLineString.geometry.coordinates.map(coord => [coord.lng, coord.lat]);
        console.log(newCoordinates);

        routeLineString.geometry.coordinates = newCoordinates;
        console.log(routeLineString);
        console.log(turfPolygon);
        let intersectionPoints = turf.lineIntersect(routeLineString, turfPolygon);

        console.log("intersection points");

        console.log(intersectionPoints);
        let intersectionPointsArray = intersectionPoints.features.map(d => { return d.geometry.coordinates });
        // L.geoJSON(intersectionPoints).addTo(map);

        var redIcon = L.icon({
            iconUrl: 'red_marker.png', // Replace with the URL of your red marker icon
            iconSize: [25, 41], // Adjust the icon size as needed
            iconAnchor: [12, 41], // Adjust the anchor point if necessary
            popupAnchor: [1, -34] // Adjust the popup anchor if necessary
        });

        let mark = L.geoJSON(intersectionPoints, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: redIcon });
            }
        }).addTo(map);
        removeall.push(mark);

        console.log(intersectionPointsArray);
        console.log("intersectiopointarray");
        console.log(intersectionPointsArray[0]);

        var lineStyle = {
            "color": "#7F00FF",
            "weight": 10,
            "opacity": 1,
            "zIndex": 100
        };

   
      const start =[route.coordinates[0].lng,route.coordinates[0].lat];
      const destination=[route.coordinates[route.coordinates.length-1].lng,route.coordinates[route.coordinates.length-1].lat];

       if(turf.booleanPointInPolygon((turf.point(start)), turfPolygon) && turf.booleanPointInPolygon((turf.point(destination)), turfPolygon))
       {
        intersectionPointsArray.unshift(start);
        intersectionPointsArray.push(destination);
       }

       else if(turf.booleanPointInPolygon((turf.point(start)), turfPolygon))
       {
        
        intersectionPointsArray.unshift(start);

       }
       else if(turf.booleanPointInPolygon((turf.point(destination)), turfPolygon))
       {
        intersectionPointsArray.push(destination);
       }
     console.log(intersectionPointsArray);
   console.log(route);

           
        let sum = 0;
       
        for (var i = 0; i < intersectionPointsArray.length; i = i + 2) {
            // var pair = intersectionPairs[i];
            var intersection = turf.lineSlice(turf.point(intersectionPointsArray[i]), turf.point(intersectionPointsArray[i + 1]), routeLineString);
            console.log(intersection);


            // const turfcordroute = route.coordinates.map(coord => [coord.lng, coord.lat]);
            // console.log(turfcordroute );
            var lineintersect = turf.lineString(intersection.geometry.coordinates);
            var lengthintersect = turf.length(lineintersect, { units: 'miles' });
            console.log("length is.....", lengthintersect);
            sum = sum + lengthintersect;



            console.log("intersection");
            let markline = L.geoJSON(intersection, {
                style: lineStyle
            }).addTo(map);
            removeall.push(markline);
        }
     

        console.log("sum is....", sum);
        console.log(polygon);// add polygon name over here or id

        // console.log(totalPrice);
        polygonPrice.push(sum);

        function calculateTotalPrice(distancePriceObjects, distance) {
            let totalPrice = 0;

            for (const slab of distancePriceObjects) {
                const slabDistance = slab.distance;
                const slabPrice = slab.price;

                if (distance <= slabDistance) {
                    totalPrice += distance * slabPrice;
                    break;
                } else {
                    totalPrice += slabDistance * slabPrice;
                    console.log("hiiii");
                    console.log(slabDistance, slabPrice)
                    distance -= slabDistance;
                }
            }

            return totalPrice;
        }


        const totalPrice = calculateTotalPrice(polygon.properties.priceSlabs, sum);
        console.log(`price for polygon ${polygon.properties.name} is ${totalPrice}`);
        summaryresult.push(`price for polygon ${polygon.properties.name} of ${sum} miles is ${totalPrice} £`)
        polygonSum.push(totalPrice);











    }
});
