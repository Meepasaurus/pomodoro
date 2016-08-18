'use strict';

var Timer = function(defaultSeconds,sliceDOM, counterDOM){
	var slice = sliceDOM,
		counter = counterDOM,
		seconds = defaultSeconds,
		interval = '',
		isActive = false;

	return {
		updateCounter: function(){
			var secPrefix = '',
          		minPrefix = '',
          		minutesToRefresh = Math.floor(seconds/60),
	      		secondsToRefresh = seconds % 60;
	      
	      	if (secondsToRefresh < 10){
	        	secPrefix = '0';
	      	}
	      	if (minutesToRefresh < 10){
	        	minPrefix = '0';
	      	}
	      
	      	counter.text(minPrefix + minutesToRefresh + ':' + secPrefix + secondsToRefresh);
		},

		updateClock: function(){
			//1/60 seconds = 6/360 degrees
			var partialSeconds = seconds % 60; //seconds remaining in the :00 part of the timer
			var degrees = 6 * partialSeconds + 90;

			//linear gradient method adapted from SO - Sampson
			if (partialSeconds <= 30){
				//0-50% (90-270deg)
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, green 50%),linear-gradient(90deg, green 50%, transparent 50%)'
				});
			} else {
				degrees -= 180;
				//90-270 for 50-100%
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, white 50%),linear-gradient(90deg, green 50%, transparent 50%)'
				});
			}
			//update counter
			this.updateCounter();
			
			if (seconds === 0){
				this.startStop();
				console.log('Time\'s up.');
			} else {
				seconds--;
				console.log(seconds+1 + ' seconds remaining.');
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
				seconds += 2;
			}
			this.updateClock();
		},

		init: function(){
			this.updateClock();
		}
	};
};

$(document).ready(function(){
	var myTimer = new Timer(125, $('#slice'), $('.counter').find('p'));
	myTimer.init();

	$('.btn-clock').on('click', function(e){
		e.preventDefault();
		myTimer.startStop();
	});

	$('#plus').on('click', function(e){
		e.preventDefault();
		myTimer.setSeconds(true);
	});

	$('#minus').on('click', function(e){
		e.preventDefault();
		myTimer.setSeconds(false);
	});
});