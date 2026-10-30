import { C as Vector3, N as createLucideIcon, S as Vector2, _ as Ray, b as Spherical, d as MOUSE, g as Quaternion, h as Plane, m as PerspectiveCamera, p as OrthographicCamera, x as TOUCH } from "./index-C0YyUIMP.js";
// ../node_modules/.pnpm/lucide-react@1.62.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs
/**
* @license lucide-react v1.62.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var __iconData = {
	name: "maximize-2",
	size: 24,
	node: [
		["path", {
			d: "M15 3h6v6",
			key: "1q9fwt"
		}],
		["path", {
			d: "m21 3-7 7",
			key: "1l2asr"
		}],
		["path", {
			d: "m3 21 7-7",
			key: "tjx5ai"
		}],
		["path", {
			d: "M9 21H3v-6",
			key: "wtvkvv"
		}]
	]
};
__iconData.node;
var Maximize2 = createLucideIcon(__iconData);
// ../node_modules/.pnpm/three-stdlib@2.36.1_three@0.186.1/node_modules/three-stdlib/controls/EventDispatcher.js
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
	__defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var EventDispatcher = class {
	constructor() {
		__publicField$1(this, "_listeners");
	}
	/**
	* Adds a listener to an event type.
	* @param type The type of event to listen to.
	* @param listener The function that gets called when the event is fired.
	*/
	addEventListener(type, listener) {
		if (this._listeners === void 0) this._listeners = {};
		const listeners = this._listeners;
		if (listeners[type] === void 0) listeners[type] = [];
		if (listeners[type].indexOf(listener) === -1) listeners[type].push(listener);
	}
	/**
	* Checks if listener is added to an event type.
	* @param type The type of event to listen to.
	* @param listener The function that gets called when the event is fired.
	*/
	hasEventListener(type, listener) {
		if (this._listeners === void 0) return false;
		const listeners = this._listeners;
		return listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1;
	}
	/**
	* Removes a listener from an event type.
	* @param type The type of the listener that gets removed.
	* @param listener The listener function that gets removed.
	*/
	removeEventListener(type, listener) {
		if (this._listeners === void 0) return;
		const listenerArray = this._listeners[type];
		if (listenerArray !== void 0) {
			const index = listenerArray.indexOf(listener);
			if (index !== -1) listenerArray.splice(index, 1);
		}
	}
	/**
	* Fire an event type.
	* @param event The event that gets fired.
	*/
	dispatchEvent(event) {
		if (this._listeners === void 0) return;
		const listenerArray = this._listeners[event.type];
		if (listenerArray !== void 0) {
			event.target = this;
			const array = listenerArray.slice(0);
			for (let i = 0, l = array.length; i < l; i++) array[i].call(this, event);
			event.target = null;
		}
	}
};
// ../node_modules/.pnpm/three-stdlib@2.36.1_three@0.186.1/node_modules/three-stdlib/controls/OrbitControls.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
	__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var _ray = /* @__PURE__ */ new Ray();
var _plane = /* @__PURE__ */ new Plane();
var TILT_LIMIT = Math.cos(70 * (Math.PI / 180));
var moduloWrapAround = (offset, capacity) => (offset % capacity + capacity) % capacity;
var OrbitControls = class extends EventDispatcher {
	constructor(object, domElement) {
		super();
		__publicField(this, "object");
		__publicField(this, "domElement");
		__publicField(this, "enabled", true);
		__publicField(this, "target", new Vector3());
		__publicField(this, "minDistance", 0);
		__publicField(this, "maxDistance", Infinity);
		__publicField(this, "minZoom", 0);
		__publicField(this, "maxZoom", Infinity);
		__publicField(this, "minPolarAngle", 0);
		__publicField(this, "maxPolarAngle", Math.PI);
		__publicField(this, "minAzimuthAngle", -Infinity);
		__publicField(this, "maxAzimuthAngle", Infinity);
		__publicField(this, "enableDamping", false);
		__publicField(this, "dampingFactor", .05);
		__publicField(this, "enableZoom", true);
		__publicField(this, "zoomSpeed", 1);
		__publicField(this, "enableRotate", true);
		__publicField(this, "rotateSpeed", 1);
		__publicField(this, "enablePan", true);
		__publicField(this, "panSpeed", 1);
		__publicField(this, "screenSpacePanning", true);
		__publicField(this, "keyPanSpeed", 7);
		__publicField(this, "zoomToCursor", false);
		__publicField(this, "autoRotate", false);
		__publicField(this, "autoRotateSpeed", 2);
		__publicField(this, "reverseOrbit", false);
		__publicField(this, "reverseHorizontalOrbit", false);
		__publicField(this, "reverseVerticalOrbit", false);
		__publicField(this, "keys", {
			LEFT: "ArrowLeft",
			UP: "ArrowUp",
			RIGHT: "ArrowRight",
			BOTTOM: "ArrowDown"
		});
		__publicField(this, "mouseButtons", {
			LEFT: MOUSE.ROTATE,
			MIDDLE: MOUSE.DOLLY,
			RIGHT: MOUSE.PAN
		});
		__publicField(this, "touches", {
			ONE: TOUCH.ROTATE,
			TWO: TOUCH.DOLLY_PAN
		});
		__publicField(this, "target0");
		__publicField(this, "position0");
		__publicField(this, "zoom0");
		__publicField(this, "_domElementKeyEvents", null);
		__publicField(this, "getPolarAngle");
		__publicField(this, "getAzimuthalAngle");
		__publicField(this, "setPolarAngle");
		__publicField(this, "setAzimuthalAngle");
		__publicField(this, "getDistance");
		__publicField(this, "getZoomScale");
		__publicField(this, "listenToKeyEvents");
		__publicField(this, "stopListenToKeyEvents");
		__publicField(this, "saveState");
		__publicField(this, "reset");
		__publicField(this, "update");
		__publicField(this, "connect");
		__publicField(this, "dispose");
		__publicField(this, "dollyIn");
		__publicField(this, "dollyOut");
		__publicField(this, "getScale");
		__publicField(this, "setScale");
		this.object = object;
		this.domElement = domElement;
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;
		this.getPolarAngle = () => spherical.phi;
		this.getAzimuthalAngle = () => spherical.theta;
		this.setPolarAngle = (value) => {
			let phi = moduloWrapAround(value, 2 * Math.PI);
			let currentPhi = spherical.phi;
			if (currentPhi < 0) currentPhi += 2 * Math.PI;
			if (phi < 0) phi += 2 * Math.PI;
			let phiDist = Math.abs(phi - currentPhi);
			if (2 * Math.PI - phiDist < phiDist) {
				if (phi < currentPhi) phi += 2 * Math.PI;
				else currentPhi += 2 * Math.PI;
			}
			sphericalDelta.phi = phi - currentPhi;
			scope.update();
		};
		this.setAzimuthalAngle = (value) => {
			let theta = moduloWrapAround(value, 2 * Math.PI);
			let currentTheta = spherical.theta;
			if (currentTheta < 0) currentTheta += 2 * Math.PI;
			if (theta < 0) theta += 2 * Math.PI;
			let thetaDist = Math.abs(theta - currentTheta);
			if (2 * Math.PI - thetaDist < thetaDist) {
				if (theta < currentTheta) theta += 2 * Math.PI;
				else currentTheta += 2 * Math.PI;
			}
			sphericalDelta.theta = theta - currentTheta;
			scope.update();
		};
		this.getDistance = () => scope.object.position.distanceTo(scope.target);
		this.listenToKeyEvents = (domElement2) => {
			domElement2.addEventListener("keydown", onKeyDown);
			this._domElementKeyEvents = domElement2;
		};
		this.stopListenToKeyEvents = () => {
			this._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
			this._domElementKeyEvents = null;
		};
		this.saveState = () => {
			scope.target0.copy(scope.target);
			scope.position0.copy(scope.object.position);
			scope.zoom0 = scope.object.zoom;
		};
		this.reset = () => {
			scope.target.copy(scope.target0);
			scope.object.position.copy(scope.position0);
			scope.object.zoom = scope.zoom0;
			scope.object.updateProjectionMatrix();
			scope.dispatchEvent(changeEvent);
			scope.update();
			state = STATE.NONE;
		};
		this.update = (() => {
			const offset = new Vector3();
			const up = new Vector3(0, 1, 0);
			const quat = new Quaternion().setFromUnitVectors(object.up, up);
			const quatInverse = quat.clone().invert();
			const lastPosition = new Vector3();
			const lastQuaternion = new Quaternion();
			const twoPI = 2 * Math.PI;
			return function update() {
				const position = scope.object.position;
				quat.setFromUnitVectors(object.up, up);
				quatInverse.copy(quat).invert();
				offset.copy(position).sub(scope.target);
				offset.applyQuaternion(quat);
				spherical.setFromVector3(offset);
				if (scope.autoRotate && state === STATE.NONE) rotateLeft(getAutoRotationAngle());
				if (scope.enableDamping) {
					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
					spherical.phi += sphericalDelta.phi * scope.dampingFactor;
				} else {
					spherical.theta += sphericalDelta.theta;
					spherical.phi += sphericalDelta.phi;
				}
				let min = scope.minAzimuthAngle;
				let max = scope.maxAzimuthAngle;
				if (isFinite(min) && isFinite(max)) {
					if (min < -Math.PI) min += twoPI;
					else if (min > Math.PI) min -= twoPI;
					if (max < -Math.PI) max += twoPI;
					else if (max > Math.PI) max -= twoPI;
					if (min <= max) spherical.theta = Math.max(min, Math.min(max, spherical.theta));
					else spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
				}
				spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
				spherical.makeSafe();
				if (scope.enableDamping === true) scope.target.addScaledVector(panOffset, scope.dampingFactor);
				else scope.target.add(panOffset);
				if (scope.zoomToCursor && performCursorZoom || scope.object.isOrthographicCamera) spherical.radius = clampDistance(spherical.radius);
				else spherical.radius = clampDistance(spherical.radius * scale);
				offset.setFromSpherical(spherical);
				offset.applyQuaternion(quatInverse);
				position.copy(scope.target).add(offset);
				if (!scope.object.matrixAutoUpdate) scope.object.updateMatrix();
				scope.object.lookAt(scope.target);
				if (scope.enableDamping === true) {
					sphericalDelta.theta *= 1 - scope.dampingFactor;
					sphericalDelta.phi *= 1 - scope.dampingFactor;
					panOffset.multiplyScalar(1 - scope.dampingFactor);
				} else {
					sphericalDelta.set(0, 0, 0);
					panOffset.set(0, 0, 0);
				}
				let zoomChanged = false;
				if (scope.zoomToCursor && performCursorZoom) {
					let newRadius = null;
					if (scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera) {
						const prevRadius = offset.length();
						newRadius = clampDistance(prevRadius * scale);
						const radiusDelta = prevRadius - newRadius;
						scope.object.position.addScaledVector(dollyDirection, radiusDelta);
						scope.object.updateMatrixWorld();
					} else if (scope.object.isOrthographicCamera) {
						const mouseBefore = new Vector3(mouse.x, mouse.y, 0);
						mouseBefore.unproject(scope.object);
						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / scale));
						scope.object.updateProjectionMatrix();
						zoomChanged = true;
						const mouseAfter = new Vector3(mouse.x, mouse.y, 0);
						mouseAfter.unproject(scope.object);
						scope.object.position.sub(mouseAfter).add(mouseBefore);
						scope.object.updateMatrixWorld();
						newRadius = offset.length();
					} else {
						console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.");
						scope.zoomToCursor = false;
					}
					if (newRadius !== null) {
						if (scope.screenSpacePanning) scope.target.set(0, 0, -1).transformDirection(scope.object.matrix).multiplyScalar(newRadius).add(scope.object.position);
						else {
							_ray.origin.copy(scope.object.position);
							_ray.direction.set(0, 0, -1).transformDirection(scope.object.matrix);
							if (Math.abs(scope.object.up.dot(_ray.direction)) < TILT_LIMIT) object.lookAt(scope.target);
							else {
								_plane.setFromNormalAndCoplanarPoint(scope.object.up, scope.target);
								_ray.intersectPlane(_plane, scope.target);
							}
						}
					}
				} else if (scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) {
					zoomChanged = scale !== 1;
					if (zoomChanged) {
						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / scale));
						scope.object.updateProjectionMatrix();
					}
				}
				scale = 1;
				performCursorZoom = false;
				if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
					scope.dispatchEvent(changeEvent);
					lastPosition.copy(scope.object.position);
					lastQuaternion.copy(scope.object.quaternion);
					zoomChanged = false;
					return true;
				}
				return false;
			};
		})();
		this.connect = (domElement2) => {
			scope.domElement = domElement2;
			scope.domElement.style.touchAction = "none";
			scope.domElement.addEventListener("contextmenu", onContextMenu);
			scope.domElement.addEventListener("pointerdown", onPointerDown);
			scope.domElement.addEventListener("pointercancel", onPointerUp);
			scope.domElement.addEventListener("wheel", onMouseWheel);
		};
		this.dispose = () => {
			var _a, _b, _c, _d, _e, _f;
			if (scope.domElement) scope.domElement.style.touchAction = "auto";
			(_a = scope.domElement) == null || _a.removeEventListener("contextmenu", onContextMenu);
			(_b = scope.domElement) == null || _b.removeEventListener("pointerdown", onPointerDown);
			(_c = scope.domElement) == null || _c.removeEventListener("pointercancel", onPointerUp);
			(_d = scope.domElement) == null || _d.removeEventListener("wheel", onMouseWheel);
			(_e = scope.domElement) == null || _e.ownerDocument.removeEventListener("pointermove", onPointerMove);
			(_f = scope.domElement) == null || _f.ownerDocument.removeEventListener("pointerup", onPointerUp);
			if (scope._domElementKeyEvents !== null) scope._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
		};
		const scope = this;
		const changeEvent = { type: "change" };
		const startEvent = { type: "start" };
		const endEvent = { type: "end" };
		const STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};
		let state = STATE.NONE;
		const EPS = 1e-6;
		const spherical = new Spherical();
		const sphericalDelta = new Spherical();
		let scale = 1;
		const panOffset = new Vector3();
		const rotateStart = new Vector2();
		const rotateEnd = new Vector2();
		const rotateDelta = new Vector2();
		const panStart = new Vector2();
		const panEnd = new Vector2();
		const panDelta = new Vector2();
		const dollyStart = new Vector2();
		const dollyEnd = new Vector2();
		const dollyDelta = new Vector2();
		const dollyDirection = new Vector3();
		const mouse = new Vector2();
		let performCursorZoom = false;
		const pointers = [];
		const pointerPositions = {};
		function getAutoRotationAngle() {
			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
		}
		function getZoomScale() {
			return Math.pow(.95, scope.zoomSpeed);
		}
		function rotateLeft(angle) {
			if (scope.reverseOrbit || scope.reverseHorizontalOrbit) sphericalDelta.theta += angle;
			else sphericalDelta.theta -= angle;
		}
		function rotateUp(angle) {
			if (scope.reverseOrbit || scope.reverseVerticalOrbit) sphericalDelta.phi += angle;
			else sphericalDelta.phi -= angle;
		}
		const panLeft = (() => {
			const v = new Vector3();
			return function panLeft2(distance, objectMatrix) {
				v.setFromMatrixColumn(objectMatrix, 0);
				v.multiplyScalar(-distance);
				panOffset.add(v);
			};
		})();
		const panUp = (() => {
			const v = new Vector3();
			return function panUp2(distance, objectMatrix) {
				if (scope.screenSpacePanning === true) v.setFromMatrixColumn(objectMatrix, 1);
				else {
					v.setFromMatrixColumn(objectMatrix, 0);
					v.crossVectors(scope.object.up, v);
				}
				v.multiplyScalar(distance);
				panOffset.add(v);
			};
		})();
		const pan = (() => {
			const offset = new Vector3();
			return function pan2(deltaX, deltaY) {
				const element = scope.domElement;
				if (element && scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera) {
					const position = scope.object.position;
					offset.copy(position).sub(scope.target);
					let targetDistance = offset.length();
					targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180);
					panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
					panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
				} else if (element && scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) {
					panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
					panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
				} else {
					console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
					scope.enablePan = false;
				}
			};
		})();
		function setScale(newScale) {
			if (scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera || scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) scale = newScale;
			else {
				console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
				scope.enableZoom = false;
			}
		}
		function dollyOut(dollyScale) {
			setScale(scale / dollyScale);
		}
		function dollyIn(dollyScale) {
			setScale(scale * dollyScale);
		}
		function updateMouseParameters(event) {
			if (!scope.zoomToCursor || !scope.domElement) return;
			performCursorZoom = true;
			const rect = scope.domElement.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			const w = rect.width;
			const h = rect.height;
			mouse.x = x / w * 2 - 1;
			mouse.y = -(y / h) * 2 + 1;
			dollyDirection.set(mouse.x, mouse.y, 1).unproject(scope.object).sub(scope.object.position).normalize();
		}
		function clampDistance(dist) {
			return Math.max(scope.minDistance, Math.min(scope.maxDistance, dist));
		}
		function handleMouseDownRotate(event) {
			rotateStart.set(event.clientX, event.clientY);
		}
		function handleMouseDownDolly(event) {
			updateMouseParameters(event);
			dollyStart.set(event.clientX, event.clientY);
		}
		function handleMouseDownPan(event) {
			panStart.set(event.clientX, event.clientY);
		}
		function handleMouseMoveRotate(event) {
			rotateEnd.set(event.clientX, event.clientY);
			rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
			const element = scope.domElement;
			if (element) {
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
			}
			rotateStart.copy(rotateEnd);
			scope.update();
		}
		function handleMouseMoveDolly(event) {
			dollyEnd.set(event.clientX, event.clientY);
			dollyDelta.subVectors(dollyEnd, dollyStart);
			if (dollyDelta.y > 0) dollyOut(getZoomScale());
			else if (dollyDelta.y < 0) dollyIn(getZoomScale());
			dollyStart.copy(dollyEnd);
			scope.update();
		}
		function handleMouseMovePan(event) {
			panEnd.set(event.clientX, event.clientY);
			panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
			pan(panDelta.x, panDelta.y);
			panStart.copy(panEnd);
			scope.update();
		}
		function handleMouseWheel(event) {
			updateMouseParameters(event);
			if (event.deltaY < 0) dollyIn(getZoomScale());
			else if (event.deltaY > 0) dollyOut(getZoomScale());
			scope.update();
		}
		function handleKeyDown(event) {
			let needsUpdate = false;
			switch (event.code) {
				case scope.keys.UP:
					pan(0, scope.keyPanSpeed);
					needsUpdate = true;
					break;
				case scope.keys.BOTTOM:
					pan(0, -scope.keyPanSpeed);
					needsUpdate = true;
					break;
				case scope.keys.LEFT:
					pan(scope.keyPanSpeed, 0);
					needsUpdate = true;
					break;
				case scope.keys.RIGHT:
					pan(-scope.keyPanSpeed, 0);
					needsUpdate = true;
			}
			if (needsUpdate) {
				event.preventDefault();
				scope.update();
			}
		}
		function handleTouchStartRotate() {
			if (pointers.length == 1) rotateStart.set(pointers[0].pageX, pointers[0].pageY);
			else {
				const x = .5 * (pointers[0].pageX + pointers[1].pageX);
				const y = .5 * (pointers[0].pageY + pointers[1].pageY);
				rotateStart.set(x, y);
			}
		}
		function handleTouchStartPan() {
			if (pointers.length == 1) panStart.set(pointers[0].pageX, pointers[0].pageY);
			else {
				const x = .5 * (pointers[0].pageX + pointers[1].pageX);
				const y = .5 * (pointers[0].pageY + pointers[1].pageY);
				panStart.set(x, y);
			}
		}
		function handleTouchStartDolly() {
			const dx = pointers[0].pageX - pointers[1].pageX;
			const dy = pointers[0].pageY - pointers[1].pageY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			dollyStart.set(0, distance);
		}
		function handleTouchStartDollyPan() {
			if (scope.enableZoom) handleTouchStartDolly();
			if (scope.enablePan) handleTouchStartPan();
		}
		function handleTouchStartDollyRotate() {
			if (scope.enableZoom) handleTouchStartDolly();
			if (scope.enableRotate) handleTouchStartRotate();
		}
		function handleTouchMoveRotate(event) {
			if (pointers.length == 1) rotateEnd.set(event.pageX, event.pageY);
			else {
				const position = getSecondPointerPosition(event);
				const x = .5 * (event.pageX + position.x);
				const y = .5 * (event.pageY + position.y);
				rotateEnd.set(x, y);
			}
			rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
			const element = scope.domElement;
			if (element) {
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
			}
			rotateStart.copy(rotateEnd);
		}
		function handleTouchMovePan(event) {
			if (pointers.length == 1) panEnd.set(event.pageX, event.pageY);
			else {
				const position = getSecondPointerPosition(event);
				const x = .5 * (event.pageX + position.x);
				const y = .5 * (event.pageY + position.y);
				panEnd.set(x, y);
			}
			panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
			pan(panDelta.x, panDelta.y);
			panStart.copy(panEnd);
		}
		function handleTouchMoveDolly(event) {
			const position = getSecondPointerPosition(event);
			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			dollyEnd.set(0, distance);
			dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
			dollyOut(dollyDelta.y);
			dollyStart.copy(dollyEnd);
		}
		function handleTouchMoveDollyPan(event) {
			if (scope.enableZoom) handleTouchMoveDolly(event);
			if (scope.enablePan) handleTouchMovePan(event);
		}
		function handleTouchMoveDollyRotate(event) {
			if (scope.enableZoom) handleTouchMoveDolly(event);
			if (scope.enableRotate) handleTouchMoveRotate(event);
		}
		function onPointerDown(event) {
			var _a, _b;
			if (scope.enabled === false) return;
			if (pointers.length === 0) {
				(_a = scope.domElement) == null || _a.ownerDocument.addEventListener("pointermove", onPointerMove);
				(_b = scope.domElement) == null || _b.ownerDocument.addEventListener("pointerup", onPointerUp);
			}
			addPointer(event);
			if (event.pointerType === "touch") onTouchStart(event);
			else onMouseDown(event);
		}
		function onPointerMove(event) {
			if (scope.enabled === false) return;
			if (event.pointerType === "touch") onTouchMove(event);
			else onMouseMove(event);
		}
		function onPointerUp(event) {
			var _a, _b, _c;
			removePointer(event);
			if (pointers.length === 0) {
				(_a = scope.domElement) == null || _a.releasePointerCapture(event.pointerId);
				(_b = scope.domElement) == null || _b.ownerDocument.removeEventListener("pointermove", onPointerMove);
				(_c = scope.domElement) == null || _c.ownerDocument.removeEventListener("pointerup", onPointerUp);
			}
			scope.dispatchEvent(endEvent);
			state = STATE.NONE;
		}
		function onMouseDown(event) {
			let mouseAction;
			switch (event.button) {
				case 0:
					mouseAction = scope.mouseButtons.LEFT;
					break;
				case 1:
					mouseAction = scope.mouseButtons.MIDDLE;
					break;
				case 2:
					mouseAction = scope.mouseButtons.RIGHT;
					break;
				default: mouseAction = -1;
			}
			switch (mouseAction) {
				case MOUSE.DOLLY:
					if (scope.enableZoom === false) return;
					handleMouseDownDolly(event);
					state = STATE.DOLLY;
					break;
				case MOUSE.ROTATE:
					if (event.ctrlKey || event.metaKey || event.shiftKey) {
						if (scope.enablePan === false) return;
						handleMouseDownPan(event);
						state = STATE.PAN;
					} else {
						if (scope.enableRotate === false) return;
						handleMouseDownRotate(event);
						state = STATE.ROTATE;
					}
					break;
				case MOUSE.PAN:
					if (event.ctrlKey || event.metaKey || event.shiftKey) {
						if (scope.enableRotate === false) return;
						handleMouseDownRotate(event);
						state = STATE.ROTATE;
					} else {
						if (scope.enablePan === false) return;
						handleMouseDownPan(event);
						state = STATE.PAN;
					}
					break;
				default: state = STATE.NONE;
			}
			if (state !== STATE.NONE) scope.dispatchEvent(startEvent);
		}
		function onMouseMove(event) {
			if (scope.enabled === false) return;
			switch (state) {
				case STATE.ROTATE:
					if (scope.enableRotate === false) return;
					handleMouseMoveRotate(event);
					break;
				case STATE.DOLLY:
					if (scope.enableZoom === false) return;
					handleMouseMoveDolly(event);
					break;
				case STATE.PAN:
					if (scope.enablePan === false) return;
					handleMouseMovePan(event);
			}
		}
		function onMouseWheel(event) {
			if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;
			event.preventDefault();
			scope.dispatchEvent(startEvent);
			handleMouseWheel(event);
			scope.dispatchEvent(endEvent);
		}
		function onKeyDown(event) {
			if (scope.enabled === false || scope.enablePan === false) return;
			handleKeyDown(event);
		}
		function onTouchStart(event) {
			trackPointer(event);
			switch (pointers.length) {
				case 1:
					switch (scope.touches.ONE) {
						case TOUCH.ROTATE:
							if (scope.enableRotate === false) return;
							handleTouchStartRotate();
							state = STATE.TOUCH_ROTATE;
							break;
						case TOUCH.PAN:
							if (scope.enablePan === false) return;
							handleTouchStartPan();
							state = STATE.TOUCH_PAN;
							break;
						default: state = STATE.NONE;
					}
					break;
				case 2:
					switch (scope.touches.TWO) {
						case TOUCH.DOLLY_PAN:
							if (scope.enableZoom === false && scope.enablePan === false) return;
							handleTouchStartDollyPan();
							state = STATE.TOUCH_DOLLY_PAN;
							break;
						case TOUCH.DOLLY_ROTATE:
							if (scope.enableZoom === false && scope.enableRotate === false) return;
							handleTouchStartDollyRotate();
							state = STATE.TOUCH_DOLLY_ROTATE;
							break;
						default: state = STATE.NONE;
					}
					break;
				default: state = STATE.NONE;
			}
			if (state !== STATE.NONE) scope.dispatchEvent(startEvent);
		}
		function onTouchMove(event) {
			trackPointer(event);
			switch (state) {
				case STATE.TOUCH_ROTATE:
					if (scope.enableRotate === false) return;
					handleTouchMoveRotate(event);
					scope.update();
					break;
				case STATE.TOUCH_PAN:
					if (scope.enablePan === false) return;
					handleTouchMovePan(event);
					scope.update();
					break;
				case STATE.TOUCH_DOLLY_PAN:
					if (scope.enableZoom === false && scope.enablePan === false) return;
					handleTouchMoveDollyPan(event);
					scope.update();
					break;
				case STATE.TOUCH_DOLLY_ROTATE:
					if (scope.enableZoom === false && scope.enableRotate === false) return;
					handleTouchMoveDollyRotate(event);
					scope.update();
					break;
				default: state = STATE.NONE;
			}
		}
		function onContextMenu(event) {
			if (scope.enabled === false) return;
			event.preventDefault();
		}
		function addPointer(event) {
			pointers.push(event);
		}
		function removePointer(event) {
			delete pointerPositions[event.pointerId];
			for (let i = 0; i < pointers.length; i++) if (pointers[i].pointerId == event.pointerId) {
				pointers.splice(i, 1);
				return;
			}
		}
		function trackPointer(event) {
			let position = pointerPositions[event.pointerId];
			if (position === void 0) {
				position = new Vector2();
				pointerPositions[event.pointerId] = position;
			}
			position.set(event.pageX, event.pageY);
		}
		function getSecondPointerPosition(event) {
			const pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
			return pointerPositions[pointer.pointerId];
		}
		this.dollyIn = (dollyScale = getZoomScale()) => {
			dollyIn(dollyScale);
			scope.update();
		};
		this.dollyOut = (dollyScale = getZoomScale()) => {
			dollyOut(dollyScale);
			scope.update();
		};
		this.getScale = () => {
			return scale;
		};
		this.setScale = (newScale) => {
			setScale(newScale);
			scope.update();
		};
		this.getZoomScale = () => {
			return getZoomScale();
		};
		if (domElement !== void 0) this.connect(domElement);
		this.update();
	}
};
export { Maximize2 as n, OrbitControls as t };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JiaXRDb250cm9scy1DcFk3X29RZy5qcyIsIm5hbWVzIjpbIl9fZGVmUHJvcCIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fcHVibGljRmllbGQiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbHVjaWRlLXJlYWN0QDEuNjIuMF9AdHlwZXMrcmVhY3RAMTkuMy4wX3JlYWN0QDE5LjMuMS9ub2RlX21vZHVsZXMvbHVjaWRlLXJlYWN0L2Rpc3QvZXNtL2ljb25zL21heGltaXplLTIubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3RocmVlLXN0ZGxpYkAyLjM2LjFfdGhyZWVAMC4xODYuMS9ub2RlX21vZHVsZXMvdGhyZWUtc3RkbGliL2NvbnRyb2xzL0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS90aHJlZS1zdGRsaWJAMi4zNi4xX3RocmVlQDAuMTg2LjEvbm9kZV9tb2R1bGVzL3RocmVlLXN0ZGxpYi9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2UgbHVjaWRlLXJlYWN0IHYxLjYyLjAgLSBJU0NcbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBJU0MgbGljZW5zZS5cbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBjcmVhdGVMdWNpZGVJY29uIGZyb20gJy4uL2NyZWF0ZUx1Y2lkZUljb24ubWpzJztcblxuY29uc3QgX19pY29uRGF0YSA9IHtcbiAgbmFtZTogXCJtYXhpbWl6ZS0yXCIsXG4gIHNpemU6IDI0LFxuICBub2RlOiBbXG4gICAgW1wicGF0aFwiLCB7IGQ6IFwiTTE1IDNoNnY2XCIsIGtleTogXCIxcTlmd3RcIiB9XSxcbiAgICBbXCJwYXRoXCIsIHsgZDogXCJtMjEgMy03IDdcIiwga2V5OiBcIjFsMmFzclwiIH1dLFxuICAgIFtcInBhdGhcIiwgeyBkOiBcIm0zIDIxIDctN1wiLCBrZXk6IFwidGp4NWFpXCIgfV0sXG4gICAgW1wicGF0aFwiLCB7IGQ6IFwiTTkgMjFIM3YtNlwiLCBrZXk6IFwid3R2a3Z2XCIgfV1cbiAgXVxufTtcbl9faWNvbkRhdGEubm9kZTtcbmNvbnN0IE1heGltaXplMiA9IGNyZWF0ZUx1Y2lkZUljb24oX19pY29uRGF0YSk7XG5cbmV4cG9ydCB7IF9faWNvbkRhdGEsIE1heGltaXplMiBhcyBkZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXhpbWl6ZS0yLm1qcy5tYXBcbiIsInZhciBfX2RlZlByb3AgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgX19kZWZOb3JtYWxQcm9wID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ga2V5IGluIG9iaiA/IF9fZGVmUHJvcChvYmosIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZSB9KSA6IG9ialtrZXldID0gdmFsdWU7XG52YXIgX19wdWJsaWNGaWVsZCA9IChvYmosIGtleSwgdmFsdWUpID0+IHtcbiAgX19kZWZOb3JtYWxQcm9wKG9iaiwgdHlwZW9mIGtleSAhPT0gXCJzeW1ib2xcIiA/IGtleSArIFwiXCIgOiBrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcbmNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIG5vdCBkZWZpbmVkIGluIEB0eXBlcy90aHJlZVxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJfbGlzdGVuZXJzXCIpO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdG8gYW4gZXZlbnQgdHlwZS5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgZXZlbnQgdG8gbGlzdGVuIHRvLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWQuXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdm9pZCAwKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gPT09IHZvaWQgMCkge1xuICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgfVxuICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICBsaXN0ZW5lcnNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgICAgKiBDaGVja3MgaWYgbGlzdGVuZXIgaXMgYWRkZWQgdG8gYW4gZXZlbnQgdHlwZS5cbiAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgZXZlbnQgdG8gbGlzdGVuIHRvLlxuICAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWQuXG4gICAgICAqL1xuICBoYXNFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdm9pZCAwKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcbiAgICByZXR1cm4gbGlzdGVuZXJzW3R5cGVdICE9PSB2b2lkIDAgJiYgbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpICE9PSAtMTtcbiAgfVxuICAvKipcbiAgICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYW4gZXZlbnQgdHlwZS5cbiAgICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGxpc3RlbmVyIHRoYXQgZ2V0cyByZW1vdmVkLlxuICAgICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHRoYXQgZ2V0cyByZW1vdmVkLlxuICAgICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHZvaWQgMClcbiAgICAgIHJldHVybjtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG4gICAgY29uc3QgbGlzdGVuZXJBcnJheSA9IGxpc3RlbmVyc1t0eXBlXTtcbiAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdm9pZCAwKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVyQXJyYXkuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGxpc3RlbmVyQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAgICAqIEZpcmUgYW4gZXZlbnQgdHlwZS5cbiAgICAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0aGF0IGdldHMgZmlyZWQuXG4gICAgICAqL1xuICBkaXNwYXRjaEV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdm9pZCAwKVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcbiAgICBjb25zdCBsaXN0ZW5lckFycmF5ID0gbGlzdGVuZXJzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB2b2lkIDApIHtcbiAgICAgIGV2ZW50LnRhcmdldCA9IHRoaXM7XG4gICAgICBjb25zdCBhcnJheSA9IGxpc3RlbmVyQXJyYXkuc2xpY2UoMCk7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBhcnJheVtpXS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIGV2ZW50LnRhcmdldCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5leHBvcnQge1xuICBFdmVudERpc3BhdGNoZXJcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1FdmVudERpc3BhdGNoZXIuanMubWFwXG4iLCJ2YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZGVmTm9ybWFsUHJvcCA9IChvYmosIGtleSwgdmFsdWUpID0+IGtleSBpbiBvYmogPyBfX2RlZlByb3Aob2JqLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWUgfSkgOiBvYmpba2V5XSA9IHZhbHVlO1xudmFyIF9fcHVibGljRmllbGQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG4gIF9fZGVmTm9ybWFsUHJvcChvYmosIHR5cGVvZiBrZXkgIT09IFwic3ltYm9sXCIgPyBrZXkgKyBcIlwiIDoga2V5LCB2YWx1ZSk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5pbXBvcnQgeyBWZWN0b3IzLCBNT1VTRSwgVE9VQ0gsIFF1YXRlcm5pb24sIFBlcnNwZWN0aXZlQ2FtZXJhLCBPcnRob2dyYXBoaWNDYW1lcmEsIFNwaGVyaWNhbCwgVmVjdG9yMiwgUmF5LCBQbGFuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcIi4vRXZlbnREaXNwYXRjaGVyLmpzXCI7XG5jb25zdCBfcmF5ID0gLyogQF9fUFVSRV9fICovIG5ldyBSYXkoKTtcbmNvbnN0IF9wbGFuZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUGxhbmUoKTtcbmNvbnN0IFRJTFRfTElNSVQgPSBNYXRoLmNvcyg3MCAqIChNYXRoLlBJIC8gMTgwKSk7XG5jb25zdCBtb2R1bG9XcmFwQXJvdW5kID0gKG9mZnNldCwgY2FwYWNpdHkpID0+IChvZmZzZXQgJSBjYXBhY2l0eSArIGNhcGFjaXR5KSAlIGNhcGFjaXR5O1xuY2xhc3MgT3JiaXRDb250cm9scyBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKG9iamVjdCwgZG9tRWxlbWVudCkge1xuICAgIHN1cGVyKCk7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcIm9iamVjdFwiKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZG9tRWxlbWVudFwiKTtcbiAgICAvLyBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGNvbnRyb2xcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZW5hYmxlZFwiLCB0cnVlKTtcbiAgICAvLyBcInRhcmdldFwiIHNldHMgdGhlIGxvY2F0aW9uIG9mIGZvY3VzLCB3aGVyZSB0aGUgb2JqZWN0IG9yYml0cyBhcm91bmRcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwidGFyZ2V0XCIsIG5ldyBWZWN0b3IzKCkpO1xuICAgIC8vIEhvdyBmYXIgeW91IGNhbiBkb2xseSBpbiBhbmQgb3V0ICggUGVyc3BlY3RpdmVDYW1lcmEgb25seSApXG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcIm1pbkRpc3RhbmNlXCIsIDApO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJtYXhEaXN0YW5jZVwiLCBJbmZpbml0eSk7XG4gICAgLy8gSG93IGZhciB5b3UgY2FuIHpvb20gaW4gYW5kIG91dCAoIE9ydGhvZ3JhcGhpY0NhbWVyYSBvbmx5IClcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwibWluWm9vbVwiLCAwKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwibWF4Wm9vbVwiLCBJbmZpbml0eSk7XG4gICAgLy8gSG93IGZhciB5b3UgY2FuIG9yYml0IHZlcnRpY2FsbHksIHVwcGVyIGFuZCBsb3dlciBsaW1pdHMuXG4gICAgLy8gUmFuZ2UgaXMgMCB0byBNYXRoLlBJIHJhZGlhbnMuXG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcIm1pblBvbGFyQW5nbGVcIiwgMCk7XG4gICAgLy8gcmFkaWFuc1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJtYXhQb2xhckFuZ2xlXCIsIE1hdGguUEkpO1xuICAgIC8vIHJhZGlhbnNcbiAgICAvLyBIb3cgZmFyIHlvdSBjYW4gb3JiaXQgaG9yaXpvbnRhbGx5LCB1cHBlciBhbmQgbG93ZXIgbGltaXRzLlxuICAgIC8vIElmIHNldCwgdGhlIGludGVydmFsIFsgbWluLCBtYXggXSBtdXN0IGJlIGEgc3ViLWludGVydmFsIG9mIFsgLSAyIFBJLCAyIFBJIF0sIHdpdGggKCBtYXggLSBtaW4gPCAyIFBJIClcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwibWluQXppbXV0aEFuZ2xlXCIsIC1JbmZpbml0eSk7XG4gICAgLy8gcmFkaWFuc1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJtYXhBemltdXRoQW5nbGVcIiwgSW5maW5pdHkpO1xuICAgIC8vIHJhZGlhbnNcbiAgICAvLyBTZXQgdG8gdHJ1ZSB0byBlbmFibGUgZGFtcGluZyAoaW5lcnRpYSlcbiAgICAvLyBJZiBkYW1waW5nIGlzIGVuYWJsZWQsIHlvdSBtdXN0IGNhbGwgY29udHJvbHMudXBkYXRlKCkgaW4geW91ciBhbmltYXRpb24gbG9vcFxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJlbmFibGVEYW1waW5nXCIsIGZhbHNlKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZGFtcGluZ0ZhY3RvclwiLCAwLjA1KTtcbiAgICAvLyBUaGlzIG9wdGlvbiBhY3R1YWxseSBlbmFibGVzIGRvbGx5aW5nIGluIGFuZCBvdXQ7IGxlZnQgYXMgXCJ6b29tXCIgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHpvb21pbmdcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZW5hYmxlWm9vbVwiLCB0cnVlKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiem9vbVNwZWVkXCIsIDEpO1xuICAgIC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHJvdGF0aW5nXG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImVuYWJsZVJvdGF0ZVwiLCB0cnVlKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwicm90YXRlU3BlZWRcIiwgMSk7XG4gICAgLy8gU2V0IHRvIGZhbHNlIHRvIGRpc2FibGUgcGFubmluZ1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJlbmFibGVQYW5cIiwgdHJ1ZSk7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcInBhblNwZWVkXCIsIDEpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJzY3JlZW5TcGFjZVBhbm5pbmdcIiwgdHJ1ZSk7XG4gICAgLy8gaWYgZmFsc2UsIHBhbiBvcnRob2dvbmFsIHRvIHdvcmxkLXNwYWNlIGRpcmVjdGlvbiBjYW1lcmEudXBcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwia2V5UGFuU3BlZWRcIiwgNyk7XG4gICAgLy8gcGl4ZWxzIG1vdmVkIHBlciBhcnJvdyBrZXkgcHVzaFxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJ6b29tVG9DdXJzb3JcIiwgZmFsc2UpO1xuICAgIC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XG4gICAgLy8gSWYgYXV0by1yb3RhdGUgaXMgZW5hYmxlZCwgeW91IG11c3QgY2FsbCBjb250cm9scy51cGRhdGUoKSBpbiB5b3VyIGFuaW1hdGlvbiBsb29wXG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImF1dG9Sb3RhdGVcIiwgZmFsc2UpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJhdXRvUm90YXRlU3BlZWRcIiwgMik7XG4gICAgLy8gMzAgc2Vjb25kcyBwZXIgb3JiaXQgd2hlbiBmcHMgaXMgNjBcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwicmV2ZXJzZU9yYml0XCIsIGZhbHNlKTtcbiAgICAvLyB0cnVlIGlmIHlvdSB3YW50IHRvIHJldmVyc2UgdGhlIG9yYml0IHRvIG1vdXNlIGRyYWcgZnJvbSBsZWZ0IHRvIHJpZ2h0ID0gb3JiaXRzIGxlZnRcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwicmV2ZXJzZUhvcml6b250YWxPcmJpdFwiLCBmYWxzZSk7XG4gICAgLy8gdHJ1ZSBpZiB5b3Ugd2FudCB0byByZXZlcnNlIHRoZSBob3Jpem9udGFsIG9yYml0IGRpcmVjdGlvblxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJyZXZlcnNlVmVydGljYWxPcmJpdFwiLCBmYWxzZSk7XG4gICAgLy8gdHJ1ZSBpZiB5b3Ugd2FudCB0byByZXZlcnNlIHRoZSB2ZXJ0aWNhbCBvcmJpdCBkaXJlY3Rpb25cbiAgICAvLyBUaGUgZm91ciBhcnJvdyBrZXlzXG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImtleXNcIiwgeyBMRUZUOiBcIkFycm93TGVmdFwiLCBVUDogXCJBcnJvd1VwXCIsIFJJR0hUOiBcIkFycm93UmlnaHRcIiwgQk9UVE9NOiBcIkFycm93RG93blwiIH0pO1xuICAgIC8vIE1vdXNlIGJ1dHRvbnNcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwibW91c2VCdXR0b25zXCIsIHtcbiAgICAgIExFRlQ6IE1PVVNFLlJPVEFURSxcbiAgICAgIE1JRERMRTogTU9VU0UuRE9MTFksXG4gICAgICBSSUdIVDogTU9VU0UuUEFOXG4gICAgfSk7XG4gICAgLy8gVG91Y2ggZmluZ2Vyc1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJ0b3VjaGVzXCIsIHsgT05FOiBUT1VDSC5ST1RBVEUsIFRXTzogVE9VQ0guRE9MTFlfUEFOIH0pO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJ0YXJnZXQwXCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJwb3NpdGlvbjBcIik7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcInpvb20wXCIpO1xuICAgIC8vIHRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgZm9yIGtleSBldmVudHNcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiX2RvbUVsZW1lbnRLZXlFdmVudHNcIiwgbnVsbCk7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImdldFBvbGFyQW5nbGVcIik7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImdldEF6aW11dGhhbEFuZ2xlXCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJzZXRQb2xhckFuZ2xlXCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJzZXRBemltdXRoYWxBbmdsZVwiKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZ2V0RGlzdGFuY2VcIik7XG4gICAgLy8gTm90IHVzZWQgaW4gbW9zdCBzY2VuYXJpb3MsIGhvd2V2ZXIgdGhleSBjYW4gYmUgdXNlZnVsIGZvciBzcGVjaWZpYyB1c2UgY2FzZXNcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwiZ2V0Wm9vbVNjYWxlXCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJsaXN0ZW5Ub0tleUV2ZW50c1wiKTtcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwic3RvcExpc3RlblRvS2V5RXZlbnRzXCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJzYXZlU3RhdGVcIik7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcInJlc2V0XCIpO1xuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJ1cGRhdGVcIik7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImNvbm5lY3RcIik7XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImRpc3Bvc2VcIik7XG4gICAgLy8gRG9sbHkgaW4gcHJvZ3JhbW1hdGljYWxseVxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJkb2xseUluXCIpO1xuICAgIC8vIERvbGx5IG91dCBwcm9ncmFtbWF0aWNhbGx5XG4gICAgX19wdWJsaWNGaWVsZCh0aGlzLCBcImRvbGx5T3V0XCIpO1xuICAgIC8vIEdldCB0aGUgY3VycmVudCBzY2FsZVxuICAgIF9fcHVibGljRmllbGQodGhpcywgXCJnZXRTY2FsZVwiKTtcbiAgICAvLyBTZXQgdGhlIGN1cnJlbnQgc2NhbGUgKHRoZXNlIGFyZSBub3QgdXNlZCBpbiBtb3N0IHNjZW5hcmlvcywgaG93ZXZlciB0aGV5IGNhbiBiZSB1c2VmdWwgZm9yIHNwZWNpZmljIHVzZSBjYXNlcylcbiAgICBfX3B1YmxpY0ZpZWxkKHRoaXMsIFwic2V0U2NhbGVcIik7XG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcbiAgICB0aGlzLnRhcmdldDAgPSB0aGlzLnRhcmdldC5jbG9uZSgpO1xuICAgIHRoaXMucG9zaXRpb24wID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcbiAgICB0aGlzLnpvb20wID0gdGhpcy5vYmplY3Quem9vbTtcbiAgICB0aGlzLmdldFBvbGFyQW5nbGUgPSAoKSA9PiBzcGhlcmljYWwucGhpO1xuICAgIHRoaXMuZ2V0QXppbXV0aGFsQW5nbGUgPSAoKSA9PiBzcGhlcmljYWwudGhldGE7XG4gICAgdGhpcy5zZXRQb2xhckFuZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgICBsZXQgcGhpID0gbW9kdWxvV3JhcEFyb3VuZCh2YWx1ZSwgMiAqIE1hdGguUEkpO1xuICAgICAgbGV0IGN1cnJlbnRQaGkgPSBzcGhlcmljYWwucGhpO1xuICAgICAgaWYgKGN1cnJlbnRQaGkgPCAwKVxuICAgICAgICBjdXJyZW50UGhpICs9IDIgKiBNYXRoLlBJO1xuICAgICAgaWYgKHBoaSA8IDApXG4gICAgICAgIHBoaSArPSAyICogTWF0aC5QSTtcbiAgICAgIGxldCBwaGlEaXN0ID0gTWF0aC5hYnMocGhpIC0gY3VycmVudFBoaSk7XG4gICAgICBpZiAoMiAqIE1hdGguUEkgLSBwaGlEaXN0IDwgcGhpRGlzdCkge1xuICAgICAgICBpZiAocGhpIDwgY3VycmVudFBoaSkge1xuICAgICAgICAgIHBoaSArPSAyICogTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50UGhpICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzcGhlcmljYWxEZWx0YS5waGkgPSBwaGkgLSBjdXJyZW50UGhpO1xuICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgfTtcbiAgICB0aGlzLnNldEF6aW11dGhhbEFuZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgICBsZXQgdGhldGEgPSBtb2R1bG9XcmFwQXJvdW5kKHZhbHVlLCAyICogTWF0aC5QSSk7XG4gICAgICBsZXQgY3VycmVudFRoZXRhID0gc3BoZXJpY2FsLnRoZXRhO1xuICAgICAgaWYgKGN1cnJlbnRUaGV0YSA8IDApXG4gICAgICAgIGN1cnJlbnRUaGV0YSArPSAyICogTWF0aC5QSTtcbiAgICAgIGlmICh0aGV0YSA8IDApXG4gICAgICAgIHRoZXRhICs9IDIgKiBNYXRoLlBJO1xuICAgICAgbGV0IHRoZXRhRGlzdCA9IE1hdGguYWJzKHRoZXRhIC0gY3VycmVudFRoZXRhKTtcbiAgICAgIGlmICgyICogTWF0aC5QSSAtIHRoZXRhRGlzdCA8IHRoZXRhRGlzdCkge1xuICAgICAgICBpZiAodGhldGEgPCBjdXJyZW50VGhldGEpIHtcbiAgICAgICAgICB0aGV0YSArPSAyICogTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50VGhldGEgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNwaGVyaWNhbERlbHRhLnRoZXRhID0gdGhldGEgLSBjdXJyZW50VGhldGE7XG4gICAgICBzY29wZS51cGRhdGUoKTtcbiAgICB9O1xuICAgIHRoaXMuZ2V0RGlzdGFuY2UgPSAoKSA9PiBzY29wZS5vYmplY3QucG9zaXRpb24uZGlzdGFuY2VUbyhzY29wZS50YXJnZXQpO1xuICAgIHRoaXMubGlzdGVuVG9LZXlFdmVudHMgPSAoZG9tRWxlbWVudDIpID0+IHtcbiAgICAgIGRvbUVsZW1lbnQyLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5RG93bik7XG4gICAgICB0aGlzLl9kb21FbGVtZW50S2V5RXZlbnRzID0gZG9tRWxlbWVudDI7XG4gICAgfTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5Ub0tleUV2ZW50cyA9ICgpID0+IHtcbiAgICAgIHRoaXMuX2RvbUVsZW1lbnRLZXlFdmVudHMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgb25LZXlEb3duKTtcbiAgICAgIHRoaXMuX2RvbUVsZW1lbnRLZXlFdmVudHMgPSBudWxsO1xuICAgIH07XG4gICAgdGhpcy5zYXZlU3RhdGUgPSAoKSA9PiB7XG4gICAgICBzY29wZS50YXJnZXQwLmNvcHkoc2NvcGUudGFyZ2V0KTtcbiAgICAgIHNjb3BlLnBvc2l0aW9uMC5jb3B5KHNjb3BlLm9iamVjdC5wb3NpdGlvbik7XG4gICAgICBzY29wZS56b29tMCA9IHNjb3BlLm9iamVjdC56b29tO1xuICAgIH07XG4gICAgdGhpcy5yZXNldCA9ICgpID0+IHtcbiAgICAgIHNjb3BlLnRhcmdldC5jb3B5KHNjb3BlLnRhcmdldDApO1xuICAgICAgc2NvcGUub2JqZWN0LnBvc2l0aW9uLmNvcHkoc2NvcGUucG9zaXRpb24wKTtcbiAgICAgIHNjb3BlLm9iamVjdC56b29tID0gc2NvcGUuem9vbTA7XG4gICAgICBzY29wZS5vYmplY3QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCk7XG4gICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG5ldyBWZWN0b3IzKCk7XG4gICAgICBjb25zdCB1cCA9IG5ldyBWZWN0b3IzKDAsIDEsIDApO1xuICAgICAgY29uc3QgcXVhdCA9IG5ldyBRdWF0ZXJuaW9uKCkuc2V0RnJvbVVuaXRWZWN0b3JzKG9iamVjdC51cCwgdXApO1xuICAgICAgY29uc3QgcXVhdEludmVyc2UgPSBxdWF0LmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICBjb25zdCBsYXN0UG9zaXRpb24gPSBuZXcgVmVjdG9yMygpO1xuICAgICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuICAgICAgY29uc3QgdHdvUEkgPSAyICogTWF0aC5QSTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gc2NvcGUub2JqZWN0LnBvc2l0aW9uO1xuICAgICAgICBxdWF0LnNldEZyb21Vbml0VmVjdG9ycyhvYmplY3QudXAsIHVwKTtcbiAgICAgICAgcXVhdEludmVyc2UuY29weShxdWF0KS5pbnZlcnQoKTtcbiAgICAgICAgb2Zmc2V0LmNvcHkocG9zaXRpb24pLnN1YihzY29wZS50YXJnZXQpO1xuICAgICAgICBvZmZzZXQuYXBwbHlRdWF0ZXJuaW9uKHF1YXQpO1xuICAgICAgICBzcGhlcmljYWwuc2V0RnJvbVZlY3RvcjMob2Zmc2V0KTtcbiAgICAgICAgaWYgKHNjb3BlLmF1dG9Sb3RhdGUgJiYgc3RhdGUgPT09IFNUQVRFLk5PTkUpIHtcbiAgICAgICAgICByb3RhdGVMZWZ0KGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZS5lbmFibGVEYW1waW5nKSB7XG4gICAgICAgICAgc3BoZXJpY2FsLnRoZXRhICs9IHNwaGVyaWNhbERlbHRhLnRoZXRhICogc2NvcGUuZGFtcGluZ0ZhY3RvcjtcbiAgICAgICAgICBzcGhlcmljYWwucGhpICs9IHNwaGVyaWNhbERlbHRhLnBoaSAqIHNjb3BlLmRhbXBpbmdGYWN0b3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BoZXJpY2FsLnRoZXRhICs9IHNwaGVyaWNhbERlbHRhLnRoZXRhO1xuICAgICAgICAgIHNwaGVyaWNhbC5waGkgKz0gc3BoZXJpY2FsRGVsdGEucGhpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtaW4gPSBzY29wZS5taW5BemltdXRoQW5nbGU7XG4gICAgICAgIGxldCBtYXggPSBzY29wZS5tYXhBemltdXRoQW5nbGU7XG4gICAgICAgIGlmIChpc0Zpbml0ZShtaW4pICYmIGlzRmluaXRlKG1heCkpIHtcbiAgICAgICAgICBpZiAobWluIDwgLU1hdGguUEkpXG4gICAgICAgICAgICBtaW4gKz0gdHdvUEk7XG4gICAgICAgICAgZWxzZSBpZiAobWluID4gTWF0aC5QSSlcbiAgICAgICAgICAgIG1pbiAtPSB0d29QSTtcbiAgICAgICAgICBpZiAobWF4IDwgLU1hdGguUEkpXG4gICAgICAgICAgICBtYXggKz0gdHdvUEk7XG4gICAgICAgICAgZWxzZSBpZiAobWF4ID4gTWF0aC5QSSlcbiAgICAgICAgICAgIG1heCAtPSB0d29QSTtcbiAgICAgICAgICBpZiAobWluIDw9IG1heCkge1xuICAgICAgICAgICAgc3BoZXJpY2FsLnRoZXRhID0gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHNwaGVyaWNhbC50aGV0YSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGhlcmljYWwudGhldGEgPSBzcGhlcmljYWwudGhldGEgPiAobWluICsgbWF4KSAvIDIgPyBNYXRoLm1heChtaW4sIHNwaGVyaWNhbC50aGV0YSkgOiBNYXRoLm1pbihtYXgsIHNwaGVyaWNhbC50aGV0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwaGVyaWNhbC5waGkgPSBNYXRoLm1heChzY29wZS5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbihzY29wZS5tYXhQb2xhckFuZ2xlLCBzcGhlcmljYWwucGhpKSk7XG4gICAgICAgIHNwaGVyaWNhbC5tYWtlU2FmZSgpO1xuICAgICAgICBpZiAoc2NvcGUuZW5hYmxlRGFtcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHNjb3BlLnRhcmdldC5hZGRTY2FsZWRWZWN0b3IocGFuT2Zmc2V0LCBzY29wZS5kYW1waW5nRmFjdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY29wZS50YXJnZXQuYWRkKHBhbk9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjb3BlLnpvb21Ub0N1cnNvciAmJiBwZXJmb3JtQ3Vyc29yWm9vbSB8fCBzY29wZS5vYmplY3QuaXNPcnRob2dyYXBoaWNDYW1lcmEpIHtcbiAgICAgICAgICBzcGhlcmljYWwucmFkaXVzID0gY2xhbXBEaXN0YW5jZShzcGhlcmljYWwucmFkaXVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGhlcmljYWwucmFkaXVzID0gY2xhbXBEaXN0YW5jZShzcGhlcmljYWwucmFkaXVzICogc2NhbGUpO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldC5zZXRGcm9tU3BoZXJpY2FsKHNwaGVyaWNhbCk7XG4gICAgICAgIG9mZnNldC5hcHBseVF1YXRlcm5pb24ocXVhdEludmVyc2UpO1xuICAgICAgICBwb3NpdGlvbi5jb3B5KHNjb3BlLnRhcmdldCkuYWRkKG9mZnNldCk7XG4gICAgICAgIGlmICghc2NvcGUub2JqZWN0Lm1hdHJpeEF1dG9VcGRhdGUpXG4gICAgICAgICAgc2NvcGUub2JqZWN0LnVwZGF0ZU1hdHJpeCgpO1xuICAgICAgICBzY29wZS5vYmplY3QubG9va0F0KHNjb3BlLnRhcmdldCk7XG4gICAgICAgIGlmIChzY29wZS5lbmFibGVEYW1waW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgc3BoZXJpY2FsRGVsdGEudGhldGEgKj0gMSAtIHNjb3BlLmRhbXBpbmdGYWN0b3I7XG4gICAgICAgICAgc3BoZXJpY2FsRGVsdGEucGhpICo9IDEgLSBzY29wZS5kYW1waW5nRmFjdG9yO1xuICAgICAgICAgIHBhbk9mZnNldC5tdWx0aXBseVNjYWxhcigxIC0gc2NvcGUuZGFtcGluZ0ZhY3Rvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BoZXJpY2FsRGVsdGEuc2V0KDAsIDAsIDApO1xuICAgICAgICAgIHBhbk9mZnNldC5zZXQoMCwgMCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHpvb21DaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGlmIChzY29wZS56b29tVG9DdXJzb3IgJiYgcGVyZm9ybUN1cnNvclpvb20pIHtcbiAgICAgICAgICBsZXQgbmV3UmFkaXVzID0gbnVsbDtcbiAgICAgICAgICBpZiAoc2NvcGUub2JqZWN0IGluc3RhbmNlb2YgUGVyc3BlY3RpdmVDYW1lcmEgJiYgc2NvcGUub2JqZWN0LmlzUGVyc3BlY3RpdmVDYW1lcmEpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZSYWRpdXMgPSBvZmZzZXQubGVuZ3RoKCk7XG4gICAgICAgICAgICBuZXdSYWRpdXMgPSBjbGFtcERpc3RhbmNlKHByZXZSYWRpdXMgKiBzY2FsZSk7XG4gICAgICAgICAgICBjb25zdCByYWRpdXNEZWx0YSA9IHByZXZSYWRpdXMgLSBuZXdSYWRpdXM7XG4gICAgICAgICAgICBzY29wZS5vYmplY3QucG9zaXRpb24uYWRkU2NhbGVkVmVjdG9yKGRvbGx5RGlyZWN0aW9uLCByYWRpdXNEZWx0YSk7XG4gICAgICAgICAgICBzY29wZS5vYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjb3BlLm9iamVjdC5pc09ydGhvZ3JhcGhpY0NhbWVyYSkge1xuICAgICAgICAgICAgY29uc3QgbW91c2VCZWZvcmUgPSBuZXcgVmVjdG9yMyhtb3VzZS54LCBtb3VzZS55LCAwKTtcbiAgICAgICAgICAgIG1vdXNlQmVmb3JlLnVucHJvamVjdChzY29wZS5vYmplY3QpO1xuICAgICAgICAgICAgc2NvcGUub2JqZWN0Lnpvb20gPSBNYXRoLm1heChzY29wZS5taW5ab29tLCBNYXRoLm1pbihzY29wZS5tYXhab29tLCBzY29wZS5vYmplY3Quem9vbSAvIHNjYWxlKSk7XG4gICAgICAgICAgICBzY29wZS5vYmplY3QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgICAgICAgem9vbUNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3QgbW91c2VBZnRlciA9IG5ldyBWZWN0b3IzKG1vdXNlLngsIG1vdXNlLnksIDApO1xuICAgICAgICAgICAgbW91c2VBZnRlci51bnByb2plY3Qoc2NvcGUub2JqZWN0KTtcbiAgICAgICAgICAgIHNjb3BlLm9iamVjdC5wb3NpdGlvbi5zdWIobW91c2VBZnRlcikuYWRkKG1vdXNlQmVmb3JlKTtcbiAgICAgICAgICAgIHNjb3BlLm9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xuICAgICAgICAgICAgbmV3UmFkaXVzID0gb2Zmc2V0Lmxlbmd0aCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXQVJOSU5HOiBPcmJpdENvbnRyb2xzLmpzIGVuY291bnRlcmVkIGFuIHVua25vd24gY2FtZXJhIHR5cGUgLSB6b29tIHRvIGN1cnNvciBkaXNhYmxlZC5cIik7XG4gICAgICAgICAgICBzY29wZS56b29tVG9DdXJzb3IgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG5ld1JhZGl1cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHNjb3BlLnNjcmVlblNwYWNlUGFubmluZykge1xuICAgICAgICAgICAgICBzY29wZS50YXJnZXQuc2V0KDAsIDAsIC0xKS50cmFuc2Zvcm1EaXJlY3Rpb24oc2NvcGUub2JqZWN0Lm1hdHJpeCkubXVsdGlwbHlTY2FsYXIobmV3UmFkaXVzKS5hZGQoc2NvcGUub2JqZWN0LnBvc2l0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yYXkub3JpZ2luLmNvcHkoc2NvcGUub2JqZWN0LnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgX3JheS5kaXJlY3Rpb24uc2V0KDAsIDAsIC0xKS50cmFuc2Zvcm1EaXJlY3Rpb24oc2NvcGUub2JqZWN0Lm1hdHJpeCk7XG4gICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzY29wZS5vYmplY3QudXAuZG90KF9yYXkuZGlyZWN0aW9uKSkgPCBUSUxUX0xJTUlUKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0Lmxvb2tBdChzY29wZS50YXJnZXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9wbGFuZS5zZXRGcm9tTm9ybWFsQW5kQ29wbGFuYXJQb2ludChzY29wZS5vYmplY3QudXAsIHNjb3BlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgX3JheS5pbnRlcnNlY3RQbGFuZShfcGxhbmUsIHNjb3BlLnRhcmdldCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc2NvcGUub2JqZWN0IGluc3RhbmNlb2YgT3J0aG9ncmFwaGljQ2FtZXJhICYmIHNjb3BlLm9iamVjdC5pc09ydGhvZ3JhcGhpY0NhbWVyYSkge1xuICAgICAgICAgIHpvb21DaGFuZ2VkID0gc2NhbGUgIT09IDE7XG4gICAgICAgICAgaWYgKHpvb21DaGFuZ2VkKSB7XG4gICAgICAgICAgICBzY29wZS5vYmplY3Quem9vbSA9IE1hdGgubWF4KHNjb3BlLm1pblpvb20sIE1hdGgubWluKHNjb3BlLm1heFpvb20sIHNjb3BlLm9iamVjdC56b29tIC8gc2NhbGUpKTtcbiAgICAgICAgICAgIHNjb3BlLm9iamVjdC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNjYWxlID0gMTtcbiAgICAgICAgcGVyZm9ybUN1cnNvclpvb20gPSBmYWxzZTtcbiAgICAgICAgaWYgKHpvb21DaGFuZ2VkIHx8IGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZChzY29wZS5vYmplY3QucG9zaXRpb24pID4gRVBTIHx8IDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdChzY29wZS5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XG4gICAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChjaGFuZ2VFdmVudCk7XG4gICAgICAgICAgbGFzdFBvc2l0aW9uLmNvcHkoc2NvcGUub2JqZWN0LnBvc2l0aW9uKTtcbiAgICAgICAgICBsYXN0UXVhdGVybmlvbi5jb3B5KHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uKTtcbiAgICAgICAgICB6b29tQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgICB0aGlzLmNvbm5lY3QgPSAoZG9tRWxlbWVudDIpID0+IHtcbiAgICAgIHNjb3BlLmRvbUVsZW1lbnQgPSBkb21FbGVtZW50MjtcbiAgICAgIHNjb3BlLmRvbUVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm5vbmVcIjtcbiAgICAgIHNjb3BlLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIG9uQ29udGV4dE1lbnUpO1xuICAgICAgc2NvcGUuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgb25Qb2ludGVyRG93bik7XG4gICAgICBzY29wZS5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIG9uUG9pbnRlclVwKTtcbiAgICAgIHNjb3BlLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIG9uTW91c2VXaGVlbCk7XG4gICAgfTtcbiAgICB0aGlzLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgIGlmIChzY29wZS5kb21FbGVtZW50KSB7XG4gICAgICAgIHNjb3BlLmRvbUVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSBcImF1dG9cIjtcbiAgICAgIH1cbiAgICAgIChfYSA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfYS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgb25Db250ZXh0TWVudSk7XG4gICAgICAoX2IgPSBzY29wZS5kb21FbGVtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIG9uUG9pbnRlckRvd24pO1xuICAgICAgKF9jID0gc2NvcGUuZG9tRWxlbWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIG9uUG9pbnRlclVwKTtcbiAgICAgIChfZCA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZC5yZW1vdmVFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgb25Nb3VzZVdoZWVsKTtcbiAgICAgIChfZSA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZS5vd25lckRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvblBvaW50ZXJNb3ZlKTtcbiAgICAgIChfZiA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZi5vd25lckRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgb25Qb2ludGVyVXApO1xuICAgICAgaWYgKHNjb3BlLl9kb21FbGVtZW50S2V5RXZlbnRzICE9PSBudWxsKSB7XG4gICAgICAgIHNjb3BlLl9kb21FbGVtZW50S2V5RXZlbnRzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIG9uS2V5RG93bik7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG4gICAgY29uc3QgY2hhbmdlRXZlbnQgPSB7IHR5cGU6IFwiY2hhbmdlXCIgfTtcbiAgICBjb25zdCBzdGFydEV2ZW50ID0geyB0eXBlOiBcInN0YXJ0XCIgfTtcbiAgICBjb25zdCBlbmRFdmVudCA9IHsgdHlwZTogXCJlbmRcIiB9O1xuICAgIGNvbnN0IFNUQVRFID0ge1xuICAgICAgTk9ORTogLTEsXG4gICAgICBST1RBVEU6IDAsXG4gICAgICBET0xMWTogMSxcbiAgICAgIFBBTjogMixcbiAgICAgIFRPVUNIX1JPVEFURTogMyxcbiAgICAgIFRPVUNIX1BBTjogNCxcbiAgICAgIFRPVUNIX0RPTExZX1BBTjogNSxcbiAgICAgIFRPVUNIX0RPTExZX1JPVEFURTogNlxuICAgIH07XG4gICAgbGV0IHN0YXRlID0gU1RBVEUuTk9ORTtcbiAgICBjb25zdCBFUFMgPSAxZS02O1xuICAgIGNvbnN0IHNwaGVyaWNhbCA9IG5ldyBTcGhlcmljYWwoKTtcbiAgICBjb25zdCBzcGhlcmljYWxEZWx0YSA9IG5ldyBTcGhlcmljYWwoKTtcbiAgICBsZXQgc2NhbGUgPSAxO1xuICAgIGNvbnN0IHBhbk9mZnNldCA9IG5ldyBWZWN0b3IzKCk7XG4gICAgY29uc3Qgcm90YXRlU3RhcnQgPSBuZXcgVmVjdG9yMigpO1xuICAgIGNvbnN0IHJvdGF0ZUVuZCA9IG5ldyBWZWN0b3IyKCk7XG4gICAgY29uc3Qgcm90YXRlRGVsdGEgPSBuZXcgVmVjdG9yMigpO1xuICAgIGNvbnN0IHBhblN0YXJ0ID0gbmV3IFZlY3RvcjIoKTtcbiAgICBjb25zdCBwYW5FbmQgPSBuZXcgVmVjdG9yMigpO1xuICAgIGNvbnN0IHBhbkRlbHRhID0gbmV3IFZlY3RvcjIoKTtcbiAgICBjb25zdCBkb2xseVN0YXJ0ID0gbmV3IFZlY3RvcjIoKTtcbiAgICBjb25zdCBkb2xseUVuZCA9IG5ldyBWZWN0b3IyKCk7XG4gICAgY29uc3QgZG9sbHlEZWx0YSA9IG5ldyBWZWN0b3IyKCk7XG4gICAgY29uc3QgZG9sbHlEaXJlY3Rpb24gPSBuZXcgVmVjdG9yMygpO1xuICAgIGNvbnN0IG1vdXNlID0gbmV3IFZlY3RvcjIoKTtcbiAgICBsZXQgcGVyZm9ybUN1cnNvclpvb20gPSBmYWxzZTtcbiAgICBjb25zdCBwb2ludGVycyA9IFtdO1xuICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbnMgPSB7fTtcbiAgICBmdW5jdGlvbiBnZXRBdXRvUm90YXRpb25BbmdsZSgpIHtcbiAgICAgIHJldHVybiAyICogTWF0aC5QSSAvIDYwIC8gNjAgKiBzY29wZS5hdXRvUm90YXRlU3BlZWQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFpvb21TY2FsZSgpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdygwLjk1LCBzY29wZS56b29tU3BlZWQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByb3RhdGVMZWZ0KGFuZ2xlKSB7XG4gICAgICBpZiAoc2NvcGUucmV2ZXJzZU9yYml0IHx8IHNjb3BlLnJldmVyc2VIb3Jpem9udGFsT3JiaXQpIHtcbiAgICAgICAgc3BoZXJpY2FsRGVsdGEudGhldGEgKz0gYW5nbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGhlcmljYWxEZWx0YS50aGV0YSAtPSBhbmdsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcm90YXRlVXAoYW5nbGUpIHtcbiAgICAgIGlmIChzY29wZS5yZXZlcnNlT3JiaXQgfHwgc2NvcGUucmV2ZXJzZVZlcnRpY2FsT3JiaXQpIHtcbiAgICAgICAgc3BoZXJpY2FsRGVsdGEucGhpICs9IGFuZ2xlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BoZXJpY2FsRGVsdGEucGhpIC09IGFuZ2xlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwYW5MZWZ0ID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IHYgPSBuZXcgVmVjdG9yMygpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHBhbkxlZnQyKGRpc3RhbmNlLCBvYmplY3RNYXRyaXgpIHtcbiAgICAgICAgdi5zZXRGcm9tTWF0cml4Q29sdW1uKG9iamVjdE1hdHJpeCwgMCk7XG4gICAgICAgIHYubXVsdGlwbHlTY2FsYXIoLWRpc3RhbmNlKTtcbiAgICAgICAgcGFuT2Zmc2V0LmFkZCh2KTtcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgICBjb25zdCBwYW5VcCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCB2ID0gbmV3IFZlY3RvcjMoKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBwYW5VcDIoZGlzdGFuY2UsIG9iamVjdE1hdHJpeCkge1xuICAgICAgICBpZiAoc2NvcGUuc2NyZWVuU3BhY2VQYW5uaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgdi5zZXRGcm9tTWF0cml4Q29sdW1uKG9iamVjdE1hdHJpeCwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdi5zZXRGcm9tTWF0cml4Q29sdW1uKG9iamVjdE1hdHJpeCwgMCk7XG4gICAgICAgICAgdi5jcm9zc1ZlY3RvcnMoc2NvcGUub2JqZWN0LnVwLCB2KTtcbiAgICAgICAgfVxuICAgICAgICB2Lm11bHRpcGx5U2NhbGFyKGRpc3RhbmNlKTtcbiAgICAgICAgcGFuT2Zmc2V0LmFkZCh2KTtcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgICBjb25zdCBwYW4gPSAoKCkgPT4ge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gbmV3IFZlY3RvcjMoKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBwYW4yKGRlbHRhWCwgZGVsdGFZKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCAmJiBzY29wZS5vYmplY3QgaW5zdGFuY2VvZiBQZXJzcGVjdGl2ZUNhbWVyYSAmJiBzY29wZS5vYmplY3QuaXNQZXJzcGVjdGl2ZUNhbWVyYSkge1xuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gc2NvcGUub2JqZWN0LnBvc2l0aW9uO1xuICAgICAgICAgIG9mZnNldC5jb3B5KHBvc2l0aW9uKS5zdWIoc2NvcGUudGFyZ2V0KTtcbiAgICAgICAgICBsZXQgdGFyZ2V0RGlzdGFuY2UgPSBvZmZzZXQubGVuZ3RoKCk7XG4gICAgICAgICAgdGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oc2NvcGUub2JqZWN0LmZvdiAvIDIgKiBNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgICBwYW5MZWZ0KDIgKiBkZWx0YVggKiB0YXJnZXREaXN0YW5jZSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0LCBzY29wZS5vYmplY3QubWF0cml4KTtcbiAgICAgICAgICBwYW5VcCgyICogZGVsdGFZICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCwgc2NvcGUub2JqZWN0Lm1hdHJpeCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCAmJiBzY29wZS5vYmplY3QgaW5zdGFuY2VvZiBPcnRob2dyYXBoaWNDYW1lcmEgJiYgc2NvcGUub2JqZWN0LmlzT3J0aG9ncmFwaGljQ2FtZXJhKSB7XG4gICAgICAgICAgcGFuTGVmdChcbiAgICAgICAgICAgIGRlbHRhWCAqIChzY29wZS5vYmplY3QucmlnaHQgLSBzY29wZS5vYmplY3QubGVmdCkgLyBzY29wZS5vYmplY3Quem9vbSAvIGVsZW1lbnQuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBzY29wZS5vYmplY3QubWF0cml4XG4gICAgICAgICAgKTtcbiAgICAgICAgICBwYW5VcChcbiAgICAgICAgICAgIGRlbHRhWSAqIChzY29wZS5vYmplY3QudG9wIC0gc2NvcGUub2JqZWN0LmJvdHRvbSkgLyBzY29wZS5vYmplY3Quem9vbSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgc2NvcGUub2JqZWN0Lm1hdHJpeFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiV0FSTklORzogT3JiaXRDb250cm9scy5qcyBlbmNvdW50ZXJlZCBhbiB1bmtub3duIGNhbWVyYSB0eXBlIC0gcGFuIGRpc2FibGVkLlwiKTtcbiAgICAgICAgICBzY29wZS5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuICAgIGZ1bmN0aW9uIHNldFNjYWxlKG5ld1NjYWxlKSB7XG4gICAgICBpZiAoc2NvcGUub2JqZWN0IGluc3RhbmNlb2YgUGVyc3BlY3RpdmVDYW1lcmEgJiYgc2NvcGUub2JqZWN0LmlzUGVyc3BlY3RpdmVDYW1lcmEgfHwgc2NvcGUub2JqZWN0IGluc3RhbmNlb2YgT3J0aG9ncmFwaGljQ2FtZXJhICYmIHNjb3BlLm9iamVjdC5pc09ydGhvZ3JhcGhpY0NhbWVyYSkge1xuICAgICAgICBzY2FsZSA9IG5ld1NjYWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV0FSTklORzogT3JiaXRDb250cm9scy5qcyBlbmNvdW50ZXJlZCBhbiB1bmtub3duIGNhbWVyYSB0eXBlIC0gZG9sbHkvem9vbSBkaXNhYmxlZC5cIik7XG4gICAgICAgIHNjb3BlLmVuYWJsZVpvb20gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZG9sbHlPdXQoZG9sbHlTY2FsZSkge1xuICAgICAgc2V0U2NhbGUoc2NhbGUgLyBkb2xseVNjYWxlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9sbHlJbihkb2xseVNjYWxlKSB7XG4gICAgICBzZXRTY2FsZShzY2FsZSAqIGRvbGx5U2NhbGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVNb3VzZVBhcmFtZXRlcnMoZXZlbnQpIHtcbiAgICAgIGlmICghc2NvcGUuem9vbVRvQ3Vyc29yIHx8ICFzY29wZS5kb21FbGVtZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBlcmZvcm1DdXJzb3Jab29tID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlY3QgPSBzY29wZS5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgeCA9IGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgY29uc3QgdyA9IHJlY3Qud2lkdGg7XG4gICAgICBjb25zdCBoID0gcmVjdC5oZWlnaHQ7XG4gICAgICBtb3VzZS54ID0geCAvIHcgKiAyIC0gMTtcbiAgICAgIG1vdXNlLnkgPSAtKHkgLyBoKSAqIDIgKyAxO1xuICAgICAgZG9sbHlEaXJlY3Rpb24uc2V0KG1vdXNlLngsIG1vdXNlLnksIDEpLnVucHJvamVjdChzY29wZS5vYmplY3QpLnN1YihzY29wZS5vYmplY3QucG9zaXRpb24pLm5vcm1hbGl6ZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGFtcERpc3RhbmNlKGRpc3QpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heChzY29wZS5taW5EaXN0YW5jZSwgTWF0aC5taW4oc2NvcGUubWF4RGlzdGFuY2UsIGRpc3QpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VEb3duUm90YXRlKGV2ZW50KSB7XG4gICAgICByb3RhdGVTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93bkRvbGx5KGV2ZW50KSB7XG4gICAgICB1cGRhdGVNb3VzZVBhcmFtZXRlcnMoZXZlbnQpO1xuICAgICAgZG9sbHlTdGFydC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93blBhbihldmVudCkge1xuICAgICAgcGFuU3RhcnQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZU1vdmVSb3RhdGUoZXZlbnQpIHtcbiAgICAgIHJvdGF0ZUVuZC5zZXQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICByb3RhdGVEZWx0YS5zdWJWZWN0b3JzKHJvdGF0ZUVuZCwgcm90YXRlU3RhcnQpLm11bHRpcGx5U2NhbGFyKHNjb3BlLnJvdGF0ZVNwZWVkKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50O1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgcm90YXRlTGVmdCgyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudEhlaWdodCk7XG4gICAgICAgIHJvdGF0ZVVwKDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcbiAgICAgIH1cbiAgICAgIHJvdGF0ZVN0YXJ0LmNvcHkocm90YXRlRW5kKTtcbiAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZU1vdmVEb2xseShldmVudCkge1xuICAgICAgZG9sbHlFbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgZG9sbHlEZWx0YS5zdWJWZWN0b3JzKGRvbGx5RW5kLCBkb2xseVN0YXJ0KTtcbiAgICAgIGlmIChkb2xseURlbHRhLnkgPiAwKSB7XG4gICAgICAgIGRvbGx5T3V0KGdldFpvb21TY2FsZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9sbHlEZWx0YS55IDwgMCkge1xuICAgICAgICBkb2xseUluKGdldFpvb21TY2FsZSgpKTtcbiAgICAgIH1cbiAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XG4gICAgICBzY29wZS51cGRhdGUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VNb3ZlUGFuKGV2ZW50KSB7XG4gICAgICBwYW5FbmQuc2V0KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgcGFuRGVsdGEuc3ViVmVjdG9ycyhwYW5FbmQsIHBhblN0YXJ0KS5tdWx0aXBseVNjYWxhcihzY29wZS5wYW5TcGVlZCk7XG4gICAgICBwYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XG4gICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XG4gICAgICBzY29wZS51cGRhdGUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VXaGVlbChldmVudCkge1xuICAgICAgdXBkYXRlTW91c2VQYXJhbWV0ZXJzKGV2ZW50KTtcbiAgICAgIGlmIChldmVudC5kZWx0YVkgPCAwKSB7XG4gICAgICAgIGRvbGx5SW4oZ2V0Wm9vbVNjYWxlKCkpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5kZWx0YVkgPiAwKSB7XG4gICAgICAgIGRvbGx5T3V0KGdldFpvb21TY2FsZSgpKTtcbiAgICAgIH1cbiAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgICBsZXQgbmVlZHNVcGRhdGUgPSBmYWxzZTtcbiAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSkge1xuICAgICAgICBjYXNlIHNjb3BlLmtleXMuVVA6XG4gICAgICAgICAgcGFuKDAsIHNjb3BlLmtleVBhblNwZWVkKTtcbiAgICAgICAgICBuZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc2NvcGUua2V5cy5CT1RUT006XG4gICAgICAgICAgcGFuKDAsIC1zY29wZS5rZXlQYW5TcGVlZCk7XG4gICAgICAgICAgbmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNjb3BlLmtleXMuTEVGVDpcbiAgICAgICAgICBwYW4oc2NvcGUua2V5UGFuU3BlZWQsIDApO1xuICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzY29wZS5rZXlzLlJJR0hUOlxuICAgICAgICAgIHBhbigtc2NvcGUua2V5UGFuU3BlZWQsIDApO1xuICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkc1VwZGF0ZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydFJvdGF0ZSgpIHtcbiAgICAgIGlmIChwb2ludGVycy5sZW5ndGggPT0gMSkge1xuICAgICAgICByb3RhdGVTdGFydC5zZXQocG9pbnRlcnNbMF0ucGFnZVgsIHBvaW50ZXJzWzBdLnBhZ2VZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHggPSAwLjUgKiAocG9pbnRlcnNbMF0ucGFnZVggKyBwb2ludGVyc1sxXS5wYWdlWCk7XG4gICAgICAgIGNvbnN0IHkgPSAwLjUgKiAocG9pbnRlcnNbMF0ucGFnZVkgKyBwb2ludGVyc1sxXS5wYWdlWSk7XG4gICAgICAgIHJvdGF0ZVN0YXJ0LnNldCh4LCB5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydFBhbigpIHtcbiAgICAgIGlmIChwb2ludGVycy5sZW5ndGggPT0gMSkge1xuICAgICAgICBwYW5TdGFydC5zZXQocG9pbnRlcnNbMF0ucGFnZVgsIHBvaW50ZXJzWzBdLnBhZ2VZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHggPSAwLjUgKiAocG9pbnRlcnNbMF0ucGFnZVggKyBwb2ludGVyc1sxXS5wYWdlWCk7XG4gICAgICAgIGNvbnN0IHkgPSAwLjUgKiAocG9pbnRlcnNbMF0ucGFnZVkgKyBwb2ludGVyc1sxXS5wYWdlWSk7XG4gICAgICAgIHBhblN0YXJ0LnNldCh4LCB5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydERvbGx5KCkge1xuICAgICAgY29uc3QgZHggPSBwb2ludGVyc1swXS5wYWdlWCAtIHBvaW50ZXJzWzFdLnBhZ2VYO1xuICAgICAgY29uc3QgZHkgPSBwb2ludGVyc1swXS5wYWdlWSAtIHBvaW50ZXJzWzFdLnBhZ2VZO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgZG9sbHlTdGFydC5zZXQoMCwgZGlzdGFuY2UpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaFN0YXJ0RG9sbHlQYW4oKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlWm9vbSlcbiAgICAgICAgaGFuZGxlVG91Y2hTdGFydERvbGx5KCk7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlUGFuKVxuICAgICAgICBoYW5kbGVUb3VjaFN0YXJ0UGFuKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnREb2xseVJvdGF0ZSgpIHtcbiAgICAgIGlmIChzY29wZS5lbmFibGVab29tKVxuICAgICAgICBoYW5kbGVUb3VjaFN0YXJ0RG9sbHkoKTtcbiAgICAgIGlmIChzY29wZS5lbmFibGVSb3RhdGUpXG4gICAgICAgIGhhbmRsZVRvdWNoU3RhcnRSb3RhdGUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hNb3ZlUm90YXRlKGV2ZW50KSB7XG4gICAgICBpZiAocG9pbnRlcnMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgcm90YXRlRW5kLnNldChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRTZWNvbmRQb2ludGVyUG9zaXRpb24oZXZlbnQpO1xuICAgICAgICBjb25zdCB4ID0gMC41ICogKGV2ZW50LnBhZ2VYICsgcG9zaXRpb24ueCk7XG4gICAgICAgIGNvbnN0IHkgPSAwLjUgKiAoZXZlbnQucGFnZVkgKyBwb3NpdGlvbi55KTtcbiAgICAgICAgcm90YXRlRW5kLnNldCh4LCB5KTtcbiAgICAgIH1cbiAgICAgIHJvdGF0ZURlbHRhLnN1YlZlY3RvcnMocm90YXRlRW5kLCByb3RhdGVTdGFydCkubXVsdGlwbHlTY2FsYXIoc2NvcGUucm90YXRlU3BlZWQpO1xuICAgICAgY29uc3QgZWxlbWVudCA9IHNjb3BlLmRvbUVsZW1lbnQ7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICByb3RhdGVMZWZ0KDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueCAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcbiAgICAgICAgcm90YXRlVXAoMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgICAgfVxuICAgICAgcm90YXRlU3RhcnQuY29weShyb3RhdGVFbmQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaE1vdmVQYW4oZXZlbnQpIHtcbiAgICAgIGlmIChwb2ludGVycy5sZW5ndGggPT0gMSkge1xuICAgICAgICBwYW5FbmQuc2V0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFNlY29uZFBvaW50ZXJQb3NpdGlvbihldmVudCk7XG4gICAgICAgIGNvbnN0IHggPSAwLjUgKiAoZXZlbnQucGFnZVggKyBwb3NpdGlvbi54KTtcbiAgICAgICAgY29uc3QgeSA9IDAuNSAqIChldmVudC5wYWdlWSArIHBvc2l0aW9uLnkpO1xuICAgICAgICBwYW5FbmQuc2V0KHgsIHkpO1xuICAgICAgfVxuICAgICAgcGFuRGVsdGEuc3ViVmVjdG9ycyhwYW5FbmQsIHBhblN0YXJ0KS5tdWx0aXBseVNjYWxhcihzY29wZS5wYW5TcGVlZCk7XG4gICAgICBwYW4ocGFuRGVsdGEueCwgcGFuRGVsdGEueSk7XG4gICAgICBwYW5TdGFydC5jb3B5KHBhbkVuZCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZURvbGx5KGV2ZW50KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFNlY29uZFBvaW50ZXJQb3NpdGlvbihldmVudCk7XG4gICAgICBjb25zdCBkeCA9IGV2ZW50LnBhZ2VYIC0gcG9zaXRpb24ueDtcbiAgICAgIGNvbnN0IGR5ID0gZXZlbnQucGFnZVkgLSBwb3NpdGlvbi55O1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgZG9sbHlFbmQuc2V0KDAsIGRpc3RhbmNlKTtcbiAgICAgIGRvbGx5RGVsdGEuc2V0KDAsIE1hdGgucG93KGRvbGx5RW5kLnkgLyBkb2xseVN0YXJ0LnksIHNjb3BlLnpvb21TcGVlZCkpO1xuICAgICAgZG9sbHlPdXQoZG9sbHlEZWx0YS55KTtcbiAgICAgIGRvbGx5U3RhcnQuY29weShkb2xseUVuZCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZURvbGx5UGFuKGV2ZW50KSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlWm9vbSlcbiAgICAgICAgaGFuZGxlVG91Y2hNb3ZlRG9sbHkoZXZlbnQpO1xuICAgICAgaWYgKHNjb3BlLmVuYWJsZVBhbilcbiAgICAgICAgaGFuZGxlVG91Y2hNb3ZlUGFuKGV2ZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hNb3ZlRG9sbHlSb3RhdGUoZXZlbnQpIHtcbiAgICAgIGlmIChzY29wZS5lbmFibGVab29tKVxuICAgICAgICBoYW5kbGVUb3VjaE1vdmVEb2xseShldmVudCk7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlUm90YXRlKVxuICAgICAgICBoYW5kbGVUb3VjaE1vdmVSb3RhdGUoZXZlbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblBvaW50ZXJEb3duKGV2ZW50KSB7XG4gICAgICB2YXIgX2EsIF9iO1xuICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAocG9pbnRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIChfYSA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfYS5vd25lckRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBvblBvaW50ZXJNb3ZlKTtcbiAgICAgICAgKF9iID0gc2NvcGUuZG9tRWxlbWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9iLm93bmVyRG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCBvblBvaW50ZXJVcCk7XG4gICAgICB9XG4gICAgICBhZGRQb2ludGVyKGV2ZW50KTtcbiAgICAgIGlmIChldmVudC5wb2ludGVyVHlwZSA9PT0gXCJ0b3VjaFwiKSB7XG4gICAgICAgIG9uVG91Y2hTdGFydChldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbk1vdXNlRG93bihldmVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoZXZlbnQpIHtcbiAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKGV2ZW50LnBvaW50ZXJUeXBlID09PSBcInRvdWNoXCIpIHtcbiAgICAgICAgb25Ub3VjaE1vdmUoZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25Nb3VzZU1vdmUoZXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvblBvaW50ZXJVcChldmVudCkge1xuICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICByZW1vdmVQb2ludGVyKGV2ZW50KTtcbiAgICAgIGlmIChwb2ludGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgKF9hID0gc2NvcGUuZG9tRWxlbWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLnJlbGVhc2VQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpO1xuICAgICAgICAoX2IgPSBzY29wZS5kb21FbGVtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2Iub3duZXJEb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgb25Qb2ludGVyTW92ZSk7XG4gICAgICAgIChfYyA9IHNjb3BlLmRvbUVsZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfYy5vd25lckRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgb25Qb2ludGVyVXApO1xuICAgICAgfVxuICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChlbmRFdmVudCk7XG4gICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKGV2ZW50KSB7XG4gICAgICBsZXQgbW91c2VBY3Rpb247XG4gICAgICBzd2l0Y2ggKGV2ZW50LmJ1dHRvbikge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgbW91c2VBY3Rpb24gPSBzY29wZS5tb3VzZUJ1dHRvbnMuTEVGVDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIG1vdXNlQWN0aW9uID0gc2NvcGUubW91c2VCdXR0b25zLk1JRERMRTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG1vdXNlQWN0aW9uID0gc2NvcGUubW91c2VCdXR0b25zLlJJR0hUO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1vdXNlQWN0aW9uID0gLTE7XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKG1vdXNlQWN0aW9uKSB7XG4gICAgICAgIGNhc2UgTU9VU0UuRE9MTFk6XG4gICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGhhbmRsZU1vdXNlRG93bkRvbGx5KGV2ZW50KTtcbiAgICAgICAgICBzdGF0ZSA9IFNUQVRFLkRPTExZO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIE1PVVNFLlJPVEFURTpcbiAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaGFuZGxlTW91c2VEb3duUGFuKGV2ZW50KTtcbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUEFOO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlUm90YXRlID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaGFuZGxlTW91c2VEb3duUm90YXRlKGV2ZW50KTtcbiAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuUk9UQVRFO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBNT1VTRS5QQU46XG4gICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSB8fCBldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGhhbmRsZU1vdXNlRG93blJvdGF0ZShldmVudCk7XG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlJPVEFURTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVBhbiA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGhhbmRsZU1vdXNlRG93blBhbihldmVudCk7XG4gICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlBBTjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXRlICE9PSBTVEFURS5OT05FKSB7XG4gICAgICAgIHNjb3BlLmRpc3BhdGNoRXZlbnQoc3RhcnRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBTVEFURS5ST1RBVEU6XG4gICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaGFuZGxlTW91c2VNb3ZlUm90YXRlKGV2ZW50KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTVEFURS5ET0xMWTpcbiAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlWm9vbSA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaGFuZGxlTW91c2VNb3ZlRG9sbHkoZXZlbnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFNUQVRFLlBBTjpcbiAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBoYW5kbGVNb3VzZU1vdmVQYW4oZXZlbnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdXNlV2hlZWwoZXZlbnQpIHtcbiAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSB8fCBzY29wZS5lbmFibGVab29tID09PSBmYWxzZSB8fCBzdGF0ZSAhPT0gU1RBVEUuTk9ORSAmJiBzdGF0ZSAhPT0gU1RBVEUuUk9UQVRFKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KHN0YXJ0RXZlbnQpO1xuICAgICAgaGFuZGxlTW91c2VXaGVlbChldmVudCk7XG4gICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KGVuZEV2ZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgfHwgc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaGFuZGxlS2V5RG93bihldmVudCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVG91Y2hTdGFydChldmVudCkge1xuICAgICAgdHJhY2tQb2ludGVyKGV2ZW50KTtcbiAgICAgIHN3aXRjaCAocG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBzd2l0Y2ggKHNjb3BlLnRvdWNoZXMuT05FKSB7XG4gICAgICAgICAgICBjYXNlIFRPVUNILlJPVEFURTpcbiAgICAgICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICBoYW5kbGVUb3VjaFN0YXJ0Um90YXRlKCk7XG4gICAgICAgICAgICAgIHN0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVE9VQ0guUEFOOlxuICAgICAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIGhhbmRsZVRvdWNoU3RhcnRQYW4oKTtcbiAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9QQU47XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHN3aXRjaCAoc2NvcGUudG91Y2hlcy5UV08pIHtcbiAgICAgICAgICAgIGNhc2UgVE9VQ0guRE9MTFlfUEFOOlxuICAgICAgICAgICAgICBpZiAoc2NvcGUuZW5hYmxlWm9vbSA9PT0gZmFsc2UgJiYgc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIGhhbmRsZVRvdWNoU3RhcnREb2xseVBhbigpO1xuICAgICAgICAgICAgICBzdGF0ZSA9IFNUQVRFLlRPVUNIX0RPTExZX1BBTjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRPVUNILkRPTExZX1JPVEFURTpcbiAgICAgICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlICYmIHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICBoYW5kbGVUb3VjaFN0YXJ0RG9sbHlSb3RhdGUoKTtcbiAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5UT1VDSF9ET0xMWV9ST1RBVEU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgc3RhdGUgPSBTVEFURS5OT05FO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBzdGF0ZSA9IFNUQVRFLk5PTkU7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgIT09IFNUQVRFLk5PTkUpIHtcbiAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChzdGFydEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoZXZlbnQpIHtcbiAgICAgIHRyYWNrUG9pbnRlcihldmVudCk7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgU1RBVEUuVE9VQ0hfUk9UQVRFOlxuICAgICAgICAgIGlmIChzY29wZS5lbmFibGVSb3RhdGUgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGhhbmRsZVRvdWNoTW92ZVJvdGF0ZShldmVudCk7XG4gICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU1RBVEUuVE9VQ0hfUEFOOlxuICAgICAgICAgIGlmIChzY29wZS5lbmFibGVQYW4gPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGhhbmRsZVRvdWNoTW92ZVBhbihldmVudCk7XG4gICAgICAgICAgc2NvcGUudXBkYXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU1RBVEUuVE9VQ0hfRE9MTFlfUEFOOlxuICAgICAgICAgIGlmIChzY29wZS5lbmFibGVab29tID09PSBmYWxzZSAmJiBzY29wZS5lbmFibGVQYW4gPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGhhbmRsZVRvdWNoTW92ZURvbGx5UGFuKGV2ZW50KTtcbiAgICAgICAgICBzY29wZS51cGRhdGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTVEFURS5UT1VDSF9ET0xMWV9ST1RBVEU6XG4gICAgICAgICAgaWYgKHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlICYmIHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaGFuZGxlVG91Y2hNb3ZlRG9sbHlSb3RhdGUoZXZlbnQpO1xuICAgICAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHN0YXRlID0gU1RBVEUuTk9ORTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25Db250ZXh0TWVudShldmVudCkge1xuICAgICAgaWYgKHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRQb2ludGVyKGV2ZW50KSB7XG4gICAgICBwb2ludGVycy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlUG9pbnRlcihldmVudCkge1xuICAgICAgZGVsZXRlIHBvaW50ZXJQb3NpdGlvbnNbZXZlbnQucG9pbnRlcklkXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBvaW50ZXJzW2ldLnBvaW50ZXJJZCA9PSBldmVudC5wb2ludGVySWQpIHtcbiAgICAgICAgICBwb2ludGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyYWNrUG9pbnRlcihldmVudCkge1xuICAgICAgbGV0IHBvc2l0aW9uID0gcG9pbnRlclBvc2l0aW9uc1tldmVudC5wb2ludGVySWRdO1xuICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHtcbiAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xuICAgICAgICBwb2ludGVyUG9zaXRpb25zW2V2ZW50LnBvaW50ZXJJZF0gPSBwb3NpdGlvbjtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uLnNldChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRTZWNvbmRQb2ludGVyUG9zaXRpb24oZXZlbnQpIHtcbiAgICAgIGNvbnN0IHBvaW50ZXIgPSBldmVudC5wb2ludGVySWQgPT09IHBvaW50ZXJzWzBdLnBvaW50ZXJJZCA/IHBvaW50ZXJzWzFdIDogcG9pbnRlcnNbMF07XG4gICAgICByZXR1cm4gcG9pbnRlclBvc2l0aW9uc1twb2ludGVyLnBvaW50ZXJJZF07XG4gICAgfVxuICAgIHRoaXMuZG9sbHlJbiA9IChkb2xseVNjYWxlID0gZ2V0Wm9vbVNjYWxlKCkpID0+IHtcbiAgICAgIGRvbGx5SW4oZG9sbHlTY2FsZSk7XG4gICAgICBzY29wZS51cGRhdGUoKTtcbiAgICB9O1xuICAgIHRoaXMuZG9sbHlPdXQgPSAoZG9sbHlTY2FsZSA9IGdldFpvb21TY2FsZSgpKSA9PiB7XG4gICAgICBkb2xseU91dChkb2xseVNjYWxlKTtcbiAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgdGhpcy5nZXRTY2FsZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuICAgIHRoaXMuc2V0U2NhbGUgPSAobmV3U2NhbGUpID0+IHtcbiAgICAgIHNldFNjYWxlKG5ld1NjYWxlKTtcbiAgICAgIHNjb3BlLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgdGhpcy5nZXRab29tU2NhbGUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0Wm9vbVNjYWxlKCk7XG4gICAgfTtcbiAgICBpZiAoZG9tRWxlbWVudCAhPT0gdm9pZCAwKVxuICAgICAgdGhpcy5jb25uZWN0KGRvbUVsZW1lbnQpO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cbn1cbmNsYXNzIE1hcENvbnRyb2xzIGV4dGVuZHMgT3JiaXRDb250cm9scyB7XG4gIGNvbnN0cnVjdG9yKG9iamVjdCwgZG9tRWxlbWVudCkge1xuICAgIHN1cGVyKG9iamVjdCwgZG9tRWxlbWVudCk7XG4gICAgdGhpcy5zY3JlZW5TcGFjZVBhbm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLm1vdXNlQnV0dG9ucy5MRUZUID0gTU9VU0UuUEFOO1xuICAgIHRoaXMubW91c2VCdXR0b25zLlJJR0hUID0gTU9VU0UuUk9UQVRFO1xuICAgIHRoaXMudG91Y2hlcy5PTkUgPSBUT1VDSC5QQU47XG4gICAgdGhpcy50b3VjaGVzLlRXTyA9IFRPVUNILkRPTExZX1JPVEFURTtcbiAgfVxufVxuZXhwb3J0IHtcbiAgTWFwQ29udHJvbHMsXG4gIE9yYml0Q29udHJvbHNcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PcmJpdENvbnRyb2xzLmpzLm1hcFxuIl0sImlnbm9yZUxpc3QiOlswLDEsMl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVNBLElBQU0sYUFBYTtDQUNqQixNQUFNO0NBQ04sTUFBTTtDQUNOLE1BQU07RUFDSixDQUFDLFFBQVE7R0FBRSxHQUFHO0dBQWEsS0FBSztFQUFTLENBQUM7RUFDMUMsQ0FBQyxRQUFRO0dBQUUsR0FBRztHQUFhLEtBQUs7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