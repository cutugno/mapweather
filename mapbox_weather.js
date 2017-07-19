/*  mapbox weather!

	dipendenze:
		jQuery
		mapbox-gl-js
		mapbox-gl-geocoder
		skycons (icons)

*/

$(function() {
	var url="server/?test";
	$.get(url,function(resp){
		console.log(resp);
		exit();
	});

	var token;
	if (navigator.geolocation){
		// leggo token...
		getToken(function(token){
			if (token!=="error") {
				// ... e vai!
				build(token);
			}else{
				// no token
				var msg="Errore token";
				console.log(msg);			 	
				$("#results").html(msg).show();	
			}
		});	
	}else{
		var msg="Il tuo browser non supporta la geolocalizzazione!";
		console.log(msg);			 	
		$("#results").html(msg).show();
	}		
})		

/* visualizzazione meteo */
function displayWeather (meteo,luogo) {
	$("#luogo").html(luogo);
	$("#summary").html(meteo.currently.summary);
	$("#temperature").html(meteo.currently.temperature);
	$("#hourly").html(meteo.hourly.summary);
	$("#daily").html(meteo.daily.summary);	
	var skycons = new Skycons({"color": "black"}); // icone					
	skycons.add("icon", meteo.currently.icon);
	skycons.add("icon_hourly", meteo.hourly.icon);
	skycons.add("icon_daily", meteo.daily.icon);
	skycons.play();
	$("#results").show();
}		

/* darksky meteo call */
function askWeather (lng,lat,callback) {
	var url='weather_call.php';
	var dati='lat='+lat+'&lng='+lng;
	$.post(url,dati,function(resp){
		var meteo=JSON.parse(resp);
		callback(meteo);					
	})
	.fail(function() {
	    callback("error");
	});	
}		

/* mapbox geocoding call */
function askGeocoding(lng,lat,callback) {
	var url='geocode_call.php';
	var dati='lat='+lat+'&lng='+lng;				
	$.post(url,dati,function(resp){
		var luogo=JSON.parse(resp);
		callback(luogo);					
	})
	.fail(function() {
	    callback("error");
	});	
};

/* token call */
function getToken(callback) {
	var url='token.php';
	$.get(url,function(resp){
		callback(resp);
	})
	.fail(function() {
	    callback("error");
	});	
}

/* imposto mappa e geolocalizzazione */
function build(token) {

	/* creazione mappa e sue funzioni */
	function createMap(lng,lat,token) {		
		mapboxgl.accessToken = token;
		// init mappa
		var map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v9',
			center: [lng,lat], // centro su utente o valori fallback
			zoom: 13
		});
		// input geocoding
		var geocoder=new MapboxGeocoder({
			accessToken: mapboxgl.accessToken
		});
		map.addControl(geocoder);
		
		// pulsante geolocation
		var geolocate_control=new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			}
		});
		map.addControl(geolocate_control);					

		// set marker e prima chiamata 
		map.on('load', function() {
		    map.addSource('single-point', {
		        "type": "geojson",
		        "data": {
		            "type": "FeatureCollection",
		            "features": []
		        }
		    });

		    map.addLayer({
		        "id": "point",
		        "source": "single-point",
		        "type": "circle",
		        "paint": {
		            "circle-radius": 10,
		            "circle-color": "#007cbf"
		        }
		    });
		    // chiamo geocode mapbox
			var data=askGeocoding(lng,lat,function(data){	
				if (data!=="error")	{
					var luogo=data.features[0];							
					$(".mapboxgl-ctrl-geocoder input").val(luogo.place_name); // setto geocoder con click
					map.getSource('single-point').setData(luogo.geometry);
					// chiamo darksky
					askWeather(lng,lat,function(meteo){
						if (meteo!=="error") {	
							$("#luogo").html(luogo.place_name);									
							displayWeather(meteo);
						}else{
							console.log("Errore meteo");
						}
					}); 
				}else{
					console.log("Errore geocoding");
				}
			}); 		
		});

		// click su mappa
		map.on('click', function (e) {					
			var lat=e.lngLat.lat;
			var lng=e.lngLat.lng;						
			map.flyTo({
				center: [lng,lat],
				zoom: 13
			});
			// chiamo geocode mapb
			var data=askGeocoding(lng,lat,function(data){	
				if (data!=="error")	{
					var luogo=data.features[0];							
					$(".mapboxgl-ctrl-geocoder input").val(luogo.place_name); // setto geocoder con click
					map.getSource('single-point').setData(luogo.geometry);
					// chiamo darksky
					askWeather(lng,lat,function(meteo){
						if (meteo!=="error") {	
							$("#luogo").html(luogo.place_name);									
							displayWeather(meteo);
						}else{
							console.log("Errore meteo");
						}
					}); 
				}else{
					console.log("Errore geocoding");
				}
			}); 						
		});

		// submit geocoding
		geocoder.on('result', function(ev) {
			var luogo=ev.result; // contiene info sul luogo (https://www.mapbox.com/api-documentation/?language=JavaScript#response-format)
			var lng=luogo.center[0];
			var lat=luogo.center[1];
			map.getSource('single-point').setData(luogo.geometry);	
			// chiamo darksky					 
			askWeather(lng,lat,function(meteo){
				if (meteo!=="error") {	
					$("#luogo").html(luogo.place_name);									
					displayWeather(meteo);
				}else{
					console.log("Errore meteo");
				}
			}); 			
		})	 

		// click su geolocation
		geolocate_control.on('geolocate', function(position) {
			var lng=position.coords.longitude;
			var lat=position.coords.latitude;
			map.getSource('single-point').setData(luogo.geometry);	
			// chiamo darksky					 
			askWeather(lng,lat,function(meteo){
				if (meteo!=="error") {	
					$("#luogo").html(luogo.place_name);									
					displayWeather(meteo);
				}else{
					console.log("Errore meteo");
				}
			}); 			
		});
	};

	/* geolocalizzazione */
	var geolocate_options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function geolocateSuccess(position) {
	 	console.log("Utente geolocalizzato");
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		createMap(longitude,latitude,token);
	};

	function geolocateError(err) {
	 	if (err.code == err.PERMISSION_DENIED) {
	    	console.log("Geolocalizzazione rifiutata, uso valori di default");
	  		var fallback_lng=12.501827;
 			var fallback_lat=41.900993;
 			createMap(fallback_lng,fallback_lat,token);
		};
	};

	/* geolocalizzazione browser */
	navigator.geolocation.getCurrentPosition(geolocateSuccess, geolocateError, geolocate_options);
}
			