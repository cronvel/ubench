
"use strict" ;



var i = 0 ;

//*
benchmark( 'Increment' , function() {
	
	competitor( "i = ( i || 0 ) + 1 (2)" , function() {
		i = ( i || 0 ) + 1 ;
	} ) ;
	
	competitor( "i ++ (2)" , function() {
		i ++ ;
	} ) ;
} ) ;
//*/

