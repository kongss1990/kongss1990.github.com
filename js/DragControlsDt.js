/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

THREE.DragControls = function ( _objects, _camera, _domElement ) {

	if ( _objects instanceof THREE.Camera ) {

		console.warn( 'THREE.DragControls: Constructor now expects ( objects, camera, domElement )' );
		var temp = _objects; _objects = _camera; _camera = temp;

	}

	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	var _selected = null, _hovered = null;

	//dt
	var addMoveEvent=false;
	var disableMove=false;


	var scope = this;
	//touch start与end的间隔时间
	var touchTime;

	function activate() {

		//_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		//_domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		//_domElement.addEventListener( 'mouseup', onDocumentMouseCancel, false );
		//_domElement.addEventListener( 'mouseleave', onDocumentMouseCancel, false );
		_domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
		_domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );
		_domElement.addEventListener( 'click', onDocumentMouseClick, false );

	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.removeEventListener( 'mouseup', onDocumentMouseCancel, false );
		_domElement.removeEventListener( 'mouseleave', onDocumentMouseCancel, false );
		_domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.removeEventListener( 'touchstart', onDocumentTouchStart, false );
		_domElement.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		_domElement.removeEventListener( 'click', onDocumentMouseClick, false );
	}

	function dispose() {

		deactivate();

	}

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ) );

			}

			scope.dispatchEvent( { type: 'drag', object: _selected } );

			return;

		}else{
			//dt
			if(addMoveEvent){
				_plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ));
				_raycaster.ray.intersectPlane( _plane, _intersection )
				scope.dispatchEvent( { type: 'move', pos: _intersection.sub( _offset )} );
			}

		}

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			var object = intersects[ 0 ].object;
			var point = intersects[ 0 ].point;
			//_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), object.position );
			_plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), object.position );
			if ( _hovered !== object ) {
				scope.dispatchEvent( { type: 'hoveron', object: object ,point:point} );
				_domElement.style.cursor = 'pointer';
				_hovered = object;
			}

		} else {

			if ( _hovered !== null ) {

				scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

				_domElement.style.cursor = 'auto';
				_hovered = null;

			}

		}

	}

	//dt
	function onDocumentMouseClick(event){

		event.preventDefault();

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_offset.copy( _intersection ).sub( _selected.position );

			}

			scope.dispatchEvent( { type: 'click', object: _selected } );
			_selected = null;

		}
		_domElement.style.cursor = 'auto';

	}
	function onDocumentMouseDown( event ) {

		event.preventDefault();

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_offset.copy( _intersection ).sub( _selected.position );

			}

			_domElement.style.cursor = 'move';

			scope.dispatchEvent( { type: 'dragstart', object: _selected } );

		}


	}

	function onDocumentMouseCancel( event ) {


		event.preventDefault();

		if ( _selected ) {

			scope.dispatchEvent( { type: 'dragend', object: _selected } );

			_selected = null;

		}

		_domElement.style.cursor = 'auto';

	}

	function onDocumentTouchMove( event ) {
		if(disableMove)return

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ) );

			}
			var intersects = _raycaster.intersectObjects( _objects );
			//var point = intersects[ 0 ].point;
			var intersect = null;
			if(intersects.length)intersect=intersects

			scope.dispatchEvent( { type: 'drag', object: _selected,intersect:intersect} );


		}else{
			//dt
			if(addMoveEvent){
				_plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ));
				_raycaster.ray.intersectPlane( _plane, _intersection )
				scope.dispatchEvent( { type: 'move', pos: _intersection.sub( _offset )} );
			}
		}



	}

	function onDocumentTouchStart( event ) {
		touchTime = (new Date()).getTime();
		event.preventDefault();
		if(typeof event.changedTouches=="undefined")return
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;


			//_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _selected.position );
			_plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), _selected.position );
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_offset.copy( _intersection ).sub( _selected.position );

			}

			_domElement.style.cursor = 'move';

			scope.dispatchEvent( { type: 'dragstart', object: _selected } );

		}


	}

	function onDocumentTouchEnd( event ) {


		event.preventDefault();

		if ( _selected ) {

			scope.dispatchEvent( { type: 'dragend', object: _selected } );
            var spaceTime = (new Date()).getTime()-touchTime;


            if(spaceTime<150){
                scope.dispatchEvent( { type: 'click', object: _selected } );

            }
            touchTime=null;
            _selected = null;
        }

		_domElement.style.cursor = 'auto';

	}

	activate();

	//dt
	this.addMoveEvent =function(v){
		addMoveEvent=v;
	} ;
	//dt
	this.disableMove =function(v){
		disableMove=v;
	} ;
	this.moveFun=function( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();


		//移动端的触摸偏移距离设置 提高体验
		var touchW=-20;
		var touchH=-40;
		_mouse.x = ( ( event.clientX+touchW- rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY+touchH- rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		_plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ));
		_raycaster.ray.intersectPlane( _plane, _intersection );

		var intersects = _raycaster.intersectObjects( _objects );
		var intersect=null;
		if ( intersects.length > 0 )intersect=intersects;
		scope.dispatchEvent( { type: 'move', pos: _intersection.sub( _offset ),intersect:intersect} );

	}
	// API

	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;

	// Backward compatibility

	this.setObjects = function () {

		console.error( 'THREE.DragControls: setObjects() has been removed.' );

	};

	this.on = function ( type, listener ) {

		console.warn( 'THREE.DragControls: on() has been deprecated. Use addEventListener() instead.' );
		scope.addEventListener( type, listener );

	};

	this.off = function ( type, listener ) {

		console.warn( 'THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.' );
		scope.removeEventListener( type, listener );

	};

	this.notify = function ( type ) {

		console.error( 'THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.' );
		scope.dispatchEvent( { type: type } );

	};

};

THREE.DragControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DragControls.prototype.constructor = THREE.DragControls;
