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

"use strict" ;



const asyncKit = require( 'async-kit' ) ;
const string = require( 'string-kit' ) ;
const termkit = require( 'terminal-kit' ) ;
const term = termkit.realTerminal ;

//const notifications = require( 'freedesktop-notifications' ) ;
//notifications.setAppName( 'wfm' ) ;

const path = require( 'path' ) ;

const minimist = require( 'minimist' ) ;
const glob = require( 'glob' ) ;

const ubenchPackage = require( '../package.json' ) ;

function noop() {}



const ubench = {} ;
module.exports = ubench ;



ubench.cli = () => {
	var i , iMax , args , v , package_ , benchFiles ;
	//var context = {} ;

	var runtime = {
		warmupTimeout: 500 ,
		coolDownTimeout: 500 ,
		benchTimeout: 2000 ,
		count: 1 ,
		benchFn: {} ,
		grep: []
	} ;

	term.bold.magenta( 'ubench' ).dim( ' v%s by Cédric Ronvel\n\n' , ubenchPackage.version ) ;

	// Manage command line arguments
	args = minimist( process.argv.slice( 2 ) ) ;

	if ( args.h || args.help ) {
		ubench.usage() ;
		process.exit() ;
		return ;
	}

	if ( args.fastest ) {
		runtime.warmupTimeout = 50 ;
		runtime.coolDownTimeout = 50 ;
		runtime.benchTimeout = 250 ;
	}
	else if ( args.faster ) {
		runtime.warmupTimeout = 100 ;
		runtime.coolDownTimeout = 100 ;
		runtime.benchTimeout = 500 ;
	}
	else if ( args.fast ) {
		runtime.warmupTimeout = 200 ;
		runtime.coolDownTimeout = 200 ;
		runtime.benchTimeout = 1000 ;
	}

	if ( args.b && ( v = parseInt( args.b , 10 ) ) ) { runtime.benchTimeout = v ; }
	if ( args.w && ( v = parseInt( args.w , 10 ) ) ) { runtime.warmupTimeout = v ; }
	if ( args.c && ( v = parseInt( args.c , 10 ) ) ) { runtime.coolDownTimeout = v ; }
	if ( args.n && ( v = parseInt( args.n , 10 ) ) ) { runtime.count = v ; }

	// Turn string into regexp for the "grep" feature
	if ( Array.isArray( args.g ) ) {
		for ( i = 0 , iMax = args.g.length ; i < iMax ; i ++ ) {
			runtime.grep[ i ] = new RegExp( args.g[ i ] , 'i' ) ;
		}
	}
	else if ( args.g ) {
		runtime.grep[ 0 ] = new RegExp( args.g , 'i' ) ;
	}


	if ( args._.length ) {
		benchFiles = args._.map( e => path.isAbsolute( e ) ? e : process.cwd() + '/' + e ) ;
	}
	else {
		// Require the package.json
		try {
			package_ = require( process.cwd() + '/package.json' ) ;
		}
		catch ( error ) {
			if ( error.code === 'MODULE_NOT_FOUND' ) { ubench.exitError( "No package.json found.\n" ) ; }
			else { ubench.exitError( "Error in the package.json: %E\n" , error ) ; }
		}

		// Get the bench directory
		if ( ! package_.directories || ! package_.directories.bench ) {
			ubench.exitError( "The package.json miss a directories.bench path, set to the directory containing bench files.\n" ) ;
		}

		// Load all bench files
		benchFiles = glob.sync( process.cwd() + '/' + package_.directories.bench + '/*js' ) ;
	}

	// Register to global
	global.benchmark = ubench.registerBenchmark.bind( runtime ) ;
	global.competitor = ubench.registerCompetitor.bind( runtime ) ;

	if ( ! global.gc ) {
		term.red( 'Cannot run the garbage collector manually\n\n' ) ;
		global.gc = function() {} ;
	}

	try {
		for ( i = 0 , iMax = benchFiles.length ; i < iMax ; i ++ ) {
			require( benchFiles[ i ] ) ;
		}
	}
	catch ( error ) {
		ubench.exitError( "Error in the bench file '" + benchFiles[ i ] + "': %E\n" , error ) ;
	}


	if ( args.check ) {
		ubench.check( runtime ) ;
	}


	ubench.init( () => {
		// Remove console.log and error
		console.log = console.error = noop ;
		ubench.run( runtime ) ;
	} ) ;
} ;



ubench.usage = () => {
	term.blue( "Usage is: ubench [<benchmark file1>] [<benchmark file2>] [...] [<option1>] [<option2>] [...]\n" ) ;
	term.blue( "Available options:\n" ) ;
	term.blue( "  -g           Grep by Benchmark name (can be used multiple times)\n" ) ;
	term.blue( "  -b           Benchmark timeout (default: 5000ms)\n" ) ;
	term.blue( "  -w           Warmup timeout (default: 1000ms)\n" ) ;
	term.blue( "  -c           Cool-down timeout (default: 1000ms)\n" ) ;
	term.blue( "  -n           Number of time each benchmark should be done (default: 1)\n" ) ;
	term.blue( "  --fast       Shortcut for options ^/-b 1000 -c 200 -w 200^:\n" ) ;
	term.blue( "  --faster     Shortcut for options ^/-b 500 -c 100 -w 100^:\n" ) ;
	term.blue( "  --fastest    Shortcut for options ^/-b 250 -c 50 -w 50^:\n" ) ;
	term.blue( "  --jx         Run jx (jxcore) instead of node for the benchmark\n" ) ;
	term.blue( "  -h , --help  Show this help\n" ) ;
	term.blue( "\n" ) ;
} ;



ubench.init = callback => {
	//notifications.init( callback ) ;
	callback() ;
} ;



ubench.exitError = ( ... args ) => {
	var message = string.format( ... args ) ;

	term.bold.red( message ) ;

	/*
	notifications.createNotification( {
		summary: 'ubench: error' ,
		body: message ,
		icon: 'dialog-warning'
	} ).push() ;
	*/

	process.exit( 1 ) ;
} ;



ubench.check = runtime => {
	Object.keys( runtime.benchFn ).forEach( benchName => {

		term( '^_^y== Benchmark: ^Y^/%s^:^y^_ ==\n' , benchName ) ;

		Object.keys( runtime.benchFn[ benchName ] ).forEach( benchCompetitor => {

			term( "^M^/^_%s^:: " , benchCompetitor ) ;

			try {
				term.noFormat( string.inspect( { style: 'color' } , runtime.benchFn[ benchName ][ benchCompetitor ]() ) ) ;
			}
			catch ( error ) {
				term( "^R^+Error!^ %E" , runtime.benchFn[ benchName ][ benchCompetitor ]() ) ;
			}
		} ) ;
	} ) ;

	term( '\n' ) ;
	term.styleReset() ;
	process.exit() ;
} ;



ubench.run = runtime => {
	asyncKit.foreach( runtime.benchFn , ( e , benchName , outerForeachCallback ) => {

		term( '^_^y== Benchmark: ^Y^/%s^:^y^_ ==\n' , benchName ) ;

		asyncKit.map( e , ( benchFn , benchCompetitor , innerForeachCallback ) => {

			var benchMethod = ubench.doOneBench ;

			// Force the GC now!
			term.column.eraseLine( 1 , "^M^/%s^: -- ^g^+GARBAGE COLLECTION^:" , benchCompetitor ) ;
			global.gc() ;
			term.column.eraseLine( 1 , "^M^/%s^: -- ^C^+COOLDOWN^:" , benchCompetitor ) ;

			setTimeout( () => {

				term.column.eraseLine( 1 , "^M^/%s^: -- ^Y^+WARMUP^:" , benchCompetitor ) ;

				benchMethod( benchFn , runtime.warmupTimeout , () => {


					// Force the GC now!
					term.column.eraseLine( 1 , "^M^/%s^: -- ^g^+GARBAGE COLLECTION^:" , benchCompetitor ) ;
					global.gc() ;
					term.column.eraseLine( 1 , "^M^/%s^: -- ^C^+COOLDOWN^:" , benchCompetitor ) ;

					setTimeout( () => {

						//var startMemory , endMemory ;

						term.column.eraseLine( 1 , "^M^/%s^: -- ^R^+BENCHMARKING^:" , benchCompetitor ) ;

						//startMemory = process.memoryUsage().heapUsed ;

						benchMethod( benchFn , runtime.benchTimeout , innerForeachCallback ) ;

						/*
							benchMethod( benchFn , runtime.benchTimeout , function( error , result ) {

								term.column.eraseLine( 1 , "^M^/%s^: -- ^C^+COOLDOWN^:" , benchCompetitor ) ;

								// Force the GC now!
								global.gc() ;
								//endMemory = process.memoryUsage().heapUsed ;
								//result.memoryLeak = endMemory - startMemory ;

								setTimeout( innerForeachCallback.bind( undefined , error , result ) , runtime.coolDownTimeout / 2 ) ;
							} ) ;
							//*/
					} , runtime.coolDownTimeout
					) ;
				} ) ;
			} , runtime.coolDownTimeout / 2 ) ;
		} )
			.parallel( 1 )
			.exec( ( error , results ) => {

				var benchCompetitor , fastest = 0 , col = 0 ;

				//var paddingLeak = 0 , numLeak ;

				if ( error ) { outerForeachCallback( error ) ; return ; }

				for ( benchCompetitor in results ) {
					if ( results[ benchCompetitor ].opsPerSecond > fastest ) { fastest = results[ benchCompetitor ].opsPerSecond ; }
					if ( benchCompetitor.length > col ) { col = benchCompetitor.length ; }

					/*
					numLeak = '' + results[ benchCompetitor ].memoryLeak ;
					if ( numLeak.length > paddingLeak ) { paddingLeak = numLeak.length ; }
					*/
				}

				col += 3 ;

				for ( benchCompetitor in results ) {
					term.column.eraseLine( 1 , '^M^/%s^:' , benchCompetitor ) ;

					term.column( col , '^B%[.2!L15]f^b ops/s   ' , results[ benchCompetitor ].opsPerSecond ) ;

					if ( results[ benchCompetitor ].opsPerSecond < fastest ) {
						term( ' ^B%[.1L4]f%%^ ' , 100 * results[ benchCompetitor ].opsPerSecond / fastest ) ;
					}
					else {
						term( '^R^+^_FASTEST^:' ) ;
					}

					term( '   ^B%[L8]kB^b   ' , results[ benchCompetitor ].memory ) ;

					// The gc do not want to do the job on demand, so it's not possible to check memory leak ATM
					/*
					numLeak = '' + results[ benchCompetitor ].memoryLeak ;
					if ( numLeak.length < paddingLeak ) { numLeak = ' '.repeat( paddingLeak - numLeak.length ) + numLeak ; }
					term( '   ^B%s^b leak   ' , numLeak ) ;
					*/

					term( '^:\n' ) ;
				}

				term( '\n' ) ;

				outerForeachCallback() ;
			} ) ;

	} )
		.nice( 10 )
		.exec( () => {

			runtime.count -- ;

			if ( runtime.count ) {
				ubench.run( runtime ) ;
				return ;
			}

			term.styleReset() ;
			process.exit() ;
		} ) ;
} ;



ubench.doOneBench = ( benchFn , timeout , callback ) => {
	var count , startTime , endTime , maxEndTime , startMemory , endMemory ;

	/*
	var fnThis = Object.create( null ) ;
	//benchFn = benchFn.bind( fnThis ) ;
	//*/

	startMemory = process.memoryUsage().heapUsed ;

	// We do not want to mesure the for loop speed, so we run at least 100 times the bench function
	for ( count = 0 , startTime = Date.now() , maxEndTime = startTime + timeout ; ( endTime = Date.now() ) < maxEndTime ; count += 100 ) {
		//*
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
		//*/

		/*
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ; benchFn.call( fnThis ) ;
		//*/
	}

	endMemory = process.memoryUsage().heapUsed ;

	//console.log( count , startTime , endTime , endTime - startTime ) ;
	callback( undefined , {
		opsPerSecond: 1000 * count / ( endTime - startTime ) ,
		memory: endMemory - startMemory
	} ) ;
} ;





/* User-land global functions */



var intoBenchmark = null ;
var fnThis = Object.create( null ) ;

ubench.registerBenchmark = function benchmark( benchName , fn ) {
	var i , iMax ;

	if ( ! benchName || typeof benchName !== 'string' || typeof fn !== 'function' ) {
		throw new Error( "Usage is benchmark( name , fn )" ) ;
	}

	// Filter out benchmarks that are not relevant
	for ( i = 0 , iMax = this.grep.length ; i < iMax ; i ++ ) {
		if ( ! benchName.match( this.grep[ i ] ) ) { return ; }
	}

	if ( ! this.benchFn[ benchName ] ) { this.benchFn[ benchName ] = {} ; }

	intoBenchmark = benchName ;
	fn.call( fnThis ) ;
	intoBenchmark = null ;
} ;



ubench.registerCompetitor = function competitor( benchCompetitor , fn ) {
	if ( ! benchCompetitor || typeof benchCompetitor !== 'string' || typeof fn !== 'function' ) {
		throw new Error( "Usage is competitor( name , fn )" ) ;
	}

	if ( ! intoBenchmark ) {
		throw new Error( "competitor() should be called from within a benchmark() callback" ) ;
	}

	// This cause raw power loss on small bench (like a "i++" bench), but this produce more stable result.
	// Otherwise, some competitor would run faster (sometime twice as fast) for no reason at all
	// (even if the code is a copy-paste of another one, which run 2 times slower for some unknown reasons).
	// Also benchmarks consume far less memory this way.
	this.benchFn[ intoBenchmark ][ benchCompetitor ] = fn.bind( fnThis ) ;

	//this.benchFn[ intoBenchmark ][ benchCompetitor ] = fn ;
	//this.benchFn[ intoBenchmark ][ benchCompetitor ] = fn.bind( Object.create( null ) ) ;
	//this.benchFn[ intoBenchmark ][ benchCompetitor ] = fn.bind( undefined ) ;
} ;

