document.addEventListener("DOMContentLoaded", function(e) {

	var loader = document.getElementById('loader');

	// Map infos
	var url =  document.location.href ;
	var params = getAllUrlParams(url);
	var jsonId = params.mapid;
	var style = params.style;

	// Map variables
	var instaMap;
	var markerGroup;

	var GenerateMap = function(json,style,options) {

		$.get("https://api.myjson.com/bins/"+jsonId, function(data, textStatus, jqXHR) {
			var instaMap = L.map('instaMap').setView([0, 0], 2);
			var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 19
			}).addTo(instaMap);
			markerGroup = L.featureGroup().addTo(instaMap);
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				CreateMarker(data[i]);
			}
			instaMap.fitBounds(markerGroup.getBounds(),{padding: [50, 50]});


		});

		loader.style.display='none';





	};


	var CreateMarker = function(instaMedia) {

		console.log(instaMedia);
		if (instaMedia.location) {
			var icon = L.icon({
		    iconUrl: instaMedia.images.low_resolution.url,

		    iconSize:     [instaMedia.images.low_resolution.width/7, instaMedia.images.low_resolution.height/7], // size of the icon
		    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});
			var zoomedIcon = L.icon({
		    iconUrl: instaMedia.images.low_resolution.url,

		    iconSize:     [instaMedia.images.low_resolution.width/2, instaMedia.images.low_resolution.height/2], // size of the icon
		    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		});


		var marker = L.marker([instaMedia.location.latitude, instaMedia.location.longitude],{icon: icon}).addTo(markerGroup).bindPopup("<div style='position: relative;top:50px;'><img class='instapic' src='"+instaMedia.images.standard_resolution.url+"' style=''/> <div class='button-group' ><a class='insta-btn' href='"+instaMedia.link+"' target='_blank'><i class='fa fa-instagram' ></i> view on instagram</a> <br><a class='insta-loc' href='https://www.instagram.com/explore/locations/"+instaMedia.location.id+"' target='_blank'><i class='fa fa-map-pin' ></i> explore location</a><br><br><a class='insta-f' href='https://www.instagram.com/"+instaMedia.user.username+"' target='_blank'><img src="+instaMedia.user.profile_picture+" style='width:20px;height:20px;border-radius:50%;top:5px;position:relative' /> Follow me on instagram</a></div></div>");


https://www.instagram.com/explore/locations/


		marker.on('mouseover',function(ev) {
			marker.openPopup();
		})
		marker.on('mouseout',function(ev) {
			// marker.setIcon(icon)
		})
	}

	};



	GenerateMap(jsonId, style)





    console.log("DOM fully loaded and parsed");


  });
