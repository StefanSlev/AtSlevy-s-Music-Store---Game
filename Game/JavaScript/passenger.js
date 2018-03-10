"use strict";

function Passenger() {
	
	var probHappy = Game.gameSettings.probHappy;
	var probSad = Game.gameSettings.probSad;
	var probStraight = Game.gameSettings.probStraight;
	
	var _canChangeMood = true;
	
	var happyArray = [
		{
			mood: "sad",
			value: probSad
		},
		{
			mood: "straight",
			value: probSad + probStraight,
		},
		{
			mood: "happy",
			value: 1
		}
	];
	
	var type = Math.random();
	var _mood = "";

	for (var i = 0; i < happyArray.length; i++) {
		
		if (type <= happyArray[i].value) {
			
			_mood = happyArray[i].mood;
			break;
		}
	}
	
	Object.defineProperty(this, "mood", {
		
		get() {
			
			return _mood;
		},
		
		set(anotherMood) {
			
			var moodArray = ["happy", "straight", "sad"];
			
			if (moodArray.indexOf(anotherMood) != -1)
				_mood = anotherMood;
		}
	});
	
	Object.defineProperty(this, "canChangeMood", {
		
		get() {
			
			return _canChangeMood;
		},
		
		set(bool) {
		
			if ((typeof bool).toLowerCase() === "boolean")
				_canChangeMood = bool;
		}
	});
	
	/** Create face **/
	
	var _face = document.createElement("div");
	var eye1 = document.createElement("div");
	eye1.className = "eye eye1";
	var eye2 = document.createElement("div");
	eye2.className = "eye eye2";
	var mouth = document.createElement("div");
	mouth.className = "mouth";
	
	_face.appendChild(eye1);
	_face.appendChild(eye2);
	_face.appendChild(mouth);
	
	switch (this.mood) {
			
		case "happy":
			_face.className = "happy_face";
			break;
		case "sad":
			_face.className = "sad_face";
			break;
		case "straight":
			_face.className = "straight_face";
			break;
	}
	
	Object.defineProperty(this, "face", {
		
		get() {
			
			return _face;
		}
	});
}

Passenger.prototype.improveMood = function() {
	
	if (this.canChangeMood) {
		
		switch (this.mood) {

			case "sad":
				this.face.classList.remove("sad_face");
				this.face.classList.add("straight_face");
				this.mood = "straight";
				break;
			case "straight":
				this.face.classList.remove("straight_face");
				this.face.classList.add("happy_face");
				this.mood = "happy";
				break;
		}
	}
}

function Celebrity() {
	
	Passenger.call(this);
	this.canChangeMood = false;
	
	/** Build up the hat **/
	var hat = document.createElement("div");
	hat.className = "hat";
	hat.appendChild(document.createElement("div"));
	hat.appendChild(document.createElement("div"));
	
	hat.onmouseover = (event) => {
		
		if (this.canChangeMood == false) {
			
			this.canChangeMood = true;
			var myHat = event.currentTarget;
			this.face.removeChild(myHat);
		}
	};
	
	this.face.insertBefore(hat, this.face.firstElementChild);
}

Object.setPrototypeOf(Celebrity.prototype, Passenger.prototype);