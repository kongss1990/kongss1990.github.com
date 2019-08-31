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

	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.addEventListener( 'mouseup', onDocumentMouseCancel, false );
		_domElement.addEventListener( 'mouseleave', onDocumentMouseCancel, false );
		_domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
		_domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );

	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.removeEventListener( 'mouseup', onDocumentMouseCancel, false );
		_domElement.removeEventListener( 'mouseleave', onDocumentMouseCancel, false );
		_domElement.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		_domElement.removeEventListener( 'touchstart', onDocumentTouchStart, false );
		_domElement.removeEventListener( 'touchend', onDocumentTouchEnd, false );

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
        var isOk = true;
        var isX = true;
        var isZ = true;
        if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {


                // var v = _intersection.sub( _offset );
                //----------------------
                // console.log(v.x,v.z);
                //****************检测是否碰撞******************
                var tempObj = _selected.clone();
                var pos = _intersection.clone();
                tempObj.position.copy( pos.sub( _offset ) );

                // console.log(_intersection);

                //两个分量
                var tempObjX = _selected.clone();
                var tempObjZ = _selected.clone();


                tempObjX.position.x=_intersection.clone().sub(_offset).x;
                tempObjZ.position.z=_intersection.clone().sub(_offset).z;
                var boxX =  new THREE.Box3().setFromObject(tempObjX);
                var boxZ =  new THREE.Box3().setFromObject(tempObjZ);

                var box1 =  new THREE.Box3().setFromObject(tempObj);
                for(var i=0;i<_objects.length;i++){
                    if(_objects[i]!=_selected){
                        var box2 = new THREE.Box3();
                        box2.setFromObject(_objects[i]);
                        if(box1.intersectsBox(box2)){
                            isOk = false;

                        	if(boxX.intersectsBox(box2)){
                        		isX=false;
							}
                            if(boxZ.intersectsBox(box2)){
                                isZ=false;
                            }
                        }
                    }

                }

                // var box1 =  new THREE.Box3().setFromObject(tempObj);
                // for(var i=0;i<_objects.length;i++){
					// if(_objects[i]!=_selected){
                //         var box2 = new THREE.Box3();
                //         box2.setFromObject(_objects[i]);
                //         if(box1.intersectsBox(box2)){
                //             console.log('hit');
                //             isOk = false;
                //         }
					// }
                //
                // }


                if(isOk){
                    _selected.position.copy( _intersection.sub( _offset ) );
                }else{
                    if(isX){
                        _selected.position.x=_intersection.sub( new THREE.Vector3(_offset.x,0,0) ).x;
                    }
                    if(isZ){
                        _selected.position.z=_intersection.sub( new THREE.Vector3(0,0,_offset.z) ).z;
                    }
				}


			}

			if(isOk || isX ||isZ){
                scope.dispatchEvent( { type: 'drag', object: _selected } );
            }

			return;

		}

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			var object = intersects[ 0 ].object;

			// _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), object.position );
            _plane.setFromNormalAndCoplanarPoint( new THREE.Vector3( 0, 1, 0 ), object.position );

			if ( _hovered !== object ) {

				scope.dispatchEvent( { type: 'hoveron', object: object } );

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

			scope.dispatchEvent( { type: 'drag', object: _selected } );

			return;

		}

	}

	function onDocumentTouchStart( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		var intersects = _raycaster.intersectObjects( _objects );

		if ( intersects.length > 0 ) {

			_selected = intersects[ 0 ].object;

			// _plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _selected.position );
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

			_selected = null;

		}

		_domElement.style.cursor = 'auto';

	}

	activate();

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
