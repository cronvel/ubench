
/* global benchmark, competitor */

"use strict" ;



benchmark( 'Iteration over Array and Set (performing a sum)' , () => {
	var array = [] , set_ = new Set() ;

	for ( let i = 0 ; i < 1000 ; i ++ ) {
		array[ i ] = i ;
		set_.add( i ) ;
	}

	competitor( "Array, using 'for' loop" , () => {
		var i , iMax , sum = 0 ;
		for ( i = 0 , iMax = array.length ; i < iMax ; i ++ ) {
			sum += array[ i ] ;
		}
		return sum ;
	} ) ;

	competitor( "Array, using 'for of' loop" , () => {
		var element , sum = 0 ;
		for ( element of array ) {
			sum += element ;
		}
		return sum ;
	} ) ;

	competitor( "Set, using 'for of' loop" , () => {
		var element , sum = 0 ;
		for ( element of set_ ) {
			sum += element ;
		}
		return sum ;
	} ) ;
} ) ;



benchmark( 'Clone Array and Set' , () => {
	var array = [] , set_ = new Set() ;

	for ( let i = 0 ; i < 1000 ; i ++ ) {
		array[ i ] = i ;
		set_.add( i ) ;
	}

	competitor( "Array to Array, using Array.from( array )" , () => {
		return Array.from( array ) ;
	} ) ;

	competitor( "Array to Array, using [ ... array ]" , () => {
		return [ ... array ] ;
	} ) ;

	competitor( "Array to Array, using 'for' loop and direct index assignment, instanciated with the correct length" , () => {
		var i , iMax , newArray = new Array( array.length ) ;
		for ( i = 0 , iMax = array.length ; i < iMax ; i ++ ) {
			newArray[ i ] = array[ i ] ;
		}
		return newArray ;
	} ) ;

	competitor( "Array to Array, using 'for' loop and direct index assignment" , () => {
		var i , iMax , newArray = [] ;
		for ( i = 0 , iMax = array.length ; i < iMax ; i ++ ) {
			newArray[ i ] = array[ i ] ;
		}
		return newArray ;
	} ) ;

	competitor( "Array to Array, using 'for' loop and newArray.length as index" , () => {
		var i , iMax , newArray = [] ;
		for ( i = 0 , iMax = array.length ; i < iMax ; i ++ ) {
			newArray[ newArray.length ] = array[ i ] ;
		}
		return newArray ;
	} ) ;

	competitor( "Array to Array, using 'for' loop and .push()" , () => {
		var i , iMax , newArray = [] ;
		for ( i = 0 , iMax = array.length ; i < iMax ; i ++ ) {
			newArray.push( array[ i ] ) ;
		}
		return newArray ;
	} ) ;

	competitor( "Array to Array, using 'for of' loop and newArray.length as index" , () => {
		var element , newArray = [] ;
		for ( element of array ) {
			newArray[ newArray.length ] = element ;
		}
		return newArray ;
	} ) ;

	competitor( "Array to Array, using 'for of' loop and i++ as index, instanciated with the correct length" , () => {
		var i = 0 , element , newArray = new Array( array.length ) ;
		for ( element of array ) {
			newArray[ i ++ ] = element ;
		}
		return newArray ;
	} ) ;

	competitor( "Set to Array, using Array.from( set )" , () => {
		return Array.from( set_ ) ;
	} ) ;

	competitor( "Set to Array, using [ ... set ]" , () => {
		return [ ... set_ ] ;
	} ) ;

	competitor( "Set to Array, using 'for of' loop and newArray.length as index" , () => {
		var element , newArray = [] ;
		for ( element of set_ ) {
			newArray[ newArray.length ] = element ;
		}
		return newArray ;
	} ) ;

	competitor( "Set to Array, using 'for of' loop and i++ as index, instanciated with the correct length" , () => {
		var i = 0 , element , newArray = new Array( set_.size ) ;
		for ( element of set_ ) {
			newArray[ i ++ ] = element ;
		}
		return newArray ;
	} ) ;

	competitor( "Set to Set, using 'for of' loop and newSet.add()" , () => {
		var element , newSet = new Set() ;
		for ( element of set_ ) {
			newSet.add( element ) ;
		}
		return newSet ;
	} ) ;
} ) ;

