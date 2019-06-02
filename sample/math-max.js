
"use strict" ;



benchmark( 'Math.max() vs ternary' , () => {
	
	var a = 10 , b = 3 , c = 19 ;
	
	competitor( 'Math.max()' , () => Math.max( a , b ) + Math.max( a , c ) + Math.max( b , c ) ) ;
	
	competitor( 'ternary' , () => ( a > b ? a : b ) + ( a > c ? a : c ) + ( b > c ? b : c ) ) ;
	
	function max( a , b ) { return ( a > b ? a : b ) ; }
	
	competitor( 'ternary function' , () => max( a , b ) + max( a , c ) + max( b , c ) ) ;
} ) ;



benchmark( 'Heaviside Math.max(0,Math.sign(x)) vs ternary' , () => {
	
	var a = 10 , b = 3 , c = 19 ;
	
	competitor( 'Math.max(0,Math.sign(x))' , () => Math.max( 0 , Math.sign( a ) ) + Math.max( 0 , Math.sign( b ) ) + Math.max( 0 , Math.sign( c ) ) ) ;
	
	competitor( 'ternary' , () => ( a > 0 ? 1 : 0 ) + ( b > 0 ? 1 : 0 ) + ( c > 0 ? 1 : 0 ) ) ;
} ) ;


