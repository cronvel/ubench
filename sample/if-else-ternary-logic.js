
"use strict" ;



benchmark( 'if/else vs ternary vs logic' , function() {
	
	competitor( 'none' , function() {
		var v = true ;
		
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
		v = ! v ;
	} ) ;

	competitor( 'if/else' , function() {
		var v = true ;
		
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
		if ( v ) { v = ! v ; } else { v = ! v ; }
	} ) ;
	
	competitor( 'ternary' , function() {
		var v = true ;
		
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
		v = v ? ! v : ! v ;
	} ) ;
} ) ;


