
"use strict" ;



benchmark( 'Math.max() vs ternary' , function() {
	
	var a = 10 , b = 3 , c = 19 ;
	
	competitor( 'Math.max()' , function() {
		
		return Math.max( a , b ) +
			Math.max( a , c ) +
			Math.max( b , c ) ;
	} ) ;
	
	competitor( 'ternary' , function() {
		
		return ( a > b ? a : b ) +
			( a > c ? a : c ) +
			( b > c ? b : c ) ;
	} ) ;
	
	function max( a , b ) { return ( a > b ? a : b ) ; }
	
	competitor( 'ternary function' , function() {
		
		return max( a , b ) +
			max( a , c ) +
			max( b , c ) ;
	} ) ;
} ) ;


