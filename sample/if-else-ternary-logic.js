
"use strict" ;



benchmark( 'if/else vs ternary vs logic (one statement)' , function() {
	
	var v = [] ;
	for ( var i = 0 ; i < 10 ; i ++ ) { v[ i ] = !! ( i % 2 ) ; }
	
	competitor( 'none' , function() {
		var r = 100 ;
		var s = 100 ;
		var t = 100 ;
		
		-- r ;
		++ r ;
		-- r ;
		++ r ;
		-- r ;
		++ r ;
		-- r ;
		++ r ;
		-- r ;
		++ r ;
		
		return r ;
	} ) ;

	competitor( 'if/else' , function() {
		var r = 100 ;
		
		if ( v[ 0 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 1 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 2 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 3 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 4 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 5 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 6 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 7 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 8 ] ) { ++ r ; } else { -- r ; }
		if ( v[ 9 ] ) { ++ r ; } else { -- r ; }
		
		return r ;
	} ) ;
	
	competitor( 'ternary' , function() {
		var r = 100 ;
		
		v[ 0 ] ? ++ r : -- r ;
		v[ 1 ] ? ++ r : -- r ;
		v[ 2 ] ? ++ r : -- r ;
		v[ 3 ] ? ++ r : -- r ;
		v[ 4 ] ? ++ r : -- r ;
		v[ 5 ] ? ++ r : -- r ;
		v[ 6 ] ? ++ r : -- r ;
		v[ 7 ] ? ++ r : -- r ;
		v[ 8 ] ? ++ r : -- r ;
		v[ 9 ] ? ++ r : -- r ;
		
		return r ;
	} ) ;
	
	competitor( 'logic' , function() {
		var r = 100 ;
		
		v[ 0 ] && ++ r || -- r ;
		v[ 1 ] && ++ r || -- r ;
		v[ 2 ] && ++ r || -- r ;
		v[ 3 ] && ++ r || -- r ;
		v[ 4 ] && ++ r || -- r ;
		v[ 5 ] && ++ r || -- r ;
		v[ 6 ] && ++ r || -- r ;
		v[ 7 ] && ++ r || -- r ;
		v[ 8 ] && ++ r || -- r ;
		v[ 9 ] && ++ r || -- r ;
		
		return r ;
	} ) ;
} ) ;



benchmark( 'if/else vs ternary vs logic (three statements)' , function() {
	
	var v = [] ;
	for ( var i = 0 ; i < 10 ; i ++ ) { v[ i ] = !! ( i % 2 ) ; }
	
	competitor( 'none' , function() {
		var r = 100 ;
		var s = 100 ;
		var t = 100 ;
		
		-- r ; s += 2 ; t -= 3 ;
		++ r ; s -= 2 ; t += 3 ;
		-- r ; s += 2 ; t -= 3 ;
		++ r ; s -= 2 ; t += 3 ;
		-- r ; s += 2 ; t -= 3 ;
		++ r ; s -= 2 ; t += 3 ;
		-- r ; s += 2 ; t -= 3 ;
		++ r ; s -= 2 ; t += 3 ;
		-- r ; s += 2 ; t -= 3 ;
		++ r ; s -= 2 ; t += 3 ;
		
		return r ;
	} ) ;

	competitor( 'if/else' , function() {
		var r = 100 ;
		var s = 100 ;
		var t = 100 ;
		
		if ( v[ 0 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 1 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 2 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 3 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 4 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 5 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 6 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 7 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 8 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		if ( v[ 9 ] ) { ++ r ; s -= 2 ; t += 3 ; } else { -- r ; s += 2 ; t -= 3 ; }
		
		return r ;
	} ) ;
	
	competitor( 'ternary' , function() {
		var r = 100 ;
		var s = 100 ;
		var t = 100 ;
		
		v[ 0 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 1 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 2 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 3 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 4 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 5 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 6 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 7 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 8 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		v[ 9 ] ? ( ++ r , s -= 2 , t += 3 ) : ( -- r , s += 2 , t -= 3 ) ;
		
		return r ;
	} ) ;
	
	competitor( 'logic' , function() {
		var r = 100 ;
		var s = 100 ;
		var t = 100 ;
		
		v[ 0 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 1 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 2 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 3 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 4 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 5 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 6 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 7 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 8 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		v[ 9 ] && ( ++ r , s -= 2 , t += 3 ) || ( -- r , s += 2 , t -= 3 ) ;
		
		return r ;
	} ) ;
} ) ;


