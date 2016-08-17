'use strict';

var Timer = function(){
	var slice = $('#slice'),
		seconds = 0; //0-59

	return {
		drawSlice: function(seconds){
			//1/60 seconds = 6/360 degrees
			var degrees = 6 * seconds + 90;

			if (seconds <= 30){
				//.slice-right is used for 0-50% (90-270deg)
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, white 50%),linear-gradient(90deg, white 50%, transparent 50%)'
				});
			} else {
				degrees -= 180;
				console.log(degrees);
				//90-270 for 50-100%
				slice.css({
					'background-image' :
        				'linear-gradient(' + degrees +
        				'deg, transparent 50%, green 50%),linear-gradient(90deg, white 50%, transparent 50%)'
				});
			}
		}
	};
};

$(document).ready(function(){
	var myTimer = new Timer();

	var percent = 29;

	$('#plus').on('click', function(e){
		e.preventDefault();
		percent++;
		$('.percent').find('p').text(percent);
		myTimer.drawSlice(percent);
	});

	$('#minus').on('click', function(e){
		e.preventDefault();
		percent--;
		$('.percent').find('p').text(percent);
		myTimer.drawSlice(percent);
	});
});