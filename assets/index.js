'use strict';

var Timer = function(defaultSessionSeconds, defaultBreakSeconds){
	var sliceDOM = $('#slice'),
		counterDOM = $('.counter').find('p'),
		titleDOM = $('#title'),
		pulseDOM = $('#pulse'),
		txtColor = 'white',
		bgColor = '#263238',
		timerType = 'session',
		totalSessionSeconds = defaultSessionSeconds,
		totalBreakSeconds = defaultBreakSeconds,
		sectionTotalSeconds = 0,
		sectionRemainingSeconds = 0,
		interval = '',
		isActive = false;

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
					document.getElementById("notification").play();
					timerType = 'break';
					sectionRemainingSeconds = totalBreakSeconds;
					sectionTotalSeconds = totalBreakSeconds;
					this.startStop();
				} else {
					document.getElementById("notification").play();
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

		setSeconds: function(newSeconds){
			if (newSeconds){
				totalSessionSeconds += 2;
			}
			this.updateClock();
		},

		setSession: function(data){
			console.log(data);
		},

		init: function(){
			sectionRemainingSeconds = totalSessionSeconds;
			sectionTotalSeconds = totalSessionSeconds;
			$('#session-seconds-ones').text(5);
			this.updateClock();
		}
	};
};

$(document).ready(function(){
	var myTimer = new Timer(3, 5);
	myTimer.init();

	$('.btn-clock').on('click', function(e){
		e.preventDefault();
		myTimer.startStop();
	});

	$('.edit-session').on('click', function(e){
		e.preventDefault();
		myTimer.setSession($(this).data('edit'));
	});

	$('#minus').on('click', function(e){
		e.preventDefault();
		//myTimer.setSeconds(false);
	});
});