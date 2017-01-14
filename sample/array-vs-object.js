
"use strict" ;



benchmark( 'array vs object (creating and using)' , function() {
	
	competitor( 'array' , function() {
		var v1 = [ 1 , 2 , 3 ] ;
		var v2 = [ 4 , 5 , 6 ] ;
		var dot ;
		
		v1[ 0 ] ++ ;
		v1[ 1 ] = - v1[ 1 ] ;
		v1[ 2 ] *= 2 ;
		
		v2[ 0 ] -= 3 ;
		v2[ 1 ] /= 2 ;
		v2[ 2 ] *= 0.5 ;
		
		dot = v1[ 0 ] * v2[ 0 ] + v1[ 1 ] * v2[ 1 ] + v1[ 2 ] * v2[ 2 ]
		
		return v1 ;
	} ) ;
	
	competitor( 'object literal' , function() {
		var v1 = { x: 1 , y: 2 , z: 3 } ;
		var v2 = { x: 4 , y: 5 , z: 6 } ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
	
	competitor( 'object with Object.create() then assignment' , function() {
		var v1 = Object.create( Object.prototype ) ;
		v1.x = 1 ;
		v1.y = 2 ;
		v1.z = 3 ;
		var v2 = Object.create( Object.prototype ) ;
		v2.x = 4 ;
		v2.y = 5 ;
		v2.z = 6 ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
	
	competitor( 'object with Object.create() with descriptor' , function() {
		var v1 = Object.create( Object.prototype , {
			x: { value: 1 , enumerable: true , writable: true } ,
			y: { value: 2 , enumerable: true , writable: true } ,
			z: { value: 3 , enumerable: true , writable: true }
		} ) ;
		var v2 = Object.create( Object.prototype , {
			x: { value: 4 , enumerable: true , writable: true } ,
			y: { value: 5 , enumerable: true , writable: true } ,
			z: { value: 6 , enumerable: true , writable: true }
		} ) ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
	
	competitor( 'sealed object literal' , function() {
		var v1 = { x: 1 , y: 2 , z: 3 } ;
		var v2 = { x: 4 , y: 5 , z: 6 } ;
		Object.seal( v1 ) ;
		Object.seal( v2 ) ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
	
	competitor( 'object with Object.create(), then assignment, then seal' , function() {
		var v1 = Object.create( Object.prototype ) ;
		v1.x = 1 ;
		v1.y = 2 ;
		v1.z = 3 ;
		Object.seal( v1 ) ;
		var v2 = Object.create( Object.prototype ) ;
		v2.x = 4 ;
		v2.y = 5 ;
		v2.z = 6 ;
		Object.seal( v2 ) ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
	
	competitor( 'object with Object.create() with descriptor, then seal' , function() {
		var v1 = Object.create( Object.prototype , {
			x: { value: 1 , enumerable: true , writable: true } ,
			y: { value: 2 , enumerable: true , writable: true } ,
			z: { value: 3 , enumerable: true , writable: true }
		} ) ;
		Object.seal( v1 ) ;
		var v2 = Object.create( Object.prototype , {
			x: { value: 4 , enumerable: true , writable: true } ,
			y: { value: 5 , enumerable: true , writable: true } ,
			z: { value: 6 , enumerable: true , writable: true }
		} ) ;
		Object.seal( v2 ) ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
		
		return v1 ;
	} ) ;
} ) ;



benchmark( 'array vs object (using existing)' , function() {
	
	var arrayV1 = [ 1 , 2 , 3 ] ;
	var arrayV2 = [ 4 , 5 , 6 ] ;
	
	competitor( 'array' , function() {
		var dot ;
		
		arrayV1[ 0 ] ++ ;
		arrayV1[ 1 ] = - arrayV1[ 1 ] ;
		arrayV1[ 2 ] *= 2 ;
		
		arrayV2[ 0 ] -= 3 ;
		arrayV2[ 1 ] /= 2 ;
		arrayV2[ 2 ] *= 0.5 ;
		
		dot = arrayV1[ 0 ] * arrayV2[ 0 ] + arrayV1[ 1 ] * arrayV2[ 1 ] + arrayV1[ 2 ] * arrayV2[ 2 ]
		
		return arrayV1 ;
	} ) ;
	
	
	var literalV1 = { x: 1 , y: 2 , z: 3 } ;
	var literalV2 = { x: 4 , y: 5 , z: 6 } ;
	
	competitor( 'object literal' , function() {
		var dot ;
		
		literalV1.x ++ ;
		literalV1.y = - literalV1.y ;
		literalV1.z *= 2 ;
		
		literalV2.x -= 3 ;
		literalV2.y /= 2 ;
		literalV2.z *= 0.5 ;
		
		dot = literalV1.x * literalV2.x + literalV1.y * literalV2.y + literalV1.z * literalV2.z
		
		return literalV1 ;
	} ) ;
	
	
	var oCreateV1 = Object.create( Object.prototype ) ;
	oCreateV1.x = 1 ;
	oCreateV1.y = 2 ;
	oCreateV1.z = 3 ;
	var oCreateV2 = Object.create( Object.prototype ) ;
	oCreateV2.x = 4 ;
	oCreateV2.y = 5 ;
	oCreateV2.z = 6 ;
	
	competitor( 'object with Object.create() then assignment' , function() {
		var dot ;
		
		oCreateV1.x ++ ;
		oCreateV1.y = - oCreateV1.y ;
		oCreateV1.z *= 2 ;
		
		oCreateV2.x -= 3 ;
		oCreateV2.y /= 2 ;
		oCreateV2.z *= 0.5 ;
		
		dot = oCreateV1.x * oCreateV2.x + oCreateV1.y * oCreateV2.y + oCreateV1.z * oCreateV2.z
		
		return oCreateV1 ;
	} ) ;
	
	
	var oCreateDescriptorV1 = Object.create( Object.prototype , {
		x: { value: 1 , enumerable: true , writable: true } ,
		y: { value: 2 , enumerable: true , writable: true } ,
		z: { value: 3 , enumerable: true , writable: true }
	} ) ;
	var oCreateDescriptorV2 = Object.create( Object.prototype , {
		x: { value: 4 , enumerable: true , writable: true } ,
		y: { value: 5 , enumerable: true , writable: true } ,
		z: { value: 6 , enumerable: true , writable: true }
	} ) ;
	
	competitor( 'object with Object.create() with descriptor' , function() {
		var dot ;
		
		oCreateDescriptorV1.x ++ ;
		oCreateDescriptorV1.y = - oCreateDescriptorV1.y ;
		oCreateDescriptorV1.z *= 2 ;
		
		oCreateDescriptorV2.x -= 3 ;
		oCreateDescriptorV2.y /= 2 ;
		oCreateDescriptorV2.z *= 0.5 ;
		
		dot = oCreateDescriptorV1.x * oCreateDescriptorV2.x + oCreateDescriptorV1.y * oCreateDescriptorV2.y + oCreateDescriptorV1.z * oCreateDescriptorV2.z
		
		return oCreateDescriptorV1 ;
	} ) ;
	
	
	var literalSealedV1 = { x: 1 , y: 2 , z: 3 } ;
	var literalSealedV2 = { x: 4 , y: 5 , z: 6 } ;
	Object.seal( literalSealedV1 ) ;
	Object.seal( literalSealedV2 ) ;
	
	competitor( 'sealed object literal' , function() {
		var dot ;
		
		literalSealedV1.x ++ ;
		literalSealedV1.y = - literalSealedV1.y ;
		literalSealedV1.z *= 2 ;
		
		literalSealedV2.x -= 3 ;
		literalSealedV2.y /= 2 ;
		literalSealedV2.z *= 0.5 ;
		
		dot = literalSealedV1.x * literalSealedV2.x + literalSealedV1.y * literalSealedV2.y + literalSealedV1.z * literalSealedV2.z
		
		return literalSealedV1 ;
	} ) ;
	
	
	var oCreateSealedV1 = Object.create( Object.prototype ) ;
	oCreateSealedV1.x = 1 ;
	oCreateSealedV1.y = 2 ;
	oCreateSealedV1.z = 3 ;
	Object.seal( oCreateSealedV1 ) ;
	var oCreateSealedV2 = Object.create( Object.prototype ) ;
	oCreateSealedV2.x = 4 ;
	oCreateSealedV2.y = 5 ;
	oCreateSealedV2.z = 6 ;
	Object.seal( oCreateSealedV2 ) ;
	
	competitor( 'object with Object.create(), then assignment, then seal' , function() {
		var dot ;
		
		oCreateSealedV1.x ++ ;
		oCreateSealedV1.y = - oCreateSealedV1.y ;
		oCreateSealedV1.z *= 2 ;
		
		oCreateSealedV2.x -= 3 ;
		oCreateSealedV2.y /= 2 ;
		oCreateSealedV2.z *= 0.5 ;
		
		dot = oCreateSealedV1.x * oCreateSealedV2.x + oCreateSealedV1.y * oCreateSealedV2.y + oCreateSealedV1.z * oCreateSealedV2.z
		
		return oCreateSealedV1 ;
	} ) ;
	
	
	var oCreateDescriptorSealedV1 = Object.create( Object.prototype , {
		x: { value: 1 , enumerable: true , writable: true } ,
		y: { value: 2 , enumerable: true , writable: true } ,
		z: { value: 3 , enumerable: true , writable: true }
	} ) ;
	Object.seal( oCreateDescriptorSealedV1 ) ;
	var oCreateDescriptorSealedV2 = Object.create( Object.prototype , {
		x: { value: 4 , enumerable: true , writable: true } ,
		y: { value: 5 , enumerable: true , writable: true } ,
		z: { value: 6 , enumerable: true , writable: true }
	} ) ;
	Object.seal( oCreateDescriptorSealedV2 ) ;
	
	competitor( 'object with Object.create() with descriptor, then seal' , function() {
		var dot ;
		
		oCreateDescriptorSealedV1.x ++ ;
		oCreateDescriptorSealedV1.y = - oCreateDescriptorSealedV1.y ;
		oCreateDescriptorSealedV1.z *= 2 ;
		
		oCreateDescriptorSealedV2.x -= 3 ;
		oCreateDescriptorSealedV2.y /= 2 ;
		oCreateDescriptorSealedV2.z *= 0.5 ;
		
		dot = oCreateDescriptorSealedV1.x * oCreateDescriptorSealedV2.x + oCreateDescriptorSealedV1.y * oCreateDescriptorSealedV2.y + oCreateDescriptorSealedV1.z * oCreateDescriptorSealedV2.z
		
		return oCreateDescriptorSealedV1 ;
	} ) ;
} ) ;



