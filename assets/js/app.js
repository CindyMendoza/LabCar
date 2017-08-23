var pos, map, infoWindow, marker, total, originInput, destinationInput, btntrazar,
originAutocomplete, destinationAutocomplete, directionsService, directionsDisplay;
function initMap() {
        // Try HTML5 geolocation.
        //Crea un nuevo mapa dentro del contenedor HTML dado, que normalmente es un elemento DIV
        map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: -12.046373, lng: -77.0427542 },
         zoom: 15
       });
       originInput = document.getElementById('origin-input');
       destinationInput = document.getElementById('destination-input');
       total = document.getElementById('total');
       btntrazar = document.getElementById('trazar');
       //Servicio para proporcionar predicciones de lugar basadas en la entrada de texto
       // de un usuario. Se adjunta a un elemento de entrada de tipo texto y escucha
       //la entrada de texto en ese campo. La lista de
       //predicciones se presenta como una lista desplegable y se actualiza a medida
       // que se introduce el texto.
       originAutocomplete = new google.maps.places.Autocomplete(originInput);
       destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

      // Servicio para calcular direcciones entre dos o más lugares.
      directionsService = new google.maps.DirectionsService;
      //Renderiza las direcciones obtenidas del DirectionsService.
      directionsDisplay = new google.maps.DirectionsRenderer;

      //btntrazar
      btntrazar.addEventListener('click',function(){
        //route(request:DirectionsRequest, callback:function(DirectionsResult, DirectionsStatus))
        //Emita una solicitud de búsqueda de direcciones
        directionsService.route({
          origin: originInput.value,
          destination: destinationInput.value,
          travelMode: 'DRIVING'
        }, function(response, status){
              if(status ==='OK'){
                //setDirections:Establezca el renderizador para utilizar el resultado del DirectionsService.
                //Establecer un conjunto válido de direcciones de esta manera mostrará las direcciones
                //en el mapa designado y el panel del procesador.
                directionsDisplay.setDirections(response);
                //setMap:Este método especifica el mapa en el que se mostrarán las direcciones.
                // Pase null para eliminar las direcciones del mapa.
                directionsDisplay.setMap(map);
                // Number convierte txt a num con replace retiramos km
                var km = Number((response.routes[0].legs[0].distance.text.replace("km",""))) * 0.5;
                //toFixed : Devuelve una cadena, con el número escrito con un número especificado de decimales
                km.toFixed(2)
                console.log(km);
                total.innerHTML = "<p>La ruta que seleccionaste tiene "+ response.routes[0].legs[0].distance.text +"," +
                " el tiempo de recorrido es "+ response.routes[0].legs[0].duration.text +" aproximadamente," +
                "el lugar de origen es en " + response.routes[0].legs[0].start_address + " y " +
                "el lugar de destino es en " + response.routes[0].legs[0].end_address + ".</p>" +
                "<p class='h4'>El costo es de S/."+ km +"</p>";

        }else{ alert("Dirección no valida")}
      });
    });
    //Crea una ventana de información con las opciones dadas. Un InfoWindow se puede colocar
    // en un mapa en una posición particular o por encima de un marcador,
    //dependiendo de lo que se especifica en las opciones.
    //A menos que la panorámica automática esté deshabilitada,
    // un InfoWindow recorrerá el mapa para hacerse visible cuando se abra.
    //Después de construir un InfoWindow, debe llamar abierto para mostrarlo en el mapa.
    // El usuario puede hacer clic en el botón de cierre de InfoWindow para
    //eliminarlo del mapa o el desarrollador puede llamar a close () para el mismo efecto.
       infoWindow = new google.maps.InfoWindow();
        if (navigator.geolocation) {
          // El método Geolocation.getCurrentPosition() se utiliza para obtener la posición de un dispositivo.
          // navigator.geolocation.getCurrentPosition(success, error, options)
          navigator.geolocation.getCurrentPosition(function(position) {
            //success
             pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              //envia ubicacion actual a map
              map.setCenter(pos);
              marker = new google.maps.Marker({
              position: map.getCenter(),//obtenemos la ubicaion de map
              map: map,
              animation: google.maps.Animation.BOUNCE
          });
          }, function() {
            //error
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setMap(map);
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.':
                              'Error: Your browser doesn\'t support geolocation.');
      }
