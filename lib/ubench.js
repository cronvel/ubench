/*
	The Cedric's Swiss Knife (CSK) - CSK bench

	Copyright (c) 2016 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/



// Load modules
var minimist = require( 'minimist' ) ;
var glob = require( 'glob' ) ;
var string = require( 'string-kit' ) ;
var termkit = require( 'terminal-kit' ) ;
var term = termkit.terminal ;

var notifications = require( 'freedesktop-notifications' ) ;
notifications.setAppName( 'wfm' ) ;

var ubenchPackage = require( '../package.json' ) ;



var ubench = {} ;
module.exports = ubench ;



ubench.cli = function cli()
{
	var args , command , commandFile , package_ , benchFiles ;
	
	term.bold.magenta( 'ubench' ).dim( ' v%s by Cédric Ronvel\n\n' , ubenchPackage.version ) ;
	
	args = minimist( process.argv.slice( 2 ) ) ;
	
	// Require the package.json (mandatory)
	try {
		package_ = require( process.cwd() + '/package.json' ) ;
	}
	catch ( error ) {
		if ( error.code === 'MODULE_NOT_FOUND' ) { ubench.exitError( "No package.json found.\n" ) ; }
		else { ubench.exitError( "Error in the package.json: %E\n" , error ) ; }
	}
	
	// Get the bench directory
	if ( ! package_.directories && ! package_.directories.bench )
	{
		ubench.exitError( "The package.json miss a directories.bench path, set to the directory containing bench files" ) ;
	}
	
	// Load all bench files
	benchFiles = glob.sync( process.cwd() + '/' + package_.directories.bench + '/*js' ) ;
	
	try {
		for ( i = 0 , iMax = benchFiles.length ; i < iMax ; i ++ )
		{
			require( benchFiles[ i ] ) ;
		}
	}
	catch ( error ) {
		ubench.exitError( "Error in the bench file '" + benchFiles[ i ] + "': %E\n" , error ) ;
	}
	
	ubench.init( function() {
		ubench.run() ;
	} ) ;
} ;



ubench.init = function init( callback )
{
	notifications.init( callback ) ;
} ;



ubench.usage = function usage()
{
	term( "Usage is: ubench [<batch>] [<test>] [<option1>] [<option2>] [...]\n" ) ;
} ;



ubench.exitError = function exitError()
{
	var message = string.format.apply( null , arguments ) ;
	
	term.bold.red( message ) ;
	
	notifications.createNotification( {
		summary: 'ubench: error' ,
		body: message ,
		icon: 'dialog-warning'
	} ).push() ;
	
	process.exit( 1 ) ;
} ;



ubench.run = function run( callback )
{
	process.exit() ;
} ;




