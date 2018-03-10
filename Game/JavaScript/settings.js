"use strict";

var levelChanged = false;

function loadSettings() {
	
	/** Level **/
	
	levelChanged = false;
	var levelInput = document.getElementsByName("level");
	
	for (var i = 0; i < levelInput.length; i++) {
		
		if (levelInput[i].value === Game.gameSettings.level) {
			
			levelInput[i].checked = "true";
			break;
		}
	}
	
	/** Celebrity **/
	
	if (Game.gameSettings.probCelebrity > 0) {
		
		var checkBox = document.getElementsByName("celebrity")[0];
		
		checkBox.checked = true;
		showRange(checkBox);
		
		var celebRange = document.getElementsByName("celebrityRange")[0];
		var prob = Math.floor(Game.gameSettings.probCelebrity * 100);
		
		celebRange.value = prob;
		rangeChange(celebRange);
		
	}
	
	/** Timing **/
	
	var timingRange = document.getElementsByName("timingRange")[0];
	
	timingRange.value = Game.gameSettings.guitarStreetTime;
	timingRangeChange(timingRange);
	
	/** Probabilities **/
	
	var happyRange = document.getElementsByName("happyProb")[0];
	var prob = Math.floor(Game.gameSettings.probHappy * 100);
	
	happyRange.value = prob;
	rangeChange(happyRange);
}

/** Level JS **/

function changeLevel(radio) {
	
	if (radio instanceof HTMLInputElement) {
		
		levelChanged = true;
	}
}

function showRange(checkInput) {
	
	if (checkInput instanceof HTMLInputElement) {
		
		levelChanged = false;
		var celebRange = document.getElementsByName("celebrityRange")[0];
		
		celebRange.parentElement.classList.toggle("hidden");
	}
}

function rangeChange(range) {
	
	if (range instanceof HTMLInputElement) {
		
		levelChanged = false;
		if (range.nextElementSibling instanceof HTMLParagraphElement) {
			
			var p = range.nextElementSibling;
			p.innerHTML = `Probability: ${range.value}%`;
		}
	}
}

function timingRangeChange(range) {
	
	if (range instanceof HTMLInputElement) {
		
		levelChanged = false;
		if (range.nextElementSibling instanceof HTMLParagraphElement) {
			
			var p = range.nextElementSibling;
			p.innerHTML = `Spawn Time: ${range.value}ms`;
		}
	}
}

function happSelectChange(select) {
	
	if (select instanceof HTMLSelectElement) {
		
		var prob = 0;
		
		switch (select.value) {
				
			case "happy":
				prob = Game.gameSettings.probHappy;
				break;
			case "sad":
				prob = Game.gameSettings.probSad;
				break;
			case "straight":
				prob = Game.gameSettings.probStraight;
				break;
		}
		
		prob = Math.floor(prob * 100);
		var range = document.getElementsByName("happyProb")[0];
		range.value = prob;
		
		if (range.nextElementSibling instanceof HTMLParagraphElement) {
			
			var p = range.nextElementSibling;
			p.innerHTML = `Probability: ${range.value}%`;
		}
	}
}

function timingSelectChange(select) {
	
	if (select instanceof HTMLSelectElement) {
		
		var result = [];
		var options = select && select.options;
		
		for (var i = 0; i < options.length; i++) {
			
			if (options[i].selected) {
				
				result.push(options[i].value);
			}
		}
		
		var range = document.getElementsByName("timingRange")[0];
		
		if (result.length == 1) {
			
			var time = 0;
			switch (result[0]) {
					
				case "guitar":
					time = Game.gameSettings.guitarStreetTime;
					break;
				case "drums":
					time = Game.gameSettings.drumsStreetTime;
					break;
				case "piano":
					time = Game.gameSettings.pianoStreetTime;
					break;
			}
			
			range.value = time;
			if (range.nextElementSibling instanceof HTMLParagraphElement) {
			
				var p = range.nextElementSibling;
				p.innerHTML = `Spawn Time: ${range.value}ms`;
			}
			
		} else if (result.length > 1) {
			
			range.value = 5000;
			if (range.nextElementSibling instanceof HTMLParagraphElement) {
			
				var p = range.nextElementSibling;
				p.innerHTML = "Spawn Time: 5000ms";
			}
		}
	}
}

function submitChanges() {
	
	var localStorageExists = checkLocalStorage();
	
	/** Level **/
	
	if (levelChanged) {
		
		var levelInput = document.getElementsByName("level");

		for (var i = 0; i < levelInput.length; i++) {

			if (levelInput[i].checked) {

				switch (levelInput[i].value) {

					case "easy":
						
						/** Game settings **/
						
						Game.gameSettings.level = "easy";
						Game.gameSettings.guitarStreetTime = 6000;
						Game.gameSettings.pianoStreetTime = 8000;
						Game.gameSettings.drumsStreetTime = 10000;
						Game.gameSettings.probCelebrity = 0.5;
						Game.gameSettings.probHappy = 0.5;
						Game.gameSettings.probSad = 0.25;
						Game.gameSettings.probStraight = 0.25;
						
						/** Local storage **/
						if (localStorageExists) {
							
							localStorage.setItem("level", "easy");
							localStorage.setItem("guitarstreet", 6000);
							localStorage.setItem("pianostreet", 8000);
							localStorage.setItem("drumsstreet", 10000);
							localStorage.setItem("celebrity", 0.5);
							localStorage.setItem("happy", 0.5);
							localStorage.setItem("sad", 0.25);
							localStorage.setItem("straight", 0.25);
						}
						break;

					case "normal":
						
						/** Game settings **/
						Game.gameSettings.level = "normal";
						Game.gameSettings.guitarStreetTime = 4000;
						Game.gameSettings.pianoStreetTime = 6000;
						Game.gameSettings.drumsStreetTime = 8000;
						Game.gameSettings.probCelebrity = 0.2;
						Game.gameSettings.probHappy = 0.2;
						Game.gameSettings.probSad = 0.5;
						Game.gameSettings.probStraight = 0.3;
						
						/** Local storage **/
						if (localStorageExists) {
							
							localStorage.setItem("level", "normal");
							localStorage.setItem("guitarstreet", 4000);
							localStorage.setItem("pianostreet", 6000);
							localStorage.setItem("drumsstreet", 8000);
							localStorage.setItem("celebrity", 0.2);
							localStorage.setItem("happy", 0.2);
							localStorage.setItem("sad", 0.5);
							localStorage.setItem("straight", 0.3);
						}
						break;

					case "hard":
						
						/** Game settings **/
						Game.gameSettings.level = "hard";
						Game.gameSettings.guitarStreetTime = 2000;
						Game.gameSettings.pianoStreetTime = 4000;
						Game.gameSettings.drumsStreetTime = 6000;
						Game.gameSettings.probCelebrity = 0;
						Game.gameSettings.probHappy = 0;
						Game.gameSettings.probSad = 0.5;
						Game.gameSettings.probStraight = 0.5;
						
						/** Local storage **/
						if (localStorageExists) {
							
							localStorage.setItem("level", "hard");
							localStorage.setItem("guitarstreet", 2000);
							localStorage.setItem("pianostreet", 4000);
							localStorage.setItem("drumsstreet", 6000);
							localStorage.setItem("celebrity", 0);
							localStorage.setItem("happy", 0);
							localStorage.setItem("sad", 0.5);
							localStorage.setItem("straight", 0.5);
						}
						break;
				}
				break;
			}
		}
		
	} else {
	
		/** Celebrity **/

		var checkBox = document.getElementsByName("celebrity")[0];

		var probCeleb = 0;

		if (checkBox.checked) {

			var celebRange = document.getElementsByName("celebrityRange")[0];

			probCeleb = celebRange.value / 100;
		}
		
		Game.gameSettings.probCelebrity = probCeleb;
		if (localStorageExists)
			localStorage.setItem("celebrity", probCeleb);

		/** Timing **/

		var timingRange = document.getElementsByName("timingRange")[0];
		var time = Number(timingRange.value);

		var select = document.getElementsByName("timing")[0];

		var options = select && select.options;

		for (var i = 0; i < options.length; i++) {

			if (options[i].selected) {

				switch (options[i].value) {

					case "guitar":
						Game.gameSettings.guitarStreetTime = time;
						if (localStorageExists)
							localStorage.setItem("guitarstreet", Game.gameSettings.guitarStreetTime);
						break;
					case "piano":
						Game.gameSettings.pianoStreetTime = time;
						if (localStorageExists)
							localStorage.setItem("pianostreet", Game.gameSettings.pianoStreetTime);
						break;
					case "drums":
						Game.gameSettings.drumsStreetTime = time;
						if (localStorageExists)
							localStorage.setItem("drumsstreet", Game.gameSettings.drumsStreetTime);
						break;
				}
			}
		}

		/** Probability **/

		var happySelect = document.getElementsByName("happiness")[0];
		var happyProb = document.getElementsByName("happyProb")[0];

		var type = happySelect.value;
		var prob = Number(happyProb.value);
		var modify = 0;

		switch (type) {

			case "happy":
					modify = (prob - Game.gameSettings.probHappy * 100) / 2;
					break;
			case "sad":
					modify = (prob - Game.gameSettings.probSad * 100) / 2;
					break;
			case "straight":
					modify = (prob - Game.gameSettings.probStraight * 100) / 2;
					break;
		}
		
		var happyArray = [{
							type: "happy",
							prob: Game.gameSettings.probHappy * 100
						  },
						  {
							type: "sad",
							prob: Game.gameSettings.probSad * 100
						  },
						  {
							type: "straight",
							prob: Game.gameSettings.probStraight * 100
						  },
						 ];

		var dataError = false;
		var negValue = 0;
		
		for (var i = 0; i < happyArray.length; i++) {

			if (happyArray[i].type === type) {

				happyArray[i].prob = prob;

			} else {

				happyArray[i].prob = happyArray[i].prob - modify;
				if (happyArray[i].prob < 0) {
					
					dataError = true;
					negValue = happyArray[i].prob;
				}
			}
			
		}

		if (dataError) {
		
			for (var i = 0; i < happyArray.length; i++) {
				
				if (happyArray[i].type != type) {
					
					if (happyArray[i].prob < 0)
						happyArray[i].prob -= negValue;
					else
						happyArray[i].prob += negValue;
				}
			}
		}

		for (var i = 0; i < happyArray.length; i++) {
			
			switch (happyArray[i].type) {

				case "happy":
					Game.gameSettings.probHappy = happyArray[i].prob / 100;
					if (localStorageExists)
						localStorage.setItem("happy", Game.gameSettings.probHappy);
					break;
				case "sad":
					Game.gameSettings.probSad = happyArray[i].prob / 100;
					if (localStorageExists)
						localStorage.setItem("sad", Game.gameSettings.probSad);
					break;
				case "straight":
					Game.gameSettings.probStraight = happyArray[i].prob / 100;
					if (localStorageExists)
						localStorage.setItem("straight", Game.gameSettings.probStraight);
					break;
			}
		}
	}
	
	/** **/
	Game.loadStartScreen();
}

/** Cheats **/
var cheatsList = {
	
	fastsinger: function() {
		
		Game.gameSettings.noteTime = 100;
		if (checkLocalStorage())
			localStorage.setItem("note", 100);
	},
	normalsinger: function() {
		
		Game.gameSettings.noteTime = 300;
		if (checkLocalStorage())
			localStorage.setItem("note", 300);
	},
	slowsinger: function() {
		
		Game.gameSettings.noteTime = 500;
		if (checkLocalStorage())
			localStorage.setItem("note", 500);
	},
	fastpeople: function() {
		
		Game.gameSettings.animationDuration = 3000;
		if (checkLocalStorage())
			localStorage.setItem("animation", 3000);
	},
	normalpeople: function() {
		Game.gameSettings.animationDuration = 5000;
		if (checkLocalStorage())
			localStorage.setItem("animation", 5000);
	},
	slowpeople: function() {
		
		Game.gameSettings.animationDuration = 7000;
		if (checkLocalStorage())
			localStorage.setItem("animation", 7000);
	}
};

function singleCheat() {
	
	var input = document.getElementsByName("singlecheat")[0];
	var output = document.getElementById("singleCheatRes");
	var cheat = input.value;
	
	var cond = /^(fast|normal|slow)(singer|people)$/i.test(cheat);
	
	if (cond) {
		
		output.innerHTML = "Cheat activated !!!";
		cheatsList[cheat]();
		
	} else output.innerHTML = "";
}

function multipleCheat() {
	
	var input = document.getElementsByName("multiplecheat")[0];
	var output = document.getElementById("multipleCheatRes");
	var multicheat = (input.value).toString();
	
	var cheats = multicheat.split("\n");
	var ok = false;
	
	for (var i = 0; i < cheats.length; i++) {
		
		var cond = /^(fast|normal|slow)(singer|people)$/i.test(cheats[i]);
		
		if (cond) {
			
			ok = true;
			cheatsList[cheats[i]]();
		} 
	}
	
	if (ok) {
		
		output.innerHTML = "Cheats activated !!!";
		
	} else output.innerHTML = "";
}