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
var async = require( 'async-kit' ) ;
var string = require( 'string-kit' ) ;
var termkit = require( 'terminal-kit' ) ;
var term = termkit.terminal ;

var notifications = require( 'freedesktop-notifications' ) ;
notifications.setAppName( 'wfm' ) ;

var minimist = require( 'minimist' ) ;
var glob = require( 'glob' ) ;

var ubenchPackage = require( '../package.json' ) ;



var ubench = {} ;
module.exports = ubench ;



ubench.cli = function cli()
{
	var i , iMax , args , package_ , benchFiles , context = {} ;
	
	var runtime = {
		warmupTimeout: 2000 ,
		coolDownTimeout: 3000 ,
		benchTimeout: 5000 ,
		benchFn: {}
	} ;
	
	
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
	if ( ! package_.directories || ! package_.directories.bench )
	{
		ubench.exitError( "The package.json miss a directories.bench path, set to the directory containing bench files.\n" ) ;
	}
	
	// Register to global
	global.bench = ubench.registerBenchmark.bind( runtime ) ;
	
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
		ubench.run( runtime ) ;
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



ubench.run = function run( runtime )
{
	async.foreach( runtime.benchFn , function( e , benchName , outerForeachCallback ) {
		
		term( '^y-- Running: ^Y^/%s^:^y --\n\n' , benchName ) ;
		
		async.map( e , function( benchFn , benchVariant , innerForeachCallback ) {
			
			var benchMethod = ubench.doOneBench ;
			
			term.column.eraseLine( 1 , "^M%s^m: ^C^+COOLDOWN^:" , benchVariant ) ;
			
			// Force the GC now!
			global.gc() ;
			
			setTimeout( function() {
					
				term.column.eraseLine( 1 , "^M%s^m: ^Y^+WARMUP^:" , benchVariant ) ;
				
				benchMethod( benchFn , runtime.warmupTimeout , function() {
					
					term.column.eraseLine( 1 , "^M%s^m: ^C^+COOLDOWN^:" , benchVariant ) ;
					
					// Force the GC now!
					global.gc() ;
					
					// Force the GC again! Run that lazy V8!
					setTimeout( global.gc , runtime.coolDownTimeout / 3 ) ;
					
					setTimeout( function() {
							
							term.column.eraseLine( 1 , "^M%s^m: ^R^+RUNNING^:" , benchVariant ) ;
							benchMethod( benchFn , runtime.benchTimeout , innerForeachCallback ) ;
							
						} , runtime.coolDownTimeout
					) ;
				} ) ;
			} , runtime.coolDownTimeout ) ;
		} )
		.parallel( 1 )
		.exec( function( error , results ) {
			
			var benchVariant , fastest = 0 , col = 0 , paddingOps = 0 , paddingMem = 0 , numOps , numMem , percent ;
			
			if ( error ) { outerForeachCallback( error ) ; return ; }
			
			for ( benchVariant in results )
			{
				if ( results[ benchVariant ].opsPerSecond > fastest ) { fastest = results[ benchVariant ].opsPerSecond ; }
				if ( benchVariant.length > col ) { col = benchVariant.length ; }
				
				numOps = '' + results[ benchVariant ].opsPerSecond ;
				if ( numOps.length > paddingOps ) { paddingOps = numOps.length ; }
				
				numMem = '' + results[ benchVariant ].memoryBalance ;
				if ( numMem.length > paddingMem ) { paddingMem = numMem.length ; }
			}
			
			col += 10 ;
			
			for ( benchVariant in results )
			{
				term.column.eraseLine( 1 , '    ^m* ^M^/%s^:^m : ' , benchVariant ) ;
				
				numOps = '' + results[ benchVariant ].opsPerSecond ;
				if ( numOps.length < paddingOps ) { numOps = ' '.repeat( paddingOps - numOps.length ) + numOps ; }
				
				term.column( col , '^B%s^b ops/s   ' , numOps ) ;
				
				if ( results[ benchVariant ].opsPerSecond < fastest )
				{
					percent = '' + Math.round( 100 * ( 1 - results[ benchVariant ].opsPerSecond / fastest ) ) ;
					percent = ' '.repeat( 3 - percent.length ) + percent ;
					term( '^B%s%% slower' , percent ) ;
				}
				else
				{
					term( '  ^R^+^_FASTEST^:  ' ) ;
				}
				
				
				numMem = '' + results[ benchVariant ].memoryBalance ;
				if ( numMem.length < paddingMem ) { numMem = ' '.repeat( paddingMem - numMem.length ) + numMem ; }
				
				term( '   ^B%s^b memory balance   ' , numMem ) ;
				
				/*
				if ( results[ benchVariant ].opsPerSecond < fastest )
				{
					term( '^B%i%% slower' , 100 * ( 1 - results[ benchVariant ].opsPerSecond / fastest ) ) ;
				}
				else
				{
					term( '^R^+^_FASTEST^:' ) ;
				}
				*/
				
				term( '^:\n' ) ;
			}
			
			outerForeachCallback() ;
		} ) ;
		
	} )
	.exec( function( error ) {
		term.styleReset() ;
		term( '\n' ) ;
		process.exit() ;
	} ) ;
} ;



ubench.doOneBench = function doOneBench( benchFn , timeout , callback )
{
	var count , startTime , endTime , maxEndTime , startMemory , endMemory ;
	
	startMemory = process.memoryUsage().heapUsed ;
	
	// We do not want to mesure the for loop speed, so we run at least 100 times the bench function
	for ( count = 0 , startTime = Date.now() , maxEndTime = startTime + timeout ; ( endTime = Date.now() ) < maxEndTime ; count += 100 )
	{
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
		benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ; benchFn() ;
	}
	
	endMemory = process.memoryUsage().heapUsed ;
	
	//console.log( count , startTime , endTime , endTime - startTime ) ;
	callback( undefined , {
		opsPerSecond: 1000 * count / ( endTime - startTime ) ,
		memoryBalance: endMemory - startMemory
	} ) ;
} ;





			/* User-land global functions */



ubench.registerBenchmark = function()
{
	var benchName , benchVariant , benchFn ;
	
	if ( arguments.length < 2 ) { throw new Error( "bench() need at least 2 arguments" ) ; }
	
	benchName = arguments[ 0 ] ;
	
	if ( arguments.length > 2 )
	{
		benchVariant = arguments[ 1 ] ;
		benchFn = arguments[ 2 ] ;
	}
	else
	{
		benchFn = arguments[ 1 ] ;
		benchVariant = benchFn.name || '' ;
	}
	
	if ( ! this.benchFn[ benchName ] ) { this.benchFn[ benchName ] = {} ; }
	
	this.benchFn[ benchName ][ benchVariant ] = benchFn ;
	
	//console.log( 'Registered:' , benchName , benchVariant ) ;
} ;





