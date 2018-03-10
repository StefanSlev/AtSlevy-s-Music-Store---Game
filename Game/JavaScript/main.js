"use strict";

function checkLocalStorage() {
		
	var test = "test";
		
	try {
			
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
			
	} catch(err) {
			
		return false;
	}
}

String.prototype.insertAt = function(pos, str) {
	
	if ((typeof str).toLowerCase() === "string")
		return this.substring(0, pos) + str + this.substring(pos);
	return this.substring(0);
}

function addEvent(elem, eventName, callback) {
	
	var prefix = ["","moz","MS","o","webkit"];

	for (var i = 0; i < prefix.length; i++)
		elem.addEventListener(prefix[i] + eventName, callback, false);
}

function removeEvent(elem, eventName, callback) {
	
	var prefix = ["","moz","MS","o","webkit"];
	
	for (var i = 0; i < prefix.length; i++)
		elem.removeEventListener(prefix[i] + eventName, callback, false);
}

function getLeft(box) {
			
	if (!box)
		return 0;
			
	if (box instanceof HTMLElement) {
				
		return box.offsetLeft + getLeft(box.offsetParent);
	}
}
		
function getTop(box) {
			
	if (!box)
		return 0;
			
	if (box instanceof HTMLElement) {
				
		return box.offsetTop + getTop(box.offsetParent);
	}
}

function crossProduct(p, q, r) {
	
	return ((q.X - p.X) * (r.Y - p.Y) - (r.X - p.X) * (q.Y - p.Y));
}

function checkCollisionBoxes(box1, box2) {
			
	if (box1 instanceof HTMLElement && box2 instanceof HTMLElement) {
				
		var box1Dg = {
					
			firstPoint : {
						
				X : box1.offsetLeft,
				Y : box1.offsetTop
			},
			secondPoint : {
						
				X :  box1.offsetLeft + box1.offsetWidth,
				Y :  box1.offsetTop + box1.offsetHeight
			}
		};
				
		var box2Dg = {
					
			firstPoint : {
						
				X : box2.offsetLeft,
				Y : box2.offsetTop
			},
			secondPoint : {
						
				X : box2.offsetLeft + box2.offsetWidth,
				Y : box2.offsetTop + box2.offsetHeight
			}
		};
				
		if (box1Dg.firstPoint.X >= box2Dg.secondPoint.X || box1Dg.secondPoint.X <= box2Dg.firstPoint.X)
					return false;
				
		if (box1Dg.firstPoint.Y >= box2Dg.secondPoint.Y || box1Dg.secondPoint.Y <= box2Dg.firstPoint.Y)
					return false;
				
		return true;
	}
	
	return false;
}

function animate({note, moveFunction, step, axis}) {
 	
	if (Game.endGame == false) {
		
		var oldLeft = note.offsetLeft;
		var oldTop = note.offsetTop;
		var newLeft = oldLeft, newTop = oldTop;

		if (axis === "X") {

			newLeft = oldLeft + step;
			newTop = moveFunction(newLeft);

		} else if (axis === "Y") {

			newTop = oldTop + step;
			newLeft = moveFunction(newTop);
		}

		note.style.left = newLeft + "px";
		note.style.top = newTop + "px";

		var contMove = true;

		if (newLeft < -note.offsetWidth || newTop < -note.offsetHeight || newLeft > Game.gameSettings.canvasWidth || newTop > Game.gameSettings.canvasHeight)
			contMove = false;

		switch (note.getAttribute("alt")) {

			case "note1":
				// guitar note
				if (checkCollisionBoxes(note, Game.Streets.guitarStreet)) {

					Game.Streets.improveMood(Game.Streets.guitarStreetArray);
					contMove = false;
				}
				break;
			case "note2":
				// drums note
				if (checkCollisionBoxes(note, Game.Streets.drumsStreet)) {

					Game.Streets.improveMood(Game.Streets.drumsStreetArray);
					contMove = false;
				}
				break;
			case "note3":
				// piano note
				if (checkCollisionBoxes(note, Game.Streets.pianoStreet)) {

					Game.Streets.improveMood(Game.Streets.pianoStreetArray);
					contMove = false;
				}
				break;
		}

		if (contMove) {

			requestAnimationFrame(function() {

				animate({
					note: note,
					moveFunction: moveFunction,
					step: step,
					axis: axis
				});
			});
		} else {


			note.parentNode.removeChild(note);
		}
	}
}

var Game = (function() {
	
	var _startScreen = false;
	var _gameScreen = false;
	var _settingsScreen = false;
	
	/** Game loading **/
	var _loaded = false;
	var _res_loaded = false;
	
	/** **/
	var _Player = null;
	var _Streets = null;
	var _mouseCoord = null;
	/** Score and Fame **/
	var _score = 0;
	var _fame = 0;
	/** Timers ID **/
	var guitar_spawn = 0;
	var drums_spawn = 0;
	var piano_spawn = 0;
	var note_spawn = 0;
	var game_timer = 0;
	/** **/
	var _endGame = false;
	var _startTime = 0;
	
	function clearCanvas() {
		
		for (var i = 0; i < Game.gameCanvas.children.length; i++) {
			
			Game.gameCanvas.removeChild(Game.gameCanvas.children[i]);
			i--;
		}
	}
	
	function createGameScreen() {
		
		Game.gameCanvas.className = "row";
		
		var playerArea = document.createElement("div");
		playerArea.className = "col-6 row";
		
		var playerMenu = document.createElement("div");
		playerMenu.className = "col-3 menu";
		
		/** Instruments **/
		
		var _instruments = [];
		_instruments.push(Loader.getImage("guitar"));
		_instruments.push(Loader.getImage("drums"));
		_instruments.push(Loader.getImage("piano"));
	
		var guitarCont = document.createElement("div");
		guitarCont.className = "instrument selectedInstr";
		guitarCont.id = "guitar";
		guitarCont.appendChild(_instruments[0]);
		
		var drumsCont = document.createElement("div");
		drumsCont.className = "instrument";
		drumsCont.id = "drums";
		drumsCont.appendChild(_instruments[1]);
		
		var pianoCont = document.createElement("div");
		pianoCont.className = "instrument";
		pianoCont.id = "piano";
		pianoCont.appendChild(_instruments[2]);
		
		var actPlayerArea = document.createElement("div");
		actPlayerArea.className = "col-9";
		actPlayerArea.style.position = "relative";
		actPlayerArea.id = "playerArea";
		
		/** Player area **/
		
		var personPlaying = Loader.getImage("person");
		personPlaying.className = "personPlaying";
		personPlaying.id = "personPlaying";
		
		var instrPlayed = Loader.getImage("guitar");
		instrPlayed.className = "instrPlayed";
		instrPlayed.id = "instrPlayed";
		
		var tabel = document.createElement("div");
		tabel.classList.add("scoreTabel");
		tabel.innerHTML = "Score: 0 Fame: " + Game.fame;
		
		var timer = document.createElement("div");
		timer.classList.add("timer");
		var timerText = document.createTextNode("Time: 0s");
		timer.appendChild(timerText);
		timer.normalize();
		timer.id = "timer";
		
		actPlayerArea.appendChild(personPlaying);
		actPlayerArea.appendChild(instrPlayed);
		actPlayerArea.appendChild(tabel);
		actPlayerArea.appendChild(timer);
		/** **/
		
		var _streets = [];
		var _ids = ["guitarStreet", "drumsStreet", "pianoStreet"];
		var indx_street = -1;
		
		for (var i = 1; i <= 3; i++) {
			
			var _street = document.createElement("div");
			_street.className = "col-2";
			_street.style.position = "relative";
			_streets.push(_street);
		}
		
		while (_ids.length > 0) {
			
			var indx = Math.floor(Math.random() * _ids.length);
			_streets[++indx_street].id = _ids[indx];
			_ids.splice(indx, 1);	
		}
		
		playerMenu.appendChild(guitarCont);
		playerMenu.appendChild(drumsCont);
		playerMenu.appendChild(pianoCont);
		playerArea.appendChild(playerMenu);
		playerArea.appendChild(actPlayerArea);
		Game.gameCanvas.appendChild(playerArea);
		
		for (var i = 0; i < _streets.length; i++) {
			
			var label = document.createElement("p");
			var name = _streets[i].id;
			
			/** Formatting name **/
			name = name.insertAt(name.indexOf("S"), " ");
			name = name.toUpperCase();
			label.innerHTML = name;
			
			label.className = "label";
			_streets[i].appendChild(label);
			Game.gameCanvas.appendChild(_streets[i]);
		}
		
		for (var i = 0; i < _instruments.length; i++) {
			
			_instruments[i].style.width = (guitarCont.offsetWidth - 10) + "px";
			_instruments[i].style.height = (guitarCont.offsetHeight - 10) + "px";
		}
	}
	
	function loseGame() {
		
		_endGame = true;
		
		if (guitar_spawn)
			clearInterval(guitar_spawn);
		if (piano_spawn)
			clearInterval(piano_spawn);
		if (drums_spawn)
			clearInterval(drums_spawn);
		if (note_spawn)
			clearInterval(note_spawn);
		if (game_timer)
			clearInterval(game_timer);
		/** **/
			
		window.onkeydown = null;
		window.onmousemove = null;
		Game.gameCanvas.classList.toggle("row");
		/** **/
		
		for (var i = 0; i < Game.Streets.guitarStreetArray.length; i++) {
						
			Game.Streets.guitarStreetArray[i].face.style.animationPlayState = "paused";
		}
						
		for (var i = 0; i < Game.Streets.pianoStreetArray.length; i++) {
							
			Game.Streets.pianoStreetArray[i].face.style.animationPlayState = "paused";
		}
						
		for (var i = 0; i < Game.Streets.drumsStreetArray.length; i++) {
							
			Game.Streets.drumsStreetArray[i].face.style.animationPlayState = "paused";
		}
			
		_Player = null;
		_Streets = null;
			
		/** Load exit screen **/
		clearCanvas();
			
		var container = document.createElement("div");
		container.id = "container";
		container.style.width = "100%";
		container.style.height = "100%";
		container.style.backgroundColor = "#F5F5F5";
		container.style.zIndex = "10";
		container.className = "helper";
			
		var button = document.createElement("button");
		button.innerHTML = "Continue";
		button.onclick = function() {
				
			Game.loadStartScreen();
		}
			
		var p = document.createElement("p");
		p.innerHTML = "Congrats ! Your score is: " + Game.score;
		p.classList.add("finalScore");
			
		var div = document.createElement("div");
		div.appendChild(p);
		div.appendChild(button);
			
		container.appendChild(div);
		Game.gameCanvas.appendChild(container);
	}
	
	function erasePass(street, pass) {
					
		var i;
		
		for (i = 0; i < street.length; i++) {
						
			if (street[i].face.getAttribute("idStreet") == pass.getAttribute("idStreet"))
				break;
		}
					
		var nr = 0;
		var lost = false;
					
		switch (street[i].mood) {
							
			case "happy":
							
				nr = Game.score;
				nr++;
				Game.score = nr;
							
				if (street[i] instanceof Celebrity) {
								
					nr = Game.fame;
					nr++;
					Game.fame = nr;
				}
			break;
							
			case "sad":
				nr = Game.fame;
				if (nr > 0) {
								
					nr--;
					Game.fame = nr;
								
				} else lost = true;
			break;
		}
					
		street.splice(i, 1);
		pass.parentNode.removeChild(pass);
		
		if (_endGame == false) {
			if (lost) {

				loseGame();

			} else {

				var tabel = document.querySelectorAll("div.scoreTabel")[0];
				tabel.innerHTML = "Score: " + Game.score + " Fame: " + Game.fame;
			}
		}
	}
	
	function spawnNote() {
		
		var selInstr = Game.Player.instrArray[Game.Player.selectedIndex];
		var key = "";
		
		switch (selInstr.id) {
				
			case "guitar":
				key = "note1";
				break;
			case "drums":
				key = "note2";
				break;
			case "piano":
				key = "note3";
				break;
		}
		
		var newNote = Loader.getImage(key);
		newNote.classList.add("note");
		Game.gameCanvas.appendChild(newNote);
		
		/** Animate note **/
		
		var xNote = newNote.offsetLeft;
		var yNote = newNote.offsetTop;
		
		var xMouse = Game.mouseCoord.X;
		var yMouse = Game.mouseCoord.Y;
		
		var moveFuncX = (function() {
			
			var aF = yNote - yMouse;
			var bF = xMouse - xNote;
			var cF = yMouse * xNote - xMouse * yNote;
			
			return function(x) {
				
				return - (aF * x) / bF - cF / bF;
			};
		})();
		
		var moveFuncY = (function() {
			
			var aF = yNote - yMouse;
			var bF = xMouse - xNote;
			var cF = yMouse * xNote - xMouse * yNote;
			
			return function(y) {
				
				return - (bF * y) / aF - cF / aF;
			};
		})();
		
		var stepX = 1, stepY = 1;
		
		stepX = ((xNote <= xMouse) ? 6 : -6);
		stepY = ((yNote <= yMouse) ? 6 : -6);
		
		var delta1 = crossProduct({X: 0, Y: 0}, {X: xNote, Y: yNote}, {X:xMouse, Y:yMouse});
		var delta2 = crossProduct({X: 0, Y: Game.gameCanvas.offsetHeight}, {X: xNote, Y: yNote}, {X:xMouse, Y:yMouse});
		
		if (delta1 * delta2 <= 0) {
			
			requestAnimationFrame(function() {
			
				animate({
					axis: "X",
					note: newNote,
					moveFunction: moveFuncX,
					step: stepX
				});
			});
		} else {
			
			requestAnimationFrame(function() {
			
				animate({
					axis: "Y",
					note: newNote,
					moveFunction: moveFuncY,
					step: stepY
				});
			});
		}
	}
	
	return {
		
		/** Game ended**/
		get endGame() {
			
			return _endGame;
		},
		
		/** GameCanvas pos **/
		get canvasOffsetLeft() {
			
			return getLeft(Game.gameCanvas);
		},
		
		get canvasOffsetTop() {
			
			return getTop(Game.gameCanvas);
		},
		
		/** Game loading **/
		get loaded() {
			
			return _loaded;
		},
		
		set loaded(load) {
			
			if ((typeof load).toLowerCase() === "boolean")
				_loaded = load;
		},
		
		get resourcesLoaded() {
			
			return _res_loaded;
		},
		
		set resourcesLoaded(load) {
		
			if ((typeof load).toLowerCase() === "boolean")
					_res_loaded = load;
		},
		
		/** Game canvas and screens **/
		get gameCanvas() {
			
			return document.getElementById("gameCanvas");
		},
		
		get startScreen() {
			
			return _startScreen;
		},
		
		get gameScreen() {
		
			return _gameScreen;
		},
		
		get settingsScreen() {
			
			return _settingsScreen;
		},
		
		/** Score and fame **/
		
		get score() {
		
			return _score;
		},
		
		set score(nr) {
			
			nr = parseInt(nr);
			
			if (!isNaN(nr))
				_score = nr;
		},
		
		get fame() {
			
			return _fame;
		},
		
		set fame(nr) {
			
			nr = parseInt(nr);
			
			if (!isNaN(nr))
				_fame = nr;
		},
		
		/** Game settings**/
		
		gameSettings: (function() {
			
			var _standardWidth = 0;
			var _standardHeight = 0;
			var _minWidth = 0;
			var _minHeight = 0;
			
			/** **/
			var _level = "easy";
			
			/** Probabilities **/
			var _probHappy = 0;
			var _probSad = 0;
			var _probStraight = 0;
			var _probCelebrity = 0;
			
			/** Streets timing **/
			var _guitarStreetTime = 0;
			var _pianoStreetTime = 0;
			var _drumsStreetTime = 0;
			var _noteTime = 0;
			
			/** Standard fame **/
			var _standardFame = 0;
			var _animationDuration = 0;
			
			return {
				
				get canvasWidth() {
					
					return Game.gameCanvas.offsetWidth;
				},
				
				get canvasHeight() {
					
					return Game.gameCanvas.offsetHeight;
				},
				
				get standardWidth() {
					
					return _standardWidth;
				},
				
				get standardHeight() {
					
					return _standardHeight;
				},
				
				get minWidth() {
					
					return _minWidth;
				},
				
				get minHeight() {
					
					return _minHeight;
				},
				
				set standardWidth(width) {
					
					width = Number(width);
					
					if (!isNaN(width))
						_standardWidth = width;
				},
				
				set standardHeight(height) {
					
					height = Number(height);
					
					if (!isNaN(height))
						_standardHeight = height;
				},
				
				set minWidth(width) {
					
					width = Number(width);
					
					if (!isNaN(width))
						_minWidth = width;
				},
				
				set minHeight(height) {
					
					height = Number(height);
					
					if (!isNaN(height))
						_minHeight = height;
				},
				
				get level() {
					
					return _level;
				},
				
				set level(newLevel) {
					
					if (["easy", "normal", "hard"].indexOf(newLevel) != -1)
						_level = newLevel;
				},
				get probHappy() {
					
					return _probHappy;
				},
				get probStraight() {
					
					return _probStraight;
				},
				get probSad() {
					
					return _probSad;
				},
				get probCelebrity() {
					
					return _probCelebrity;
				},
				set probHappy(prob) {
					
					prob = Number(prob);
					
					if (!isNaN(prob) && prob >= 0 && prob <= 1)
						_probHappy = prob;
				},
				set probStraight(prob) {
					
					prob = Number(prob);
					
					if (!isNaN(prob) && prob >= 0 && prob <= 1)
						_probStraight = prob;
				},
				set probSad(prob) {
					
					prob = Number(prob);
					
					if (!isNaN(prob) && prob >= 0 && prob <= 1)
						_probSad = prob;
				},
				set probCelebrity(prob) {
					
					prob = Number(prob);
					
					if (!isNaN(prob) && prob >= 0 && prob <= 1)
						_probCelebrity = prob;
				},
				get guitarStreetTime() {
					
					return _guitarStreetTime;
				},
				get pianoStreetTime() {
					
					return _pianoStreetTime;
				},
				get drumsStreetTime() {
					
					return _drumsStreetTime;
				},
				set guitarStreetTime(time) {
					
					time = Number(time);
					
					if (!isNaN(time))
						_guitarStreetTime = time;
				},
				set pianoStreetTime(time) {
					
					time = Number(time);
					
					if (!isNaN(time))
						_pianoStreetTime = time;
				},
				set drumsStreetTime(time) {
					
					time = Number(time);
					
					if (!isNaN(time))
						_drumsStreetTime = time;
				},
				
				get noteTime() {
					
					return _noteTime;
				},
				
				set noteTime(time) {
					
					time = Number(time);
					
					if (!isNaN(time))
						_noteTime = time;
				},
				get standardFame() {
					
					return _standardFame;
				},
				set standardFame(nr) {
					
					nr = parseInt(nr);
					
					if (!isNaN(nr))
						_standardFame = nr;
				},
				
				get animationDuration() {
					
					return _animationDuration;
				},
				
				set animationDuration(time) {
					
					time = Number(time);
					
					if (!isNaN(time))
						_animationDuration = time;
				}
			};
			
		})(),
		
		/** Player **/
		
		get Player() {
			
			return _Player;
		},
		
		/** Streets **/
		get Streets() {
			
			return _Streets;
		},
		
		get mouseCoord() {
			
			return _mouseCoord;
		},
		
		loadStartScreen: function() {
			
			clearCanvas();
			_startScreen = true;
			_gameScreen = false;
			_settingsScreen = false;
			window.onkeydown = null;
			window.onmousemove = null;
			/** **/
			var playBtn = document.createElement("button");
			var setBtn = document.createElement("button");
			var menu = document.createElement("div");
			menu.id = "menu";
			
			playBtn.innerHTML = "Play";
			setBtn.innerHTML = "Settings";
			playBtn.style.marginBottom = "30px";
			playBtn.onclick = function(event) {
				
				Game.gameCanvas.classList.toggle("helper");
				
				_mouseCoord = {
					
					X: event.pageX - Game.canvasOffsetLeft,
					
					Y: event.pageY - Game.canvasOffsetTop
					
				}
				Game.loadGameScreen();
			}
			
			setBtn.onclick = function(event) {
				
				Game.gameCanvas.classList.toggle("helper");
				Game.loadSettingsScreen();
			}
			
			Game.gameCanvas.classList.toggle("helper");
			
			menu.appendChild(playBtn);
			menu.appendChild(setBtn);
			
			Game.gameCanvas.appendChild(menu);
		},
		
		loadGameScreen : function() {
			
			clearCanvas();
			_startScreen = false;
			_gameScreen = false;
			_settingsScreen = false;
			_endGame = false;
			window.onkeydown = null;
			window.onmousemove = null;
			/** Initialize screen **/
			Game.fame = Game.gameSettings.standardFame;
			Game.score = 0;
			createGameScreen();
			_startTime = Date.now();
			/** Initialize Player **/
			
			_Player = (function() {
	
				var selectedIndex = 0;
				var _instrArray = [];
				var _instrPlayed = document.getElementById("instrPlayed");
				var _playerArea = document.getElementById("playerArea");
				var _personPlaying = document.getElementById("personPlaying");
				
				_instrArray.push(document.getElementById("guitar"));
				_instrArray.push(document.getElementById("drums"));
				_instrArray.push(document.getElementById("piano"));
				
				return {
					
					get selectedIndex() {
						
						return selectedIndex;
					},
					get personPlaying() {
						
						return _personPlaying;
					},
					
					get instrPlayed() {
						
						return _instrPlayed;
					},
					
					get instrArray() {
						
						return _instrArray;
					},
					menuMoveUp: function() {
					
						_instrArray[selectedIndex].classList.toggle("selectedInstr");
						selectedIndex = (selectedIndex + 2) % 3;
						_instrArray[selectedIndex].classList.toggle("selectedInstr");
						
						/** **/
						_playerArea.removeChild(_instrPlayed);
						_instrPlayed = Loader.getImage(_instrArray[selectedIndex].id);
						_instrPlayed.className = "instrPlayed";
						_instrPlayed.id = "instrPlayed";
						_playerArea.appendChild(_instrPlayed);
					},
					menuMoveDown: function() {
					
						_instrArray[selectedIndex].classList.toggle("selectedInstr");
						selectedIndex = (selectedIndex + 1) % 3;
						_instrArray[selectedIndex].classList.toggle("selectedInstr");
						
						/** **/
						_playerArea.removeChild(_instrPlayed);
						_instrPlayed = Loader.getImage(_instrArray[selectedIndex].id);
						_instrPlayed.className = "instrPlayed";
						_instrPlayed.id = "instrPlayed";
						_playerArea.appendChild(_instrPlayed);
					}
				};
				
			})();
			
			/** Create streets object **/
			
			_Streets = (function() {
				
				var _guitarStreet = document.getElementById("guitarStreet");
				var _drumsStreet = document.getElementById("drumsStreet");
				var _pianoStreet = document.getElementById("pianoStreet");
				
				var _guitarStreetPass = [];
				var _drumsStreetPass = [];
				var _pianoStreetPass = [];
				
				var getGuitarId = (function() {
					
					var guitarId = 0;
					return function() {
						
						guitarId = (guitarId + 1) % Number.MAX_SAFE_INTEGER;
						return guitarId;
					}
				})();
				
				var getPianoId = (function() {
					
					var pianoId = 0;
					return function() {
						
						pianoId = (pianoId + 1) % Number.MAX_SAFE_INTEGER;
						return pianoId;
					}
				})();
				
				var getDrumsId = (function() {
					
					var drumsId = 0;
					return function() {
						
						drumsId = (drumsId + 1) % Number.MAX_SAFE_INTEGER;
						return drumsId;
					}
				})();
				
				return {
					
					get guitarStreet() {
					
						return _guitarStreet;
					},
					
					get drumsStreet() {
						
						return _drumsStreet;
					},
					get pianoStreet() {
						
						return _pianoStreet;
					},
					get guitarStreetArray() {
						
						return _guitarStreetPass;
					},
					get pianoStreetArray() {
						
						return _pianoStreetPass;
					},
					get drumsStreetArray() {
						
						return _drumsStreetPass;
					},
					improveMood: function(street) {
						
						if (street instanceof Array) {
							
							for (var i = 0; i < street.length; i++) {
						
								var pass = street[i];
								pass.improveMood();
							}
						}
					},
					spawnGuitarPass: function() {
						
						var prob = Math.random();
						var pass = null;
						
						if (prob <= Game.gameSettings.probCelebrity)
							pass = new Celebrity();
						else
							pass = new Passenger();
						
						_guitarStreetPass.push(pass);
						pass.face.setAttribute("idStreet", getGuitarId());
						
						/** **/
						pass.face.classList.add("animateFace");
						pass.face.style.animationDuration = Game.gameSettings.animationDuration + "ms";
						
						addEvent(pass.face, "AnimationEnd", function(event) {
							
							erasePass(_guitarStreetPass, event.target);
						});
						
						_guitarStreet.appendChild(pass.face);
					},
					
					spawnPianoPass: function() {
						
						var prob = Math.random();
						var pass = null;
						
						if (prob <= Game.gameSettings.probCelebrity)
							pass = new Celebrity();
						else
							pass = new Passenger();
						
						_pianoStreetPass.push(pass);
						pass.face.setAttribute("idStreet", getPianoId());
						
						/** **/
						pass.face.classList.add("animateFace");
						pass.face.style.animationDuration = Game.gameSettings.animationDuration + "ms";
						addEvent(pass.face, "AnimationEnd", function(event) {
							
							erasePass(_pianoStreetPass, event.target);
						});
						
						_pianoStreet.appendChild(pass.face);
					},
					
					spawnDrumsPass: function() {
						
						var prob = Math.random();
						var pass = null;
						
						if (prob <= Game.gameSettings.probCelebrity)
							pass = new Celebrity();
						else
							pass = new Passenger();
						
						_drumsStreetPass.push(pass);
						pass.face.setAttribute("idStreet", getDrumsId());
						
						/** **/
						pass.face.classList.add("animateFace");
						pass.face.style.animationDuration = Game.gameSettings.animationDuration + "ms";
						addEvent(pass.face, "AnimationEnd", function(event) {
							
							erasePass(_drumsStreetPass, event.target);
						});
						
						_drumsStreet.appendChild(pass.face);
					},
				}
				
			})();
			
			/** Create event handlers **/
			
			window.onkeydown = function(event) {
				
				switch ((event.key).toLowerCase()) {
						
					case "arrowdown":
						Game.Player.menuMoveDown();
						break;
					case "arrowup":
						Game.Player.menuMoveUp();
						break;
					case "w":
						Game.Player.menuMoveUp();
						break;
					case "s":
						Game.Player.menuMoveDown();
						break;
				}
			}
			
			window.onmousemove = function(event) {
				
				_mouseCoord.X = event.pageX - Game.canvasOffsetLeft;
				_mouseCoord.Y = event.pageY - Game.canvasOffsetTop;
			}
			
			_gameScreen = true;
			
			if (_endGame == false) {
				
				Game.Streets.spawnGuitarPass();

				guitar_spawn = setInterval(function() {

					Game.Streets.spawnGuitarPass();

				}, Game.gameSettings.guitarStreetTime);

				piano_spawn = setInterval(function() {

					Game.Streets.spawnPianoPass();

				}, Game.gameSettings.pianoStreetTime);

				drums_spawn = setInterval(function() {

					Game.Streets.spawnDrumsPass();

				}, Game.gameSettings.drumsStreetTime);

				note_spawn = setInterval(function() {
					
					spawnNote();

				}, Game.gameSettings.noteTime);
				
				game_timer = setInterval(function() {
					
					var timer = document.getElementById("timer");
					var time = Math.floor((Date.now() - _startTime) / 1000);
					timer.innerHTML = `Time: ${time}s`;
					
				}, 1000);
			}
		},
		
		loadSettingsScreen: function() {
			
			clearCanvas();
			_startScreen = false;
			_gameScreen = false;
			_settingsScreen = true;
			
			window.onkeydown = null;
			window.onmousemove = null;
			/** **/
			var page = Loader.getSettingsPage();
			Game.gameCanvas.innerHTML = page.innerHTML;
			loadSettings();
		}
	};
	
})();

window.addEventListener("load", function() {

	Loader.parseResources();
	
	var waitLoad = setInterval(function() {
		
		if (Game.loaded && Game.resourcesLoaded) {
			
			clearInterval(waitLoad);
			
			Game.loadStartScreen();
		}
		
	}, 50);

});