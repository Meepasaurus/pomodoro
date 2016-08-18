'use strict';

var Timer = function(defaultWorkSeconds, defaultBreakSeconds, sliceDOM, counterDOM){
	var slice = sliceDOM,
		counter = counterDOM,
		timerType = 'work',
		totalWorkSeconds = defaultWorkSeconds,
		totalBreakSeconds = defaultBreakSeconds,
		sectionTotalSeconds = 0,
		sectionRemainingSeconds = 0,
		//remainingWorkSeconds = totalWorkSeconds,
		//remainingBreakSeconds = totalBreakSeconds,
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
	      
	      	counter.text(minPrefix + minutesToRefresh + ':' + secPrefix + secondsToRefresh);
		},

		updateClock: function(){
			//remainingSeconds/totalSeconds = x/360 degrees
			var degrees = (sectionRemainingSeconds/sectionTotalSeconds) * 360;

			//linear gradient method adapted from SO - Sampson
			if (degrees <= 180){
				//0-50% (90-270deg)
				degrees += 90;
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, green 50%),linear-gradient(90deg, green 50%, transparent 50%)'
				});
			} else {
				degrees -= 90;
				//90-270 for 50-100%
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, white 50%),linear-gradient(90deg, green 50%, transparent 50%)'
				});
			}
			//update counter
			this.updateCounter();
			
			if (sectionRemainingSeconds === 0){
				this.startStop();
				console.log(timerType + ' time\'s up.');
				if (timerType === 'work'){
					timerType = 'break';
					sectionRemainingSeconds = totalBreakSeconds;
					sectionTotalSeconds = totalBreakSeconds;
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
				totalWorkSeconds += 2;
			}
			this.updateClock();
		},

		init: function(){
			sectionRemainingSeconds = totalWorkSeconds;
			sectionTotalSeconds = totalWorkSeconds;
			this.updateClock();
		}
	};
};

$(document).ready(function(){
	var myTimer = new Timer(3, 5, $('#slice'), $('.counter').find('p'));
	myTimer.init();

	$('.btn-clock').on('click', function(e){
		e.preventDefault();
		myTimer.startStop();
	});

	$('#plus').on('click', function(e){
		e.preventDefault();
		//myTimer.setSeconds(true);
	});

	$('#minus').on('click', function(e){
		e.preventDefault();
		//myTimer.setSeconds(false);
	});
});