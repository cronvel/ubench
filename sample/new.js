
"use strict" ;



benchmark( "new vs object.create()" , function() {
	
	competitor( "object literal" , function() {
		var v1 = { x: 1 , y: 2 , z: 3 } ;
		var v2 = { x: 4 , y: 5 , z: 6 } ;
		var dot ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
	} ) ;
	
	function Vector3D( x , y , z )
	{
		this.x = x ;
		this.y = y ;
		this.z = z ;
	}
	
	function Vector3D( x , y , z )
	{
		this.x = x ;
		this.y = y ;
		this.z = z ;
	}
	
	function createVector3D( x , y , z )
	{
		var self = Object.create( Vector3D.prototype ) ;
		self.x = x ;
		self.y = y ;
		self.z = z ;
		return self ;
	}
	
	function newVector3D( x , y , z )
	{
		var self = new Vector3D() ;
		self.x = x ;
		self.y = y ;
		self.z = z ;
		return self ;
	}
	
	Vector3D.prototype.dot = function dot( vector )
	{
		return this.x * vector.x + this.y * vector.y + this.z * vector.z ;
	} ;
	
	function Vector3DCheck( x , y , z )
	{
		var self = this ;
		if ( ! ( self instanceof Vector3DCheck ) ) { self = Object.create( Vector3DCheck.prototype ) ; }
		self.x = x ;
		self.y = y ;
		self.z = z ;
		return self ;
	}
	
	Vector3DCheck.prototype.dot = Vector3D.prototype.dot ;
	
	competitor( "'new' operator" , function() {
		var v1 = new Vector3D( 1 , 2 , 3 ) ;
		var v2 = new Vector3D( 4 , 5 , 6 ) ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.dot( v2 ) ;
	} ) ;
	
	competitor( "'new' operator, constructor checking 'this'" , function() {
		var v1 = new Vector3DCheck( 1 , 2 , 3 ) ;
		var v2 = new Vector3DCheck( 4 , 5 , 6 ) ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.dot( v2 ) ;
	} ) ;
	
	competitor( "invoking without 'new' a constructor checking 'this'" , function() {
		var v1 = Vector3DCheck( 1 , 2 , 3 ) ;
		var v2 = Vector3DCheck( 4 , 5 , 6 ) ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.dot( v2 ) ;
	} ) ;
	
	competitor( "factory using Object.create()" , function() {
		var v1 = createVector3D( 1 , 2 , 3 ) ;
		var v2 = createVector3D( 4 , 5 , 6 ) ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.dot( v2 ) ;
	} ) ;
	
	competitor( "factory using 'new'" , function() {
		var v1 = newVector3D( 1 , 2 , 3 ) ;
		var v2 = newVector3D( 4 , 5 , 6 ) ;
		
		v1.x ++ ;
		v1.y = - v1.y ;
		v1.z *= 2 ;
		
		v2.x -= 3 ;
		v2.y /= 2 ;
		v2.z *= 0.5 ;
		
		return v1.dot( v2 ) ;
	} ) ;
} ) ;



