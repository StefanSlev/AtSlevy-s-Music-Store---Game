"use strict";

window.addEventListener("load", function() {
	
	var windowHeight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
	
	var main = document.getElementsByTagName("main")[0];
	var header = document.getElementsByTagName("header")[0];
	
	var newMainHeight = windowHeight - header.offsetHeight;
	
	if (newMainHeight >= Game.gameSettings.standardHeight)
		main.style.height = newMainHeight + "px";
});


window.addEventListener("resize", function() {

	var windowHeight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
	
	var main = document.getElementsByTagName("main")[0];
	var header = document.getElementsByTagName("header")[0];
	
	var newMainHeight = windowHeight - header.offsetHeight;
	
	if (newMainHeight >= Game.gameSettings.standardHeight)
		main.style.height = newMainHeight + "px";
});