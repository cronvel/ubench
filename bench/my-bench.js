


var i = 0 ;

bench( 'toto' , 'i++' , function() {
	i++ ;
} ) ;

bench( 'toto' , 'i = i + 1' , function() {
	i = i + 1 ;
} ) ;

bench( 'toto' , "i = i + '1'" , function() {
	i = i + '1' ;
} ) ;


