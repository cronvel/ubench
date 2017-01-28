
"use strict" ;



benchmark( '2D distance' , function() {
	
	var a = 10 , b = 3 ;
	
	competitor( 'Math.hypot( a , b )' , function() {
		
		return Math.hypot( a , b ) ;
	} ) ;
	
	competitor( 'Math.sqrt( a * a + b * b )' , function() {
		
		return Math.sqrt( a * a + b * b ) ;
	} ) ;
	
	competitor( 'Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ) )' , function() {
		
		return Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ) ) ;
	} ) ;
	
	competitor( '[Squared distance] a * a + b * b' , function() {
		
		return a * a + b * b ;
	} ) ;
	
	competitor( '[Squared distance] Math.pow( a , 2 ) + Math.pow( b , 2 )' , function() {
		
		return Math.pow( a , 2 ) + Math.pow( b , 2 ) ;
	} ) ;
} ) ;



benchmark( '3D distance' , function() {
	
	var a = 10 , b = 3 , c = 18 ;
	
	competitor( 'Math.hypot( a , b , c )' , function() {
		
		return Math.hypot( a , b , c ) ;
	} ) ;
	
	competitor( 'Math.sqrt( a * a + b * b + c * c )' , function() {
		
		return Math.sqrt( a * a + b * b + c * c ) ;
	} ) ;
	
	competitor( 'Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ) + Math.pow( c , 2 ) )' , function() {
		
		return Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ) + Math.pow( c , 2 ) ) ;
	} ) ;
	
	competitor( '[Squared distance] a * a + b * b + c * c' , function() {
		
		return a * a + b * b + c * c ;
	} ) ;
	
	competitor( '[Squared distance] Math.pow( a , 2 ) + Math.pow( b , 2 ) + Math.pow( c , 2 )' , function() {
		
		return Math.pow( a , 2 ) + Math.pow( b , 2 ) + Math.pow( c , 2 ) ;
	} ) ;
} ) ;


