
/* global benchmark, competitor */

"use strict" ;



const ALLOWED_CHARS = [
    'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' ,
    'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,
    'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' ,
    'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
    '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,
] ;

function randomString( minLength , maxLength = minLength ) {
	var str = '' ,
		length = minLength + Math.floor( Math.random() * ( maxLength - minLength ) ) ;

	for ( let i = 0 ; i < length ; i ++ ) {
		str += ALLOWED_CHARS[ Math.floor( Math.random() * ALLOWED_CHARS.length ) ] ;
	}

	return str ;
}



benchmark( 'Key iteration over Object and Map (performing a sum)' , () => {
	var keyCount = 1000 ,
		object = {} ,
		map = new Map() ;

	for ( let i = 0 ; i < keyCount ; i ++ ) {
		let key = randomString( 6 , 20 ) ;
		let value = Math.random() * 1000 ;
		object[ key ] = value ;
		map.set( key , value ) ;
	}

	competitor( "Using the 'for .. in' loop" , () => {
		var sum = 0 ;
		for ( let key in object ) {
			sum += object[ key ]
		}
		return sum ;
	} ) ;

	competitor( "Using the 'for .. of' loop with Object.keys()" , () => {
		var sum = 0 ;
		for ( let key of Object.keys( object ) ) {
			sum += object[ key ]
		}
		return sum ;
	} ) ;

	competitor( "Using Object.keys().forEach()" , () => {
		var sum = 0 ;
		Object.keys( object ).forEach( key => sum += object[ key ] ) ;
		return sum ;
	} ) ;

	competitor( "Using the 'for .. of' loop with Map#keys()" , () => {
		var sum = 0 ;
		for ( let key of map.keys( map ) ) {
			sum += map.get( key ) ;
		}
		return sum ;
	} ) ;

	competitor( "Using the 'for .. of' loop with Map#entries()" , () => {
		var sum = 0 ;
		for ( let [ key , value ] of map.entries( map ) ) {
			sum += value ;
		}
		return sum ;
	} ) ;

	competitor( "Using Map#forEach()" , () => {
		var sum = 0 ;
		map.forEach( ( value , key ) => sum += value ) ;
		return sum ;
	} ) ;
} ) ;

