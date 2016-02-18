
"use strict" ;



var i = 0 ;

benchmark( 'Increment' , function() {
	
	competitor( "i = i + '1'" , function() {
		i = i + '1' ;
	} ) ;

	competitor( 'i ++' , function() {
		i ++ ;
	} ) ;

	competitor( 'i = i + 1' , function() {
		i = i + 1 ;
	} ) ;
	
	competitor( "i = ( i || 0 ) + 1" , function() {
		i = ( i || 0 ) + 1 ;
	} ) ;
} ) ;




