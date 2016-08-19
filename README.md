Pomodoro Clock [WIP]
====================

- Drawing the circular progress ring was achieved by using two variations of CSS background-image: linear-gradient. The angles of these gradients allow you to draw pie segments from 0-180 degrees on the right half, and 180-360 on the left (adapted from http://jsfiddle.net/jonathansampson/7PtEm/). 

   At certain scales, particularly in IE, there is a noticeable vertical line down the middle at 0 and 100%, which required two extra cases to simply draw a solid background-color and remove the gradient. A second, smaller circular div is placed on top to act as a mask and create the ring.

Audio Credits
-------------

- chime: https://www.freesound.org/people/hykenfreak/sounds/202029/

- bleep: https://www.freesound.org/people/JustinBW/sounds/80921/

- moo: https://www.freesound.org/people/JarredGibb/sounds/233134/
