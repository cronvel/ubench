
"use strict" ;



benchmark( 'Async/await cost' , () => {
	
	function syncFn( a ) {
		if ( a ) { return true ; }
		return false ;
	}
	
	async function asyncFn( a ) {
		if ( a ) { await a ; return true ; }
		return false ;
	}
	
	competitor( 'sync' , () => syncFn() ) ;
	
	competitor( 'async/await function without triggering any async code' , async () => await asyncFn() ) ;
} ) ;

