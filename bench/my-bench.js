


var i = 0 ;

bench( 'increment' , "i = i + '1'" , function() {
	i = i + '1' ;
} ) ;

bench( 'increment' , 'i ++' , function() {
	i ++ ;
} ) ;

bench( 'increment' , 'i = i + 1' , function() {
	i = i + 1 ;
} ) ;



