import { n as Maximize2, t as OrbitControls } from "./OrbitControls-DWqyy4Rt.js";
import { M as Box, P as require_jsx_runtime, R as require_react, a as WebGLRenderer, c as DirectionalLight, i as normalizeModel, m as PerspectiveCamera, n as fitCameraToObject, r as loadModelObject, s as Color, t as disposeObject, u as HemisphereLight, v as SRGBColorSpace, w as fileUrl, y as Scene, z as __toESM } from "./index-CKoCG6dd.js";
// src/components/viewer/ModelPreview.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ModelPreview({ model, file, onOpen }) {
	const containerRef = (0, import_react.useRef)(null);
	const sceneRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const rendererRef = (0, import_react.useRef)(null);
	const controlsRef = (0, import_react.useRef)(null);
	const currentRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		const scene = new Scene();
		scene.background = new Color("#f5f5f5");
		const camera = new PerspectiveCamera(45, 4 / 3, .01, 5e3);
		camera.position.set(2, 2, 2);
		const renderer = new WebGLRenderer({
			antialias: true,
			alpha: false
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.outputColorSpace = SRGBColorSpace;
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = 1.05;
		renderer.setClearColor("#f5f5f5");
		renderer.domElement.style.display = "block";
		renderer.domElement.style.width = "100%";
		renderer.domElement.style.height = "100%";
		renderer.domElement.style.background = "#f5f5f5";
		container.appendChild(renderer.domElement);
		scene.add(new HemisphereLight(16777215, 5592405, 2.1));
		const key = new DirectionalLight(16777215, 2.2);
		key.position.set(4, 7, 5);
		scene.add(key);
		const fill = new DirectionalLight(16777215, 1.1);
		fill.position.set(-5, 2, -4);
		scene.add(fill);
		const rim = new DirectionalLight(16766658, .8);
		rim.position.set(0, -4, -3);
		scene.add(rim);
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = .08;
		controls.enablePan = false;
		controls.autoRotate = true;
		controls.autoRotateSpeed = .65;
		controls.minDistance = .01;
		controls.maxDistance = 5e3;
		sceneRef.current = scene;
		cameraRef.current = camera;
		rendererRef.current = renderer;
		controlsRef.current = controls;
		const resize = () => {
			const w = container.clientWidth || 1;
			const h = container.clientHeight || 1;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h, false);
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(container);
		const tick = () => {
			controls.update();
			renderer.render(scene, camera);
			rafRef.current = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(rafRef.current);
			ro.disconnect();
			controls.dispose();
			if (currentRef.current) disposeObject(currentRef.current);
			renderer.dispose();
			renderer.domElement.remove();
			sceneRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		setError("");
		fetch(fileUrl(model.id, file.id), { credentials: "same-origin" }).then((res) => {
			if (!res.ok) throw new Error("Could not download this file.");
			return res.arrayBuffer();
		}).then((data) => loadModelObject(data, file.format)).then((object) => {
			if (cancelled) {
				disposeObject(object);
				return;
			}
			const scene = sceneRef.current;
			if (!scene) return;
			if (currentRef.current) {
				scene.remove(currentRef.current);
				disposeObject(currentRef.current);
			}
			const wrapper = normalizeModel(object, file.format);
			scene.add(wrapper);
			currentRef.current = wrapper;
			if (cameraRef.current && controlsRef.current) fitCameraToObject(cameraRef.current, controlsRef.current, wrapper, 1.45);
			if (rendererRef.current && cameraRef.current) rendererRef.current.render(scene, cameraRef.current);
			setLoading(false);
		}).catch((err) => {
			if (!cancelled) {
				setError(err instanceof Error ? err.message : "Preview unavailable.");
				setLoading(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		model.id,
		file.id,
		file.format
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "relative h-full w-full touch-none",
		onDoubleClick: onOpen,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-0 top-0 z-10 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 bg-ink/75 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-3 w-3 text-brand" }), " 3D Preview"]
				})
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-canvas/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-7 animate-spin rounded-full border-2 border-line border-t-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium text-muted",
					children: "Loading 3D preview…"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-canvas px-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-8 w-8 text-line-strong" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-ink",
						children: "Preview unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xs text-[10px] text-muted",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpen,
						className: "btn-secondary !min-h-8 !px-3 !text-[11px]",
						children: "Open full viewer"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute bottom-2 left-2 z-10 bg-surface/90 px-2 py-1 text-[9px] text-muted",
				children: "Drag to rotate · Scroll to zoom"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 right-2 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpen,
					className: "flex items-center gap-1 bg-surface/95 px-2 py-1 text-[10px] font-semibold text-ink shadow-sm hover:bg-brand-soft",
					"aria-label": "Open fullscreen 3D viewer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3 w-3" }), " Full viewer"]
				})
			})
		]
	});
}
export { ModelPreview as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxQcmV2aWV3LUQyWWw5anEtLmpzIiwibmFtZXMiOlsidXNlUmVmIiwidXNlU3RhdGUiLCJUSFJFRS5TY2VuZSIsIlRIUkVFLkNvbG9yIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuU1JHQkNvbG9yU3BhY2UiLCJUSFJFRS5IZW1pc3BoZXJlTGlnaHQiLCJUSFJFRS5EaXJlY3Rpb25hbExpZ2h0Il0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vd2ViL3NyYy9jb21wb25lbnRzL3ZpZXdlci9Nb2RlbFByZXZpZXcudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJveCwgTWF4aW1pemUyIH0gZnJvbSAnbHVjaWRlLXJlYWN0J1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS1zdGRsaWInXG5pbXBvcnQgeyBkaXNwb3NlT2JqZWN0LCBmaXRDYW1lcmFUb09iamVjdCwgbG9hZE1vZGVsT2JqZWN0LCBub3JtYWxpemVNb2RlbCB9IGZyb20gJy4uLy4uL2xpYi9sb2FkLW1vZGVsJ1xuaW1wb3J0IHsgZmlsZVVybCwgdHlwZSBNb2RlbCwgdHlwZSBNb2RlbEZpbGUgfSBmcm9tICcuLi8uLi9saWIvbW9kZWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2RlbFByZXZpZXcoeyBtb2RlbCwgZmlsZSwgb25PcGVuIH06IHsgbW9kZWw6IE1vZGVsOyBmaWxlOiBNb2RlbEZpbGU7IG9uT3BlbjogKCkgPT4gdm9pZCB9KSB7XG4gIGNvbnN0IGNvbnRhaW5lclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbClcbiAgY29uc3Qgc2NlbmVSZWYgPSB1c2VSZWY8VEhSRUUuU2NlbmUgfCBudWxsPihudWxsKVxuICBjb25zdCBjYW1lcmFSZWYgPSB1c2VSZWY8VEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgfCBudWxsPihudWxsKVxuICBjb25zdCByZW5kZXJlclJlZiA9IHVzZVJlZjxUSFJFRS5XZWJHTFJlbmRlcmVyIHwgbnVsbD4obnVsbClcbiAgY29uc3QgY29udHJvbHNSZWYgPSB1c2VSZWY8T3JiaXRDb250cm9scyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IGN1cnJlbnRSZWYgPSB1c2VSZWY8VEhSRUUuR3JvdXAgfCBudWxsPihudWxsKVxuICBjb25zdCByYWZSZWYgPSB1c2VSZWYoMClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50XG4gICAgaWYgKCFjb250YWluZXIpIHJldHVyblxuICAgIGNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCcjZjVmNWY1JylcbiAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIDQgLyAzLCAwLjAxLCA1MDAwKVxuICAgIGNhbWVyYS5wb3NpdGlvbi5zZXQoMiwgMiwgMilcbiAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogZmFsc2UgfSlcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsIDIpKVxuICAgIHJlbmRlcmVyLm91dHB1dENvbG9yU3BhY2UgPSBUSFJFRS5TUkdCQ29sb3JTcGFjZVxuICAgIHJlbmRlcmVyLnRvbmVNYXBwaW5nID0gVEhSRUUuQUNFU0ZpbG1pY1RvbmVNYXBwaW5nXG4gICAgcmVuZGVyZXIudG9uZU1hcHBpbmdFeHBvc3VyZSA9IDEuMDVcbiAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKCcjZjVmNWY1JylcbiAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXG4gICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gJyNmNWY1ZjUnXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cbiAgICBzY2VuZS5hZGQobmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweGZmZmZmZiwgMHg1NTU1NTUsIDIuMSkpXG4gICAgY29uc3Qga2V5ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDIuMilcbiAgICBrZXkucG9zaXRpb24uc2V0KDQsIDcsIDUpXG4gICAgc2NlbmUuYWRkKGtleSlcbiAgICBjb25zdCBmaWxsID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEuMSlcbiAgICBmaWxsLnBvc2l0aW9uLnNldCgtNSwgMiwgLTQpXG4gICAgc2NlbmUuYWRkKGZpbGwpXG4gICAgY29uc3QgcmltID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmQ2YzIsIDAuOClcbiAgICByaW0ucG9zaXRpb24uc2V0KDAsIC00LCAtMylcbiAgICBzY2VuZS5hZGQocmltKVxuXG4gICAgY29uc3QgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpXG4gICAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWVcbiAgICBjb250cm9scy5kYW1waW5nRmFjdG9yID0gMC4wOFxuICAgIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlXG4gICAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IHRydWVcbiAgICBjb250cm9scy5hdXRvUm90YXRlU3BlZWQgPSAwLjY1XG4gICAgY29udHJvbHMubWluRGlzdGFuY2UgPSAwLjAxXG4gICAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDAwXG5cbiAgICBzY2VuZVJlZi5jdXJyZW50ID0gc2NlbmVcbiAgICBjYW1lcmFSZWYuY3VycmVudCA9IGNhbWVyYVxuICAgIHJlbmRlcmVyUmVmLmN1cnJlbnQgPSByZW5kZXJlclxuICAgIGNvbnRyb2xzUmVmLmN1cnJlbnQgPSBjb250cm9sc1xuXG4gICAgY29uc3QgcmVzaXplID0gKCkgPT4ge1xuICAgICAgY29uc3QgdyA9IGNvbnRhaW5lci5jbGllbnRXaWR0aCB8fCAxXG4gICAgICBjb25zdCBoID0gY29udGFpbmVyLmNsaWVudEhlaWdodCB8fCAxXG4gICAgICBjYW1lcmEuYXNwZWN0ID0gdyAvIGhcbiAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgIHJlbmRlcmVyLnNldFNpemUodywgaCwgZmFsc2UpXG4gICAgfVxuICAgIHJlc2l6ZSgpXG4gICAgY29uc3Qgcm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIocmVzaXplKVxuICAgIHJvLm9ic2VydmUoY29udGFpbmVyKVxuXG4gICAgY29uc3QgdGljayA9ICgpID0+IHtcbiAgICAgIGNvbnRyb2xzLnVwZGF0ZSgpXG4gICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSlcbiAgICAgIHJhZlJlZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spXG4gICAgfVxuICAgIHRpY2soKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZlJlZi5jdXJyZW50KVxuICAgICAgcm8uZGlzY29ubmVjdCgpXG4gICAgICBjb250cm9scy5kaXNwb3NlKClcbiAgICAgIGlmIChjdXJyZW50UmVmLmN1cnJlbnQpIGRpc3Bvc2VPYmplY3QoY3VycmVudFJlZi5jdXJyZW50KVxuICAgICAgcmVuZGVyZXIuZGlzcG9zZSgpXG4gICAgICByZW5kZXJlci5kb21FbGVtZW50LnJlbW92ZSgpXG4gICAgICBzY2VuZVJlZi5jdXJyZW50ID0gbnVsbFxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2VcbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgc2V0RXJyb3IoJycpXG4gICAgZmV0Y2goZmlsZVVybChtb2RlbC5pZCwgZmlsZS5pZCksIHsgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicgfSlcbiAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGRvd25sb2FkIHRoaXMgZmlsZS4nKVxuICAgICAgICByZXR1cm4gcmVzLmFycmF5QnVmZmVyKClcbiAgICAgIH0pXG4gICAgICAudGhlbigoZGF0YSkgPT4gbG9hZE1vZGVsT2JqZWN0KGRhdGEsIGZpbGUuZm9ybWF0KSlcbiAgICAgIC50aGVuKChvYmplY3QpID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgeyBkaXNwb3NlT2JqZWN0KG9iamVjdCk7IHJldHVybiB9XG4gICAgICAgIGNvbnN0IHNjZW5lID0gc2NlbmVSZWYuY3VycmVudFxuICAgICAgICBpZiAoIXNjZW5lKSByZXR1cm5cbiAgICAgICAgaWYgKGN1cnJlbnRSZWYuY3VycmVudCkgeyBzY2VuZS5yZW1vdmUoY3VycmVudFJlZi5jdXJyZW50KTsgZGlzcG9zZU9iamVjdChjdXJyZW50UmVmLmN1cnJlbnQpIH1cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IG5vcm1hbGl6ZU1vZGVsKG9iamVjdCwgZmlsZS5mb3JtYXQpXG4gICAgICAgIHNjZW5lLmFkZCh3cmFwcGVyKVxuICAgICAgICBjdXJyZW50UmVmLmN1cnJlbnQgPSB3cmFwcGVyXG4gICAgICAgIGlmIChjYW1lcmFSZWYuY3VycmVudCAmJiBjb250cm9sc1JlZi5jdXJyZW50KSBmaXRDYW1lcmFUb09iamVjdChjYW1lcmFSZWYuY3VycmVudCwgY29udHJvbHNSZWYuY3VycmVudCwgd3JhcHBlciwgMS40NSlcbiAgICAgICAgaWYgKHJlbmRlcmVyUmVmLmN1cnJlbnQgJiYgY2FtZXJhUmVmLmN1cnJlbnQpIHJlbmRlcmVyUmVmLmN1cnJlbnQucmVuZGVyKHNjZW5lLCBjYW1lcmFSZWYuY3VycmVudClcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBpZiAoIWNhbmNlbGxlZCkgeyBzZXRFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ1ByZXZpZXcgdW5hdmFpbGFibGUuJyk7IHNldExvYWRpbmcoZmFsc2UpIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZSB9XG4gIH0sIFttb2RlbC5pZCwgZmlsZS5pZCwgZmlsZS5mb3JtYXRdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e2NvbnRhaW5lclJlZn0gY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1mdWxsIHctZnVsbCB0b3VjaC1ub25lXCIgb25Eb3VibGVDbGljaz17b25PcGVufT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgei0xMCBwLTJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgYmctaW5rLzc1IHB4LTIgcHktMSB0ZXh0LVs5cHhdIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMTJlbV0gdGV4dC13aGl0ZVwiPjxCb3ggY2xhc3NOYW1lPVwiaC0zIHctMyB0ZXh0LWJyYW5kXCIgLz4gM0QgUHJldmlldzwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmUgYWJzb2x1dGUgaW5zZXQtMCB6LTEwIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIGJnLWNhbnZhcy82MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC03IHctNyBhbmltYXRlLXNwaW4gcm91bmRlZC1mdWxsIGJvcmRlci0yIGJvcmRlci1saW5lIGJvcmRlci10LWJyYW5kXCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB0ZXh0LW11dGVkXCI+TG9hZGluZyAzRCBwcmV2aWV34oCmPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgei0xMCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBiZy1jYW52YXMgcHgtNCB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgIDxCb3ggY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LWxpbmUtc3Ryb25nXCIgLz5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1pbmtcIj5QcmV2aWV3IHVuYXZhaWxhYmxlPC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1heC13LXhzIHRleHQtWzEwcHhdIHRleHQtbXV0ZWRcIj57ZXJyb3J9PC9wPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e29uT3Blbn0gY2xhc3NOYW1lPVwiYnRuLXNlY29uZGFyeSAhbWluLWgtOCAhcHgtMyAhdGV4dC1bMTFweF1cIj5PcGVuIGZ1bGwgdmlld2VyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBib3R0b20tMiBsZWZ0LTIgei0xMCBiZy1zdXJmYWNlLzkwIHB4LTIgcHktMSB0ZXh0LVs5cHhdIHRleHQtbXV0ZWRcIj5cbiAgICAgICAgRHJhZyB0byByb3RhdGUgwrcgU2Nyb2xsIHRvIHpvb21cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMiByaWdodC0yIHotMTBcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17b25PcGVufSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBiZy1zdXJmYWNlLzk1IHB4LTIgcHktMSB0ZXh0LVsxMHB4XSBmb250LXNlbWlib2xkIHRleHQtaW5rIHNoYWRvdy1zbSBob3ZlcjpiZy1icmFuZC1zb2Z0XCIgYXJpYS1sYWJlbD1cIk9wZW4gZnVsbHNjcmVlbiAzRCB2aWV3ZXJcIj5cbiAgICAgICAgICA8TWF4aW1pemUyIGNsYXNzTmFtZT1cImgtMyB3LTNcIiAvPiBGdWxsIHZpZXdlclxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7O0FBT0EsU0FBd0IsYUFBYSxFQUFFLE9BQU8sTUFBTSxVQUFpRTtDQUNuSCxNQUFNLGdCQUFBLEdBQWVBLGFBQUFBLE9BQUFBLENBQXVCLElBQUk7Q0FDaEQsTUFBTSxZQUFBLEdBQVdBLGFBQUFBLE9BQUFBLENBQTJCLElBQUk7Q0FDaEQsTUFBTSxhQUFBLEdBQVlBLGFBQUFBLE9BQUFBLENBQXVDLElBQUk7Q0FDN0QsTUFBTSxlQUFBLEdBQWNBLGFBQUFBLE9BQUFBLENBQW1DLElBQUk7Q0FDM0QsTUFBTSxlQUFBLEdBQWNBLGFBQUFBLE9BQUFBLENBQTZCLElBQUk7Q0FDckQsTUFBTSxjQUFBLEdBQWFBLGFBQUFBLE9BQUFBLENBQTJCLElBQUk7Q0FDbEQsTUFBTSxVQUFBLEdBQVNBLGFBQUFBLE9BQUFBLENBQU8sQ0FBQztDQUN2QixNQUFNLENBQUMsU0FBUyxlQUFBLEdBQWNDLGFBQUFBLFNBQUFBLENBQVMsSUFBSTtDQUMzQyxNQUFNLENBQUMsT0FBTyxhQUFBLEdBQVlBLGFBQUFBLFNBQUFBLENBQVMsRUFBRTtDQUVyQyxDQUFBLEdBQUEsYUFBQSxVQUFBLE9BQWdCO0VBQ2QsTUFBTSxZQUFZLGFBQWE7RUFDL0IsSUFBSSxDQUFDLFdBQVc7RUFDaEIsTUFBTSxRQUFRLElBQUlDLE1BQVk7RUFDOUIsTUFBTSxhQUFhLElBQUlDLE1BQVksU0FBUztFQUM1QyxNQUFNLFNBQVMsSUFBSUMsa0JBQXdCLElBQUksSUFBSSxHQUFHLEtBQU0sR0FBSTtFQUNoRSxPQUFPLFNBQVMsSUFBSSxHQUFHLEdBQUcsQ0FBQztFQUMzQixNQUFNLFdBQVcsSUFBSUMsY0FBb0I7R0FBRSxXQUFXO0dBQU0sT0FBTztFQUFNLENBQUM7RUFDMUUsU0FBUyxjQUFjLEtBQUssSUFBSSxPQUFPLG9CQUFvQixHQUFHLENBQUMsQ0FBQztFQUNoRSxTQUFTLG1CQUFtQkM7RUFDNUIsU0FBUyxjQUFjO0VBQ3ZCLFNBQVMsc0JBQXNCO0VBQy9CLFNBQVMsY0FBYyxTQUFTO0VBQ2hDLFNBQVMsV0FBVyxNQUFNLFVBQVU7RUFDcEMsU0FBUyxXQUFXLE1BQU0sUUFBUTtFQUNsQyxTQUFTLFdBQVcsTUFBTSxTQUFTO0VBQ25DLFNBQVMsV0FBVyxNQUFNLGFBQWE7RUFDdkMsVUFBVSxZQUFZLFNBQVMsVUFBVTtFQUV6QyxNQUFNLElBQUksSUFBSUMsZ0JBQXNCLFVBQVUsU0FBVSxHQUFHLENBQUM7RUFDNUQsTUFBTSxNQUFNLElBQUlDLGlCQUF1QixVQUFVLEdBQUc7RUFDcEQsSUFBSSxTQUFTLElBQUksR0FBRyxHQUFHLENBQUM7RUFDeEIsTUFBTSxJQUFJLEdBQUc7RUFDYixNQUFNLE9BQU8sSUFBSUEsaUJBQXVCLFVBQVUsR0FBRztFQUNyRCxLQUFLLFNBQVMsSUFBSSxJQUFJLEdBQUcsRUFBRTtFQUMzQixNQUFNLElBQUksSUFBSTtFQUNkLE1BQU0sTUFBTSxJQUFJQSxpQkFBdUIsVUFBVSxFQUFHO0VBQ3BELElBQUksU0FBUyxJQUFJLEdBQUcsSUFBSSxFQUFFO0VBQzFCLE1BQU0sSUFBSSxHQUFHO0VBRWIsTUFBTSxXQUFXLElBQUksY0FBYyxRQUFRLFNBQVMsVUFBVTtFQUM5RCxTQUFTLGdCQUFnQjtFQUN6QixTQUFTLGdCQUFnQjtFQUN6QixTQUFTLFlBQVk7RUFDckIsU0FBUyxhQUFhO0VBQ3RCLFNBQVMsa0JBQWtCO0VBQzNCLFNBQVMsY0FBYztFQUN2QixTQUFTLGNBQWM7RUFFdkIsU0FBUyxVQUFVO0VBQ25CLFVBQVUsVUFBVTtFQUNwQixZQUFZLFVBQVU7RUFDdEIsWUFBWSxVQUFVO0VBRXRCLE1BQU0sZUFBZTtHQUNuQixNQUFNLElBQUksVUFBVSxlQUFlO0dBQ25DLE1BQU0sSUFBSSxVQUFVLGdCQUFnQjtHQUNwQyxPQUFPLFNBQVMsSUFBSTtHQUNwQixPQUFPLHVCQUF1QjtHQUM5QixTQUFTLFFBQVEsR0FBRyxHQUFHLEtBQUs7RUFDOUI7RUFDQSxPQUFPO0VBQ1AsTUFBTSxLQUFLLElBQUksZUFBZSxNQUFNO0VBQ3BDLEdBQUcsUUFBUSxTQUFTO0VBRXBCLE1BQU0sYUFBYTtHQUNqQixTQUFTLE9BQU87R0FDaEIsU0FBUyxPQUFPLE9BQU8sTUFBTTtHQUM3QixPQUFPLFVBQVUsc0JBQXNCLElBQUk7RUFDN0M7RUFDQSxLQUFLO0VBRUwsYUFBYTtHQUNYLHFCQUFxQixPQUFPLE9BQU87R0FDbkMsR0FBRyxXQUFXO0dBQ2QsU0FBUyxRQUFRO0dBQ2pCLElBQUksV0FBVyxTQUFTLGNBQWMsV0FBVyxPQUFPO0dBQ3hELFNBQVMsUUFBUTtHQUNqQixTQUFTLFdBQVcsT0FBTztHQUMzQixTQUFTLFVBQVU7RUFDckI7Q0FDRixHQUFHLENBQUMsQ0FBQztDQUVMLENBQUEsR0FBQSxhQUFBLFVBQUEsT0FBZ0I7RUFDZCxJQUFJLFlBQVk7RUFDaEIsV0FBVyxJQUFJO0VBQ2YsU0FBUyxFQUFFO0VBQ1gsTUFBTSxRQUFRLE1BQU0sSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLGFBQWEsY0FBYyxDQUFDLENBQUMsQ0FDOUQsTUFBTSxRQUFRO0dBQ2IsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLElBQUksTUFBTSwrQkFBK0I7R0FDNUQsT0FBTyxJQUFJLFlBQVk7RUFDekIsQ0FBQyxDQUFDLENBQ0QsTUFBTSxTQUFTLGdCQUFnQixNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FDbEQsTUFBTSxXQUFXO0dBQ2hCLElBQUksV0FBVztJQUFFLGNBQWMsTUFBTTtJQUFHO0dBQU87R0FDL0MsTUFBTSxRQUFRLFNBQVM7R0FDdkIsSUFBSSxDQUFDLE9BQU87R0FDWixJQUFJLFdBQVcsU0FBUztJQUFFLE1BQU0sT0FBTyxXQUFXLE9BQU87SUFBRyxjQUFjLFdBQVcsT0FBTztHQUFFO0dBQzlGLE1BQU0sVUFBVSxlQUFlLFFBQVEsS0FBSyxNQUFNO0dBQ2xELE1BQU0sSUFBSSxPQUFPO0dBQ2pCLFdBQVcsVUFBVTtHQUNyQixJQUFJLFVBQVUsV0FBVyxZQUFZLFNBQVMsa0JBQWtCLFVBQVUsU0FBUyxZQUFZLFNBQVMsU0FBUyxJQUFJO0dBQ3JILElBQUksWUFBWSxXQUFXLFVBQVUsU0FBUyxZQUFZLFFBQVEsT0FBTyxPQUFPLFVBQVUsT0FBTztHQUNqRyxXQUFXLEtBQUs7RUFDbEIsQ0FBQyxDQUFDLENBQ0QsT0FBTyxRQUFRO0dBQ2QsSUFBSSxDQUFDLFdBQVc7SUFBRSxTQUFTLGVBQWUsUUFBUSxJQUFJLFVBQVUsc0JBQXNCO0lBQUcsV0FBVyxLQUFLO0dBQUU7RUFDN0csQ0FBQztFQUNILGFBQWE7R0FBRSxZQUFZO0VBQUs7Q0FDbEMsR0FBRztFQUFDLE1BQU07RUFBSSxLQUFLO0VBQUksS0FBSztDQUFNLENBQUM7Q0FFbkMsT0FDRSxpQkFBQSxHQUFBLG1CQUFBLEtBQUEsQ0FBQyxPQUFEO0VBQUssS0FBSztFQUFjLFdBQVU7RUFBb0MsZUFBZTtFQUFyRixVQUFBO0dBQ0UsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsT0FBRDtJQUFLLFdBQVU7SUFDYixVQUFBLGlCQUFBLEdBQUEsbUJBQUEsS0FBQSxDQUFDLFFBQUQ7S0FBTSxXQUFVO0tBQWhCLFVBQUEsQ0FBMEgsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsS0FBRCxFQUFLLFdBQVUscUJBQXNCLENBQUEsR0FBQyxhQUFpQjs7R0FDOUssQ0FBQTtHQUNKLFdBQ0MsaUJBQUEsR0FBQSxtQkFBQSxLQUFBLENBQUMsT0FBRDtJQUFLLFdBQVU7SUFBZixVQUFBLENBQ0UsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsT0FBRCxFQUFLLFdBQVUsd0VBQXlFLENBQUEsR0FDeEYsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsUUFBRDtLQUFNLFdBQVU7S0FBcUMsVUFBQTtJQUF5QixDQUFBLENBQzNFOztHQUVOLFNBQ0MsaUJBQUEsR0FBQSxtQkFBQSxLQUFBLENBQUMsT0FBRDtJQUFLLFdBQVU7SUFBZixVQUFBO0tBQ0UsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsS0FBRCxFQUFLLFdBQVUsMkJBQTRCLENBQUE7S0FDM0MsaUJBQUEsR0FBQSxtQkFBQSxJQUFBLENBQUMsS0FBRDtNQUFHLFdBQVU7TUFBaUMsVUFBQTtLQUFzQixDQUFBO0tBQ3BFLGlCQUFBLEdBQUEsbUJBQUEsSUFBQSxDQUFDLEtBQUQ7TUFBRyxXQUFVO01BQW1DLFVBQUE7S0FBUyxDQUFBO0tBQ3pELGlCQUFBLEdBQUEsbUJBQUEsSUFBQSxDQUFDLFVBQUQ7TUFBUSxNQUFLO01BQVMsU0FBUztNQUFRLFdBQVU7TUFBNEMsVUFBQTtLQUF3QixDQUFBO0lBQ2xIOztHQUVQLGlCQUFBLEdBQUEsbUJBQUEsSUFBQSxDQUFDLE9BQUQ7SUFBSyxXQUFVO0lBQWtHLFVBQUE7R0FFNUcsQ0FBQTtHQUNMLGlCQUFBLEdBQUEsbUJBQUEsSUFBQSxDQUFDLE9BQUQ7SUFBSyxXQUFVO0lBQ2IsVUFBQSxpQkFBQSxHQUFBLG1CQUFBLEtBQUEsQ0FBQyxVQUFEO0tBQVEsTUFBSztLQUFTLFNBQVM7S0FBUSxXQUFVO0tBQW1ILGNBQVc7S0FBL0ssVUFBQSxDQUNFLGlCQUFBLEdBQUEsbUJBQUEsSUFBQSxDQUFDLFdBQUQsRUFBVyxXQUFVLFVBQVcsQ0FBQSxHQUFDLGNBQzNCOztHQUNMLENBQUE7RUFDRjs7QUFFVCJ9