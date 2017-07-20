/*  mapbox weather!

	dipendenze:
		jQuery
		mapbox-gl-js
		mapbox-gl-geocoder
		skycons (icons)

*/

// coordinate default per centro mappa
var fallback_lng=12.501827;
var fallback_lat=41.900993;
var token;
var tpl_results=$("#tpl_results").html();
var tpl_hourly_detail=$("#tpl_hourly_detail").html();
var tpl_daily_detail=$("#tpl_daily_detail").html();

function unixToTime(ts) {
	var date = new Date(ts*1000); // in millisecondi
	var hours = date.getHours();
	var minutes = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
	var formatted_time=hours+":"+minutes;
	return formatted_time;
}

function unixToDate(ts) {
	var date = new Date(ts*1000);
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var formatted_date=day+"/"+month;
	return formatted_date;
}

function unixToDay(ts) {
	var date = new Date(ts*1000);
	var daynum = date.getDay();
	var day_mapper=["DOM","LUN","MAR","MER","GIO","VEN","SAB"];
	return day_mapper[daynum];
}

function showHourlyDetails() {
	$("#daily_details").hide();
	$("#hourly_details").show();
}

function showDailyDetails() {
	$("#hourly_details").hide();
	$("#daily_details").show();
}

function refreshWeather(lng,lat) {
	// chiamata per eliminare dalla cache specifico valore
	var url="server/?refresh";
	var dati="lng="+lng+"&lat="+lat;
	$.post(url,dati,function(resp){
		console.log(resp);
	});
	var luogo=$("#luogo").html();
	$("#results").html("");
	$("#results_loader").show();
	askWeather(lng,lat,function(meteo){
		if (meteo!=="error") {									
			displayWeather(meteo,luogo);
		}else{
			console.log("Errore meteo");
		}
	}); 

}

/* azione! */
$(function() {
	var loader_skycons = new Skycons({"color": "#ccc"}); // icone					
	loader_skycons.add("loader_icon","fog");
	loader_skycons.play();
	if (navigator.geolocation){
		// leggo token...
		askToken(function(token){
			if (token!=="error") {
				// ... e vai!
				build(token); // geolocalizzo via browser, creo mappa e marker, carico meteo
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
 	// init icone
	var skycons = new Skycons({"color": "black"},{"resizeClear": true}); 	
	// sommario meteo
	var results=tpl_results;
	var date=unixToDate(meteo.currently.time);
	var time=unixToTime(meteo.currently.time);
	results=results.replace("%date%",date);
	results=results.replace("%time%",time);
	results=results.replace("%luogo%",luogo);
	results=results.replace("%summary%",meteo.currently.summary);
	results=results.replace("%temperature%",meteo.currently.temperature);  // aggiungere cambio colore con temperatura
	results=results.replace("%hourly%",meteo.hourly.summary); 
	results=results.replace("%daily%",meteo.daily.summary); 
	results=results.replace("%latitude%",meteo.latitude); 
	results=results.replace("%longitude%",meteo.longitude); 
	// visualizzo
	$("#results_loader").hide();
	$("#results").append(results);
	// aggiungo icone				
	skycons.add("icon", meteo.currently.icon);
	skycons.add("icon_hourly", meteo.hourly.icon);
	skycons.add("icon_daily", meteo.daily.icon);
	// azzero dettagli
	$("#hourly_details").hide();
	$("#daily_details").hide();
	$("#hourly_details_list").html("");
	$("#daily_details_list").html("");
	// dettagli orari
	var hourly_details=meteo.hourly.data;
	$.each(hourly_details,function(index,value) {
		if (index<=23) { // solo 24 ore		
			var detail=tpl_hourly_detail;
			var time=unixToTime(value.time);
			detail=detail.replace("%index%",index);
			detail=detail.replace("%time%",time);
			detail=detail.replace("%summary%",value.summary);
			detail=detail.replace("%temperature%",value.temperature);
			detail=detail.replace("%apparentTemperature%",value.apparentTemperature);
			detail=detail.replace("%precipProbability%",value.precipProbability*100);
			detail=detail.replace("%precipIntensity%",value.precipIntensity);
			$("#hourly_details_list").append(detail);
			skycons.add("icon_hourly_detail_"+index,value.icon);
		}
	});
	// dettagli giorni
	var daily_details=meteo.daily.data;
	$.each(daily_details,function(index,value) {
		if (index<=6) { // solo 7 giorni	
			var detail=tpl_daily_detail;
			var date=unixToDate(value.time);
			var day=unixToDay(value.time);
			detail=detail.replace("%index%",index);
			detail=detail.replace("%day%",day);
			detail=detail.replace("%date%",date);
			detail=detail.replace("%summary%",value.summary);
			detail=detail.replace("%temperatureMin%",value.temperatureMin);
			detail=detail.replace("%temperatureMax%",value.temperatureMax);
			detail=detail.replace("%apparentTemperature%",value.apparentTemperature);
			detail=detail.replace("%apparentTemperatureMin%",value.apparentTemperatureMin);
			detail=detail.replace("%apparentTemperatureMax%",value.apparentTemperatureMax);
			detail=detail.replace("%precipProbability%",value.precipProbability*100);
			detail=detail.replace("%precipIntensity%",value.precipIntensity);
			$("#daily_details_list").append(detail);
			skycons.add("icon_daily_detail_"+index,value.icon);
		}
	});
	// attivo animazioni icone
	skycons.play();
}		

/* darksky meteo call */
function askWeather (lng,lat,callback) {
	var url='server/?weather';
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
	var url='server/?geocode';
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
function askToken(callback) {
	var url='server/?token';
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
		// init input geocoding
		var geocoder=new MapboxGeocoder({
			accessToken: mapboxgl.accessToken
		});
		map.addControl(geocoder);
		
		// AZIONI

		// submit input geocoding
		geocoder.on('result', function(ev) {
			$("#results").html("");
			$("#results_loader").show();
			var luogo=ev.result; // contiene info sul luogo (https://www.mapbox.com/api-documentation/?language=JavaScript#response-format)
			var lng=luogo.center[0];
			var lat=luogo.center[1];
			map.getSource('single-point').setData(luogo.geometry);	
			// chiamo darksky					 
			askWeather(lng,lat,function(meteo){
				if (meteo!=="error") {									
					displayWeather(meteo,luogo.place_name);
				}else{
					console.log("Errore meteo");
				}
			}); 			
		})	 
		
		// init pulsante geolocation
		var geolocate_control=new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			}
		});
		map.addControl(geolocate_control);
		
		// click su pulsante geolocation
		geolocate_control.on('geolocate', function(position) {
			$("#results").html("");
			$("#results_loader").show();
			var lng=position.coords.longitude;
			var lat=position.coords.latitude;
			map.getSource('single-point').setData(luogo.geometry);	
			// chiamo darksky					 
			askWeather(lng,lat,function(meteo){
				if (meteo!=="error") {									
					displayWeather(meteo,luogo.place_name);
				}else{
					console.log("Errore meteo");
				}
			}); 			
		});

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
		            "circle-color": "#fea500"
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
							displayWeather(meteo,luogo.place_name);
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
			$("#results").html("");
			$("#results_loader").show();				
			var lat=e.lngLat.lat;
			var lng=e.lngLat.lng;						
			map.flyTo({
				center: [lng,lat],
				zoom: 13
			});
			// chiamo geocode map
			var data=askGeocoding(lng,lat,function(data){	
				if (data!=="error")	{
					var luogo=data.features[0];							
					$(".mapboxgl-ctrl-geocoder input").val(luogo.place_name); // setto geocoder con click
					map.getSource('single-point').setData(luogo.geometry);
					// chiamo darksky
					askWeather(lng,lat,function(meteo){
						if (meteo!=="error") {									
							displayWeather(meteo,luogo.place_name);
						}else{
							console.log("Errore meteo");
						}
					}); 
				}else{
					console.log("Errore geocoding");
				}
			}); 						
		});
	};

	/* init geolocalizzazione iniziale browser */
	var geolocate_options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function geolocateSuccess(position) {
	 	console.log("Utente geolocalizzato");
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		createMap(longitude,latitude,token); // init mappa con centro posizione utente
	};

	function geolocateError(err) {
	    	console.log("Geolocalizzazione rifiutata, uso valori di default");
 		createMap(fallback_lng,fallback_lat,token); // init mappa con centro default
	};

	/* eseguo geolocalizzazione browser */
	navigator.geolocation.getCurrentPosition(geolocateSuccess, geolocateError, geolocate_options);
}
			
