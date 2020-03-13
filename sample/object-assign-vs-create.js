
"use strict" ;



benchmark( "Clone (top-level only): Object.assign() vs Object.create()" , () => {
	var object = {
		a: 1 ,
		b: 2 ,
		c: 13 ,
		d: 41 ,
		e: 134 ,
		f: "string" ,
		aBigBigBigKey: "a long long long long string"
	} ;
	
	competitor( "Object.assign()" , () => {
		return Object.assign( {} , object ) ;
	} ) ;
	
	competitor( "Object.create()" , () => {
		return Object.create( object ) ;
	} ) ;
} ) ;



benchmark( "Clone (top-level only) and change: Object.assign() vs Object.create()" , () => {
	var object = {
		a: 1 ,
		b: 2 ,
		c: 13 ,
		d: 41 ,
		e: 134 ,
		f: "string" ,
		aBigBigBigKey: "a long long long long string"
	} ;
	
	competitor( "Object.assign()" , () => {
		var modified = Object.assign( {} , object , { a:7 , f: "changed" , g: "new" } ) ;
		return modified ;
	} ) ;
	
	competitor( "Object.create() assign after" , () => {
		var modified = Object.create( object ) ;
		modified.a = 7 ;
		modified.f = "changed" ;
		modified.g = "new" ;
		return modified ;
	} ) ;

	competitor( "Object.create() with descriptor" , () => {
		var modified = Object.create( object , {
			a: { value: 7 } ,
			f: { value: "changed" } ,
			g: { value: "new" }
		} ) ;
		return modified ;
	} ) ;

	competitor( "Object.create() inside Object.assign()" , () => {
		var modified = Object.assign( Object.create( object ) , {
			a: 7 ,
			f: "changed" ,
			g: "new"
		} ) ;
		return modified ;
	} ) ;
} ) ;



benchmark( "Clone (top-level only), change and access: Object.assign() vs Object.create()" , () => {
	var object = {
		a: 1 ,
		b: 2 ,
		c: 13 ,
		d: 41 ,
		e: 134 ,
		f: "string" ,
		aBigBigBigKey: "a long long long long string"
	} ;
	
	competitor( "Object.assign()" , () => {
		var modified = Object.assign( {} , object , { a:7 , f: "changed" , g: "new" } ) ;

		var val = 0 ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		modified.val = val ;
		return modified ;
	} ) ;
	
	competitor( "Object.create()" , () => {
		var modified = Object.create( object ) ;
		modified.a = 7 ;
		modified.f = "changed" ;
		modified.g = "new" ;

		var val = 0 ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		val += object.a + object.b + object.c + object.d + object.e ;
		modified.val = val ;
		return modified ;
	} ) ;
} ) ;

