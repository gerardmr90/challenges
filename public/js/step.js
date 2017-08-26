window.onload = function () {

	var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
		'm', 'n', 'ñ', 'o', 'p', 'q',	'r', 's', 't', 'u', 'v', 'w',	'x', 'y', 'z'];

	var assertion = 'no hay ninguna relacion entre estas alteraciones en la zona lumbar y el desarrollo del dolor cronico';

	var letter;
	var letters;
	var buttons;

	var phraseHolder;
	var hiddenPhrase;
	var hiddenLetter;
	var hiddenLettersList = [];
	var chosenPhrase;

	var hangmanParts = [];

	var guessedLetters = 0;
	var lives = 10;
	var spaces = 0;
	var commas = 0;
	var showLives = document.getElementById('lives');

	buttons = function () {
		buttons = document.getElementById('buttons');
		letters = document.createElement('ul');

		for (var i = 0; i < alphabet.length; i++) {
			letters.id = 'alphabet';
			letter = document.createElement('li');
			letter.id = 'letter';
			letter.innerHTML = alphabet[i];
			onClickListener();
			letters.appendChild(letter);
			buttons.appendChild(letters);

		}
	};

	createHiddenPhrase = function () {
		phraseHolder = document.getElementById('phrase_holder');
		hiddenPhrase = document.createElement('ul');

		for (var i = 0; i < chosenPhrase.length; i++) {
			hiddenPhrase.setAttribute('id', 'phrase');
			hiddenLetter = document.createElement('li');
			if (chosenPhrase[i] === '-') {
				hiddenLetter.innerHTML = '--';
				spaces += 1;
			} else if (chosenPhrase[i] === ',') {
				hiddenLetter.innerHTML = ',';
				commas += 1;
			} else {
				hiddenLetter.innerHTML = '_';
			}

			hiddenLettersList.push(hiddenLetter);
			phraseHolder.appendChild(hiddenPhrase);
			hiddenPhrase.appendChild(hiddenLetter);
		}
	};

	checkScore = function () {
		showLives.innerHTML = 'Vidas restantes: ' + lives;
		if (lives < 1) {
			$('#loose').modal('show');
		}
		for (var i = 0; i < hiddenLettersList.length; i++) {
			if (guessedLetters + spaces + commas === hiddenLettersList.length) {
				$('#win').modal('show');
			}
		}
	};

	getCanvas =  function(){
		hangman = document.getElementById('hangman');
		context = hangman.getContext('2d');
		context.beginPath();
		context.lineWidth = 2;
	};

	draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
	    context.moveTo($pathFromx, $pathFromy);
	    context.lineTo($pathTox, $pathToy);
	    context.stroke();
	};

	head = function(){
		hangman = document.getElementById('hangman');
		context = hangman.getContext('2d');
		context.beginPath();
		context.arc(60, 25, 10, 0, Math.PI*2, true);
		context.stroke();
	};

	frame1 = function() {
		draw (0, 150, 150, 150);
	};

	frame2 = function() {
		draw (10, 0, 10, 600);
	};

	frame3 = function() {
		draw (0, 5, 70, 5);
	};

	frame4 = function() {
		draw (60, 5, 60, 15);
	};

	torso = function() {
		draw (60, 36, 60, 70);
	};

	rightArm = function() {
		draw (60, 46, 100, 50);
	};

	leftArm = function() {
		draw (60, 46, 20, 50);
	};

	rightLeg = function() {
		draw (60, 70, 100, 100);
	};

	leftLeg = function() {
		draw (60, 70, 20, 100);
	};

	hangmanParts = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1];

	onClickListener = function () {
		letter.onclick = function () {
			var chosenLetter = (this.innerHTML);
			this.setAttribute('class', 'active');
			this.onclick = null;
			for (var i = 0; i < chosenPhrase.length; i++) {
				if (chosenPhrase[i] === chosenLetter) {
					hiddenLettersList[i].innerHTML = chosenLetter;
					guessedLetters += 1;
				}
			}
			var index = (chosenPhrase.indexOf(chosenLetter));
			if (index === -1) {
				lives -= 1;
				hangmanParts[lives]();
			}
			checkScore();
		};
	};

	play = function () {
		chosenPhrase = assertion.replace(/\s/g, '-');
		buttons();
		getCanvas();
		createHiddenPhrase();
		checkScore();
	};

	play();

};
