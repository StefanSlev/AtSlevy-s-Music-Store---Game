"use strict";

var Loader = (function() {
	
	var images = [];
	var loadingBar = null;
	var localStorageExists = false;
	var settingsPage = null;
	
	function addImage(image) {
			
		if (image.domImage instanceof HTMLImageElement && image.id && image.entry) {
				
			images.push(image);
		}
	}
			
	function loadImages(xmlImages) {
	
		for (var i = 0; i < xmlImages.children.length; i++) {

			var xmlImage = xmlImages.children[i];

			var image = {

				domImage: document.createElement("img"),
				id: xmlImage.getAttribute("id"),
				entry: xmlImage.getAttribute("entry")
			};

			image.domImage.src = xmlImage.innerHTML;
			image.domImage.alt = image.id;
			image.domImage.style.width = parseInt(xmlImage.getAttribute("width")) + "px";
			image.domImage.style.height = parseInt(xmlImage.getAttribute("height")) + "px";

			addImage(image);
		}
	}
	
	function loadCanvasSize(xmlCanvas) {
		
		for (var i = 0; i < xmlCanvas.children.length; i++) {
			
			var xmlSet = xmlCanvas.children[i];
			
			switch (xmlSet.tagName.toLowerCase()) {
					
				case "standard":
					
					var sWidth = xmlSet.getElementsByTagName("width")[0];
					var sHeight = xmlSet.getElementsByTagName("height")[0];
					
					if (sWidth && sHeight) {
						
						Game.gameSettings.standardWidth = parseInt(sWidth.innerHTML);
						Game.gameSettings.standardHeight = parseInt(sHeight.innerHTML);
					}
					
					break;
				case "minimum":
					
					var mWidth = xmlSet.getElementsByTagName("width")[0];
					var mHeight = xmlSet.getElementsByTagName("height")[0];
					
					if (mWidth && mHeight) {
						
						Game.gameSettings.minWidth = parseInt(mWidth.innerHTML);
						Game.gameSettings.minHeight = parseInt(mHeight.innerHTML);
					}
					break;
			}
		}
	}
	
	function loadProbabilities(xmlSet) {
		
		for (var i = 0; i < xmlSet.children.length; i++) {
			
			var prob = xmlSet.children[i];
			switch (prob.tagName.toLowerCase()) {
					
				case "happy":
					/** Look for happy on local storage **/
					
					if (localStorageExists) {
						
						var probHappy = localStorage.getItem("happy");
						
						if (probHappy)
							Game.gameSettings.probHappy = parseFloat(probHappy);
						else {

							Game.gameSettings.probHappy = parseFloat(prob.innerHTML);
							localStorage.setItem("happy", Game.gameSettings.probHappy);
						}
					} else Game.gameSettings.probHappy = parseFloat(prob.innerHTML);
					
					break;
				case "sad":
					/** Look for sad on local storage **/
					
					if (localStorageExists) {
						
						var probSad = localStorage.getItem("sad");
						
						if (probSad)
							Game.gameSettings.probSad = parseFloat(probSad);
						else {
							
							Game.gameSettings.probSad = parseFloat(prob.innerHTML);
							localStorage.setItem("sad", Game.gameSettings.probSad);
						}
						
					} else Game.gameSettings.probSad = parseFloat(prob.innerHTML);
					
					break;
				case "straight":
					/** Look for straight on local storage **/
					
					if (localStorageExists) {
						
						var probStraight = localStorage.getItem("straight");
						
						if (probStraight)
							Game.gameSettings.probStraight = parseFloat(probStraight);
						else {
							
							Game.gameSettings.probStraight = parseFloat(prob.innerHTML);
							localStorage.setItem("straight", Game.gameSettings.probStraight);
						}
					} else Game.gameSettings.probStraight = parseFloat(prob.innerHTML);
					
					break;
				case "celebrity":
					
					/** Look for straight on local storage **/
					
					if (localStorageExists) {
						
						var probCelebrity = localStorage.getItem("celebrity");
						
						if (probCelebrity)
							Game.gameSettings.probCelebrity = parseFloat(probCelebrity);
						else {
							
							Game.gameSettings.probCelebrity = parseFloat(prob.innerHTML);
							localStorage.setItem("celebrity", Game.gameSettings.probCelebrity);
						}
						
					} else Game.gameSettings.probCelebrity = parseFloat(prob.innerHTML);
					
					break;
			}
		}
	}
	
	function loadTiming(xmlSet) {
		
		for (var i = 0; i < xmlSet.children.length; i++) {
			
			var xmlNode = xmlSet.children[i];
			switch (xmlNode.tagName.toLowerCase()) {
					
				case "guitarstreet":
					
					if (localStorageExists) {
						
						var time = localStorage.getItem("guitarstreet");

						if (time)
							Game.gameSettings.guitarStreetTime = parseInt(time);
						else {
							
							Game.gameSettings.guitarStreetTime = parseInt(xmlNode.innerHTML);
							localStorage.setItem("guitarstreet", Game.gameSettings.guitarStreetTime);
						}
					} else Game.gameSettings.guitarStreetTime = parseInt(xmlNode.innerHTML);
					
					break;
				case "pianostreet":
					if (localStorageExists) {
						
						var time = localStorage.getItem("pianostreet");

						if (time)
							Game.gameSettings.pianoStreetTime = parseInt(time);
						else {

							Game.gameSettings.pianoStreetTime = parseInt(xmlNode.innerHTML);
							localStorage.setItem("pianostreet", Game.gameSettings.pianoStreetTime);
						}
					} else Game.gameSettings.pianoStreetTime = parseInt(xmlNode.innerHTML);
					break;
				case "drumsstreet":
					
					if (localStorageExists) {
						
						var time = localStorage.getItem("drumsstreet");

						if (time)
							Game.gameSettings.drumsStreetTime = parseInt(time);
						else {

							Game.gameSettings.drumsStreetTime = parseInt(xmlNode.innerHTML);
							localStorage.setItem("drumsstreet", Game.gameSettings.drumsStreetTime);
						}
					} else Game.gameSettings.drumsStreetTime = parseInt(xmlNode.innerHTML);
					
					break;
				case "note":
					
					if (localStorageExists) {
						
						var time = localStorage.getItem("note");

						if (time)
							Game.gameSettings.noteTime = parseInt(time);
						else {

							Game.gameSettings.noteTime = parseInt(xmlNode.innerHTML);
							localStorage.setItem("note", Game.gameSettings.noteTime);
						}
					} else Game.gameSettings.noteTime = parseInt(xmlNode.innerHTML);
					
					break;
				case "animation":
					
					if (localStorageExists) {
						
						var time = localStorage.getItem("animation");
						
						if (time)
							Game.gameSettings.animationDuration = parseInt(time);
						else {
							
							Game.gameSettings.animationDuration = parseInt(xmlNode.innerHTML);
							localStorage.setItem("animation", Game.gameSettings.animationDuration);
						}
					} else Game.gameSettings.animationDuration = parseInt(xmlNode.innerHTML);
					
					break;
			}
		}
	}
	
	function loadSettings(xmlSettings) {
		
		for (var i = 0; i < xmlSettings.children.length; i++) {
			
			var xmlSet = xmlSettings.children[i];
			
			switch (xmlSet.tagName.toLowerCase()) {
					
				case "canvassize":
					loadCanvasSize(xmlSet);
					break;
				case "level":
					if (localStorageExists) {
						
						var level = localStorage.getItem("level");
						
						if (level)
							Game.gameSettings.level = level;
						else {
							
							Game.gameSettings.level = xmlSet.innerHTML;
							localStorage.setItem("level", Game.gameSettings.level);
						}
						
					} else Game.gameSettings.level = xmlSet.innerHTML;
					
					break;
				case "probabilities":
					loadProbabilities(xmlSet);
					break;
				case "timing":
					loadTiming(xmlSet);
					break;
				case "fame":
					/**Look for fame on local storage **/
					
					if (localStorageExists) {
						
						var fame = localStorage.getItem("fame");

						if (fame)
							Game.gameSettings.standardFame = parseInt(fame);
						else {

							Game.gameSettings.standardFame = parseInt(xmlSet.innerHTML);
							localStorage.setItem("fame", Game.gameSettings.standardFame);
						}
					} else Game.gameSettings.standardFame = parseInt(xmlSet.innerHTML);
					/** **/
					break;
				case "settingspage":
					settingsPage = xmlSet;
					break;
			}
		}
	}
	
	function ajaxCall(path) {

		$(document).ready(function() {

			$.ajax({

				url: path,
				type: "GET",
				dataType: "xml",
				success: function(xml) {

					var $xml = $(xml);
					var xmlDoc = $xml.children().get(0);
					
					/** Animate the loading bar **/
					
					if ((loadingBar.bar instanceof HTMLDivElement) &&
						(loadingBar.text instanceof HTMLParagraphElement) &&
						(loadingBar.container instanceof HTMLDivElement) &&
						(loadingBar.loadBar instanceof HTMLDivElement)) {
						
						var start = Date.now(); // remember start time
						var itemTime = 200;
						var totalTime = itemTime * xmlDoc.children.length;

						var timer = setInterval(function() {

							var timePassed = Date.now() - start;

							if (timePassed >= totalTime) {
								
								clearInterval(timer);

								loadingBar.bar.style.width = "100%";
								loadingBar.text.innerHTML = "100%";
								
								var waitRes = setInterval(function() {
									
									if (Game.resourcesLoaded) {
										
										clearInterval(waitRes);
										setTimeout(function() {

											Game.gameCanvas.removeChild(loadingBar.container);
											Game.loaded = true;

										}, itemTime);
									}
									
								}, 50);
								return;
							}

							loadingBar.bar.style.width = Math.floor((timePassed / totalTime) * 100) + "%";
							loadingBar.text.innerHTML = Math.floor((timePassed / totalTime) * 100) + "%";

						}, 20);
					}
					
					/** Parse the resources **/
					for (var i = 0; i < xmlDoc.children.length; i++) {

						var currentRes = xmlDoc.children[i];
						switch(currentRes.tagName.toLowerCase()) {

							case "images":
								loadImages(currentRes);
								break;
							case "settings":
								loadSettings(currentRes);
								break;
						}
					}
		
					Game.resourcesLoaded = true;
				},
				error: function(err) {

					throw "Could not open resources";
				}
			});
		});
	}
	
	return {
		
		getImage: function(id_xml) {
			
			for (var i = 0; i < images.length; i++) {
				
				if (images[i].id === id_xml) {
					
					if (images[i].entry === "multiple") {
						
						var newImg = document.createElement("img");
						
						for (var j = 0; j < images[i].domImage.attributes.length; j++) {
							
							var attr = images[i].domImage.attributes[j];
							
							newImg.setAttribute(attr.nodeName, attr.nodeValue);
						}
						return newImg;
						
					} else return images[i].domImage;
				}
			}
				 
			return null;
		},
		
		getSettingsPage: function() {
			
			return settingsPage;
		},
		
		parseResources: function(path) {
			
			localStorageExists = checkLocalStorage();
			
			Game.loaded = false;
			Game.resourcesLoaded = false;
			
			/** Loading bar **/
			
			var container = document.createElement("div");
			container.id = "container";
			container.style.width = "100%";
			container.style.height = "100%";
			container.style.backgroundColor = "#F5F5F5";
			container.style.zIndex = "10";
			container.className = "helper";
			
			var loadBar = document.createElement("div");
			loadBar.id = "loadingBar";
			
			var bar = document.createElement("div");
			bar.id = "bar";
			var text = document.createElement("p");
			text.id = "text";
			text.innerHTML = "0%";
			
			loadBar.appendChild(bar);
			loadBar.appendChild(text);

			container.appendChild(loadBar);
			Game.gameCanvas.appendChild(container);
			
			/** Save loadingBar elements **/
			loadingBar = {
				
				container: container,
				loadBar: loadBar,
				bar: bar,
				text: text
			};
			
			ajaxCall("./XML/resources.xml");
		}
	};
	
})();