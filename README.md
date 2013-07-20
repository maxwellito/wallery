wallery
=======

Wall + Gallery = Wallery

Wallery is a little PHP script made to generate a map of picture. You give a list of pictures (with URL and dimensions) and the script will made a wall of the size you want.
Combined to a frontend to create an infinite wall. Based on 4 maps, the javascript class move the pictures to give the impression of an infinite wall.

This repository content an exemple of usage (with pictures).
http://maxwellito.com/media/wallery/

Usage
-----

You need to create a Wallery object with :
- the list of picture (the same structure as in data_regular.php)
- the size of a unite (it's the size of the small square in the mozaic)
- the width of the map
- the height of the map


Future improuvements
--------------------

Review algorith code of the Wallery (PHP) class : too heavy
Use an anonymous function to make the rendering of each image.
Transform the JavaScript class into a jQuery plugin
Review the alerts in the JavaScript class