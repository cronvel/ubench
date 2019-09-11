
"use strict" ;



var i = 0 ;

benchmark( 'Increment' , () => {
	
	competitor( "i = i + '1'" , () => {
		i = i + '1' ;
	} ) ;

	competitor( 'i ++' , () => {
		i ++ ;
	} ) ;

	competitor( 'i = i + 1' , () => {
		i = i + 1 ;
	} ) ;
	
	competitor( "i = ( i || 0 ) + 1" , () => {
		i = ( i || 0 ) + 1 ;
	} ) ;
} ) ;



benchmark( 'Comparison' , () => {
	
	var str1 = 'some string' ,
		str2 = 'this is another string' ,
		str3 = 'and one string much bigger than the other and one string much bigger than the other and one string much bigger than the other' ,
		obj1 = {} ,
		obj2 = {} ,
		obj3 = {} ,
		t1 = obj1 ,
		t2 = obj2 ,
		t3 = obj3 ,
		t4 = {} ,
		t5 = {} ,
		t6 = {} ;
	
	competitor( "string equality" , () => {
		var v = false ;
		
		v ^= str1 === 'some string' ;
		v ^= str1 === 'random' ;
		v ^= str2 === 'this is another string' ;
		v ^= str2 === 'random random random' ;
		v ^= str3 === 'and one string much bigger than the other and one string much bigger than the other and one string much bigger than the other' ;
		v ^= str3 === 'random random random random random random random random random random random random random random random random random random random random random' ;

		return v ;
	} ) ;

	competitor( 'object equality' , () => {
		var v = false ;
		
		v ^= obj1 === t1 ;
		v ^= obj2 === t2 ;
		v ^= obj3 === t3 ;
		v ^= obj1 === t4 ;
		v ^= obj2 === t5 ;
		v ^= obj3 === t6 ;
		
		return v ;
	} ) ;
} ) ;

