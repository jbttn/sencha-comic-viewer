# README

## What is this?
A simple web application built with sencha touch in order to view comic book archives (cbz / cbr / zip / rar) on a server.

## What is the purpose?
All comic book applications for mobile devices seem to require you to place the archives on the actual device with no way to connect to a SMB or HTTP server to view the archives that way.  I have a server so I can keep all my files in one centrilized place, I don't want to copy my files onto my devices.  This is my solution to this problem, it all works through the browser so there are no files to copy.

## How does it work?
The json.php file is fed a location through a query string from the sencha app, the json.php file then navigates to this location and returns a json response with the items in the location which the javascript app processes.  The image.php file is fed a query string which it uses to navigate to and display an image from insize a zip archive.

## Bugs? Other notes?
I made this for my own personal use so the code is undocumented and very messy.  RAR archives are not supported yet.  The webserver must have access rights to the folder with your files (you also need to change the path at the top of the json.php and app.js files so match your setup).  Probably something else I've forgot about and will add later...

[Here is a sample comic to test out:](http://dl.dropbox.com/u/2303550/sample.cbz)