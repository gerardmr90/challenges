var spots = [false, false, false, false, false];
var index;

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
}

function setSpotAsReady(ev) {
	index = parseInt(ev.target.id);
	spots[index] = true;
	checkSpots();
}

function checkSpots() {
	for (var i = 0; i<4 ; i++) {
		if (spots[i] == false) {
			return;
		}
	}
	enableButton();
}

function enableButton() {
	document.getElementById("button-challenge").disabled = false;
}

function disableButton(ev) {
	index = parseInt(ev.target.id);
	spots[index] = false;
	document.getElementById("button-challenge").disabled = true;
}
