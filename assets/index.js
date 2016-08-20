'use strict';

var Timer = function(defaultSessionSeconds, defaultBreakSeconds){
	var sliceDOM = $('#slice'),
		counterDOM = $('.counter').find('p'),
		titleDOM = $('#title'),
		pulseDOM = $('#pulse'),
		sessionMinTensDOM = $('#session-minutes-tens'),
		sessionMinOnesDOM = $('#session-minutes-ones'),
		sessionSecTensDOM = $('#session-seconds-tens'),
		sessionSecOnesDOM = $('#session-seconds-ones'),
		audioDOM = document.getElementById("notification"),
		txtColor = 'white',
		bgColor = '#263238',
		timerType = 'session',
		audio = '',
		audioEnabled = 'true',
		totalSessionSeconds = defaultSessionSeconds,
		totalBreakSeconds = defaultBreakSeconds,
		sectionTotalSeconds = 0,
		sectionRemainingSeconds = 0,
		isInit = false, //allow update of main timer only if it's never been started once
		interval = '',
		isActive = false;

	//max time is 5999
	if (totalSessionSeconds > 5999){
		totalSessionSeconds = 5999;
	}
	if (totalBreakSeconds > 5999){
		totalBreakSeconds = 5999;
	}

	return {
		updateCounter: function(){
			var secPrefix = '',
          		minPrefix = '',
          		minutesToRefresh = Math.floor(sectionRemainingSeconds/60),
	      		secondsToRefresh = sectionRemainingSeconds % 60;
	      
	      	if (secondsToRefresh < 10){
	        	secPrefix = '0';
	      	}
	      	if (minutesToRefresh < 10){
	        	minPrefix = '0';
	      	}
	      
	      	counterDOM.text(minPrefix + minutesToRefresh + ':' + secPrefix + secondsToRefresh);
		},

		updateClock: function(){
			//remainingSeconds/totalSeconds = x/360 degrees
			var degrees = (sectionRemainingSeconds/sectionTotalSeconds) * 360;

			//change title at start of section
			if (degrees === 360){
				if (timerType === 'session'){
					titleDOM.text('Session');
				} else {
					titleDOM.text('Break');
				}
			}

			//linear gradient method adapted from SO - Sampson
			if (degrees === 0){
				sliceDOM.css({
					'background-color' : '#263238'
				});
			} else if (degrees <= 180){
				//(0-50%] - (90-270deg]
				degrees += 90;
				sliceDOM.css({
					'background-color' : txtColor,
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, ' + bgColor + ' 50%),linear-gradient(90deg, ' + bgColor + ' 50%, transparent 50%)'
				});
			} else if (degrees < 360) {
				degrees -= 90;
				//[50-100%) - [90-270deg)
				sliceDOM.css({
					'background-color' : txtColor,
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, white 50%),linear-gradient(90deg, '+ bgColor + ' 50%, transparent 50%)'
				});
			} else {
				//100%
				sliceDOM.css({
					'background-image' : 'none',
					'background-color' : txtColor
				});	
			} 
			//update counter
			this.updateCounter();
			
			if (sectionRemainingSeconds === 0){
				this.startStop();
				console.log(timerType + ' time\'s up.');
				//animation
				pulseDOM.addClass('pulse');
				window.setTimeout(function(){
					$('#pulse').removeClass('pulse');
				}, 1000);

				if (timerType === 'session'){
					this.playAudio();
					timerType = 'break';
					sectionRemainingSeconds = totalBreakSeconds;
					sectionTotalSeconds = totalBreakSeconds;
					this.startStop();
				} else {
					this.playAudio();
					timerType = 'session';
					sectionRemainingSeconds = totalSessionSeconds;
					sectionTotalSeconds = totalSessionSeconds;
					this.startStop();
				}
			} else {
				sectionRemainingSeconds--;
				console.log(sectionRemainingSeconds+1 + ' seconds remaining.');
			}
		},

		startStop: function(){
			isInit = true;
			
			if (isActive){
				//stop
				window.clearInterval(interval);
				isActive = false;
			} else {
				//start
	          	interval = window.setInterval(this.updateClock.bind(this), 1000);
	          	isActive = true;
	        }
		},

		playAudio: function(){
			if (audioEnabled){
				audioDOM.pause();
				audioDOM.currentTime = 0;
				audioDOM.play();
			}
		},

		setAudio: function(sfx){
			switch(sfx){
				case 'off':
					audioEnabled = false;
					break;
				case 'chime':
					audioDOM.src = 'audio/chime.mp3';
					audioEnabled = true;
					break;
				case 'bleep':
					audioDOM.src = 'audio/bleep.mp3';
					audioEnabled = true;
					break;
				case 'moo':
					audioDOM.src = 'audio/moo.mp3';
					audioEnabled = true;
					break;
			}
		},

		setSettingsTimer: function(data, type){
			console.log(isInit);

			data = data.toString();
			
			var operation = data.slice(0, 1),
				amount = Number(data.slice(1)),
				digits = 0,
				tempTotalSeconds = 0;

			if (type === 'session'){
				digits = this.parseFourDigits(totalSessionSeconds);
				tempTotalSeconds = totalSessionSeconds;
			} else {
				digits = this.parseFourDigits(totalBreakSeconds);
				tempTotalSeconds = totalBreakSeconds;
			}

			//console.log(operation +':'+ digits);
			if (operation === '+'){
				switch(amount){
					case 1:
						tempTotalSeconds = (digits[3] === 9) ? tempTotalSeconds -= 9 : tempTotalSeconds += 1;
						break;
					case 10:
						tempTotalSeconds = (digits[2] === 5) ? tempTotalSeconds -= 50 : tempTotalSeconds += 10;
						break;
					case 60:
						tempTotalSeconds = (digits[1] === 9) ? tempTotalSeconds -= 540 : tempTotalSeconds += 60;
						break;
					case 600:
						tempTotalSeconds = (digits[0] === 9) ? tempTotalSeconds -= 5400 : tempTotalSeconds += 600;
						break;
				}
			} else {
				switch(amount){
					case 1:
						tempTotalSeconds = (digits[3] === 0) ? tempTotalSeconds += 9 : tempTotalSeconds -= 1;
						break;
					case 10:
						tempTotalSeconds = (digits[2] === 0) ? tempTotalSeconds += 50 : tempTotalSeconds -= 10;
						break;
					case 60:
						tempTotalSeconds = (digits[1] === 0) ? tempTotalSeconds += 540 : tempTotalSeconds -= 60;
						break;
					case 600:
						tempTotalSeconds = (digits[0] === 0) ? tempTotalSeconds += 5400 : tempTotalSeconds -= 600;
						break;
				}
			}

			//set settings counter
			if (type === 'session'){
				totalSessionSeconds = tempTotalSeconds;
				this.setParsedSessionDigits(this.parseFourDigits(totalSessionSeconds));
			} else {
				totalBreakSeconds = tempTotalSeconds;
				this.setParsedBreakDigits(this.parseFourDigits(totalBreakSeconds));
			}

			if (!isInit){
				sectionRemainingSeconds = totalSessionSeconds;
				sectionTotalSeconds = totalSessionSeconds;
				if (sectionTotalSeconds === 0){
					this.updateCounter();
				} else {
					this.updateClock();
				}
			}
		},

		setParsedSessionDigits: function(parsedDigits){
			sessionMinTensDOM.text(parsedDigits[0]);
			sessionMinOnesDOM.text(parsedDigits[1]);
			sessionSecTensDOM.text(parsedDigits[2]);
			sessionSecOnesDOM.text(parsedDigits[3]);
		},

		setParsedBreakDigits: function(parsedDigits){
			$('#break-minutes-tens').text(parsedDigits[0]);
			$('#break-minutes-ones').text(parsedDigits[1]);
			$('#break-seconds-tens').text(parsedDigits[2]);
			$('#break-seconds-ones').text(parsedDigits[3]);
		},

		parseFourDigits: function(seconds){
			var secOnes = 0,
				secTens = 0,
          		minOnes = 0,
          		minTens = 0;
          	
          	minTens = Math.floor(seconds / 60 / 10);
          	minOnes = Math.floor((seconds / 60) % 10);
          	var leftoverSecs = seconds - (minTens * 600 + minOnes * 60);
          	secTens = Math.floor(leftoverSecs / 10);
          	secOnes = Math.floor(leftoverSecs % 10);

          	return ([minTens, minOnes, secTens, secOnes]);
		},

		init: function(){
			//audio
			this.setAudio($('input[name=sfx]:checked', '#sfx').val());

			//set settings counters
			this.setParsedSessionDigits(this.parseFourDigits(totalSessionSeconds));

			this.setParsedBreakDigits(this.parseFourDigits(totalBreakSeconds));

			//set main counter
			sectionRemainingSeconds = totalSessionSeconds;
			sectionTotalSeconds = totalSessionSeconds;
			this.updateClock();
		}
	};
};

$(document).ready(function(){
	var myTimer = new Timer(3, 5); //max 5999 seconds
	myTimer.init();

	$('.btn-clock').on('click', function(e){
		e.preventDefault();
		myTimer.startStop();
	});

	$('.edit-timer').on('click', function(e){
		e.preventDefault();
		myTimer.setSettingsTimer($(this).data('edit'), $(this).data('type'));
	});

	$('#sfx input').on('change', function() {
   		myTimer.setAudio($('input[name=sfx]:checked', '#sfx').val());
	});

});