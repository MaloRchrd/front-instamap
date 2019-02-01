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
	var oms;

	var GenerateMap = function(json,style,options) {

		$.get("https://api.myjson.com/bins/"+jsonId, function(data, textStatus, jqXHR) {
			var instaMap = L.map('instaMap').setView([0, 0], 2);
			var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 19
			}).addTo(instaMap);
			oms = new OverlappingMarkerSpiderfier(instaMap,{nearbyDistance:30,circleSpiralSwitchover:2});
			markerGroup = L.featureGroup().addTo(instaMap);
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				CreateMarker(data[i]);
			}
			instaMap.fitBounds(markerGroup.getBounds(),{padding: [50, 50]});
			oms.addListener('spiderfy', function(markers) {
				instaMap.closePopup();
			});
			L.Control.Watermark = L.Control.extend({
				onAdd: function(map) {
					var container = L.DomUtil.create('div');
					var link = L.DomUtil.create('a');
					var img = L.DomUtil.create('img');
					var icon = L.DomUtil.create('i');
					var instamapW = L.DomUtil.create('a');
					instamapW.innerHTML = '<p style="margin-bottom:0px;"><em>Created with</em></p>';
					instamapW.setAttribute('href','https://www.instamap.com/')
					instamapW.setAttribute('target','_blank')
					link.innerHTML = '<i class="fa fa-instagram"></i> Follow @'+ data[0].user.username;
					link.setAttribute('target','_blank')
					link.setAttribute('class','followMe')
					img.src = 'img/instamap.svg';
					img.style.width = '70px';
					// img.style.borderRadius = '50%';
					container.style.textAlign = 'center';
					container.appendChild(link);
					container.appendChild(instamapW);
					container.appendChild(img);
					// link.appendChild(icon);
					// link.appendChild(username);
					// instamapW.appendChild(img);

					return container;
				},

				onRemove: function(map) {
					// Nothing to do here
				}
			});

			L.control.watermark = function(opts) {
				return new L.Control.Watermark(opts);
			}

			L.control.watermark({ position: 'topright' }).addTo(instaMap);


		});

		loader.style.display='none';





	};


	var CreateMarker = function(instaMedia) {

		console.log(instaMedia);
		if (instaMedia.location) {
			var icon = L.icon({
		    iconUrl: instaMedia.images.low_resolution.url,

		    iconSize:     [instaMedia.images.low_resolution.width/7, instaMedia.images.low_resolution.height/7], // size of the icon
		    iconAnchor:   [instaMedia.images.low_resolution.width/7, instaMedia.images.low_resolution.height/7], // point of the icon which will correspond to marker's location
			popupAnchor:  [-0, -80]
		    // popupAnchor:  [(instaMedia.images.low_resolution.width)/4, (instaMedia.images.low_resolution.height)/4] // point from which the popup should open relative to the iconAnchor
		});
		// 	var zoomedIcon = L.icon({
		//     iconUrl: instaMedia.images.low_resolution.url,
		//
		//     iconSize:     [instaMedia.images.low_resolution.width/2, instaMedia.images.low_resolution.height/2], // size of the icon
		//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		//     popupAnchor:  [-20, -76] // point from which the popup should open relative to the iconAnchor
		// });


		var marker = L.marker([instaMedia.location.latitude, instaMedia.location.longitude],{icon: icon}).addTo(markerGroup).bindPopup("<div style='position: relative;top:50px;'><img class='instapic' src='"+instaMedia.images.standard_resolution.url+"' style=''/> <div class='button-group' ><a class='insta-btn' href='"+instaMedia.link+"' target='_blank'><i class='fa fa-instagram' ></i> View on instagram</a> <br><a class='insta-loc' href='https://www.instagram.com/explore/locations/"+instaMedia.location.id+"' target='_blank'><i class='fa fa-map-pin' ></i> Explore location</a><br><br><a class='insta-f' href='https://www.instagram.com/"+instaMedia.user.username+"' target='_blank'><img src="+instaMedia.user.profile_picture+" style='width:20px;height:20px;border-radius:50%;top:5px;position:relative' /> Follow me on instagram</a></div></div>");
		oms.addMarker(marker);



		//
		// marker.on('mouseover',function(ev) {
		// 	marker.openPopup();
		// })
		// marker.on('mouseout',function(ev) {
		// 	// marker.setIcon(icon)
		// })
	}

	};



	GenerateMap(jsonId, style)





    console.log("DOM fully loaded and parsed");


  });
