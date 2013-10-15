wallery
=======

Wall + Gallery = Wallery

Wallery was a little PHP script made to generate a map of picture, but forget that, now it's in JavaScript. The idea is simple, you give a list of displayable objects (might be pictures, videos, iframe.. we just need their dimensions) and the script will generate a wall of the size you want.
In this demo, 4 maps are generated, then a jQuery plugin control them to create an infinite wall.

This repository content an exemple of usage (with pictures).
http://maxwellito.com/media/wallery/

Usage
-----

You need to create a Wallery object with :
- displayable items list (widht, height and a custom data)
- unit size (it's the size of the small square unit in the wall)
- map dimensions (width and height)


Future improuvements
--------------------

Switch to Grunt and build tests