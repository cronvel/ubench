
"use strict" ;



benchmark( 'Object vs Set iteration' , () => {

	var object = {} , set_ = new Set() ;

	for ( let i = 0 ; i < 1000 ; i ++ ) {
		object[ 'key_' + i ] = i ;
		set_.add( i ) ;
	}

	competitor( 'Object using for .. in loop' , () => {
		var k , acc = 0 ;
		for ( k in object ) {
			acc += object[ k ] ;
		}
		return acc ;
	} ) ;

	competitor( 'Object using for .. of and Object.values() loop' , () => {
		var v , acc = 0 ;
		for ( v of Object.values( object ) ) {
			acc += v ;
		}
		return acc ;
	} ) ;

	competitor( 'Set using for .. of loop' , () => {
		var v , acc = 0 ;
		for ( v of set_ ) {
			acc += v ;
		}
		return acc ;
	} ) ;
} ) ;

