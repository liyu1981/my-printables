(function() {
	// \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	// __vite-browser-external
	var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = {};
	}));
	// ../node_modules/.pnpm/occt-import-js@0.0.23/node_modules/occt-import-js/dist/occt-import-js.wasm?url
	var import_occt_import_js = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		var occtimportjs = (() => {
			var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
			if (typeof __filename != "undefined") _scriptName = _scriptName || __filename;
			return (function(moduleArg = {}) {
				var moduleRtn;
				var Module = moduleArg;
				var readyPromiseResolve, readyPromiseReject;
				var readyPromise = new Promise((resolve, reject) => {
					readyPromiseResolve = resolve;
					readyPromiseReject = reject;
				});
				var ENVIRONMENT_IS_WEB = typeof window == "object";
				var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
				var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
				if (ENVIRONMENT_IS_NODE) {}
				var moduleOverrides = Object.assign({}, Module);
				var thisProgram = "./this.program";
				var quit_ = (status, toThrow) => {
					throw toThrow;
				};
				var scriptDirectory = "";
				function locateFile(path) {
					if (Module["locateFile"]) return Module["locateFile"](path, scriptDirectory);
					return scriptDirectory + path;
				}
				var readAsync, readBinary;
				if (ENVIRONMENT_IS_NODE) {
					var fs = require___vite_browser_external();
					var nodePath = require___vite_browser_external();
					scriptDirectory = __dirname + "/";
					readBinary = (filename) => {
						filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
						return fs.readFileSync(filename);
					};
					readAsync = (filename, binary = true) => {
						filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
						return new Promise((resolve, reject) => {
							fs.readFile(filename, binary ? void 0 : "utf8", (err, data) => {
								if (err) reject(err);
								else resolve(binary ? data.buffer : data);
							});
						});
					};
					if (!Module["thisProgram"] && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
					process.argv.slice(2);
					quit_ = (status, toThrow) => {
						process.exitCode = status;
						throw toThrow;
					};
				} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
					if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
					else if (typeof document != "undefined" && document.currentScript) scriptDirectory = document.currentScript.src;
					if (_scriptName) scriptDirectory = _scriptName;
					if (scriptDirectory.startsWith("blob:")) scriptDirectory = "";
					else scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
					if (ENVIRONMENT_IS_WORKER) readBinary = (url) => {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", url, false);
						xhr.responseType = "arraybuffer";
						xhr.send(null);
						return new Uint8Array(xhr.response);
					};
					readAsync = (url) => {
						if (isFileURI(url)) return new Promise((resolve, reject) => {
							var xhr = new XMLHttpRequest();
							xhr.open("GET", url, true);
							xhr.responseType = "arraybuffer";
							xhr.onload = () => {
								if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
									resolve(xhr.response);
									return;
								}
								reject(xhr.status);
							};
							xhr.onerror = reject;
							xhr.send(null);
						});
						return fetch(url, { credentials: "same-origin" }).then((response) => {
							if (response.ok) return response.arrayBuffer();
							return Promise.reject(/* @__PURE__ */ new Error(response.status + " : " + response.url));
						});
					};
				}
				var out = Module["print"] || console.log.bind(console);
				var err = Module["printErr"] || console.error.bind(console);
				Object.assign(Module, moduleOverrides);
				moduleOverrides = null;
				if (Module["arguments"]) Module["arguments"];
				if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
				var wasmBinary = Module["wasmBinary"];
				var wasmMemory;
				var ABORT = false;
				function assert(condition, text) {
					if (!condition) abort(text);
				}
				var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
				function updateMemoryViews() {
					var b = wasmMemory.buffer;
					Module["HEAP8"] = HEAP8 = new Int8Array(b);
					Module["HEAP16"] = HEAP16 = new Int16Array(b);
					Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
					Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
					Module["HEAP32"] = HEAP32 = new Int32Array(b);
					Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
					Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
					Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
				}
				var __ATPRERUN__ = [];
				var __ATINIT__ = [];
				var __ATPOSTRUN__ = [];
				var runtimeInitialized = false;
				function preRun() {
					var preRuns = Module["preRun"];
					if (preRuns) {
						if (typeof preRuns == "function") preRuns = [preRuns];
						preRuns.forEach(addOnPreRun);
					}
					callRuntimeCallbacks(__ATPRERUN__);
				}
				function initRuntime() {
					runtimeInitialized = true;
					if (!Module["noFSInit"] && !FS.initialized) FS.init();
					FS.ignorePermissions = false;
					TTY.init();
					callRuntimeCallbacks(__ATINIT__);
				}
				function postRun() {
					var postRuns = Module["postRun"];
					if (postRuns) {
						if (typeof postRuns == "function") postRuns = [postRuns];
						postRuns.forEach(addOnPostRun);
					}
					callRuntimeCallbacks(__ATPOSTRUN__);
				}
				function addOnPreRun(cb) {
					__ATPRERUN__.unshift(cb);
				}
				function addOnInit(cb) {
					__ATINIT__.unshift(cb);
				}
				function addOnPostRun(cb) {
					__ATPOSTRUN__.unshift(cb);
				}
				var runDependencies = 0;
				var runDependencyWatcher = null;
				var dependenciesFulfilled = null;
				function getUniqueRunDependency(id) {
					return id;
				}
				function addRunDependency(id) {
					runDependencies++;
					Module["monitorRunDependencies"]?.(runDependencies);
				}
				function removeRunDependency(id) {
					runDependencies--;
					Module["monitorRunDependencies"]?.(runDependencies);
					if (runDependencies == 0) {
						if (runDependencyWatcher !== null) {
							clearInterval(runDependencyWatcher);
							runDependencyWatcher = null;
						}
						if (dependenciesFulfilled) {
							var callback = dependenciesFulfilled;
							dependenciesFulfilled = null;
							callback();
						}
					}
				}
				function abort(what) {
					Module["onAbort"]?.(what);
					what = "Aborted(" + what + ")";
					err(what);
					ABORT = true;
					what += ". Build with -sASSERTIONS for more info.";
					if (runtimeInitialized) ___trap();
					var e = new WebAssembly.RuntimeError(what);
					readyPromiseReject(e);
					throw e;
				}
				var dataURIPrefix = "data:application/octet-stream;base64,";
				var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
				var isFileURI = (filename) => filename.startsWith("file://");
				function findWasmBinary() {
					var f = "occt-import-js.wasm";
					if (!isDataURI(f)) return locateFile(f);
					return f;
				}
				var wasmBinaryFile;
				function getBinarySync(file) {
					if (file == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
					if (readBinary) return readBinary(file);
					throw "both async and sync fetching of the wasm failed";
				}
				function getBinaryPromise(binaryFile) {
					if (!wasmBinary) return readAsync(binaryFile).then((response) => new Uint8Array(response), () => getBinarySync(binaryFile));
					return Promise.resolve().then(() => getBinarySync(binaryFile));
				}
				function instantiateArrayBuffer(binaryFile, imports, receiver) {
					return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then(receiver, (reason) => {
						err(`failed to asynchronously prepare wasm: ${reason}`);
						abort(reason);
					});
				}
				function instantiateAsync(binary, binaryFile, imports, callback) {
					if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
						return WebAssembly.instantiateStreaming(response, imports).then(callback, function(reason) {
							err(`wasm streaming compile failed: ${reason}`);
							err("falling back to ArrayBuffer instantiation");
							return instantiateArrayBuffer(binaryFile, imports, callback);
						});
					});
					return instantiateArrayBuffer(binaryFile, imports, callback);
				}
				function getWasmImports() {
					return { a: wasmImports };
				}
				function createWasm() {
					var info = getWasmImports();
					function receiveInstance(instance, module) {
						wasmExports = instance.exports;
						wasmMemory = wasmExports["_"];
						updateMemoryViews();
						wasmTable = wasmExports["ba"];
						addOnInit(wasmExports["$"]);
						removeRunDependency("wasm-instantiate");
						return wasmExports;
					}
					addRunDependency("wasm-instantiate");
					function receiveInstantiationResult(result) {
						receiveInstance(result["instance"]);
					}
					if (Module["instantiateWasm"]) try {
						return Module["instantiateWasm"](info, receiveInstance);
					} catch (e) {
						err(`Module.instantiateWasm callback failed with error: ${e}`);
						readyPromiseReject(e);
					}
					wasmBinaryFile ??= findWasmBinary();
					instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
					return {};
				}
				var tempDouble;
				var tempI64;
				function ExitStatus(status) {
					this.name = "ExitStatus";
					this.message = `Program terminated with exit(${status})`;
					this.status = status;
				}
				var callRuntimeCallbacks = (callbacks) => {
					callbacks.forEach((f) => f(Module));
				};
				var noExitRuntime = Module["noExitRuntime"] || true;
				var PATH = {
					isAbs: (path) => path.charAt(0) === "/",
					splitPath: (filename) => {
						return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(filename).slice(1);
					},
					normalizeArray: (parts, allowAboveRoot) => {
						var up = 0;
						for (var i = parts.length - 1; i >= 0; i--) {
							var last = parts[i];
							if (last === ".") parts.splice(i, 1);
							else if (last === "..") {
								parts.splice(i, 1);
								up++;
							} else if (up) {
								parts.splice(i, 1);
								up--;
							}
						}
						if (allowAboveRoot) for (; up; up--) parts.unshift("..");
						return parts;
					},
					normalize: (path) => {
						var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
						path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
						if (!path && !isAbsolute) path = ".";
						if (path && trailingSlash) path += "/";
						return (isAbsolute ? "/" : "") + path;
					},
					dirname: (path) => {
						var result = PATH.splitPath(path), root = result[0], dir = result[1];
						if (!root && !dir) return ".";
						if (dir) dir = dir.substr(0, dir.length - 1);
						return root + dir;
					},
					basename: (path) => {
						if (path === "/") return "/";
						path = PATH.normalize(path);
						path = path.replace(/\/$/, "");
						var lastSlash = path.lastIndexOf("/");
						if (lastSlash === -1) return path;
						return path.substr(lastSlash + 1);
					},
					join: (...paths) => PATH.normalize(paths.join("/")),
					join2: (l, r) => PATH.normalize(l + "/" + r)
				};
				var initRandomFill = () => {
					if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") return (view) => crypto.getRandomValues(view);
					else if (ENVIRONMENT_IS_NODE) try {
						var crypto_module = require___vite_browser_external();
						if (crypto_module["randomFillSync"]) return (view) => crypto_module["randomFillSync"](view);
						var randomBytes = crypto_module["randomBytes"];
						return (view) => (view.set(randomBytes(view.byteLength)), view);
					} catch (e) {}
					abort("initRandomDevice");
				};
				var randomFill = (view) => (randomFill = initRandomFill())(view);
				var PATH_FS = {
					resolve: (...args) => {
						var resolvedPath = "", resolvedAbsolute = false;
						for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
							var path = i >= 0 ? args[i] : FS.cwd();
							if (typeof path != "string") throw new TypeError("Arguments to path.resolve must be strings");
							else if (!path) return "";
							resolvedPath = path + "/" + resolvedPath;
							resolvedAbsolute = PATH.isAbs(path);
						}
						resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
						return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
					},
					relative: (from, to) => {
						from = PATH_FS.resolve(from).substr(1);
						to = PATH_FS.resolve(to).substr(1);
						function trim(arr) {
							var start = 0;
							for (; start < arr.length; start++) if (arr[start] !== "") break;
							var end = arr.length - 1;
							for (; end >= 0; end--) if (arr[end] !== "") break;
							if (start > end) return [];
							return arr.slice(start, end - start + 1);
						}
						var fromParts = trim(from.split("/"));
						var toParts = trim(to.split("/"));
						var length = Math.min(fromParts.length, toParts.length);
						var samePartsLength = length;
						for (var i = 0; i < length; i++) if (fromParts[i] !== toParts[i]) {
							samePartsLength = i;
							break;
						}
						var outputParts = [];
						for (var i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
						outputParts = outputParts.concat(toParts.slice(samePartsLength));
						return outputParts.join("/");
					}
				};
				var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
				var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
					var endIdx = idx + maxBytesToRead;
					var endPtr = idx;
					while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
					if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
					var str = "";
					while (idx < endPtr) {
						var u0 = heapOrArray[idx++];
						if (!(u0 & 128)) {
							str += String.fromCharCode(u0);
							continue;
						}
						var u1 = heapOrArray[idx++] & 63;
						if ((u0 & 224) == 192) {
							str += String.fromCharCode((u0 & 31) << 6 | u1);
							continue;
						}
						var u2 = heapOrArray[idx++] & 63;
						if ((u0 & 240) == 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
						else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
						if (u0 < 65536) str += String.fromCharCode(u0);
						else {
							var ch = u0 - 65536;
							str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
						}
					}
					return str;
				};
				var FS_stdin_getChar_buffer = [];
				var lengthBytesUTF8 = (str) => {
					var len = 0;
					for (var i = 0; i < str.length; ++i) {
						var c = str.charCodeAt(i);
						if (c <= 127) len++;
						else if (c <= 2047) len += 2;
						else if (c >= 55296 && c <= 57343) {
							len += 4;
							++i;
						} else len += 3;
					}
					return len;
				};
				var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
					if (!(maxBytesToWrite > 0)) return 0;
					var startIdx = outIdx;
					var endIdx = outIdx + maxBytesToWrite - 1;
					for (var i = 0; i < str.length; ++i) {
						var u = str.charCodeAt(i);
						if (u >= 55296 && u <= 57343) {
							var u1 = str.charCodeAt(++i);
							u = 65536 + ((u & 1023) << 10) | u1 & 1023;
						}
						if (u <= 127) {
							if (outIdx >= endIdx) break;
							heap[outIdx++] = u;
						} else if (u <= 2047) {
							if (outIdx + 1 >= endIdx) break;
							heap[outIdx++] = 192 | u >> 6;
							heap[outIdx++] = 128 | u & 63;
						} else if (u <= 65535) {
							if (outIdx + 2 >= endIdx) break;
							heap[outIdx++] = 224 | u >> 12;
							heap[outIdx++] = 128 | u >> 6 & 63;
							heap[outIdx++] = 128 | u & 63;
						} else {
							if (outIdx + 3 >= endIdx) break;
							heap[outIdx++] = 240 | u >> 18;
							heap[outIdx++] = 128 | u >> 12 & 63;
							heap[outIdx++] = 128 | u >> 6 & 63;
							heap[outIdx++] = 128 | u & 63;
						}
					}
					heap[outIdx] = 0;
					return outIdx - startIdx;
				};
				function intArrayFromString(stringy, dontAddNull, length) {
					var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
					var u8array = new Array(len);
					var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
					if (dontAddNull) u8array.length = numBytesWritten;
					return u8array;
				}
				var FS_stdin_getChar = () => {
					if (!FS_stdin_getChar_buffer.length) {
						var result = null;
						if (ENVIRONMENT_IS_NODE) {
							var BUFSIZE = 256;
							var buf = Buffer.alloc(BUFSIZE);
							var bytesRead = 0;
							var fd = process.stdin.fd;
							try {
								bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
							} catch (e) {
								if (e.toString().includes("EOF")) bytesRead = 0;
								else throw e;
							}
							if (bytesRead > 0) result = buf.slice(0, bytesRead).toString("utf-8");
						} else if (typeof window != "undefined" && typeof window.prompt == "function") {
							result = window.prompt("Input: ");
							if (result !== null) result += "\n";
						}
						if (!result) return null;
						FS_stdin_getChar_buffer = intArrayFromString(result, true);
					}
					return FS_stdin_getChar_buffer.shift();
				};
				var TTY = {
					ttys: [],
					init() {},
					shutdown() {},
					register(dev, ops) {
						TTY.ttys[dev] = {
							input: [],
							output: [],
							ops
						};
						FS.registerDevice(dev, TTY.stream_ops);
					},
					stream_ops: {
						open(stream) {
							var tty = TTY.ttys[stream.node.rdev];
							if (!tty) throw new FS.ErrnoError(43);
							stream.tty = tty;
							stream.seekable = false;
						},
						close(stream) {
							stream.tty.ops.fsync(stream.tty);
						},
						fsync(stream) {
							stream.tty.ops.fsync(stream.tty);
						},
						read(stream, buffer, offset, length, pos) {
							if (!stream.tty || !stream.tty.ops.get_char) throw new FS.ErrnoError(60);
							var bytesRead = 0;
							for (var i = 0; i < length; i++) {
								var result;
								try {
									result = stream.tty.ops.get_char(stream.tty);
								} catch (e) {
									throw new FS.ErrnoError(29);
								}
								if (result === void 0 && bytesRead === 0) throw new FS.ErrnoError(6);
								if (result === null || result === void 0) break;
								bytesRead++;
								buffer[offset + i] = result;
							}
							if (bytesRead) stream.node.timestamp = Date.now();
							return bytesRead;
						},
						write(stream, buffer, offset, length, pos) {
							if (!stream.tty || !stream.tty.ops.put_char) throw new FS.ErrnoError(60);
							try {
								for (var i = 0; i < length; i++) stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
							} catch (e) {
								throw new FS.ErrnoError(29);
							}
							if (length) stream.node.timestamp = Date.now();
							return i;
						}
					},
					default_tty_ops: {
						get_char(tty) {
							return FS_stdin_getChar();
						},
						put_char(tty, val) {
							if (val === null || val === 10) {
								out(UTF8ArrayToString(tty.output));
								tty.output = [];
							} else if (val != 0) tty.output.push(val);
						},
						fsync(tty) {
							if (tty.output && tty.output.length > 0) {
								out(UTF8ArrayToString(tty.output));
								tty.output = [];
							}
						},
						ioctl_tcgets(tty) {
							return {
								c_iflag: 25856,
								c_oflag: 5,
								c_cflag: 191,
								c_lflag: 35387,
								c_cc: [
									3,
									28,
									127,
									21,
									4,
									0,
									1,
									0,
									17,
									19,
									26,
									0,
									18,
									15,
									23,
									22,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0
								]
							};
						},
						ioctl_tcsets(tty, optional_actions, data) {
							return 0;
						},
						ioctl_tiocgwinsz(tty) {
							return [24, 80];
						}
					},
					default_tty1_ops: {
						put_char(tty, val) {
							if (val === null || val === 10) {
								err(UTF8ArrayToString(tty.output));
								tty.output = [];
							} else if (val != 0) tty.output.push(val);
						},
						fsync(tty) {
							if (tty.output && tty.output.length > 0) {
								err(UTF8ArrayToString(tty.output));
								tty.output = [];
							}
						}
					}
				};
				var zeroMemory = (address, size) => {
					HEAPU8.fill(0, address, address + size);
				};
				var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
				var mmapAlloc = (size) => {
					size = alignMemory(size, 65536);
					var ptr = _emscripten_builtin_memalign(65536, size);
					if (ptr) zeroMemory(ptr, size);
					return ptr;
				};
				var MEMFS = {
					ops_table: null,
					mount(mount) {
						return MEMFS.createNode(null, "/", 16895, 0);
					},
					createNode(parent, name, mode, dev) {
						if (FS.isBlkdev(mode) || FS.isFIFO(mode)) throw new FS.ErrnoError(63);
						MEMFS.ops_table ||= {
							dir: {
								node: {
									getattr: MEMFS.node_ops.getattr,
									setattr: MEMFS.node_ops.setattr,
									lookup: MEMFS.node_ops.lookup,
									mknod: MEMFS.node_ops.mknod,
									rename: MEMFS.node_ops.rename,
									unlink: MEMFS.node_ops.unlink,
									rmdir: MEMFS.node_ops.rmdir,
									readdir: MEMFS.node_ops.readdir,
									symlink: MEMFS.node_ops.symlink
								},
								stream: { llseek: MEMFS.stream_ops.llseek }
							},
							file: {
								node: {
									getattr: MEMFS.node_ops.getattr,
									setattr: MEMFS.node_ops.setattr
								},
								stream: {
									llseek: MEMFS.stream_ops.llseek,
									read: MEMFS.stream_ops.read,
									write: MEMFS.stream_ops.write,
									allocate: MEMFS.stream_ops.allocate,
									mmap: MEMFS.stream_ops.mmap,
									msync: MEMFS.stream_ops.msync
								}
							},
							link: {
								node: {
									getattr: MEMFS.node_ops.getattr,
									setattr: MEMFS.node_ops.setattr,
									readlink: MEMFS.node_ops.readlink
								},
								stream: {}
							},
							chrdev: {
								node: {
									getattr: MEMFS.node_ops.getattr,
									setattr: MEMFS.node_ops.setattr
								},
								stream: FS.chrdev_stream_ops
							}
						};
						var node = FS.createNode(parent, name, mode, dev);
						if (FS.isDir(node.mode)) {
							node.node_ops = MEMFS.ops_table.dir.node;
							node.stream_ops = MEMFS.ops_table.dir.stream;
							node.contents = {};
						} else if (FS.isFile(node.mode)) {
							node.node_ops = MEMFS.ops_table.file.node;
							node.stream_ops = MEMFS.ops_table.file.stream;
							node.usedBytes = 0;
							node.contents = null;
						} else if (FS.isLink(node.mode)) {
							node.node_ops = MEMFS.ops_table.link.node;
							node.stream_ops = MEMFS.ops_table.link.stream;
						} else if (FS.isChrdev(node.mode)) {
							node.node_ops = MEMFS.ops_table.chrdev.node;
							node.stream_ops = MEMFS.ops_table.chrdev.stream;
						}
						node.timestamp = Date.now();
						if (parent) {
							parent.contents[name] = node;
							parent.timestamp = node.timestamp;
						}
						return node;
					},
					getFileDataAsTypedArray(node) {
						if (!node.contents) return /* @__PURE__ */ new Uint8Array(0);
						if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
						return new Uint8Array(node.contents);
					},
					expandFileStorage(node, newCapacity) {
						var prevCapacity = node.contents ? node.contents.length : 0;
						if (prevCapacity >= newCapacity) return;
						newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < 1048576 ? 2 : 1.125) >>> 0);
						if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
						var oldContents = node.contents;
						node.contents = new Uint8Array(newCapacity);
						if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
					},
					resizeFileStorage(node, newSize) {
						if (node.usedBytes == newSize) return;
						if (newSize == 0) {
							node.contents = null;
							node.usedBytes = 0;
						} else {
							var oldContents = node.contents;
							node.contents = new Uint8Array(newSize);
							if (oldContents) node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
							node.usedBytes = newSize;
						}
					},
					node_ops: {
						getattr(node) {
							var attr = {};
							attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
							attr.ino = node.id;
							attr.mode = node.mode;
							attr.nlink = 1;
							attr.uid = 0;
							attr.gid = 0;
							attr.rdev = node.rdev;
							if (FS.isDir(node.mode)) attr.size = 4096;
							else if (FS.isFile(node.mode)) attr.size = node.usedBytes;
							else if (FS.isLink(node.mode)) attr.size = node.link.length;
							else attr.size = 0;
							attr.atime = new Date(node.timestamp);
							attr.mtime = new Date(node.timestamp);
							attr.ctime = new Date(node.timestamp);
							attr.blksize = 4096;
							attr.blocks = Math.ceil(attr.size / attr.blksize);
							return attr;
						},
						setattr(node, attr) {
							if (attr.mode !== void 0) node.mode = attr.mode;
							if (attr.timestamp !== void 0) node.timestamp = attr.timestamp;
							if (attr.size !== void 0) MEMFS.resizeFileStorage(node, attr.size);
						},
						lookup(parent, name) {
							throw FS.genericErrors[44];
						},
						mknod(parent, name, mode, dev) {
							return MEMFS.createNode(parent, name, mode, dev);
						},
						rename(old_node, new_dir, new_name) {
							if (FS.isDir(old_node.mode)) {
								var new_node;
								try {
									new_node = FS.lookupNode(new_dir, new_name);
								} catch (e) {}
								if (new_node) for (var i in new_node.contents) throw new FS.ErrnoError(55);
							}
							delete old_node.parent.contents[old_node.name];
							old_node.parent.timestamp = Date.now();
							old_node.name = new_name;
							new_dir.contents[new_name] = old_node;
							new_dir.timestamp = old_node.parent.timestamp;
						},
						unlink(parent, name) {
							delete parent.contents[name];
							parent.timestamp = Date.now();
						},
						rmdir(parent, name) {
							for (var i in FS.lookupNode(parent, name).contents) throw new FS.ErrnoError(55);
							delete parent.contents[name];
							parent.timestamp = Date.now();
						},
						readdir(node) {
							var entries = [".", ".."];
							for (var key of Object.keys(node.contents)) entries.push(key);
							return entries;
						},
						symlink(parent, newname, oldpath) {
							var node = MEMFS.createNode(parent, newname, 41471, 0);
							node.link = oldpath;
							return node;
						},
						readlink(node) {
							if (!FS.isLink(node.mode)) throw new FS.ErrnoError(28);
							return node.link;
						}
					},
					stream_ops: {
						read(stream, buffer, offset, length, position) {
							var contents = stream.node.contents;
							if (position >= stream.node.usedBytes) return 0;
							var size = Math.min(stream.node.usedBytes - position, length);
							if (size > 8 && contents.subarray) buffer.set(contents.subarray(position, position + size), offset);
							else for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
							return size;
						},
						write(stream, buffer, offset, length, position, canOwn) {
							if (buffer.buffer === HEAP8.buffer) canOwn = false;
							if (!length) return 0;
							var node = stream.node;
							node.timestamp = Date.now();
							if (buffer.subarray && (!node.contents || node.contents.subarray)) {
								if (canOwn) {
									node.contents = buffer.subarray(offset, offset + length);
									node.usedBytes = length;
									return length;
								} else if (node.usedBytes === 0 && position === 0) {
									node.contents = buffer.slice(offset, offset + length);
									node.usedBytes = length;
									return length;
								} else if (position + length <= node.usedBytes) {
									node.contents.set(buffer.subarray(offset, offset + length), position);
									return length;
								}
							}
							MEMFS.expandFileStorage(node, position + length);
							if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
							else for (var i = 0; i < length; i++) node.contents[position + i] = buffer[offset + i];
							node.usedBytes = Math.max(node.usedBytes, position + length);
							return length;
						},
						llseek(stream, offset, whence) {
							var position = offset;
							if (whence === 1) position += stream.position;
							else if (whence === 2) {
								if (FS.isFile(stream.node.mode)) position += stream.node.usedBytes;
							}
							if (position < 0) throw new FS.ErrnoError(28);
							return position;
						},
						allocate(stream, offset, length) {
							MEMFS.expandFileStorage(stream.node, offset + length);
							stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
						},
						mmap(stream, length, position, prot, flags) {
							if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
							var ptr;
							var allocated;
							var contents = stream.node.contents;
							if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
								allocated = false;
								ptr = contents.byteOffset;
							} else {
								allocated = true;
								ptr = mmapAlloc(length);
								if (!ptr) throw new FS.ErrnoError(48);
								if (contents) {
									if (position > 0 || position + length < contents.length) {
										if (contents.subarray) contents = contents.subarray(position, position + length);
										else contents = Array.prototype.slice.call(contents, position, position + length);
									}
									HEAP8.set(contents, ptr);
								}
							}
							return {
								ptr,
								allocated
							};
						},
						msync(stream, buffer, offset, length, mmapFlags) {
							MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
							return 0;
						}
					}
				};
				var asyncLoad = (url, onload, onerror, noRunDep) => {
					var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
					readAsync(url).then((arrayBuffer) => {
						onload(new Uint8Array(arrayBuffer));
						if (dep) removeRunDependency(dep);
					}, (err) => {
						if (onerror) onerror();
						else throw `Loading data file "${url}" failed.`;
					});
					if (dep) addRunDependency(dep);
				};
				var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
					FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
				};
				var preloadPlugins = Module["preloadPlugins"] || [];
				var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
					if (typeof Browser != "undefined") Browser.init();
					var handled = false;
					preloadPlugins.forEach((plugin) => {
						if (handled) return;
						if (plugin["canHandle"](fullname)) {
							plugin["handle"](byteArray, fullname, finish, onerror);
							handled = true;
						}
					});
					return handled;
				};
				var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
					var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
					var dep = getUniqueRunDependency(`cp ${fullname}`);
					function processData(byteArray) {
						function finish(byteArray) {
							preFinish?.();
							if (!dontCreateFile) FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
							onload?.();
							removeRunDependency(dep);
						}
						if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
							onerror?.();
							removeRunDependency(dep);
						})) return;
						finish(byteArray);
					}
					addRunDependency(dep);
					if (typeof url == "string") asyncLoad(url, processData, onerror);
					else processData(url);
				};
				var FS_modeStringToFlags = (str) => {
					var flags = {
						r: 0,
						"r+": 2,
						w: 577,
						"w+": 578,
						a: 1089,
						"a+": 1090
					}[str];
					if (typeof flags == "undefined") throw new Error(`Unknown file open mode: ${str}`);
					return flags;
				};
				var FS_getMode = (canRead, canWrite) => {
					var mode = 0;
					if (canRead) mode |= 365;
					if (canWrite) mode |= 146;
					return mode;
				};
				var FS = {
					root: null,
					mounts: [],
					devices: {},
					streams: [],
					nextInode: 1,
					nameTable: null,
					currentPath: "/",
					initialized: false,
					ignorePermissions: true,
					ErrnoError: class {
						constructor(errno) {
							this.name = "ErrnoError";
							this.errno = errno;
						}
					},
					genericErrors: {},
					filesystems: null,
					syncFSRequests: 0,
					readFiles: {},
					FSStream: class {
						constructor() {
							this.shared = {};
						}
						get object() {
							return this.node;
						}
						set object(val) {
							this.node = val;
						}
						get isRead() {
							return (this.flags & 2097155) !== 1;
						}
						get isWrite() {
							return (this.flags & 2097155) !== 0;
						}
						get isAppend() {
							return this.flags & 1024;
						}
						get flags() {
							return this.shared.flags;
						}
						set flags(val) {
							this.shared.flags = val;
						}
						get position() {
							return this.shared.position;
						}
						set position(val) {
							this.shared.position = val;
						}
					},
					FSNode: class {
						constructor(parent, name, mode, rdev) {
							if (!parent) parent = this;
							this.parent = parent;
							this.mount = parent.mount;
							this.mounted = null;
							this.id = FS.nextInode++;
							this.name = name;
							this.mode = mode;
							this.node_ops = {};
							this.stream_ops = {};
							this.rdev = rdev;
							this.readMode = 365;
							this.writeMode = 146;
						}
						get read() {
							return (this.mode & this.readMode) === this.readMode;
						}
						set read(val) {
							val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
						}
						get write() {
							return (this.mode & this.writeMode) === this.writeMode;
						}
						set write(val) {
							val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
						}
						get isFolder() {
							return FS.isDir(this.mode);
						}
						get isDevice() {
							return FS.isChrdev(this.mode);
						}
					},
					lookupPath(path, opts = {}) {
						path = PATH_FS.resolve(path);
						if (!path) return {
							path: "",
							node: null
						};
						opts = Object.assign({
							follow_mount: true,
							recurse_count: 0
						}, opts);
						if (opts.recurse_count > 8) throw new FS.ErrnoError(32);
						var parts = path.split("/").filter((p) => !!p);
						var current = FS.root;
						var current_path = "/";
						for (var i = 0; i < parts.length; i++) {
							var islast = i === parts.length - 1;
							if (islast && opts.parent) break;
							current = FS.lookupNode(current, parts[i]);
							current_path = PATH.join2(current_path, parts[i]);
							if (FS.isMountpoint(current)) {
								if (!islast || islast && opts.follow_mount) current = current.mounted.root;
							}
							if (!islast || opts.follow) {
								var count = 0;
								while (FS.isLink(current.mode)) {
									var link = FS.readlink(current_path);
									current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
									current = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 }).node;
									if (count++ > 40) throw new FS.ErrnoError(32);
								}
							}
						}
						return {
							path: current_path,
							node: current
						};
					},
					getPath(node) {
						var path;
						while (true) {
							if (FS.isRoot(node)) {
								var mount = node.mount.mountpoint;
								if (!path) return mount;
								return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
							}
							path = path ? `${node.name}/${path}` : node.name;
							node = node.parent;
						}
					},
					hashName(parentid, name) {
						var hash = 0;
						for (var i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
						return (parentid + hash >>> 0) % FS.nameTable.length;
					},
					hashAddNode(node) {
						var hash = FS.hashName(node.parent.id, node.name);
						node.name_next = FS.nameTable[hash];
						FS.nameTable[hash] = node;
					},
					hashRemoveNode(node) {
						var hash = FS.hashName(node.parent.id, node.name);
						if (FS.nameTable[hash] === node) FS.nameTable[hash] = node.name_next;
						else {
							var current = FS.nameTable[hash];
							while (current) {
								if (current.name_next === node) {
									current.name_next = node.name_next;
									break;
								}
								current = current.name_next;
							}
						}
					},
					lookupNode(parent, name) {
						var errCode = FS.mayLookup(parent);
						if (errCode) throw new FS.ErrnoError(errCode);
						var hash = FS.hashName(parent.id, name);
						for (var node = FS.nameTable[hash]; node; node = node.name_next) {
							var nodeName = node.name;
							if (node.parent.id === parent.id && nodeName === name) return node;
						}
						return FS.lookup(parent, name);
					},
					createNode(parent, name, mode, rdev) {
						var node = new FS.FSNode(parent, name, mode, rdev);
						FS.hashAddNode(node);
						return node;
					},
					destroyNode(node) {
						FS.hashRemoveNode(node);
					},
					isRoot(node) {
						return node === node.parent;
					},
					isMountpoint(node) {
						return !!node.mounted;
					},
					isFile(mode) {
						return (mode & 61440) === 32768;
					},
					isDir(mode) {
						return (mode & 61440) === 16384;
					},
					isLink(mode) {
						return (mode & 61440) === 40960;
					},
					isChrdev(mode) {
						return (mode & 61440) === 8192;
					},
					isBlkdev(mode) {
						return (mode & 61440) === 24576;
					},
					isFIFO(mode) {
						return (mode & 61440) === 4096;
					},
					isSocket(mode) {
						return (mode & 49152) === 49152;
					},
					flagsToPermissionString(flag) {
						var perms = [
							"r",
							"w",
							"rw"
						][flag & 3];
						if (flag & 512) perms += "w";
						return perms;
					},
					nodePermissions(node, perms) {
						if (FS.ignorePermissions) return 0;
						if (perms.includes("r") && !(node.mode & 292)) return 2;
						else if (perms.includes("w") && !(node.mode & 146)) return 2;
						else if (perms.includes("x") && !(node.mode & 73)) return 2;
						return 0;
					},
					mayLookup(dir) {
						if (!FS.isDir(dir.mode)) return 54;
						var errCode = FS.nodePermissions(dir, "x");
						if (errCode) return errCode;
						if (!dir.node_ops.lookup) return 2;
						return 0;
					},
					mayCreate(dir, name) {
						try {
							FS.lookupNode(dir, name);
							return 20;
						} catch (e) {}
						return FS.nodePermissions(dir, "wx");
					},
					mayDelete(dir, name, isdir) {
						var node;
						try {
							node = FS.lookupNode(dir, name);
						} catch (e) {
							return e.errno;
						}
						var errCode = FS.nodePermissions(dir, "wx");
						if (errCode) return errCode;
						if (isdir) {
							if (!FS.isDir(node.mode)) return 54;
							if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) return 10;
						} else if (FS.isDir(node.mode)) return 31;
						return 0;
					},
					mayOpen(node, flags) {
						if (!node) return 44;
						if (FS.isLink(node.mode)) return 32;
						else if (FS.isDir(node.mode)) {
							if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) return 31;
						}
						return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
					},
					MAX_OPEN_FDS: 4096,
					nextfd() {
						for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) if (!FS.streams[fd]) return fd;
						throw new FS.ErrnoError(33);
					},
					getStreamChecked(fd) {
						var stream = FS.getStream(fd);
						if (!stream) throw new FS.ErrnoError(8);
						return stream;
					},
					getStream: (fd) => FS.streams[fd],
					createStream(stream, fd = -1) {
						stream = Object.assign(new FS.FSStream(), stream);
						if (fd == -1) fd = FS.nextfd();
						stream.fd = fd;
						FS.streams[fd] = stream;
						return stream;
					},
					closeStream(fd) {
						FS.streams[fd] = null;
					},
					dupStream(origStream, fd = -1) {
						var stream = FS.createStream(origStream, fd);
						stream.stream_ops?.dup?.(stream);
						return stream;
					},
					chrdev_stream_ops: {
						open(stream) {
							stream.stream_ops = FS.getDevice(stream.node.rdev).stream_ops;
							stream.stream_ops.open?.(stream);
						},
						llseek() {
							throw new FS.ErrnoError(70);
						}
					},
					major: (dev) => dev >> 8,
					minor: (dev) => dev & 255,
					makedev: (ma, mi) => ma << 8 | mi,
					registerDevice(dev, ops) {
						FS.devices[dev] = { stream_ops: ops };
					},
					getDevice: (dev) => FS.devices[dev],
					getMounts(mount) {
						var mounts = [];
						var check = [mount];
						while (check.length) {
							var m = check.pop();
							mounts.push(m);
							check.push(...m.mounts);
						}
						return mounts;
					},
					syncfs(populate, callback) {
						if (typeof populate == "function") {
							callback = populate;
							populate = false;
						}
						FS.syncFSRequests++;
						if (FS.syncFSRequests > 1) err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
						var mounts = FS.getMounts(FS.root.mount);
						var completed = 0;
						function doCallback(errCode) {
							FS.syncFSRequests--;
							return callback(errCode);
						}
						function done(errCode) {
							if (errCode) {
								if (!done.errored) {
									done.errored = true;
									return doCallback(errCode);
								}
								return;
							}
							if (++completed >= mounts.length) doCallback(null);
						}
						mounts.forEach((mount) => {
							if (!mount.type.syncfs) return done(null);
							mount.type.syncfs(mount, populate, done);
						});
					},
					mount(type, opts, mountpoint) {
						var root = mountpoint === "/";
						var pseudo = !mountpoint;
						var node;
						if (root && FS.root) throw new FS.ErrnoError(10);
						else if (!root && !pseudo) {
							var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
							mountpoint = lookup.path;
							node = lookup.node;
							if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
							if (!FS.isDir(node.mode)) throw new FS.ErrnoError(54);
						}
						var mount = {
							type,
							opts,
							mountpoint,
							mounts: []
						};
						var mountRoot = type.mount(mount);
						mountRoot.mount = mount;
						mount.root = mountRoot;
						if (root) FS.root = mountRoot;
						else if (node) {
							node.mounted = mount;
							if (node.mount) node.mount.mounts.push(mount);
						}
						return mountRoot;
					},
					unmount(mountpoint) {
						var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
						if (!FS.isMountpoint(lookup.node)) throw new FS.ErrnoError(28);
						var node = lookup.node;
						var mount = node.mounted;
						var mounts = FS.getMounts(mount);
						Object.keys(FS.nameTable).forEach((hash) => {
							var current = FS.nameTable[hash];
							while (current) {
								var next = current.name_next;
								if (mounts.includes(current.mount)) FS.destroyNode(current);
								current = next;
							}
						});
						node.mounted = null;
						var idx = node.mount.mounts.indexOf(mount);
						node.mount.mounts.splice(idx, 1);
					},
					lookup(parent, name) {
						return parent.node_ops.lookup(parent, name);
					},
					mknod(path, mode, dev) {
						var parent = FS.lookupPath(path, { parent: true }).node;
						var name = PATH.basename(path);
						if (!name || name === "." || name === "..") throw new FS.ErrnoError(28);
						var errCode = FS.mayCreate(parent, name);
						if (errCode) throw new FS.ErrnoError(errCode);
						if (!parent.node_ops.mknod) throw new FS.ErrnoError(63);
						return parent.node_ops.mknod(parent, name, mode, dev);
					},
					create(path, mode) {
						mode = mode !== void 0 ? mode : 438;
						mode &= 4095;
						mode |= 32768;
						return FS.mknod(path, mode, 0);
					},
					mkdir(path, mode) {
						mode = mode !== void 0 ? mode : 511;
						mode &= 1023;
						mode |= 16384;
						return FS.mknod(path, mode, 0);
					},
					mkdirTree(path, mode) {
						var dirs = path.split("/");
						var d = "";
						for (var i = 0; i < dirs.length; ++i) {
							if (!dirs[i]) continue;
							d += "/" + dirs[i];
							try {
								FS.mkdir(d, mode);
							} catch (e) {
								if (e.errno != 20) throw e;
							}
						}
					},
					mkdev(path, mode, dev) {
						if (typeof dev == "undefined") {
							dev = mode;
							mode = 438;
						}
						mode |= 8192;
						return FS.mknod(path, mode, dev);
					},
					symlink(oldpath, newpath) {
						if (!PATH_FS.resolve(oldpath)) throw new FS.ErrnoError(44);
						var parent = FS.lookupPath(newpath, { parent: true }).node;
						if (!parent) throw new FS.ErrnoError(44);
						var newname = PATH.basename(newpath);
						var errCode = FS.mayCreate(parent, newname);
						if (errCode) throw new FS.ErrnoError(errCode);
						if (!parent.node_ops.symlink) throw new FS.ErrnoError(63);
						return parent.node_ops.symlink(parent, newname, oldpath);
					},
					rename(old_path, new_path) {
						var old_dirname = PATH.dirname(old_path);
						var new_dirname = PATH.dirname(new_path);
						var old_name = PATH.basename(old_path);
						var new_name = PATH.basename(new_path);
						var lookup = FS.lookupPath(old_path, { parent: true }), old_dir = lookup.node, new_dir;
						lookup = FS.lookupPath(new_path, { parent: true });
						new_dir = lookup.node;
						if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
						if (old_dir.mount !== new_dir.mount) throw new FS.ErrnoError(75);
						var old_node = FS.lookupNode(old_dir, old_name);
						var relative = PATH_FS.relative(old_path, new_dirname);
						if (relative.charAt(0) !== ".") throw new FS.ErrnoError(28);
						relative = PATH_FS.relative(new_path, old_dirname);
						if (relative.charAt(0) !== ".") throw new FS.ErrnoError(55);
						var new_node;
						try {
							new_node = FS.lookupNode(new_dir, new_name);
						} catch (e) {}
						if (old_node === new_node) return;
						var isdir = FS.isDir(old_node.mode);
						var errCode = FS.mayDelete(old_dir, old_name, isdir);
						if (errCode) throw new FS.ErrnoError(errCode);
						errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
						if (errCode) throw new FS.ErrnoError(errCode);
						if (!old_dir.node_ops.rename) throw new FS.ErrnoError(63);
						if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) throw new FS.ErrnoError(10);
						if (new_dir !== old_dir) {
							errCode = FS.nodePermissions(old_dir, "w");
							if (errCode) throw new FS.ErrnoError(errCode);
						}
						FS.hashRemoveNode(old_node);
						try {
							old_dir.node_ops.rename(old_node, new_dir, new_name);
							old_node.parent = new_dir;
						} catch (e) {
							throw e;
						} finally {
							FS.hashAddNode(old_node);
						}
					},
					rmdir(path) {
						var parent = FS.lookupPath(path, { parent: true }).node;
						var name = PATH.basename(path);
						var node = FS.lookupNode(parent, name);
						var errCode = FS.mayDelete(parent, name, true);
						if (errCode) throw new FS.ErrnoError(errCode);
						if (!parent.node_ops.rmdir) throw new FS.ErrnoError(63);
						if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
						parent.node_ops.rmdir(parent, name);
						FS.destroyNode(node);
					},
					readdir(path) {
						var node = FS.lookupPath(path, { follow: true }).node;
						if (!node.node_ops.readdir) throw new FS.ErrnoError(54);
						return node.node_ops.readdir(node);
					},
					unlink(path) {
						var parent = FS.lookupPath(path, { parent: true }).node;
						if (!parent) throw new FS.ErrnoError(44);
						var name = PATH.basename(path);
						var node = FS.lookupNode(parent, name);
						var errCode = FS.mayDelete(parent, name, false);
						if (errCode) throw new FS.ErrnoError(errCode);
						if (!parent.node_ops.unlink) throw new FS.ErrnoError(63);
						if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
						parent.node_ops.unlink(parent, name);
						FS.destroyNode(node);
					},
					readlink(path) {
						var link = FS.lookupPath(path).node;
						if (!link) throw new FS.ErrnoError(44);
						if (!link.node_ops.readlink) throw new FS.ErrnoError(28);
						return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
					},
					stat(path, dontFollow) {
						var node = FS.lookupPath(path, { follow: !dontFollow }).node;
						if (!node) throw new FS.ErrnoError(44);
						if (!node.node_ops.getattr) throw new FS.ErrnoError(63);
						return node.node_ops.getattr(node);
					},
					lstat(path) {
						return FS.stat(path, true);
					},
					chmod(path, mode, dontFollow) {
						var node;
						if (typeof path == "string") node = FS.lookupPath(path, { follow: !dontFollow }).node;
						else node = path;
						if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
						node.node_ops.setattr(node, {
							mode: mode & 4095 | node.mode & -4096,
							timestamp: Date.now()
						});
					},
					lchmod(path, mode) {
						FS.chmod(path, mode, true);
					},
					fchmod(fd, mode) {
						var stream = FS.getStreamChecked(fd);
						FS.chmod(stream.node, mode);
					},
					chown(path, uid, gid, dontFollow) {
						var node;
						if (typeof path == "string") node = FS.lookupPath(path, { follow: !dontFollow }).node;
						else node = path;
						if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
						node.node_ops.setattr(node, { timestamp: Date.now() });
					},
					lchown(path, uid, gid) {
						FS.chown(path, uid, gid, true);
					},
					fchown(fd, uid, gid) {
						var stream = FS.getStreamChecked(fd);
						FS.chown(stream.node, uid, gid);
					},
					truncate(path, len) {
						if (len < 0) throw new FS.ErrnoError(28);
						var node;
						if (typeof path == "string") node = FS.lookupPath(path, { follow: true }).node;
						else node = path;
						if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
						if (FS.isDir(node.mode)) throw new FS.ErrnoError(31);
						if (!FS.isFile(node.mode)) throw new FS.ErrnoError(28);
						var errCode = FS.nodePermissions(node, "w");
						if (errCode) throw new FS.ErrnoError(errCode);
						node.node_ops.setattr(node, {
							size: len,
							timestamp: Date.now()
						});
					},
					ftruncate(fd, len) {
						var stream = FS.getStreamChecked(fd);
						if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(28);
						FS.truncate(stream.node, len);
					},
					utime(path, atime, mtime) {
						var node = FS.lookupPath(path, { follow: true }).node;
						node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
					},
					open(path, flags, mode) {
						if (path === "") throw new FS.ErrnoError(44);
						flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
						if (flags & 64) {
							mode = typeof mode == "undefined" ? 438 : mode;
							mode = mode & 4095 | 32768;
						} else mode = 0;
						var node;
						if (typeof path == "object") node = path;
						else {
							path = PATH.normalize(path);
							try {
								node = FS.lookupPath(path, { follow: !(flags & 131072) }).node;
							} catch (e) {}
						}
						var created = false;
						if (flags & 64) {
							if (node) {
								if (flags & 128) throw new FS.ErrnoError(20);
							} else {
								node = FS.mknod(path, mode, 0);
								created = true;
							}
						}
						if (!node) throw new FS.ErrnoError(44);
						if (FS.isChrdev(node.mode)) flags &= -513;
						if (flags & 65536 && !FS.isDir(node.mode)) throw new FS.ErrnoError(54);
						if (!created) {
							var errCode = FS.mayOpen(node, flags);
							if (errCode) throw new FS.ErrnoError(errCode);
						}
						if (flags & 512 && !created) FS.truncate(node, 0);
						flags &= -131713;
						var stream = FS.createStream({
							node,
							path: FS.getPath(node),
							flags,
							seekable: true,
							position: 0,
							stream_ops: node.stream_ops,
							ungotten: [],
							error: false
						});
						if (stream.stream_ops.open) stream.stream_ops.open(stream);
						if (Module["logReadFiles"] && !(flags & 1)) {
							if (!(path in FS.readFiles)) FS.readFiles[path] = 1;
						}
						return stream;
					},
					close(stream) {
						if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
						if (stream.getdents) stream.getdents = null;
						try {
							if (stream.stream_ops.close) stream.stream_ops.close(stream);
						} catch (e) {
							throw e;
						} finally {
							FS.closeStream(stream.fd);
						}
						stream.fd = null;
					},
					isClosed(stream) {
						return stream.fd === null;
					},
					llseek(stream, offset, whence) {
						if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
						if (!stream.seekable || !stream.stream_ops.llseek) throw new FS.ErrnoError(70);
						if (whence != 0 && whence != 1 && whence != 2) throw new FS.ErrnoError(28);
						stream.position = stream.stream_ops.llseek(stream, offset, whence);
						stream.ungotten = [];
						return stream.position;
					},
					read(stream, buffer, offset, length, position) {
						if (length < 0 || position < 0) throw new FS.ErrnoError(28);
						if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
						if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(8);
						if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
						if (!stream.stream_ops.read) throw new FS.ErrnoError(28);
						var seeking = typeof position != "undefined";
						if (!seeking) position = stream.position;
						else if (!stream.seekable) throw new FS.ErrnoError(70);
						var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
						if (!seeking) stream.position += bytesRead;
						return bytesRead;
					},
					write(stream, buffer, offset, length, position, canOwn) {
						if (length < 0 || position < 0) throw new FS.ErrnoError(28);
						if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
						if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
						if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
						if (!stream.stream_ops.write) throw new FS.ErrnoError(28);
						if (stream.seekable && stream.flags & 1024) FS.llseek(stream, 0, 2);
						var seeking = typeof position != "undefined";
						if (!seeking) position = stream.position;
						else if (!stream.seekable) throw new FS.ErrnoError(70);
						var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
						if (!seeking) stream.position += bytesWritten;
						return bytesWritten;
					},
					allocate(stream, offset, length) {
						if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
						if (offset < 0 || length <= 0) throw new FS.ErrnoError(28);
						if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
						if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) throw new FS.ErrnoError(43);
						if (!stream.stream_ops.allocate) throw new FS.ErrnoError(138);
						stream.stream_ops.allocate(stream, offset, length);
					},
					mmap(stream, length, position, prot, flags) {
						if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
						if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(2);
						if (!stream.stream_ops.mmap) throw new FS.ErrnoError(43);
						if (!length) throw new FS.ErrnoError(28);
						return stream.stream_ops.mmap(stream, length, position, prot, flags);
					},
					msync(stream, buffer, offset, length, mmapFlags) {
						if (!stream.stream_ops.msync) return 0;
						return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
					},
					ioctl(stream, cmd, arg) {
						if (!stream.stream_ops.ioctl) throw new FS.ErrnoError(59);
						return stream.stream_ops.ioctl(stream, cmd, arg);
					},
					readFile(path, opts = {}) {
						opts.flags = opts.flags || 0;
						opts.encoding = opts.encoding || "binary";
						if (opts.encoding !== "utf8" && opts.encoding !== "binary") throw new Error(`Invalid encoding type "${opts.encoding}"`);
						var ret;
						var stream = FS.open(path, opts.flags);
						var length = FS.stat(path).size;
						var buf = new Uint8Array(length);
						FS.read(stream, buf, 0, length, 0);
						if (opts.encoding === "utf8") ret = UTF8ArrayToString(buf);
						else if (opts.encoding === "binary") ret = buf;
						FS.close(stream);
						return ret;
					},
					writeFile(path, data, opts = {}) {
						opts.flags = opts.flags || 577;
						var stream = FS.open(path, opts.flags, opts.mode);
						if (typeof data == "string") {
							var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
							var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
							FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
						} else if (ArrayBuffer.isView(data)) FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
						else throw new Error("Unsupported data type");
						FS.close(stream);
					},
					cwd: () => FS.currentPath,
					chdir(path) {
						var lookup = FS.lookupPath(path, { follow: true });
						if (lookup.node === null) throw new FS.ErrnoError(44);
						if (!FS.isDir(lookup.node.mode)) throw new FS.ErrnoError(54);
						var errCode = FS.nodePermissions(lookup.node, "x");
						if (errCode) throw new FS.ErrnoError(errCode);
						FS.currentPath = lookup.path;
					},
					createDefaultDirectories() {
						FS.mkdir("/tmp");
						FS.mkdir("/home");
						FS.mkdir("/home/web_user");
					},
					createDefaultDevices() {
						FS.mkdir("/dev");
						FS.registerDevice(FS.makedev(1, 3), {
							read: () => 0,
							write: (stream, buffer, offset, length, pos) => length
						});
						FS.mkdev("/dev/null", FS.makedev(1, 3));
						TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
						TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
						FS.mkdev("/dev/tty", FS.makedev(5, 0));
						FS.mkdev("/dev/tty1", FS.makedev(6, 0));
						var randomBuffer = /* @__PURE__ */ new Uint8Array(1024), randomLeft = 0;
						var randomByte = () => {
							if (randomLeft === 0) randomLeft = randomFill(randomBuffer).byteLength;
							return randomBuffer[--randomLeft];
						};
						FS.createDevice("/dev", "random", randomByte);
						FS.createDevice("/dev", "urandom", randomByte);
						FS.mkdir("/dev/shm");
						FS.mkdir("/dev/shm/tmp");
					},
					createSpecialDirectories() {
						FS.mkdir("/proc");
						var proc_self = FS.mkdir("/proc/self");
						FS.mkdir("/proc/self/fd");
						FS.mount({ mount() {
							var node = FS.createNode(proc_self, "fd", 16895, 73);
							node.node_ops = { lookup(parent, name) {
								var fd = +name;
								var stream = FS.getStreamChecked(fd);
								var ret = {
									parent: null,
									mount: { mountpoint: "fake" },
									node_ops: { readlink: () => stream.path }
								};
								ret.parent = ret;
								return ret;
							} };
							return node;
						} }, {}, "/proc/self/fd");
					},
					createStandardStreams(input, output, error) {
						if (input) FS.createDevice("/dev", "stdin", input);
						else FS.symlink("/dev/tty", "/dev/stdin");
						if (output) FS.createDevice("/dev", "stdout", null, output);
						else FS.symlink("/dev/tty", "/dev/stdout");
						if (error) FS.createDevice("/dev", "stderr", null, error);
						else FS.symlink("/dev/tty1", "/dev/stderr");
						FS.open("/dev/stdin", 0);
						FS.open("/dev/stdout", 1);
						FS.open("/dev/stderr", 1);
					},
					staticInit() {
						[44].forEach((code) => {
							FS.genericErrors[code] = new FS.ErrnoError(code);
							FS.genericErrors[code].stack = "<generic error, no stack>";
						});
						FS.nameTable = new Array(4096);
						FS.mount(MEMFS, {}, "/");
						FS.createDefaultDirectories();
						FS.createDefaultDevices();
						FS.createSpecialDirectories();
						FS.filesystems = { MEMFS };
					},
					init(input, output, error) {
						FS.initialized = true;
						input ??= Module["stdin"];
						output ??= Module["stdout"];
						error ??= Module["stderr"];
						FS.createStandardStreams(input, output, error);
					},
					quit() {
						FS.initialized = false;
						for (var i = 0; i < FS.streams.length; i++) {
							var stream = FS.streams[i];
							if (!stream) continue;
							FS.close(stream);
						}
					},
					findObject(path, dontResolveLastLink) {
						var ret = FS.analyzePath(path, dontResolveLastLink);
						if (!ret.exists) return null;
						return ret.object;
					},
					analyzePath(path, dontResolveLastLink) {
						try {
							var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
							path = lookup.path;
						} catch (e) {}
						var ret = {
							isRoot: false,
							exists: false,
							error: 0,
							name: null,
							path: null,
							object: null,
							parentExists: false,
							parentPath: null,
							parentObject: null
						};
						try {
							var lookup = FS.lookupPath(path, { parent: true });
							ret.parentExists = true;
							ret.parentPath = lookup.path;
							ret.parentObject = lookup.node;
							ret.name = PATH.basename(path);
							lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
							ret.exists = true;
							ret.path = lookup.path;
							ret.object = lookup.node;
							ret.name = lookup.node.name;
							ret.isRoot = lookup.path === "/";
						} catch (e) {
							ret.error = e.errno;
						}
						return ret;
					},
					createPath(parent, path, canRead, canWrite) {
						parent = typeof parent == "string" ? parent : FS.getPath(parent);
						var parts = path.split("/").reverse();
						while (parts.length) {
							var part = parts.pop();
							if (!part) continue;
							var current = PATH.join2(parent, part);
							try {
								FS.mkdir(current);
							} catch (e) {}
							parent = current;
						}
						return current;
					},
					createFile(parent, name, properties, canRead, canWrite) {
						var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
						var mode = FS_getMode(canRead, canWrite);
						return FS.create(path, mode);
					},
					createDataFile(parent, name, data, canRead, canWrite, canOwn) {
						var path = name;
						if (parent) {
							parent = typeof parent == "string" ? parent : FS.getPath(parent);
							path = name ? PATH.join2(parent, name) : parent;
						}
						var mode = FS_getMode(canRead, canWrite);
						var node = FS.create(path, mode);
						if (data) {
							if (typeof data == "string") {
								var arr = new Array(data.length);
								for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
								data = arr;
							}
							FS.chmod(node, mode | 146);
							var stream = FS.open(node, 577);
							FS.write(stream, data, 0, data.length, 0, canOwn);
							FS.close(stream);
							FS.chmod(node, mode);
						}
					},
					createDevice(parent, name, input, output) {
						var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
						var mode = FS_getMode(!!input, !!output);
						FS.createDevice.major ??= 64;
						var dev = FS.makedev(FS.createDevice.major++, 0);
						FS.registerDevice(dev, {
							open(stream) {
								stream.seekable = false;
							},
							close(stream) {
								if (output?.buffer?.length) output(10);
							},
							read(stream, buffer, offset, length, pos) {
								var bytesRead = 0;
								for (var i = 0; i < length; i++) {
									var result;
									try {
										result = input();
									} catch (e) {
										throw new FS.ErrnoError(29);
									}
									if (result === void 0 && bytesRead === 0) throw new FS.ErrnoError(6);
									if (result === null || result === void 0) break;
									bytesRead++;
									buffer[offset + i] = result;
								}
								if (bytesRead) stream.node.timestamp = Date.now();
								return bytesRead;
							},
							write(stream, buffer, offset, length, pos) {
								for (var i = 0; i < length; i++) try {
									output(buffer[offset + i]);
								} catch (e) {
									throw new FS.ErrnoError(29);
								}
								if (length) stream.node.timestamp = Date.now();
								return i;
							}
						});
						return FS.mkdev(path, mode, dev);
					},
					forceLoadFile(obj) {
						if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
						if (typeof XMLHttpRequest != "undefined") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
						else try {
							obj.contents = readBinary(obj.url);
							obj.usedBytes = obj.contents.length;
						} catch (e) {
							throw new FS.ErrnoError(29);
						}
					},
					createLazyFile(parent, name, url, canRead, canWrite) {
						class LazyUint8Array {
							constructor() {
								this.lengthKnown = false;
								this.chunks = [];
							}
							get(idx) {
								if (idx > this.length - 1 || idx < 0) return;
								var chunkOffset = idx % this.chunkSize;
								var chunkNum = idx / this.chunkSize | 0;
								return this.getter(chunkNum)[chunkOffset];
							}
							setDataGetter(getter) {
								this.getter = getter;
							}
							cacheLength() {
								var xhr = new XMLHttpRequest();
								xhr.open("HEAD", url, false);
								xhr.send(null);
								if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
								var datalength = Number(xhr.getResponseHeader("Content-length"));
								var header;
								var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
								var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
								var chunkSize = 1048576;
								if (!hasByteServing) chunkSize = datalength;
								var doXHR = (from, to) => {
									if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
									if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
									var xhr = new XMLHttpRequest();
									xhr.open("GET", url, false);
									if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
									xhr.responseType = "arraybuffer";
									if (xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined");
									xhr.send(null);
									if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
									if (xhr.response !== void 0) return new Uint8Array(xhr.response || []);
									return intArrayFromString(xhr.responseText || "", true);
								};
								var lazyArray = this;
								lazyArray.setDataGetter((chunkNum) => {
									var start = chunkNum * chunkSize;
									var end = (chunkNum + 1) * chunkSize - 1;
									end = Math.min(end, datalength - 1);
									if (typeof lazyArray.chunks[chunkNum] == "undefined") lazyArray.chunks[chunkNum] = doXHR(start, end);
									if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
									return lazyArray.chunks[chunkNum];
								});
								if (usesGzip || !datalength) {
									chunkSize = datalength = 1;
									datalength = this.getter(0).length;
									chunkSize = datalength;
									out("LazyFiles on gzip forces download of the whole file when length is accessed");
								}
								this._length = datalength;
								this._chunkSize = chunkSize;
								this.lengthKnown = true;
							}
							get length() {
								if (!this.lengthKnown) this.cacheLength();
								return this._length;
							}
							get chunkSize() {
								if (!this.lengthKnown) this.cacheLength();
								return this._chunkSize;
							}
						}
						if (typeof XMLHttpRequest != "undefined") {
							if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
							var properties = {
								isDevice: false,
								contents: new LazyUint8Array()
							};
						} else var properties = {
							isDevice: false,
							url
						};
						var node = FS.createFile(parent, name, properties, canRead, canWrite);
						if (properties.contents) node.contents = properties.contents;
						else if (properties.url) {
							node.contents = null;
							node.url = properties.url;
						}
						Object.defineProperties(node, { usedBytes: { get: function() {
							return this.contents.length;
						} } });
						var stream_ops = {};
						Object.keys(node.stream_ops).forEach((key) => {
							var fn = node.stream_ops[key];
							stream_ops[key] = (...args) => {
								FS.forceLoadFile(node);
								return fn(...args);
							};
						});
						function writeChunks(stream, buffer, offset, length, position) {
							var contents = stream.node.contents;
							if (position >= contents.length) return 0;
							var size = Math.min(contents.length - position, length);
							if (contents.slice) for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
							else for (var i = 0; i < size; i++) buffer[offset + i] = contents.get(position + i);
							return size;
						}
						stream_ops.read = (stream, buffer, offset, length, position) => {
							FS.forceLoadFile(node);
							return writeChunks(stream, buffer, offset, length, position);
						};
						stream_ops.mmap = (stream, length, position, prot, flags) => {
							FS.forceLoadFile(node);
							var ptr = mmapAlloc(length);
							if (!ptr) throw new FS.ErrnoError(48);
							writeChunks(stream, HEAP8, ptr, length, position);
							return {
								ptr,
								allocated: true
							};
						};
						node.stream_ops = stream_ops;
						return node;
					}
				};
				var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
				var SYSCALLS = {
					DEFAULT_POLLMASK: 5,
					calculateAt(dirfd, path, allowEmpty) {
						if (PATH.isAbs(path)) return path;
						var dir;
						if (dirfd === -100) dir = FS.cwd();
						else dir = SYSCALLS.getStreamFromFD(dirfd).path;
						if (path.length == 0) {
							if (!allowEmpty) throw new FS.ErrnoError(44);
							return dir;
						}
						return PATH.join2(dir, path);
					},
					doStat(func, path, buf) {
						var stat = func(path);
						HEAP32[buf >> 2] = stat.dev;
						HEAP32[buf + 4 >> 2] = stat.mode;
						HEAPU32[buf + 8 >> 2] = stat.nlink;
						HEAP32[buf + 12 >> 2] = stat.uid;
						HEAP32[buf + 16 >> 2] = stat.gid;
						HEAP32[buf + 20 >> 2] = stat.rdev;
						tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1];
						HEAP32[buf + 32 >> 2] = 4096;
						HEAP32[buf + 36 >> 2] = stat.blocks;
						var atime = stat.atime.getTime();
						var mtime = stat.mtime.getTime();
						var ctime = stat.ctime.getTime();
						tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
						HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
						tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1];
						HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
						tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1];
						HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
						tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1];
						return 0;
					},
					doMsync(addr, stream, len, flags, offset) {
						if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
						if (flags & 2) return 0;
						var buffer = HEAPU8.slice(addr, addr + len);
						FS.msync(stream, buffer, offset, len, flags);
					},
					getStreamFromFD(fd) {
						return FS.getStreamChecked(fd);
					},
					varargs: void 0,
					getStr(ptr) {
						return UTF8ToString(ptr);
					}
				};
				function ___syscall_chmod(path, mode) {
					try {
						path = SYSCALLS.getStr(path);
						FS.chmod(path, mode);
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_faccessat(dirfd, path, amode, flags) {
					try {
						path = SYSCALLS.getStr(path);
						path = SYSCALLS.calculateAt(dirfd, path);
						if (amode & -8) return -28;
						var node = FS.lookupPath(path, { follow: true }).node;
						if (!node) return -44;
						var perms = "";
						if (amode & 4) perms += "r";
						if (amode & 2) perms += "w";
						if (amode & 1) perms += "x";
						if (perms && FS.nodePermissions(node, perms)) return -2;
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function syscallGetVarargI() {
					var ret = HEAP32[+SYSCALLS.varargs >> 2];
					SYSCALLS.varargs += 4;
					return ret;
				}
				var syscallGetVarargP = syscallGetVarargI;
				function ___syscall_fcntl64(fd, cmd, varargs) {
					SYSCALLS.varargs = varargs;
					try {
						var stream = SYSCALLS.getStreamFromFD(fd);
						switch (cmd) {
							case 0:
								var arg = syscallGetVarargI();
								if (arg < 0) return -28;
								while (FS.streams[arg]) arg++;
								return FS.dupStream(stream, arg).fd;
							case 1:
							case 2: return 0;
							case 3: return stream.flags;
							case 4:
								var arg = syscallGetVarargI();
								stream.flags |= arg;
								return 0;
							case 12:
								var arg = syscallGetVarargP();
								var offset = 0;
								HEAP16[arg + offset >> 1] = 2;
								return 0;
							case 13:
							case 14: return 0;
						}
						return -28;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_fstat64(fd, buf) {
					try {
						var stream = SYSCALLS.getStreamFromFD(fd);
						return SYSCALLS.doStat(FS.stat, stream.path, buf);
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_ioctl(fd, op, varargs) {
					SYSCALLS.varargs = varargs;
					try {
						var stream = SYSCALLS.getStreamFromFD(fd);
						switch (op) {
							case 21509:
								if (!stream.tty) return -59;
								return 0;
							case 21505:
								if (!stream.tty) return -59;
								if (stream.tty.ops.ioctl_tcgets) {
									var termios = stream.tty.ops.ioctl_tcgets(stream);
									var argp = syscallGetVarargP();
									HEAP32[argp >> 2] = termios.c_iflag || 0;
									HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
									HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
									HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
									for (var i = 0; i < 32; i++) HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
									return 0;
								}
								return 0;
							case 21510:
							case 21511:
							case 21512:
								if (!stream.tty) return -59;
								return 0;
							case 21506:
							case 21507:
							case 21508:
								if (!stream.tty) return -59;
								if (stream.tty.ops.ioctl_tcsets) {
									var argp = syscallGetVarargP();
									var c_iflag = HEAP32[argp >> 2];
									var c_oflag = HEAP32[argp + 4 >> 2];
									var c_cflag = HEAP32[argp + 8 >> 2];
									var c_lflag = HEAP32[argp + 12 >> 2];
									var c_cc = [];
									for (var i = 0; i < 32; i++) c_cc.push(HEAP8[argp + i + 17]);
									return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
										c_iflag,
										c_oflag,
										c_cflag,
										c_lflag,
										c_cc
									});
								}
								return 0;
							case 21519:
								if (!stream.tty) return -59;
								var argp = syscallGetVarargP();
								HEAP32[argp >> 2] = 0;
								return 0;
							case 21520:
								if (!stream.tty) return -59;
								return -28;
							case 21531:
								var argp = syscallGetVarargP();
								return FS.ioctl(stream, op, argp);
							case 21523:
								if (!stream.tty) return -59;
								if (stream.tty.ops.ioctl_tiocgwinsz) {
									var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
									var argp = syscallGetVarargP();
									HEAP16[argp >> 1] = winsize[0];
									HEAP16[argp + 2 >> 1] = winsize[1];
								}
								return 0;
							case 21524:
								if (!stream.tty) return -59;
								return 0;
							case 21515:
								if (!stream.tty) return -59;
								return 0;
							default: return -28;
						}
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_lstat64(path, buf) {
					try {
						path = SYSCALLS.getStr(path);
						return SYSCALLS.doStat(FS.lstat, path, buf);
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_newfstatat(dirfd, path, buf, flags) {
					try {
						path = SYSCALLS.getStr(path);
						var nofollow = flags & 256;
						var allowEmpty = flags & 4096;
						flags = flags & -6401;
						path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
						return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_openat(dirfd, path, flags, varargs) {
					SYSCALLS.varargs = varargs;
					try {
						path = SYSCALLS.getStr(path);
						path = SYSCALLS.calculateAt(dirfd, path);
						var mode = varargs ? syscallGetVarargI() : 0;
						return FS.open(path, flags, mode).fd;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_rmdir(path) {
					try {
						path = SYSCALLS.getStr(path);
						FS.rmdir(path);
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_stat64(path, buf) {
					try {
						path = SYSCALLS.getStr(path);
						return SYSCALLS.doStat(FS.stat, path, buf);
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				function ___syscall_unlinkat(dirfd, path, flags) {
					try {
						path = SYSCALLS.getStr(path);
						path = SYSCALLS.calculateAt(dirfd, path);
						if (flags === 0) FS.unlink(path);
						else if (flags === 512) FS.rmdir(path);
						else abort("Invalid flags passed to unlinkat");
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				var __abort_js = () => {
					abort("");
				};
				var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {};
				var embind_init_charCodes = () => {
					var codes = new Array(256);
					for (var i = 0; i < 256; ++i) codes[i] = String.fromCharCode(i);
					embind_charCodes = codes;
				};
				var embind_charCodes;
				var readLatin1String = (ptr) => {
					var ret = "";
					var c = ptr;
					while (HEAPU8[c]) ret += embind_charCodes[HEAPU8[c++]];
					return ret;
				};
				var awaitingDependencies = {};
				var registeredTypes = {};
				var typeDependencies = {};
				var BindingError;
				var throwBindingError = (message) => {
					throw new BindingError(message);
				};
				var InternalError;
				var throwInternalError = (message) => {
					throw new InternalError(message);
				};
				var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
					myTypes.forEach((type) => typeDependencies[type] = dependentTypes);
					function onComplete(typeConverters) {
						var myTypeConverters = getTypeConverters(typeConverters);
						if (myTypeConverters.length !== myTypes.length) throwInternalError("Mismatched type converter count");
						for (var i = 0; i < myTypes.length; ++i) registerType(myTypes[i], myTypeConverters[i]);
					}
					var typeConverters = new Array(dependentTypes.length);
					var unregisteredTypes = [];
					var registered = 0;
					dependentTypes.forEach((dt, i) => {
						if (registeredTypes.hasOwnProperty(dt)) typeConverters[i] = registeredTypes[dt];
						else {
							unregisteredTypes.push(dt);
							if (!awaitingDependencies.hasOwnProperty(dt)) awaitingDependencies[dt] = [];
							awaitingDependencies[dt].push(() => {
								typeConverters[i] = registeredTypes[dt];
								++registered;
								if (registered === unregisteredTypes.length) onComplete(typeConverters);
							});
						}
					});
					if (0 === unregisteredTypes.length) onComplete(typeConverters);
				};
				function sharedRegisterType(rawType, registeredInstance, options = {}) {
					var name = registeredInstance.name;
					if (!rawType) throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
					if (registeredTypes.hasOwnProperty(rawType)) {
						if (options.ignoreDuplicateRegistrations) return;
						else throwBindingError(`Cannot register type '${name}' twice`);
					}
					registeredTypes[rawType] = registeredInstance;
					delete typeDependencies[rawType];
					if (awaitingDependencies.hasOwnProperty(rawType)) {
						var callbacks = awaitingDependencies[rawType];
						delete awaitingDependencies[rawType];
						callbacks.forEach((cb) => cb());
					}
				}
				function registerType(rawType, registeredInstance, options = {}) {
					return sharedRegisterType(rawType, registeredInstance, options);
				}
				var GenericWireTypeSize = 8;
				var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
					name = readLatin1String(name);
					registerType(rawType, {
						name,
						fromWireType: function(wt) {
							return !!wt;
						},
						toWireType: function(destructors, o) {
							return o ? trueValue : falseValue;
						},
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: function(pointer) {
							return this["fromWireType"](HEAPU8[pointer]);
						},
						destructorFunction: null
					});
				};
				var emval_freelist = [];
				var emval_handles = [];
				var __emval_decref = (handle) => {
					if (handle > 9 && 0 === --emval_handles[handle + 1]) {
						emval_handles[handle] = void 0;
						emval_freelist.push(handle);
					}
				};
				var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
				var init_emval = () => {
					emval_handles.push(0, 1, void 0, 1, null, 1, true, 1, false, 1);
					Module["count_emval_handles"] = count_emval_handles;
				};
				var Emval = {
					toValue: (handle) => {
						if (!handle) throwBindingError("Cannot use deleted val. handle = " + handle);
						return emval_handles[handle];
					},
					toHandle: (value) => {
						switch (value) {
							case void 0: return 2;
							case null: return 4;
							case true: return 6;
							case false: return 8;
							default: {
								const handle = emval_freelist.pop() || emval_handles.length;
								emval_handles[handle] = value;
								emval_handles[handle + 1] = 1;
								return handle;
							}
						}
					}
				};
				function readPointer(pointer) {
					return this["fromWireType"](HEAPU32[pointer >> 2]);
				}
				var EmValType = {
					name: "emscripten::val",
					fromWireType: (handle) => {
						var rv = Emval.toValue(handle);
						__emval_decref(handle);
						return rv;
					},
					toWireType: (destructors, value) => Emval.toHandle(value),
					argPackAdvance: GenericWireTypeSize,
					readValueFromPointer: readPointer,
					destructorFunction: null
				};
				var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
				var floatReadValueFromPointer = (name, width) => {
					switch (width) {
						case 4: return function(pointer) {
							return this["fromWireType"](HEAPF32[pointer >> 2]);
						};
						case 8: return function(pointer) {
							return this["fromWireType"](HEAPF64[pointer >> 3]);
						};
						default: throw new TypeError(`invalid float width (${width}): ${name}`);
					}
				};
				var __embind_register_float = (rawType, name, size) => {
					name = readLatin1String(name);
					registerType(rawType, {
						name,
						fromWireType: (value) => value,
						toWireType: (destructors, value) => value,
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: floatReadValueFromPointer(name, size),
						destructorFunction: null
					});
				};
				var createNamedFunction = (name, body) => Object.defineProperty(body, "name", { value: name });
				var runDestructors = (destructors) => {
					while (destructors.length) {
						var ptr = destructors.pop();
						destructors.pop()(ptr);
					}
				};
				function usesDestructorStack(argTypes) {
					for (var i = 1; i < argTypes.length; ++i) if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) return true;
					return false;
				}
				function newFunc(constructor, argumentList) {
					if (!(constructor instanceof Function)) throw new TypeError(`new_ called with constructor type ${typeof constructor} which is not a function`);
					var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
					dummy.prototype = constructor.prototype;
					var obj = new dummy();
					var r = constructor.apply(obj, argumentList);
					return r instanceof Object ? r : obj;
				}
				function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
					var needsDestructorStack = usesDestructorStack(argTypes);
					var argCount = argTypes.length - 2;
					var argsList = [];
					var argsListWired = ["fn"];
					if (isClassMethodFunc) argsListWired.push("thisWired");
					for (var i = 0; i < argCount; ++i) {
						argsList.push(`arg${i}`);
						argsListWired.push(`arg${i}Wired`);
					}
					argsList = argsList.join(",");
					argsListWired = argsListWired.join(",");
					var invokerFnBody = `return function (${argsList}) {\n`;
					if (needsDestructorStack) invokerFnBody += "var destructors = [];\n";
					var dtorStack = needsDestructorStack ? "destructors" : "null";
					var args1 = [
						"humanName",
						"throwBindingError",
						"invoker",
						"fn",
						"runDestructors",
						"retType",
						"classParam"
					];
					if (isClassMethodFunc) invokerFnBody += `var thisWired = classParam['toWireType'](${dtorStack}, this);\n`;
					for (var i = 0; i < argCount; ++i) {
						invokerFnBody += `var arg${i}Wired = argType${i}['toWireType'](${dtorStack}, arg${i});\n`;
						args1.push(`argType${i}`);
					}
					invokerFnBody += (returns || isAsync ? "var rv = " : "") + `invoker(${argsListWired});\n`;
					if (needsDestructorStack) invokerFnBody += "runDestructors(destructors);\n";
					else for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
						var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
						if (argTypes[i].destructorFunction !== null) {
							invokerFnBody += `${paramName}_dtor(${paramName});\n`;
							args1.push(`${paramName}_dtor`);
						}
					}
					if (returns) invokerFnBody += "var ret = retType['fromWireType'](rv);\nreturn ret;\n";
					invokerFnBody += "}\n";
					return [args1, invokerFnBody];
				}
				function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
					var argCount = argTypes.length;
					if (argCount < 2) throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
					var isClassMethodFunc = argTypes[1] !== null && classType !== null;
					var needsDestructorStack = usesDestructorStack(argTypes);
					var returns = argTypes[0].name !== "void";
					var closureArgs = [
						humanName,
						throwBindingError,
						cppInvokerFunc,
						cppTargetFunc,
						runDestructors,
						argTypes[0],
						argTypes[1]
					];
					for (var i = 0; i < argCount - 2; ++i) closureArgs.push(argTypes[i + 2]);
					if (!needsDestructorStack) {
						for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) if (argTypes[i].destructorFunction !== null) closureArgs.push(argTypes[i].destructorFunction);
					}
					let [args, invokerFnBody] = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync);
					args.push(invokerFnBody);
					return createNamedFunction(humanName, newFunc(Function, args)(...closureArgs));
				}
				var ensureOverloadTable = (proto, methodName, humanName) => {
					if (void 0 === proto[methodName].overloadTable) {
						var prevFunc = proto[methodName];
						proto[methodName] = function(...args) {
							if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
							return proto[methodName].overloadTable[args.length].apply(this, args);
						};
						proto[methodName].overloadTable = [];
						proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
					}
				};
				var exposePublicSymbol = (name, value, numArguments) => {
					if (Module.hasOwnProperty(name)) {
						if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) throwBindingError(`Cannot register public name '${name}' twice`);
						ensureOverloadTable(Module, name, name);
						if (Module.hasOwnProperty(numArguments)) throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
						Module[name].overloadTable[numArguments] = value;
					} else {
						Module[name] = value;
						if (void 0 !== numArguments) Module[name].numArguments = numArguments;
					}
				};
				var heap32VectorToArray = (count, firstElement) => {
					var array = [];
					for (var i = 0; i < count; i++) array.push(HEAPU32[firstElement + i * 4 >> 2]);
					return array;
				};
				var replacePublicSymbol = (name, value, numArguments) => {
					if (!Module.hasOwnProperty(name)) throwInternalError("Replacing nonexistent public symbol");
					if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) Module[name].overloadTable[numArguments] = value;
					else {
						Module[name] = value;
						Module[name].argCount = numArguments;
					}
				};
				var dynCallLegacy = (sig, ptr, args) => {
					sig = sig.replace(/p/g, "i");
					var f = Module["dynCall_" + sig];
					return f(ptr, ...args);
				};
				var wasmTableMirror = [];
				var wasmTable;
				var getWasmTableEntry = (funcPtr) => {
					var func = wasmTableMirror[funcPtr];
					if (!func) {
						if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
						wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
					}
					return func;
				};
				var dynCall = (sig, ptr, args = []) => {
					if (sig.includes("j")) return dynCallLegacy(sig, ptr, args);
					return getWasmTableEntry(ptr)(...args);
				};
				var getDynCaller = (sig, ptr) => (...args) => dynCall(sig, ptr, args);
				var embind__requireFunction = (signature, rawFunction) => {
					signature = readLatin1String(signature);
					function makeDynCaller() {
						if (signature.includes("j")) return getDynCaller(signature, rawFunction);
						return getWasmTableEntry(rawFunction);
					}
					var fp = makeDynCaller();
					if (typeof fp != "function") throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
					return fp;
				};
				var extendError = (baseErrorType, errorName) => {
					var errorClass = createNamedFunction(errorName, function(message) {
						this.name = errorName;
						this.message = message;
						var stack = new Error(message).stack;
						if (stack !== void 0) this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
					});
					errorClass.prototype = Object.create(baseErrorType.prototype);
					errorClass.prototype.constructor = errorClass;
					errorClass.prototype.toString = function() {
						if (this.message === void 0) return this.name;
						else return `${this.name}: ${this.message}`;
					};
					return errorClass;
				};
				var UnboundTypeError;
				var getTypeName = (type) => {
					var ptr = ___getTypeName(type);
					var rv = readLatin1String(ptr);
					_free(ptr);
					return rv;
				};
				var throwUnboundTypeError = (message, types) => {
					var unboundTypes = [];
					var seen = {};
					function visit(type) {
						if (seen[type]) return;
						if (registeredTypes[type]) return;
						if (typeDependencies[type]) {
							typeDependencies[type].forEach(visit);
							return;
						}
						unboundTypes.push(type);
						seen[type] = true;
					}
					types.forEach(visit);
					throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
				};
				var getFunctionName = (signature) => {
					signature = signature.trim();
					const argsIndex = signature.indexOf("(");
					if (argsIndex !== -1) return signature.substr(0, argsIndex);
					else return signature;
				};
				var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync, isNonnullReturn) => {
					var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
					name = readLatin1String(name);
					name = getFunctionName(name);
					rawInvoker = embind__requireFunction(signature, rawInvoker);
					exposePublicSymbol(name, function() {
						throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
					}, argCount - 1);
					whenDependentTypesAreResolved([], argTypes, (argTypes) => {
						var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
						replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
						return [];
					});
				};
				var integerReadValueFromPointer = (name, width, signed) => {
					switch (width) {
						case 1: return signed ? (pointer) => HEAP8[pointer] : (pointer) => HEAPU8[pointer];
						case 2: return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];
						case 4: return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];
						default: throw new TypeError(`invalid integer width (${width}): ${name}`);
					}
				};
				var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
					name = readLatin1String(name);
					if (maxRange === -1) maxRange = 4294967295;
					var fromWireType = (value) => value;
					if (minRange === 0) {
						var bitshift = 32 - 8 * size;
						fromWireType = (value) => value << bitshift >>> bitshift;
					}
					var isUnsignedType = name.includes("unsigned");
					var toWireType;
					if (isUnsignedType) toWireType = function(destructors, value) {
						this.name;
						return value >>> 0;
					};
					else toWireType = function(destructors, value) {
						this.name;
						return value;
					};
					registerType(primitiveType, {
						name,
						fromWireType,
						toWireType,
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0),
						destructorFunction: null
					});
				};
				var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
					var TA = [
						Int8Array,
						Uint8Array,
						Int16Array,
						Uint16Array,
						Int32Array,
						Uint32Array,
						Float32Array,
						Float64Array
					][dataTypeIndex];
					function decodeMemoryView(handle) {
						var size = HEAPU32[handle >> 2];
						var data = HEAPU32[handle + 4 >> 2];
						return new TA(HEAP8.buffer, data, size);
					}
					name = readLatin1String(name);
					registerType(rawType, {
						name,
						fromWireType: decodeMemoryView,
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: decodeMemoryView
					}, { ignoreDuplicateRegistrations: true });
				};
				var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
				var __embind_register_std_string = (rawType, name) => {
					name = readLatin1String(name);
					var stdStringIsUTF8 = name === "std::string";
					registerType(rawType, {
						name,
						fromWireType(value) {
							var length = HEAPU32[value >> 2];
							var payload = value + 4;
							var str;
							if (stdStringIsUTF8) {
								var decodeStartPtr = payload;
								for (var i = 0; i <= length; ++i) {
									var currentBytePtr = payload + i;
									if (i == length || HEAPU8[currentBytePtr] == 0) {
										var maxRead = currentBytePtr - decodeStartPtr;
										var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
										if (str === void 0) str = stringSegment;
										else {
											str += String.fromCharCode(0);
											str += stringSegment;
										}
										decodeStartPtr = currentBytePtr + 1;
									}
								}
							} else {
								var a = new Array(length);
								for (var i = 0; i < length; ++i) a[i] = String.fromCharCode(HEAPU8[payload + i]);
								str = a.join("");
							}
							_free(value);
							return str;
						},
						toWireType(destructors, value) {
							if (value instanceof ArrayBuffer) value = new Uint8Array(value);
							var length;
							var valueIsOfTypeString = typeof value == "string";
							if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) throwBindingError("Cannot pass non-string to std::string");
							if (stdStringIsUTF8 && valueIsOfTypeString) length = lengthBytesUTF8(value);
							else length = value.length;
							var base = _malloc(4 + length + 1);
							var ptr = base + 4;
							HEAPU32[base >> 2] = length;
							if (stdStringIsUTF8 && valueIsOfTypeString) stringToUTF8(value, ptr, length + 1);
							else if (valueIsOfTypeString) for (var i = 0; i < length; ++i) {
								var charCode = value.charCodeAt(i);
								if (charCode > 255) {
									_free(ptr);
									throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
								}
								HEAPU8[ptr + i] = charCode;
							}
							else for (var i = 0; i < length; ++i) HEAPU8[ptr + i] = value[i];
							if (destructors !== null) destructors.push(_free, base);
							return base;
						},
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: readPointer,
						destructorFunction(ptr) {
							_free(ptr);
						}
					});
				};
				var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
				var UTF16ToString = (ptr, maxBytesToRead) => {
					var endPtr = ptr;
					var idx = endPtr >> 1;
					var maxIdx = idx + maxBytesToRead / 2;
					while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
					endPtr = idx << 1;
					if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
					var str = "";
					for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
						var codeUnit = HEAP16[ptr + i * 2 >> 1];
						if (codeUnit == 0) break;
						str += String.fromCharCode(codeUnit);
					}
					return str;
				};
				var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
					maxBytesToWrite ??= 2147483647;
					if (maxBytesToWrite < 2) return 0;
					maxBytesToWrite -= 2;
					var startPtr = outPtr;
					var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
					for (var i = 0; i < numCharsToWrite; ++i) {
						var codeUnit = str.charCodeAt(i);
						HEAP16[outPtr >> 1] = codeUnit;
						outPtr += 2;
					}
					HEAP16[outPtr >> 1] = 0;
					return outPtr - startPtr;
				};
				var lengthBytesUTF16 = (str) => str.length * 2;
				var UTF32ToString = (ptr, maxBytesToRead) => {
					var i = 0;
					var str = "";
					while (!(i >= maxBytesToRead / 4)) {
						var utf32 = HEAP32[ptr + i * 4 >> 2];
						if (utf32 == 0) break;
						++i;
						if (utf32 >= 65536) {
							var ch = utf32 - 65536;
							str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
						} else str += String.fromCharCode(utf32);
					}
					return str;
				};
				var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
					maxBytesToWrite ??= 2147483647;
					if (maxBytesToWrite < 4) return 0;
					var startPtr = outPtr;
					var endPtr = startPtr + maxBytesToWrite - 4;
					for (var i = 0; i < str.length; ++i) {
						var codeUnit = str.charCodeAt(i);
						if (codeUnit >= 55296 && codeUnit <= 57343) {
							var trailSurrogate = str.charCodeAt(++i);
							codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
						}
						HEAP32[outPtr >> 2] = codeUnit;
						outPtr += 4;
						if (outPtr + 4 > endPtr) break;
					}
					HEAP32[outPtr >> 2] = 0;
					return outPtr - startPtr;
				};
				var lengthBytesUTF32 = (str) => {
					var len = 0;
					for (var i = 0; i < str.length; ++i) {
						var codeUnit = str.charCodeAt(i);
						if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
						len += 4;
					}
					return len;
				};
				var __embind_register_std_wstring = (rawType, charSize, name) => {
					name = readLatin1String(name);
					var decodeString, encodeString, readCharAt, lengthBytesUTF;
					if (charSize === 2) {
						decodeString = UTF16ToString;
						encodeString = stringToUTF16;
						lengthBytesUTF = lengthBytesUTF16;
						readCharAt = (pointer) => HEAPU16[pointer >> 1];
					} else if (charSize === 4) {
						decodeString = UTF32ToString;
						encodeString = stringToUTF32;
						lengthBytesUTF = lengthBytesUTF32;
						readCharAt = (pointer) => HEAPU32[pointer >> 2];
					}
					registerType(rawType, {
						name,
						fromWireType: (value) => {
							var length = HEAPU32[value >> 2];
							var str;
							var decodeStartPtr = value + 4;
							for (var i = 0; i <= length; ++i) {
								var currentBytePtr = value + 4 + i * charSize;
								if (i == length || readCharAt(currentBytePtr) == 0) {
									var maxReadBytes = currentBytePtr - decodeStartPtr;
									var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
									if (str === void 0) str = stringSegment;
									else {
										str += String.fromCharCode(0);
										str += stringSegment;
									}
									decodeStartPtr = currentBytePtr + charSize;
								}
							}
							_free(value);
							return str;
						},
						toWireType: (destructors, value) => {
							if (!(typeof value == "string")) throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
							var length = lengthBytesUTF(value);
							var ptr = _malloc(4 + length + charSize);
							HEAPU32[ptr >> 2] = length / charSize;
							encodeString(value, ptr + 4, length + charSize);
							if (destructors !== null) destructors.push(_free, ptr);
							return ptr;
						},
						argPackAdvance: GenericWireTypeSize,
						readValueFromPointer: readPointer,
						destructorFunction(ptr) {
							_free(ptr);
						}
					});
				};
				var __embind_register_void = (rawType, name) => {
					name = readLatin1String(name);
					registerType(rawType, {
						isVoid: true,
						name,
						argPackAdvance: 0,
						fromWireType: () => void 0,
						toWireType: (destructors, o) => void 0
					});
				};
				var nowIsMonotonic = 1;
				var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
				var inetPton4 = (str) => {
					var b = str.split(".");
					for (var i = 0; i < 4; i++) {
						var tmp = Number(b[i]);
						if (isNaN(tmp)) return null;
						b[i] = tmp;
					}
					return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0;
				};
				var jstoi_q = (str) => parseInt(str);
				var inetPton6 = (str) => {
					var words;
					var w, offset, z;
					var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
					var parts = [];
					if (!valid6regx.test(str)) return null;
					if (str === "::") return [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					];
					if (str.startsWith("::")) str = str.replace("::", "Z:");
					else str = str.replace("::", ":Z:");
					if (str.indexOf(".") > 0) {
						str = str.replace(/* @__PURE__ */ new RegExp("[.]", "g"), ":");
						words = str.split(":");
						words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
						words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
						words = words.slice(0, words.length - 2);
					} else words = str.split(":");
					offset = 0;
					z = 0;
					for (w = 0; w < words.length; w++) if (typeof words[w] == "string") {
						if (words[w] === "Z") {
							for (z = 0; z < 8 - words.length + 1; z++) parts[w + z] = 0;
							offset = z - 1;
						} else parts[w + offset] = _htons(parseInt(words[w], 16));
					} else parts[w + offset] = words[w];
					return [
						parts[1] << 16 | parts[0],
						parts[3] << 16 | parts[2],
						parts[5] << 16 | parts[4],
						parts[7] << 16 | parts[6]
					];
				};
				var DNS = {
					address_map: {
						id: 1,
						addrs: {},
						names: {}
					},
					lookup_name(name) {
						var res = inetPton4(name);
						if (res !== null) return name;
						res = inetPton6(name);
						if (res !== null) return name;
						var addr;
						if (DNS.address_map.addrs[name]) addr = DNS.address_map.addrs[name];
						else {
							var id = DNS.address_map.id++;
							assert(id < 65535, "exceeded max address mappings of 65535");
							addr = "172.29." + (id & 255) + "." + (id & 65280);
							DNS.address_map.names[addr] = name;
							DNS.address_map.addrs[name] = addr;
						}
						return addr;
					},
					lookup_addr(addr) {
						if (DNS.address_map.names[addr]) return DNS.address_map.names[addr];
						return null;
					}
				};
				var __emscripten_lookup_name = (name) => {
					var nameString = UTF8ToString(name);
					return inetPton4(DNS.lookup_name(nameString));
				};
				var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
				var requireRegisteredType = (rawType, humanName) => {
					var impl = registeredTypes[rawType];
					if (void 0 === impl) throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
					return impl;
				};
				var emval_returnValue = (returnType, destructorsRef, handle) => {
					var destructors = [];
					var result = returnType["toWireType"](destructors, handle);
					if (destructors.length) HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
					return result;
				};
				var __emval_as = (handle, returnType, destructorsRef) => {
					handle = Emval.toValue(handle);
					returnType = requireRegisteredType(returnType, "emval::as");
					return emval_returnValue(returnType, destructorsRef, handle);
				};
				var emval_symbols = {};
				var getStringOrSymbol = (address) => {
					var symbol = emval_symbols[address];
					if (symbol === void 0) return readLatin1String(address);
					return symbol;
				};
				var emval_methodCallers = [];
				var __emval_call_method = (caller, objHandle, methodName, destructorsRef, args) => {
					caller = emval_methodCallers[caller];
					objHandle = Emval.toValue(objHandle);
					methodName = getStringOrSymbol(methodName);
					return caller(objHandle, objHandle[methodName], destructorsRef, args);
				};
				var emval_get_global = () => {
					if (typeof globalThis == "object") return globalThis;
					return function() {
						return Function;
					}()("return this")();
				};
				var __emval_get_global = (name) => {
					if (name === 0) return Emval.toHandle(emval_get_global());
					else {
						name = getStringOrSymbol(name);
						return Emval.toHandle(emval_get_global()[name]);
					}
				};
				var emval_addMethodCaller = (caller) => {
					var id = emval_methodCallers.length;
					emval_methodCallers.push(caller);
					return id;
				};
				var emval_lookupTypes = (argCount, argTypes) => {
					var a = new Array(argCount);
					for (var i = 0; i < argCount; ++i) a[i] = requireRegisteredType(HEAPU32[argTypes + i * 4 >> 2], "parameter " + i);
					return a;
				};
				var __emval_get_method_caller = (argCount, argTypes, kind) => {
					var types = emval_lookupTypes(argCount, argTypes);
					var retType = types.shift();
					argCount--;
					var functionBody = `return function (obj, func, destructorsRef, args) {\n`;
					var offset = 0;
					var argsList = [];
					if (kind === 0) argsList.push("obj");
					var params = ["retType"];
					var args = [retType];
					for (var i = 0; i < argCount; ++i) {
						argsList.push("arg" + i);
						params.push("argType" + i);
						args.push(types[i]);
						functionBody += `  var arg${i} = argType${i}.readValueFromPointer(args${offset ? "+" + offset : ""});\n`;
						offset += types[i].argPackAdvance;
					}
					functionBody += `  var rv = ${kind === 1 ? "new func" : "func.call"}(${argsList.join(", ")});\n`;
					if (!retType.isVoid) {
						params.push("emval_returnValue");
						args.push(emval_returnValue);
						functionBody += "  return emval_returnValue(retType, destructorsRef, rv);\n";
					}
					functionBody += "};\n";
					params.push(functionBody);
					var invokerFunction = newFunc(Function, params)(...args);
					return emval_addMethodCaller(createNamedFunction(`methodCaller<(${types.map((t) => t.name).join(", ")}) => ${retType.name}>`, invokerFunction));
				};
				var __emval_get_property = (handle, key) => {
					handle = Emval.toValue(handle);
					key = Emval.toValue(key);
					return Emval.toHandle(handle[key]);
				};
				var __emval_incref = (handle) => {
					if (handle > 9) emval_handles[handle + 1] += 1;
				};
				var __emval_new_array = () => Emval.toHandle([]);
				var __emval_new_cstring = (v) => Emval.toHandle(getStringOrSymbol(v));
				var __emval_new_object = () => Emval.toHandle({});
				var __emval_run_destructors = (handle) => {
					runDestructors(Emval.toValue(handle));
					__emval_decref(handle);
				};
				var __emval_set_property = (handle, key, value) => {
					handle = Emval.toValue(handle);
					key = Emval.toValue(key);
					value = Emval.toValue(value);
					handle[key] = value;
				};
				var __emval_take_value = (type, arg) => {
					type = requireRegisteredType(type, "_emval_take_value");
					var v = type["readValueFromPointer"](arg);
					return Emval.toHandle(v);
				};
				var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
				var MONTH_DAYS_LEAP_CUMULATIVE = [
					0,
					31,
					60,
					91,
					121,
					152,
					182,
					213,
					244,
					274,
					305,
					335
				];
				var MONTH_DAYS_REGULAR_CUMULATIVE = [
					0,
					31,
					59,
					90,
					120,
					151,
					181,
					212,
					243,
					273,
					304,
					334
				];
				var ydayFromDate = (date) => {
					return (isLeapYear(date.getFullYear()) ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE)[date.getMonth()] + date.getDate() - 1;
				};
				var convertI32PairToI53Checked = (lo, hi) => hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
				function __localtime_js(time_low, time_high, tmPtr) {
					var time = convertI32PairToI53Checked(time_low, time_high);
					var date = /* @__PURE__ */ new Date(time * 1e3);
					HEAP32[tmPtr >> 2] = date.getSeconds();
					HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
					HEAP32[tmPtr + 8 >> 2] = date.getHours();
					HEAP32[tmPtr + 12 >> 2] = date.getDate();
					HEAP32[tmPtr + 16 >> 2] = date.getMonth();
					HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
					HEAP32[tmPtr + 24 >> 2] = date.getDay();
					var yday = ydayFromDate(date) | 0;
					HEAP32[tmPtr + 28 >> 2] = yday;
					HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
					var start = new Date(date.getFullYear(), 0, 1);
					var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
					var winterOffset = start.getTimezoneOffset();
					var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
					HEAP32[tmPtr + 32 >> 2] = dst;
				}
				function __munmap_js(addr, len, prot, flags, fd, offset_low, offset_high) {
					var offset = convertI32PairToI53Checked(offset_low, offset_high);
					try {
						var stream = SYSCALLS.getStreamFromFD(fd);
						if (prot & 2) SYSCALLS.doMsync(addr, stream, len, flags, offset);
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return -e.errno;
					}
				}
				var __tzset_js = (timezone, daylight, std_name, dst_name) => {
					var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
					var winter = new Date(currentYear, 0, 1);
					var summer = new Date(currentYear, 6, 1);
					var winterOffset = winter.getTimezoneOffset();
					var summerOffset = summer.getTimezoneOffset();
					var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
					HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
					HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
					var extractZone = (timezoneOffset) => {
						var sign = timezoneOffset >= 0 ? "-" : "+";
						var absOffset = Math.abs(timezoneOffset);
						return `UTC${sign}${String(Math.floor(absOffset / 60)).padStart(2, "0")}${String(absOffset % 60).padStart(2, "0")}`;
					};
					var winterName = extractZone(winterOffset);
					var summerName = extractZone(summerOffset);
					if (summerOffset < winterOffset) {
						stringToUTF8(winterName, std_name, 17);
						stringToUTF8(summerName, dst_name, 17);
					} else {
						stringToUTF8(winterName, dst_name, 17);
						stringToUTF8(summerName, std_name, 17);
					}
				};
				var _emscripten_date_now = () => Date.now();
				function jsStackTrace() {
					return (/* @__PURE__ */ new Error()).stack.toString();
				}
				var warnOnce = (text) => {
					warnOnce.shown ||= {};
					if (!warnOnce.shown[text]) {
						warnOnce.shown[text] = 1;
						if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
						err(text);
					}
				};
				function getCallstack(flags) {
					var callstack = jsStackTrace();
					var iThisFunc = callstack.lastIndexOf("_emscripten_log");
					var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
					var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
					callstack = callstack.slice(iNextLine);
					if (flags & 8 && typeof emscripten_source_map == "undefined") {
						warnOnce("Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with \"--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js\" linker flag to add source map loading to code.");
						flags ^= 8;
						flags |= 16;
					}
					var lines = callstack.split("\n");
					callstack = "";
					var newFirefoxRe = /* @__PURE__ */ new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
					var firefoxRe = /* @__PURE__ */ new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
					var chromeRe = /* @__PURE__ */ new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
					for (var l in lines) {
						var line = lines[l];
						var symbolName = "";
						var file = "";
						var lineno = 0;
						var column = 0;
						var parts = chromeRe.exec(line);
						if (parts && parts.length == 5) {
							symbolName = parts[1];
							file = parts[2];
							lineno = parts[3];
							column = parts[4];
						} else {
							parts = newFirefoxRe.exec(line) || firefoxRe.exec(line);
							if (parts && parts.length >= 4) {
								symbolName = parts[1];
								file = parts[2];
								lineno = parts[3];
								column = parts[4] | 0;
							} else {
								callstack += line + "\n";
								continue;
							}
						}
						var haveSourceMap = false;
						if (flags & 8) {
							var orig = emscripten_source_map.originalPositionFor({
								line: lineno,
								column
							});
							haveSourceMap = orig?.source;
							if (haveSourceMap) {
								if (flags & 64) orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1);
								callstack += `    at ${symbolName} (${orig.source}:${orig.line}:${orig.column})\n`;
							}
						}
						if (flags & 16 || !haveSourceMap) {
							if (flags & 64) file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
							callstack += (haveSourceMap ? `     = ${symbolName}` : `    at ${symbolName}`) + ` (${file}:${lineno}:${column})\n`;
						}
					}
					callstack = callstack.replace(/\s+$/, "");
					return callstack;
				}
				function _emscripten_get_callstack(flags, str, maxbytes) {
					var callstack = getCallstack(flags);
					if (!str || maxbytes <= 0) return lengthBytesUTF8(callstack) + 1;
					return stringToUTF8(callstack, str, maxbytes) + 1;
				}
				var getHeapMax = () => 2147483648;
				var _emscripten_get_heap_max = () => getHeapMax();
				var growMemory = (size) => {
					var pages = (size - wasmMemory.buffer.byteLength + 65535) / 65536 | 0;
					try {
						wasmMemory.grow(pages);
						updateMemoryViews();
						return 1;
					} catch (e) {}
				};
				var _emscripten_resize_heap = (requestedSize) => {
					var oldSize = HEAPU8.length;
					requestedSize >>>= 0;
					var maxHeapSize = getHeapMax();
					if (requestedSize > maxHeapSize) return false;
					for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
						var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
						overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
						if (growMemory(Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536)))) return true;
					}
					return false;
				};
				var ENV = {};
				var getExecutableName = () => thisProgram || "./this.program";
				var getEnvStrings = () => {
					if (!getEnvStrings.strings) {
						var env = {
							USER: "web_user",
							LOGNAME: "web_user",
							PATH: "/",
							PWD: "/",
							HOME: "/home/web_user",
							LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
							_: getExecutableName()
						};
						for (var x in ENV) if (ENV[x] === void 0) delete env[x];
						else env[x] = ENV[x];
						var strings = [];
						for (var x in env) strings.push(`${x}=${env[x]}`);
						getEnvStrings.strings = strings;
					}
					return getEnvStrings.strings;
				};
				var stringToAscii = (str, buffer) => {
					for (var i = 0; i < str.length; ++i) HEAP8[buffer++] = str.charCodeAt(i);
					HEAP8[buffer] = 0;
				};
				var _environ_get = (__environ, environ_buf) => {
					var bufSize = 0;
					getEnvStrings().forEach((string, i) => {
						var ptr = environ_buf + bufSize;
						HEAPU32[__environ + i * 4 >> 2] = ptr;
						stringToAscii(string, ptr);
						bufSize += string.length + 1;
					});
					return 0;
				};
				var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
					var strings = getEnvStrings();
					HEAPU32[penviron_count >> 2] = strings.length;
					var bufSize = 0;
					strings.forEach((string) => bufSize += string.length + 1);
					HEAPU32[penviron_buf_size >> 2] = bufSize;
					return 0;
				};
				var runtimeKeepaliveCounter = 0;
				var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
				var _proc_exit = (code) => {
					if (!keepRuntimeAlive()) {
						Module["onExit"]?.(code);
						ABORT = true;
					}
					quit_(code, new ExitStatus(code));
				};
				var exitJS = (status, implicit) => {
					_proc_exit(status);
				};
				var _exit = exitJS;
				function _fd_close(fd) {
					try {
						var stream = SYSCALLS.getStreamFromFD(fd);
						FS.close(stream);
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return e.errno;
					}
				}
				var doReadv = (stream, iov, iovcnt, offset) => {
					var ret = 0;
					for (var i = 0; i < iovcnt; i++) {
						var ptr = HEAPU32[iov >> 2];
						var len = HEAPU32[iov + 4 >> 2];
						iov += 8;
						var curr = FS.read(stream, HEAP8, ptr, len, offset);
						if (curr < 0) return -1;
						ret += curr;
						if (curr < len) break;
						if (typeof offset != "undefined") offset += curr;
					}
					return ret;
				};
				function _fd_read(fd, iov, iovcnt, pnum) {
					try {
						var num = doReadv(SYSCALLS.getStreamFromFD(fd), iov, iovcnt);
						HEAPU32[pnum >> 2] = num;
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return e.errno;
					}
				}
				function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
					var offset = convertI32PairToI53Checked(offset_low, offset_high);
					try {
						if (isNaN(offset)) return 61;
						var stream = SYSCALLS.getStreamFromFD(fd);
						FS.llseek(stream, offset, whence);
						tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
						if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return e.errno;
					}
				}
				var doWritev = (stream, iov, iovcnt, offset) => {
					var ret = 0;
					for (var i = 0; i < iovcnt; i++) {
						var ptr = HEAPU32[iov >> 2];
						var len = HEAPU32[iov + 4 >> 2];
						iov += 8;
						var curr = FS.write(stream, HEAP8, ptr, len, offset);
						if (curr < 0) return -1;
						ret += curr;
						if (curr < len) break;
						if (typeof offset != "undefined") offset += curr;
					}
					return ret;
				};
				function _fd_write(fd, iov, iovcnt, pnum) {
					try {
						var num = doWritev(SYSCALLS.getStreamFromFD(fd), iov, iovcnt);
						HEAPU32[pnum >> 2] = num;
						return 0;
					} catch (e) {
						if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
						return e.errno;
					}
				}
				FS.createPreloadedFile = FS_createPreloadedFile;
				FS.staticInit();
				embind_init_charCodes();
				BindingError = Module["BindingError"] = class BindingError extends Error {
					constructor(message) {
						super(message);
						this.name = "BindingError";
					}
				};
				InternalError = Module["InternalError"] = class InternalError extends Error {
					constructor(message) {
						super(message);
						this.name = "InternalError";
					}
				};
				init_emval();
				UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
				var wasmImports = {
					M: ___syscall_chmod,
					N: ___syscall_faccessat,
					h: ___syscall_fcntl64,
					I: ___syscall_fstat64,
					Q: ___syscall_ioctl,
					F: ___syscall_lstat64,
					G: ___syscall_newfstatat,
					j: ___syscall_openat,
					B: ___syscall_rmdir,
					H: ___syscall_stat64,
					C: ___syscall_unlinkat,
					A: __abort_js,
					w: __embind_register_bigint,
					V: __embind_register_bool,
					U: __embind_register_emval,
					n: __embind_register_float,
					f: __embind_register_function,
					b: __embind_register_integer,
					a: __embind_register_memory_view,
					m: __embind_register_std_string,
					i: __embind_register_std_wstring,
					W: __embind_register_void,
					J: __emscripten_get_now_is_monotonic,
					x: __emscripten_lookup_name,
					L: __emscripten_memcpy_js,
					e: __emval_as,
					q: __emval_call_method,
					T: __emval_decref,
					u: __emval_get_global,
					p: __emval_get_method_caller,
					k: __emval_get_property,
					Y: __emval_incref,
					X: __emval_new_array,
					r: __emval_new_cstring,
					Z: __emval_new_object,
					o: __emval_run_destructors,
					c: __emval_set_property,
					d: __emval_take_value,
					t: __localtime_js,
					s: __munmap_js,
					O: __tzset_js,
					K: _emscripten_date_now,
					R: _emscripten_get_callstack,
					z: _emscripten_get_heap_max,
					y: _emscripten_resize_heap,
					D: _environ_get,
					E: _environ_sizes_get,
					S: _exit,
					g: _fd_close,
					P: _fd_read,
					v: _fd_seek,
					l: _fd_write
				};
				var wasmExports = createWasm();
				var ___getTypeName = (a0) => (___getTypeName = wasmExports["aa"])(a0);
				var _malloc = (a0) => (_malloc = wasmExports["ca"])(a0);
				var _free = (a0) => (_free = wasmExports["da"])(a0);
				var _htons = (a0) => (_htons = wasmExports["ea"])(a0);
				var _emscripten_builtin_memalign = (a0, a1) => (_emscripten_builtin_memalign = wasmExports["fa"])(a0, a1);
				var ___trap = () => (___trap = wasmExports["ga"])();
				var dynCall_viijii = Module["dynCall_viijii"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_viijii = Module["dynCall_viijii"] = wasmExports["ha"])(a0, a1, a2, a3, a4, a5, a6);
				var dynCall_viiiiji = Module["dynCall_viiiiji"] = (a0, a1, a2, a3, a4, a5, a6, a7) => (dynCall_viiiiji = Module["dynCall_viiiiji"] = wasmExports["ia"])(a0, a1, a2, a3, a4, a5, a6, a7);
				var dynCall_jiji = Module["dynCall_jiji"] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module["dynCall_jiji"] = wasmExports["ja"])(a0, a1, a2, a3, a4);
				var dynCall_iiiiij = Module["dynCall_iiiiij"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iiiiij = Module["dynCall_iiiiij"] = wasmExports["ka"])(a0, a1, a2, a3, a4, a5, a6);
				var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) => (dynCall_iiiiijj = Module["dynCall_iiiiijj"] = wasmExports["la"])(a0, a1, a2, a3, a4, a5, a6, a7, a8);
				var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = wasmExports["ma"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
				var calledRun;
				var calledPrerun;
				dependenciesFulfilled = function runCaller() {
					if (!calledRun) run();
					if (!calledRun) dependenciesFulfilled = runCaller;
				};
				function run() {
					if (runDependencies > 0) return;
					if (!calledPrerun) {
						calledPrerun = 1;
						preRun();
						if (runDependencies > 0) return;
					}
					function doRun() {
						if (calledRun) return;
						calledRun = 1;
						Module["calledRun"] = 1;
						if (ABORT) return;
						initRuntime();
						readyPromiseResolve(Module);
						Module["onRuntimeInitialized"]?.();
						postRun();
					}
					if (Module["setStatus"]) {
						Module["setStatus"]("Running...");
						setTimeout(() => {
							setTimeout(() => Module["setStatus"](""), 1);
							doRun();
						}, 1);
					} else doRun();
				}
				if (Module["preInit"]) {
					if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
					while (Module["preInit"].length > 0) Module["preInit"].pop()();
				}
				run();
				moduleRtn = readyPromise;
				return moduleRtn;
			});
		})();
		if (typeof exports === "object" && typeof module === "object") module.exports = occtimportjs;
		else if (typeof define === "function" && define["amd"]) define([], () => occtimportjs);
	})))(), 1);
	var occt_import_js_default = "/assets/occt-import-js-BhHfLpto.wasm";
	// src/lib/step.worker.ts
	const ctx = self;
	let occt = null;
	ctx.onmessage = async (ev) => {
		const { id, buffer } = ev.data;
		try {
			occt ??= (0, import_occt_import_js.default)({ locateFile: () => occt_import_js_default });
			const result = (await occt).ReadStepFile(new Uint8Array(buffer), {
				linearUnit: "millimeter",
				linearDeflectionType: "absolute_value",
				linearDeflection: .01,
				angularDeflection: .5
			});
			const meshes = result.success ? result.meshes.map((m) => ({
				name: m.name,
				positions: Float32Array.from(m.attributes.position.array),
				indices: Uint32Array.from(m.index.array)
			})) : [];
			const transfer = [];
			for (const m of meshes) transfer.push(m.positions.buffer, m.indices.buffer);
			ctx.postMessage({
				id,
				ok: true,
				meshes
			}, transfer);
		} catch (err) {
			ctx.postMessage({
				id,
				ok: false,
				message: err instanceof Error ? err.message : "STEP import failed."
			});
		}
	};
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC53b3JrZXItQklkdHFfZksuanMiLCJuYW1lcyI6WyJvY2N0aW1wb3J0anMiLCJ3YXNtVXJsIl0sInNvdXJjZXMiOlsiLi4vLi4vX192aXRlLWJyb3dzZXItZXh0ZXJuYWwiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vb2NjdC1pbXBvcnQtanNAMC4wLjIzL25vZGVfbW9kdWxlcy9vY2N0LWltcG9ydC1qcy9kaXN0L29jY3QtaW1wb3J0LWpzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL29jY3QtaW1wb3J0LWpzQDAuMC4yMy9ub2RlX21vZHVsZXMvb2NjdC1pbXBvcnQtanMvZGlzdC9vY2N0LWltcG9ydC1qcy53YXNtP3VybCIsIi4uLy4uL3NyYy9saWIvc3RlcC53b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7fSIsIlxyXG52YXIgb2NjdGltcG9ydGpzID0gKCgpID0+IHtcclxuICB2YXIgX3NjcmlwdE5hbWUgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5jdXJyZW50U2NyaXB0Py5zcmMgOiB1bmRlZmluZWQ7XHJcbiAgaWYgKHR5cGVvZiBfX2ZpbGVuYW1lICE9ICd1bmRlZmluZWQnKSBfc2NyaXB0TmFtZSA9IF9zY3JpcHROYW1lIHx8IF9fZmlsZW5hbWU7XHJcbiAgcmV0dXJuIChcclxuZnVuY3Rpb24obW9kdWxlQXJnID0ge30pIHtcclxuICB2YXIgbW9kdWxlUnRuO1xyXG5cclxudmFyIE1vZHVsZT1tb2R1bGVBcmc7dmFyIHJlYWR5UHJvbWlzZVJlc29sdmUscmVhZHlQcm9taXNlUmVqZWN0O3ZhciByZWFkeVByb21pc2U9bmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e3JlYWR5UHJvbWlzZVJlc29sdmU9cmVzb2x2ZTtyZWFkeVByb21pc2VSZWplY3Q9cmVqZWN0fSk7dmFyIEVOVklST05NRU5UX0lTX1dFQj10eXBlb2Ygd2luZG93PT1cIm9iamVjdFwiO3ZhciBFTlZJUk9OTUVOVF9JU19XT1JLRVI9dHlwZW9mIGltcG9ydFNjcmlwdHM9PVwiZnVuY3Rpb25cIjt2YXIgRU5WSVJPTk1FTlRfSVNfTk9ERT10eXBlb2YgcHJvY2Vzcz09XCJvYmplY3RcIiYmdHlwZW9mIHByb2Nlc3MudmVyc2lvbnM9PVwib2JqZWN0XCImJnR5cGVvZiBwcm9jZXNzLnZlcnNpb25zLm5vZGU9PVwic3RyaW5nXCImJnByb2Nlc3MudHlwZSE9XCJyZW5kZXJlclwiO2lmKEVOVklST05NRU5UX0lTX05PREUpe312YXIgbW9kdWxlT3ZlcnJpZGVzPU9iamVjdC5hc3NpZ24oe30sTW9kdWxlKTt2YXIgYXJndW1lbnRzXz1bXTt2YXIgdGhpc1Byb2dyYW09XCIuL3RoaXMucHJvZ3JhbVwiO3ZhciBxdWl0Xz0oc3RhdHVzLHRvVGhyb3cpPT57dGhyb3cgdG9UaHJvd307dmFyIHNjcmlwdERpcmVjdG9yeT1cIlwiO2Z1bmN0aW9uIGxvY2F0ZUZpbGUocGF0aCl7aWYoTW9kdWxlW1wibG9jYXRlRmlsZVwiXSl7cmV0dXJuIE1vZHVsZVtcImxvY2F0ZUZpbGVcIl0ocGF0aCxzY3JpcHREaXJlY3RvcnkpfXJldHVybiBzY3JpcHREaXJlY3RvcnkrcGF0aH12YXIgcmVhZEFzeW5jLHJlYWRCaW5hcnk7aWYoRU5WSVJPTk1FTlRfSVNfTk9ERSl7dmFyIGZzPXJlcXVpcmUoXCJmc1wiKTt2YXIgbm9kZVBhdGg9cmVxdWlyZShcInBhdGhcIik7c2NyaXB0RGlyZWN0b3J5PV9fZGlybmFtZStcIi9cIjtyZWFkQmluYXJ5PWZpbGVuYW1lPT57ZmlsZW5hbWU9aXNGaWxlVVJJKGZpbGVuYW1lKT9uZXcgVVJMKGZpbGVuYW1lKTpub2RlUGF0aC5ub3JtYWxpemUoZmlsZW5hbWUpO3ZhciByZXQ9ZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtyZXR1cm4gcmV0fTtyZWFkQXN5bmM9KGZpbGVuYW1lLGJpbmFyeT10cnVlKT0+e2ZpbGVuYW1lPWlzRmlsZVVSSShmaWxlbmFtZSk/bmV3IFVSTChmaWxlbmFtZSk6bm9kZVBhdGgubm9ybWFsaXplKGZpbGVuYW1lKTtyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e2ZzLnJlYWRGaWxlKGZpbGVuYW1lLGJpbmFyeT91bmRlZmluZWQ6XCJ1dGY4XCIsKGVycixkYXRhKT0+e2lmKGVycilyZWplY3QoZXJyKTtlbHNlIHJlc29sdmUoYmluYXJ5P2RhdGEuYnVmZmVyOmRhdGEpfSl9KX07aWYoIU1vZHVsZVtcInRoaXNQcm9ncmFtXCJdJiZwcm9jZXNzLmFyZ3YubGVuZ3RoPjEpe3RoaXNQcm9ncmFtPXByb2Nlc3MuYXJndlsxXS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpfWFyZ3VtZW50c189cHJvY2Vzcy5hcmd2LnNsaWNlKDIpO3F1aXRfPShzdGF0dXMsdG9UaHJvdyk9Pntwcm9jZXNzLmV4aXRDb2RlPXN0YXR1czt0aHJvdyB0b1Rocm93fX1lbHNlIGlmKEVOVklST05NRU5UX0lTX1dFQnx8RU5WSVJPTk1FTlRfSVNfV09SS0VSKXtpZihFTlZJUk9OTUVOVF9JU19XT1JLRVIpe3NjcmlwdERpcmVjdG9yeT1zZWxmLmxvY2F0aW9uLmhyZWZ9ZWxzZSBpZih0eXBlb2YgZG9jdW1lbnQhPVwidW5kZWZpbmVkXCImJmRvY3VtZW50LmN1cnJlbnRTY3JpcHQpe3NjcmlwdERpcmVjdG9yeT1kb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY31pZihfc2NyaXB0TmFtZSl7c2NyaXB0RGlyZWN0b3J5PV9zY3JpcHROYW1lfWlmKHNjcmlwdERpcmVjdG9yeS5zdGFydHNXaXRoKFwiYmxvYjpcIikpe3NjcmlwdERpcmVjdG9yeT1cIlwifWVsc2V7c2NyaXB0RGlyZWN0b3J5PXNjcmlwdERpcmVjdG9yeS5zdWJzdHIoMCxzY3JpcHREaXJlY3RvcnkucmVwbGFjZSgvWz8jXS4qLyxcIlwiKS5sYXN0SW5kZXhPZihcIi9cIikrMSl9e2lmKEVOVklST05NRU5UX0lTX1dPUktFUil7cmVhZEJpbmFyeT11cmw9Pnt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbihcIkdFVFwiLHVybCxmYWxzZSk7eGhyLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCI7eGhyLnNlbmQobnVsbCk7cmV0dXJuIG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSl9fXJlYWRBc3luYz11cmw9PntpZihpc0ZpbGVVUkkodXJsKSl7cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9Pnt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbihcIkdFVFwiLHVybCx0cnVlKTt4aHIucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIjt4aHIub25sb2FkPSgpPT57aWYoeGhyLnN0YXR1cz09MjAwfHx4aHIuc3RhdHVzPT0wJiZ4aHIucmVzcG9uc2Upe3Jlc29sdmUoeGhyLnJlc3BvbnNlKTtyZXR1cm59cmVqZWN0KHhoci5zdGF0dXMpfTt4aHIub25lcnJvcj1yZWplY3Q7eGhyLnNlbmQobnVsbCl9KX1yZXR1cm4gZmV0Y2godXJsLHtjcmVkZW50aWFsczpcInNhbWUtb3JpZ2luXCJ9KS50aGVuKHJlc3BvbnNlPT57aWYocmVzcG9uc2Uub2spe3JldHVybiByZXNwb25zZS5hcnJheUJ1ZmZlcigpfXJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzK1wiIDogXCIrcmVzcG9uc2UudXJsKSl9KX19fWVsc2V7fXZhciBvdXQ9TW9kdWxlW1wicHJpbnRcIl18fGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7dmFyIGVycj1Nb2R1bGVbXCJwcmludEVyclwiXXx8Y29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpO09iamVjdC5hc3NpZ24oTW9kdWxlLG1vZHVsZU92ZXJyaWRlcyk7bW9kdWxlT3ZlcnJpZGVzPW51bGw7aWYoTW9kdWxlW1wiYXJndW1lbnRzXCJdKWFyZ3VtZW50c189TW9kdWxlW1wiYXJndW1lbnRzXCJdO2lmKE1vZHVsZVtcInRoaXNQcm9ncmFtXCJdKXRoaXNQcm9ncmFtPU1vZHVsZVtcInRoaXNQcm9ncmFtXCJdO3ZhciB3YXNtQmluYXJ5PU1vZHVsZVtcIndhc21CaW5hcnlcIl07dmFyIHdhc21NZW1vcnk7dmFyIEFCT1JUPWZhbHNlO3ZhciBFWElUU1RBVFVTO2Z1bmN0aW9uIGFzc2VydChjb25kaXRpb24sdGV4dCl7aWYoIWNvbmRpdGlvbil7YWJvcnQodGV4dCl9fXZhciBIRUFQOCxIRUFQVTgsSEVBUDE2LEhFQVBVMTYsSEVBUDMyLEhFQVBVMzIsSEVBUEYzMixIRUFQRjY0O2Z1bmN0aW9uIHVwZGF0ZU1lbW9yeVZpZXdzKCl7dmFyIGI9d2FzbU1lbW9yeS5idWZmZXI7TW9kdWxlW1wiSEVBUDhcIl09SEVBUDg9bmV3IEludDhBcnJheShiKTtNb2R1bGVbXCJIRUFQMTZcIl09SEVBUDE2PW5ldyBJbnQxNkFycmF5KGIpO01vZHVsZVtcIkhFQVBVOFwiXT1IRUFQVTg9bmV3IFVpbnQ4QXJyYXkoYik7TW9kdWxlW1wiSEVBUFUxNlwiXT1IRUFQVTE2PW5ldyBVaW50MTZBcnJheShiKTtNb2R1bGVbXCJIRUFQMzJcIl09SEVBUDMyPW5ldyBJbnQzMkFycmF5KGIpO01vZHVsZVtcIkhFQVBVMzJcIl09SEVBUFUzMj1uZXcgVWludDMyQXJyYXkoYik7TW9kdWxlW1wiSEVBUEYzMlwiXT1IRUFQRjMyPW5ldyBGbG9hdDMyQXJyYXkoYik7TW9kdWxlW1wiSEVBUEY2NFwiXT1IRUFQRjY0PW5ldyBGbG9hdDY0QXJyYXkoYil9dmFyIF9fQVRQUkVSVU5fXz1bXTt2YXIgX19BVElOSVRfXz1bXTt2YXIgX19BVFBPU1RSVU5fXz1bXTt2YXIgcnVudGltZUluaXRpYWxpemVkPWZhbHNlO2Z1bmN0aW9uIHByZVJ1bigpe3ZhciBwcmVSdW5zPU1vZHVsZVtcInByZVJ1blwiXTtpZihwcmVSdW5zKXtpZih0eXBlb2YgcHJlUnVucz09XCJmdW5jdGlvblwiKXByZVJ1bnM9W3ByZVJ1bnNdO3ByZVJ1bnMuZm9yRWFjaChhZGRPblByZVJ1bil9Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBSRVJVTl9fKX1mdW5jdGlvbiBpbml0UnVudGltZSgpe3J1bnRpbWVJbml0aWFsaXplZD10cnVlO2lmKCFNb2R1bGVbXCJub0ZTSW5pdFwiXSYmIUZTLmluaXRpYWxpemVkKUZTLmluaXQoKTtGUy5pZ25vcmVQZXJtaXNzaW9ucz1mYWxzZTtUVFkuaW5pdCgpO2NhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRJTklUX18pfWZ1bmN0aW9uIHBvc3RSdW4oKXt2YXIgcG9zdFJ1bnM9TW9kdWxlW1wicG9zdFJ1blwiXTtpZihwb3N0UnVucyl7aWYodHlwZW9mIHBvc3RSdW5zPT1cImZ1bmN0aW9uXCIpcG9zdFJ1bnM9W3Bvc3RSdW5zXTtwb3N0UnVucy5mb3JFYWNoKGFkZE9uUG9zdFJ1bil9Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBPU1RSVU5fXyl9ZnVuY3Rpb24gYWRkT25QcmVSdW4oY2Ipe19fQVRQUkVSVU5fXy51bnNoaWZ0KGNiKX1mdW5jdGlvbiBhZGRPbkluaXQoY2Ipe19fQVRJTklUX18udW5zaGlmdChjYil9ZnVuY3Rpb24gYWRkT25Qb3N0UnVuKGNiKXtfX0FUUE9TVFJVTl9fLnVuc2hpZnQoY2IpfXZhciBydW5EZXBlbmRlbmNpZXM9MDt2YXIgcnVuRGVwZW5kZW5jeVdhdGNoZXI9bnVsbDt2YXIgZGVwZW5kZW5jaWVzRnVsZmlsbGVkPW51bGw7ZnVuY3Rpb24gZ2V0VW5pcXVlUnVuRGVwZW5kZW5jeShpZCl7cmV0dXJuIGlkfWZ1bmN0aW9uIGFkZFJ1bkRlcGVuZGVuY3koaWQpe3J1bkRlcGVuZGVuY2llcysrO01vZHVsZVtcIm1vbml0b3JSdW5EZXBlbmRlbmNpZXNcIl0/LihydW5EZXBlbmRlbmNpZXMpfWZ1bmN0aW9uIHJlbW92ZVJ1bkRlcGVuZGVuY3koaWQpe3J1bkRlcGVuZGVuY2llcy0tO01vZHVsZVtcIm1vbml0b3JSdW5EZXBlbmRlbmNpZXNcIl0/LihydW5EZXBlbmRlbmNpZXMpO2lmKHJ1bkRlcGVuZGVuY2llcz09MCl7aWYocnVuRGVwZW5kZW5jeVdhdGNoZXIhPT1udWxsKXtjbGVhckludGVydmFsKHJ1bkRlcGVuZGVuY3lXYXRjaGVyKTtydW5EZXBlbmRlbmN5V2F0Y2hlcj1udWxsfWlmKGRlcGVuZGVuY2llc0Z1bGZpbGxlZCl7dmFyIGNhbGxiYWNrPWRlcGVuZGVuY2llc0Z1bGZpbGxlZDtkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtjYWxsYmFjaygpfX19ZnVuY3Rpb24gYWJvcnQod2hhdCl7TW9kdWxlW1wib25BYm9ydFwiXT8uKHdoYXQpO3doYXQ9XCJBYm9ydGVkKFwiK3doYXQrXCIpXCI7ZXJyKHdoYXQpO0FCT1JUPXRydWU7d2hhdCs9XCIuIEJ1aWxkIHdpdGggLXNBU1NFUlRJT05TIGZvciBtb3JlIGluZm8uXCI7aWYocnVudGltZUluaXRpYWxpemVkKXtfX190cmFwKCl9dmFyIGU9bmV3IFdlYkFzc2VtYmx5LlJ1bnRpbWVFcnJvcih3aGF0KTtyZWFkeVByb21pc2VSZWplY3QoZSk7dGhyb3cgZX12YXIgZGF0YVVSSVByZWZpeD1cImRhdGE6YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtO2Jhc2U2NCxcIjt2YXIgaXNEYXRhVVJJPWZpbGVuYW1lPT5maWxlbmFtZS5zdGFydHNXaXRoKGRhdGFVUklQcmVmaXgpO3ZhciBpc0ZpbGVVUkk9ZmlsZW5hbWU9PmZpbGVuYW1lLnN0YXJ0c1dpdGgoXCJmaWxlOi8vXCIpO2Z1bmN0aW9uIGZpbmRXYXNtQmluYXJ5KCl7dmFyIGY9XCJvY2N0LWltcG9ydC1qcy53YXNtXCI7aWYoIWlzRGF0YVVSSShmKSl7cmV0dXJuIGxvY2F0ZUZpbGUoZil9cmV0dXJuIGZ9dmFyIHdhc21CaW5hcnlGaWxlO2Z1bmN0aW9uIGdldEJpbmFyeVN5bmMoZmlsZSl7aWYoZmlsZT09d2FzbUJpbmFyeUZpbGUmJndhc21CaW5hcnkpe3JldHVybiBuZXcgVWludDhBcnJheSh3YXNtQmluYXJ5KX1pZihyZWFkQmluYXJ5KXtyZXR1cm4gcmVhZEJpbmFyeShmaWxlKX10aHJvd1wiYm90aCBhc3luYyBhbmQgc3luYyBmZXRjaGluZyBvZiB0aGUgd2FzbSBmYWlsZWRcIn1mdW5jdGlvbiBnZXRCaW5hcnlQcm9taXNlKGJpbmFyeUZpbGUpe2lmKCF3YXNtQmluYXJ5KXtyZXR1cm4gcmVhZEFzeW5jKGJpbmFyeUZpbGUpLnRoZW4ocmVzcG9uc2U9Pm5ldyBVaW50OEFycmF5KHJlc3BvbnNlKSwoKT0+Z2V0QmluYXJ5U3luYyhiaW5hcnlGaWxlKSl9cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PmdldEJpbmFyeVN5bmMoYmluYXJ5RmlsZSkpfWZ1bmN0aW9uIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIoYmluYXJ5RmlsZSxpbXBvcnRzLHJlY2VpdmVyKXtyZXR1cm4gZ2V0QmluYXJ5UHJvbWlzZShiaW5hcnlGaWxlKS50aGVuKGJpbmFyeT0+V2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYmluYXJ5LGltcG9ydHMpKS50aGVuKHJlY2VpdmVyLHJlYXNvbj0+e2VycihgZmFpbGVkIHRvIGFzeW5jaHJvbm91c2x5IHByZXBhcmUgd2FzbTogJHtyZWFzb259YCk7YWJvcnQocmVhc29uKX0pfWZ1bmN0aW9uIGluc3RhbnRpYXRlQXN5bmMoYmluYXJ5LGJpbmFyeUZpbGUsaW1wb3J0cyxjYWxsYmFjayl7aWYoIWJpbmFyeSYmdHlwZW9mIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nPT1cImZ1bmN0aW9uXCImJiFpc0RhdGFVUkkoYmluYXJ5RmlsZSkmJiFpc0ZpbGVVUkkoYmluYXJ5RmlsZSkmJiFFTlZJUk9OTUVOVF9JU19OT0RFJiZ0eXBlb2YgZmV0Y2g9PVwiZnVuY3Rpb25cIil7cmV0dXJuIGZldGNoKGJpbmFyeUZpbGUse2NyZWRlbnRpYWxzOlwic2FtZS1vcmlnaW5cIn0pLnRoZW4ocmVzcG9uc2U9Pnt2YXIgcmVzdWx0PVdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKHJlc3BvbnNlLGltcG9ydHMpO3JldHVybiByZXN1bHQudGhlbihjYWxsYmFjayxmdW5jdGlvbihyZWFzb24pe2Vycihgd2FzbSBzdHJlYW1pbmcgY29tcGlsZSBmYWlsZWQ6ICR7cmVhc29ufWApO2VycihcImZhbGxpbmcgYmFjayB0byBBcnJheUJ1ZmZlciBpbnN0YW50aWF0aW9uXCIpO3JldHVybiBpbnN0YW50aWF0ZUFycmF5QnVmZmVyKGJpbmFyeUZpbGUsaW1wb3J0cyxjYWxsYmFjayl9KX0pfXJldHVybiBpbnN0YW50aWF0ZUFycmF5QnVmZmVyKGJpbmFyeUZpbGUsaW1wb3J0cyxjYWxsYmFjayl9ZnVuY3Rpb24gZ2V0V2FzbUltcG9ydHMoKXtyZXR1cm57YTp3YXNtSW1wb3J0c319ZnVuY3Rpb24gY3JlYXRlV2FzbSgpe3ZhciBpbmZvPWdldFdhc21JbXBvcnRzKCk7ZnVuY3Rpb24gcmVjZWl2ZUluc3RhbmNlKGluc3RhbmNlLG1vZHVsZSl7d2FzbUV4cG9ydHM9aW5zdGFuY2UuZXhwb3J0czt3YXNtTWVtb3J5PXdhc21FeHBvcnRzW1wiX1wiXTt1cGRhdGVNZW1vcnlWaWV3cygpO3dhc21UYWJsZT13YXNtRXhwb3J0c1tcImJhXCJdO2FkZE9uSW5pdCh3YXNtRXhwb3J0c1tcIiRcIl0pO3JlbW92ZVJ1bkRlcGVuZGVuY3koXCJ3YXNtLWluc3RhbnRpYXRlXCIpO3JldHVybiB3YXNtRXhwb3J0c31hZGRSdW5EZXBlbmRlbmN5KFwid2FzbS1pbnN0YW50aWF0ZVwiKTtmdW5jdGlvbiByZWNlaXZlSW5zdGFudGlhdGlvblJlc3VsdChyZXN1bHQpe3JlY2VpdmVJbnN0YW5jZShyZXN1bHRbXCJpbnN0YW5jZVwiXSl9aWYoTW9kdWxlW1wiaW5zdGFudGlhdGVXYXNtXCJdKXt0cnl7cmV0dXJuIE1vZHVsZVtcImluc3RhbnRpYXRlV2FzbVwiXShpbmZvLHJlY2VpdmVJbnN0YW5jZSl9Y2F0Y2goZSl7ZXJyKGBNb2R1bGUuaW5zdGFudGlhdGVXYXNtIGNhbGxiYWNrIGZhaWxlZCB3aXRoIGVycm9yOiAke2V9YCk7cmVhZHlQcm9taXNlUmVqZWN0KGUpfX13YXNtQmluYXJ5RmlsZT8/PWZpbmRXYXNtQmluYXJ5KCk7aW5zdGFudGlhdGVBc3luYyh3YXNtQmluYXJ5LHdhc21CaW5hcnlGaWxlLGluZm8scmVjZWl2ZUluc3RhbnRpYXRpb25SZXN1bHQpLmNhdGNoKHJlYWR5UHJvbWlzZVJlamVjdCk7cmV0dXJue319dmFyIHRlbXBEb3VibGU7dmFyIHRlbXBJNjQ7ZnVuY3Rpb24gRXhpdFN0YXR1cyhzdGF0dXMpe3RoaXMubmFtZT1cIkV4aXRTdGF0dXNcIjt0aGlzLm1lc3NhZ2U9YFByb2dyYW0gdGVybWluYXRlZCB3aXRoIGV4aXQoJHtzdGF0dXN9KWA7dGhpcy5zdGF0dXM9c3RhdHVzfXZhciBjYWxsUnVudGltZUNhbGxiYWNrcz1jYWxsYmFja3M9PntjYWxsYmFja3MuZm9yRWFjaChmPT5mKE1vZHVsZSkpfTt2YXIgbm9FeGl0UnVudGltZT1Nb2R1bGVbXCJub0V4aXRSdW50aW1lXCJdfHx0cnVlO3ZhciBQQVRIPXtpc0FiczpwYXRoPT5wYXRoLmNoYXJBdCgwKT09PVwiL1wiLHNwbGl0UGF0aDpmaWxlbmFtZT0+e3ZhciBzcGxpdFBhdGhSZT0vXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztyZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSl9LG5vcm1hbGl6ZUFycmF5OihwYXJ0cyxhbGxvd0Fib3ZlUm9vdCk9Pnt2YXIgdXA9MDtmb3IodmFyIGk9cGFydHMubGVuZ3RoLTE7aT49MDtpLS0pe3ZhciBsYXN0PXBhcnRzW2ldO2lmKGxhc3Q9PT1cIi5cIil7cGFydHMuc3BsaWNlKGksMSl9ZWxzZSBpZihsYXN0PT09XCIuLlwiKXtwYXJ0cy5zcGxpY2UoaSwxKTt1cCsrfWVsc2UgaWYodXApe3BhcnRzLnNwbGljZShpLDEpO3VwLS19fWlmKGFsbG93QWJvdmVSb290KXtmb3IoO3VwO3VwLS0pe3BhcnRzLnVuc2hpZnQoXCIuLlwiKX19cmV0dXJuIHBhcnRzfSxub3JtYWxpemU6cGF0aD0+e3ZhciBpc0Fic29sdXRlPVBBVEguaXNBYnMocGF0aCksdHJhaWxpbmdTbGFzaD1wYXRoLnN1YnN0cigtMSk9PT1cIi9cIjtwYXRoPVBBVEgubm9ybWFsaXplQXJyYXkocGF0aC5zcGxpdChcIi9cIikuZmlsdGVyKHA9PiEhcCksIWlzQWJzb2x1dGUpLmpvaW4oXCIvXCIpO2lmKCFwYXRoJiYhaXNBYnNvbHV0ZSl7cGF0aD1cIi5cIn1pZihwYXRoJiZ0cmFpbGluZ1NsYXNoKXtwYXRoKz1cIi9cIn1yZXR1cm4oaXNBYnNvbHV0ZT9cIi9cIjpcIlwiKStwYXRofSxkaXJuYW1lOnBhdGg9Pnt2YXIgcmVzdWx0PVBBVEguc3BsaXRQYXRoKHBhdGgpLHJvb3Q9cmVzdWx0WzBdLGRpcj1yZXN1bHRbMV07aWYoIXJvb3QmJiFkaXIpe3JldHVyblwiLlwifWlmKGRpcil7ZGlyPWRpci5zdWJzdHIoMCxkaXIubGVuZ3RoLTEpfXJldHVybiByb290K2Rpcn0sYmFzZW5hbWU6cGF0aD0+e2lmKHBhdGg9PT1cIi9cIilyZXR1cm5cIi9cIjtwYXRoPVBBVEgubm9ybWFsaXplKHBhdGgpO3BhdGg9cGF0aC5yZXBsYWNlKC9cXC8kLyxcIlwiKTt2YXIgbGFzdFNsYXNoPXBhdGgubGFzdEluZGV4T2YoXCIvXCIpO2lmKGxhc3RTbGFzaD09PS0xKXJldHVybiBwYXRoO3JldHVybiBwYXRoLnN1YnN0cihsYXN0U2xhc2grMSl9LGpvaW46KC4uLnBhdGhzKT0+UEFUSC5ub3JtYWxpemUocGF0aHMuam9pbihcIi9cIikpLGpvaW4yOihsLHIpPT5QQVRILm5vcm1hbGl6ZShsK1wiL1wiK3IpfTt2YXIgaW5pdFJhbmRvbUZpbGw9KCk9PntpZih0eXBlb2YgY3J5cHRvPT1cIm9iamVjdFwiJiZ0eXBlb2YgY3J5cHRvW1wiZ2V0UmFuZG9tVmFsdWVzXCJdPT1cImZ1bmN0aW9uXCIpe3JldHVybiB2aWV3PT5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHZpZXcpfWVsc2UgaWYoRU5WSVJPTk1FTlRfSVNfTk9ERSl7dHJ5e3ZhciBjcnlwdG9fbW9kdWxlPXJlcXVpcmUoXCJjcnlwdG9cIik7dmFyIHJhbmRvbUZpbGxTeW5jPWNyeXB0b19tb2R1bGVbXCJyYW5kb21GaWxsU3luY1wiXTtpZihyYW5kb21GaWxsU3luYyl7cmV0dXJuIHZpZXc9PmNyeXB0b19tb2R1bGVbXCJyYW5kb21GaWxsU3luY1wiXSh2aWV3KX12YXIgcmFuZG9tQnl0ZXM9Y3J5cHRvX21vZHVsZVtcInJhbmRvbUJ5dGVzXCJdO3JldHVybiB2aWV3PT4odmlldy5zZXQocmFuZG9tQnl0ZXModmlldy5ieXRlTGVuZ3RoKSksdmlldyl9Y2F0Y2goZSl7fX1hYm9ydChcImluaXRSYW5kb21EZXZpY2VcIil9O3ZhciByYW5kb21GaWxsPXZpZXc9PihyYW5kb21GaWxsPWluaXRSYW5kb21GaWxsKCkpKHZpZXcpO3ZhciBQQVRIX0ZTPXtyZXNvbHZlOiguLi5hcmdzKT0+e3ZhciByZXNvbHZlZFBhdGg9XCJcIixyZXNvbHZlZEFic29sdXRlPWZhbHNlO2Zvcih2YXIgaT1hcmdzLmxlbmd0aC0xO2k+PS0xJiYhcmVzb2x2ZWRBYnNvbHV0ZTtpLS0pe3ZhciBwYXRoPWk+PTA/YXJnc1tpXTpGUy5jd2QoKTtpZih0eXBlb2YgcGF0aCE9XCJzdHJpbmdcIil7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzXCIpfWVsc2UgaWYoIXBhdGgpe3JldHVyblwiXCJ9cmVzb2x2ZWRQYXRoPXBhdGgrXCIvXCIrcmVzb2x2ZWRQYXRoO3Jlc29sdmVkQWJzb2x1dGU9UEFUSC5pc0FicyhwYXRoKX1yZXNvbHZlZFBhdGg9UEFUSC5ub3JtYWxpemVBcnJheShyZXNvbHZlZFBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwPT4hIXApLCFyZXNvbHZlZEFic29sdXRlKS5qb2luKFwiL1wiKTtyZXR1cm4ocmVzb2x2ZWRBYnNvbHV0ZT9cIi9cIjpcIlwiKStyZXNvbHZlZFBhdGh8fFwiLlwifSxyZWxhdGl2ZTooZnJvbSx0byk9Pntmcm9tPVBBVEhfRlMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7dG89UEFUSF9GUy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7ZnVuY3Rpb24gdHJpbShhcnIpe3ZhciBzdGFydD0wO2Zvcig7c3RhcnQ8YXJyLmxlbmd0aDtzdGFydCsrKXtpZihhcnJbc3RhcnRdIT09XCJcIilicmVha312YXIgZW5kPWFyci5sZW5ndGgtMTtmb3IoO2VuZD49MDtlbmQtLSl7aWYoYXJyW2VuZF0hPT1cIlwiKWJyZWFrfWlmKHN0YXJ0PmVuZClyZXR1cm5bXTtyZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LGVuZC1zdGFydCsxKX12YXIgZnJvbVBhcnRzPXRyaW0oZnJvbS5zcGxpdChcIi9cIikpO3ZhciB0b1BhcnRzPXRyaW0odG8uc3BsaXQoXCIvXCIpKTt2YXIgbGVuZ3RoPU1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsdG9QYXJ0cy5sZW5ndGgpO3ZhciBzYW1lUGFydHNMZW5ndGg9bGVuZ3RoO2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krKyl7aWYoZnJvbVBhcnRzW2ldIT09dG9QYXJ0c1tpXSl7c2FtZVBhcnRzTGVuZ3RoPWk7YnJlYWt9fXZhciBvdXRwdXRQYXJ0cz1bXTtmb3IodmFyIGk9c2FtZVBhcnRzTGVuZ3RoO2k8ZnJvbVBhcnRzLmxlbmd0aDtpKyspe291dHB1dFBhcnRzLnB1c2goXCIuLlwiKX1vdXRwdXRQYXJ0cz1vdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtyZXR1cm4gb3V0cHV0UGFydHMuam9pbihcIi9cIil9fTt2YXIgVVRGOERlY29kZXI9dHlwZW9mIFRleHREZWNvZGVyIT1cInVuZGVmaW5lZFwiP25ldyBUZXh0RGVjb2Rlcjp1bmRlZmluZWQ7dmFyIFVURjhBcnJheVRvU3RyaW5nPShoZWFwT3JBcnJheSxpZHg9MCxtYXhCeXRlc1RvUmVhZD1OYU4pPT57dmFyIGVuZElkeD1pZHgrbWF4Qnl0ZXNUb1JlYWQ7dmFyIGVuZFB0cj1pZHg7d2hpbGUoaGVhcE9yQXJyYXlbZW5kUHRyXSYmIShlbmRQdHI+PWVuZElkeCkpKytlbmRQdHI7aWYoZW5kUHRyLWlkeD4xNiYmaGVhcE9yQXJyYXkuYnVmZmVyJiZVVEY4RGVjb2Rlcil7cmV0dXJuIFVURjhEZWNvZGVyLmRlY29kZShoZWFwT3JBcnJheS5zdWJhcnJheShpZHgsZW5kUHRyKSl9dmFyIHN0cj1cIlwiO3doaWxlKGlkeDxlbmRQdHIpe3ZhciB1MD1oZWFwT3JBcnJheVtpZHgrK107aWYoISh1MCYxMjgpKXtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUodTApO2NvbnRpbnVlfXZhciB1MT1oZWFwT3JBcnJheVtpZHgrK10mNjM7aWYoKHUwJjIyNCk9PTE5Mil7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKCh1MCYzMSk8PDZ8dTEpO2NvbnRpbnVlfXZhciB1Mj1oZWFwT3JBcnJheVtpZHgrK10mNjM7aWYoKHUwJjI0MCk9PTIyNCl7dTA9KHUwJjE1KTw8MTJ8dTE8PDZ8dTJ9ZWxzZXt1MD0odTAmNyk8PDE4fHUxPDwxMnx1Mjw8NnxoZWFwT3JBcnJheVtpZHgrK10mNjN9aWYodTA8NjU1MzYpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSh1MCl9ZWxzZXt2YXIgY2g9dTAtNjU1MzY7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fGNoPj4xMCw1NjMyMHxjaCYxMDIzKX19cmV0dXJuIHN0cn07dmFyIEZTX3N0ZGluX2dldENoYXJfYnVmZmVyPVtdO3ZhciBsZW5ndGhCeXRlc1VURjg9c3RyPT57dmFyIGxlbj0wO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjPXN0ci5jaGFyQ29kZUF0KGkpO2lmKGM8PTEyNyl7bGVuKyt9ZWxzZSBpZihjPD0yMDQ3KXtsZW4rPTJ9ZWxzZSBpZihjPj01NTI5NiYmYzw9NTczNDMpe2xlbis9NDsrK2l9ZWxzZXtsZW4rPTN9fXJldHVybiBsZW59O3ZhciBzdHJpbmdUb1VURjhBcnJheT0oc3RyLGhlYXAsb3V0SWR4LG1heEJ5dGVzVG9Xcml0ZSk9PntpZighKG1heEJ5dGVzVG9Xcml0ZT4wKSlyZXR1cm4gMDt2YXIgc3RhcnRJZHg9b3V0SWR4O3ZhciBlbmRJZHg9b3V0SWR4K21heEJ5dGVzVG9Xcml0ZS0xO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciB1PXN0ci5jaGFyQ29kZUF0KGkpO2lmKHU+PTU1Mjk2JiZ1PD01NzM0Myl7dmFyIHUxPXN0ci5jaGFyQ29kZUF0KCsraSk7dT02NTUzNisoKHUmMTAyMyk8PDEwKXx1MSYxMDIzfWlmKHU8PTEyNyl7aWYob3V0SWR4Pj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109dX1lbHNlIGlmKHU8PTIwNDcpe2lmKG91dElkeCsxPj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109MTkyfHU+PjY7aGVhcFtvdXRJZHgrK109MTI4fHUmNjN9ZWxzZSBpZih1PD02NTUzNSl7aWYob3V0SWR4KzI+PWVuZElkeClicmVhaztoZWFwW291dElkeCsrXT0yMjR8dT4+MTI7aGVhcFtvdXRJZHgrK109MTI4fHU+PjYmNjM7aGVhcFtvdXRJZHgrK109MTI4fHUmNjN9ZWxzZXtpZihvdXRJZHgrMz49ZW5kSWR4KWJyZWFrO2hlYXBbb3V0SWR4KytdPTI0MHx1Pj4xODtoZWFwW291dElkeCsrXT0xMjh8dT4+MTImNjM7aGVhcFtvdXRJZHgrK109MTI4fHU+PjYmNjM7aGVhcFtvdXRJZHgrK109MTI4fHUmNjN9fWhlYXBbb3V0SWR4XT0wO3JldHVybiBvdXRJZHgtc3RhcnRJZHh9O2Z1bmN0aW9uIGludEFycmF5RnJvbVN0cmluZyhzdHJpbmd5LGRvbnRBZGROdWxsLGxlbmd0aCl7dmFyIGxlbj1sZW5ndGg+MD9sZW5ndGg6bGVuZ3RoQnl0ZXNVVEY4KHN0cmluZ3kpKzE7dmFyIHU4YXJyYXk9bmV3IEFycmF5KGxlbik7dmFyIG51bUJ5dGVzV3JpdHRlbj1zdHJpbmdUb1VURjhBcnJheShzdHJpbmd5LHU4YXJyYXksMCx1OGFycmF5Lmxlbmd0aCk7aWYoZG9udEFkZE51bGwpdThhcnJheS5sZW5ndGg9bnVtQnl0ZXNXcml0dGVuO3JldHVybiB1OGFycmF5fXZhciBGU19zdGRpbl9nZXRDaGFyPSgpPT57aWYoIUZTX3N0ZGluX2dldENoYXJfYnVmZmVyLmxlbmd0aCl7dmFyIHJlc3VsdD1udWxsO2lmKEVOVklST05NRU5UX0lTX05PREUpe3ZhciBCVUZTSVpFPTI1Njt2YXIgYnVmPUJ1ZmZlci5hbGxvYyhCVUZTSVpFKTt2YXIgYnl0ZXNSZWFkPTA7dmFyIGZkPXByb2Nlc3Muc3RkaW4uZmQ7dHJ5e2J5dGVzUmVhZD1mcy5yZWFkU3luYyhmZCxidWYsMCxCVUZTSVpFKX1jYXRjaChlKXtpZihlLnRvU3RyaW5nKCkuaW5jbHVkZXMoXCJFT0ZcIikpYnl0ZXNSZWFkPTA7ZWxzZSB0aHJvdyBlfWlmKGJ5dGVzUmVhZD4wKXtyZXN1bHQ9YnVmLnNsaWNlKDAsYnl0ZXNSZWFkKS50b1N0cmluZyhcInV0Zi04XCIpfX1lbHNlIGlmKHR5cGVvZiB3aW5kb3chPVwidW5kZWZpbmVkXCImJnR5cGVvZiB3aW5kb3cucHJvbXB0PT1cImZ1bmN0aW9uXCIpe3Jlc3VsdD13aW5kb3cucHJvbXB0KFwiSW5wdXQ6IFwiKTtpZihyZXN1bHQhPT1udWxsKXtyZXN1bHQrPVwiXFxuXCJ9fWVsc2V7fWlmKCFyZXN1bHQpe3JldHVybiBudWxsfUZTX3N0ZGluX2dldENoYXJfYnVmZmVyPWludEFycmF5RnJvbVN0cmluZyhyZXN1bHQsdHJ1ZSl9cmV0dXJuIEZTX3N0ZGluX2dldENoYXJfYnVmZmVyLnNoaWZ0KCl9O3ZhciBUVFk9e3R0eXM6W10saW5pdCgpe30sc2h1dGRvd24oKXt9LHJlZ2lzdGVyKGRldixvcHMpe1RUWS50dHlzW2Rldl09e2lucHV0OltdLG91dHB1dDpbXSxvcHN9O0ZTLnJlZ2lzdGVyRGV2aWNlKGRldixUVFkuc3RyZWFtX29wcyl9LHN0cmVhbV9vcHM6e29wZW4oc3RyZWFtKXt2YXIgdHR5PVRUWS50dHlzW3N0cmVhbS5ub2RlLnJkZXZdO2lmKCF0dHkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDQzKX1zdHJlYW0udHR5PXR0eTtzdHJlYW0uc2Vla2FibGU9ZmFsc2V9LGNsb3NlKHN0cmVhbSl7c3RyZWFtLnR0eS5vcHMuZnN5bmMoc3RyZWFtLnR0eSl9LGZzeW5jKHN0cmVhbSl7c3RyZWFtLnR0eS5vcHMuZnN5bmMoc3RyZWFtLnR0eSl9LHJlYWQoc3RyZWFtLGJ1ZmZlcixvZmZzZXQsbGVuZ3RoLHBvcyl7aWYoIXN0cmVhbS50dHl8fCFzdHJlYW0udHR5Lm9wcy5nZXRfY2hhcil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjApfXZhciBieXRlc1JlYWQ9MDtmb3IodmFyIGk9MDtpPGxlbmd0aDtpKyspe3ZhciByZXN1bHQ7dHJ5e3Jlc3VsdD1zdHJlYW0udHR5Lm9wcy5nZXRfY2hhcihzdHJlYW0udHR5KX1jYXRjaChlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOSl9aWYocmVzdWx0PT09dW5kZWZpbmVkJiZieXRlc1JlYWQ9PT0wKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2KX1pZihyZXN1bHQ9PT1udWxsfHxyZXN1bHQ9PT11bmRlZmluZWQpYnJlYWs7Ynl0ZXNSZWFkKys7YnVmZmVyW29mZnNldCtpXT1yZXN1bHR9aWYoYnl0ZXNSZWFkKXtzdHJlYW0ubm9kZS50aW1lc3RhbXA9RGF0ZS5ub3coKX1yZXR1cm4gYnl0ZXNSZWFkfSx3cml0ZShzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zKXtpZighc3RyZWFtLnR0eXx8IXN0cmVhbS50dHkub3BzLnB1dF9jaGFyKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2MCl9dHJ5e2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krKyl7c3RyZWFtLnR0eS5vcHMucHV0X2NoYXIoc3RyZWFtLnR0eSxidWZmZXJbb2Zmc2V0K2ldKX19Y2F0Y2goZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjkpfWlmKGxlbmd0aCl7c3RyZWFtLm5vZGUudGltZXN0YW1wPURhdGUubm93KCl9cmV0dXJuIGl9fSxkZWZhdWx0X3R0eV9vcHM6e2dldF9jaGFyKHR0eSl7cmV0dXJuIEZTX3N0ZGluX2dldENoYXIoKX0scHV0X2NoYXIodHR5LHZhbCl7aWYodmFsPT09bnVsbHx8dmFsPT09MTApe291dChVVEY4QXJyYXlUb1N0cmluZyh0dHkub3V0cHV0KSk7dHR5Lm91dHB1dD1bXX1lbHNle2lmKHZhbCE9MCl0dHkub3V0cHV0LnB1c2godmFsKX19LGZzeW5jKHR0eSl7aWYodHR5Lm91dHB1dCYmdHR5Lm91dHB1dC5sZW5ndGg+MCl7b3V0KFVURjhBcnJheVRvU3RyaW5nKHR0eS5vdXRwdXQpKTt0dHkub3V0cHV0PVtdfX0saW9jdGxfdGNnZXRzKHR0eSl7cmV0dXJue2NfaWZsYWc6MjU4NTYsY19vZmxhZzo1LGNfY2ZsYWc6MTkxLGNfbGZsYWc6MzUzODcsY19jYzpbMywyOCwxMjcsMjEsNCwwLDEsMCwxNywxOSwyNiwwLDE4LDE1LDIzLDIyLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDBdfX0saW9jdGxfdGNzZXRzKHR0eSxvcHRpb25hbF9hY3Rpb25zLGRhdGEpe3JldHVybiAwfSxpb2N0bF90aW9jZ3dpbnN6KHR0eSl7cmV0dXJuWzI0LDgwXX19LGRlZmF1bHRfdHR5MV9vcHM6e3B1dF9jaGFyKHR0eSx2YWwpe2lmKHZhbD09PW51bGx8fHZhbD09PTEwKXtlcnIoVVRGOEFycmF5VG9TdHJpbmcodHR5Lm91dHB1dCkpO3R0eS5vdXRwdXQ9W119ZWxzZXtpZih2YWwhPTApdHR5Lm91dHB1dC5wdXNoKHZhbCl9fSxmc3luYyh0dHkpe2lmKHR0eS5vdXRwdXQmJnR0eS5vdXRwdXQubGVuZ3RoPjApe2VycihVVEY4QXJyYXlUb1N0cmluZyh0dHkub3V0cHV0KSk7dHR5Lm91dHB1dD1bXX19fX07dmFyIHplcm9NZW1vcnk9KGFkZHJlc3Msc2l6ZSk9PntIRUFQVTguZmlsbCgwLGFkZHJlc3MsYWRkcmVzcytzaXplKX07dmFyIGFsaWduTWVtb3J5PShzaXplLGFsaWdubWVudCk9Pk1hdGguY2VpbChzaXplL2FsaWdubWVudCkqYWxpZ25tZW50O3ZhciBtbWFwQWxsb2M9c2l6ZT0+e3NpemU9YWxpZ25NZW1vcnkoc2l6ZSw2NTUzNik7dmFyIHB0cj1fZW1zY3JpcHRlbl9idWlsdGluX21lbWFsaWduKDY1NTM2LHNpemUpO2lmKHB0cil6ZXJvTWVtb3J5KHB0cixzaXplKTtyZXR1cm4gcHRyfTt2YXIgTUVNRlM9e29wc190YWJsZTpudWxsLG1vdW50KG1vdW50KXtyZXR1cm4gTUVNRlMuY3JlYXRlTm9kZShudWxsLFwiL1wiLDE2Mzg0fDUxMSwwKX0sY3JlYXRlTm9kZShwYXJlbnQsbmFtZSxtb2RlLGRldil7aWYoRlMuaXNCbGtkZXYobW9kZSl8fEZTLmlzRklGTyhtb2RlKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpfU1FTUZTLm9wc190YWJsZXx8PXtkaXI6e25vZGU6e2dldGF0dHI6TUVNRlMubm9kZV9vcHMuZ2V0YXR0cixzZXRhdHRyOk1FTUZTLm5vZGVfb3BzLnNldGF0dHIsbG9va3VwOk1FTUZTLm5vZGVfb3BzLmxvb2t1cCxta25vZDpNRU1GUy5ub2RlX29wcy5ta25vZCxyZW5hbWU6TUVNRlMubm9kZV9vcHMucmVuYW1lLHVubGluazpNRU1GUy5ub2RlX29wcy51bmxpbmsscm1kaXI6TUVNRlMubm9kZV9vcHMucm1kaXIscmVhZGRpcjpNRU1GUy5ub2RlX29wcy5yZWFkZGlyLHN5bWxpbms6TUVNRlMubm9kZV9vcHMuc3ltbGlua30sc3RyZWFtOntsbHNlZWs6TUVNRlMuc3RyZWFtX29wcy5sbHNlZWt9fSxmaWxlOntub2RlOntnZXRhdHRyOk1FTUZTLm5vZGVfb3BzLmdldGF0dHIsc2V0YXR0cjpNRU1GUy5ub2RlX29wcy5zZXRhdHRyfSxzdHJlYW06e2xsc2VlazpNRU1GUy5zdHJlYW1fb3BzLmxsc2VlayxyZWFkOk1FTUZTLnN0cmVhbV9vcHMucmVhZCx3cml0ZTpNRU1GUy5zdHJlYW1fb3BzLndyaXRlLGFsbG9jYXRlOk1FTUZTLnN0cmVhbV9vcHMuYWxsb2NhdGUsbW1hcDpNRU1GUy5zdHJlYW1fb3BzLm1tYXAsbXN5bmM6TUVNRlMuc3RyZWFtX29wcy5tc3luY319LGxpbms6e25vZGU6e2dldGF0dHI6TUVNRlMubm9kZV9vcHMuZ2V0YXR0cixzZXRhdHRyOk1FTUZTLm5vZGVfb3BzLnNldGF0dHIscmVhZGxpbms6TUVNRlMubm9kZV9vcHMucmVhZGxpbmt9LHN0cmVhbTp7fX0sY2hyZGV2Ontub2RlOntnZXRhdHRyOk1FTUZTLm5vZGVfb3BzLmdldGF0dHIsc2V0YXR0cjpNRU1GUy5ub2RlX29wcy5zZXRhdHRyfSxzdHJlYW06RlMuY2hyZGV2X3N0cmVhbV9vcHN9fTt2YXIgbm9kZT1GUy5jcmVhdGVOb2RlKHBhcmVudCxuYW1lLG1vZGUsZGV2KTtpZihGUy5pc0Rpcihub2RlLm1vZGUpKXtub2RlLm5vZGVfb3BzPU1FTUZTLm9wc190YWJsZS5kaXIubm9kZTtub2RlLnN0cmVhbV9vcHM9TUVNRlMub3BzX3RhYmxlLmRpci5zdHJlYW07bm9kZS5jb250ZW50cz17fX1lbHNlIGlmKEZTLmlzRmlsZShub2RlLm1vZGUpKXtub2RlLm5vZGVfb3BzPU1FTUZTLm9wc190YWJsZS5maWxlLm5vZGU7bm9kZS5zdHJlYW1fb3BzPU1FTUZTLm9wc190YWJsZS5maWxlLnN0cmVhbTtub2RlLnVzZWRCeXRlcz0wO25vZGUuY29udGVudHM9bnVsbH1lbHNlIGlmKEZTLmlzTGluayhub2RlLm1vZGUpKXtub2RlLm5vZGVfb3BzPU1FTUZTLm9wc190YWJsZS5saW5rLm5vZGU7bm9kZS5zdHJlYW1fb3BzPU1FTUZTLm9wc190YWJsZS5saW5rLnN0cmVhbX1lbHNlIGlmKEZTLmlzQ2hyZGV2KG5vZGUubW9kZSkpe25vZGUubm9kZV9vcHM9TUVNRlMub3BzX3RhYmxlLmNocmRldi5ub2RlO25vZGUuc3RyZWFtX29wcz1NRU1GUy5vcHNfdGFibGUuY2hyZGV2LnN0cmVhbX1ub2RlLnRpbWVzdGFtcD1EYXRlLm5vdygpO2lmKHBhcmVudCl7cGFyZW50LmNvbnRlbnRzW25hbWVdPW5vZGU7cGFyZW50LnRpbWVzdGFtcD1ub2RlLnRpbWVzdGFtcH1yZXR1cm4gbm9kZX0sZ2V0RmlsZURhdGFBc1R5cGVkQXJyYXkobm9kZSl7aWYoIW5vZGUuY29udGVudHMpcmV0dXJuIG5ldyBVaW50OEFycmF5KDApO2lmKG5vZGUuY29udGVudHMuc3ViYXJyYXkpcmV0dXJuIG5vZGUuY29udGVudHMuc3ViYXJyYXkoMCxub2RlLnVzZWRCeXRlcyk7cmV0dXJuIG5ldyBVaW50OEFycmF5KG5vZGUuY29udGVudHMpfSxleHBhbmRGaWxlU3RvcmFnZShub2RlLG5ld0NhcGFjaXR5KXt2YXIgcHJldkNhcGFjaXR5PW5vZGUuY29udGVudHM/bm9kZS5jb250ZW50cy5sZW5ndGg6MDtpZihwcmV2Q2FwYWNpdHk+PW5ld0NhcGFjaXR5KXJldHVybjt2YXIgQ0FQQUNJVFlfRE9VQkxJTkdfTUFYPTEwMjQqMTAyNDtuZXdDYXBhY2l0eT1NYXRoLm1heChuZXdDYXBhY2l0eSxwcmV2Q2FwYWNpdHkqKHByZXZDYXBhY2l0eTxDQVBBQ0lUWV9ET1VCTElOR19NQVg/MjoxLjEyNSk+Pj4wKTtpZihwcmV2Q2FwYWNpdHkhPTApbmV3Q2FwYWNpdHk9TWF0aC5tYXgobmV3Q2FwYWNpdHksMjU2KTt2YXIgb2xkQ29udGVudHM9bm9kZS5jb250ZW50cztub2RlLmNvbnRlbnRzPW5ldyBVaW50OEFycmF5KG5ld0NhcGFjaXR5KTtpZihub2RlLnVzZWRCeXRlcz4wKW5vZGUuY29udGVudHMuc2V0KG9sZENvbnRlbnRzLnN1YmFycmF5KDAsbm9kZS51c2VkQnl0ZXMpLDApfSxyZXNpemVGaWxlU3RvcmFnZShub2RlLG5ld1NpemUpe2lmKG5vZGUudXNlZEJ5dGVzPT1uZXdTaXplKXJldHVybjtpZihuZXdTaXplPT0wKXtub2RlLmNvbnRlbnRzPW51bGw7bm9kZS51c2VkQnl0ZXM9MH1lbHNle3ZhciBvbGRDb250ZW50cz1ub2RlLmNvbnRlbnRzO25vZGUuY29udGVudHM9bmV3IFVpbnQ4QXJyYXkobmV3U2l6ZSk7aWYob2xkQ29udGVudHMpe25vZGUuY29udGVudHMuc2V0KG9sZENvbnRlbnRzLnN1YmFycmF5KDAsTWF0aC5taW4obmV3U2l6ZSxub2RlLnVzZWRCeXRlcykpKX1ub2RlLnVzZWRCeXRlcz1uZXdTaXplfX0sbm9kZV9vcHM6e2dldGF0dHIobm9kZSl7dmFyIGF0dHI9e307YXR0ci5kZXY9RlMuaXNDaHJkZXYobm9kZS5tb2RlKT9ub2RlLmlkOjE7YXR0ci5pbm89bm9kZS5pZDthdHRyLm1vZGU9bm9kZS5tb2RlO2F0dHIubmxpbms9MTthdHRyLnVpZD0wO2F0dHIuZ2lkPTA7YXR0ci5yZGV2PW5vZGUucmRldjtpZihGUy5pc0Rpcihub2RlLm1vZGUpKXthdHRyLnNpemU9NDA5Nn1lbHNlIGlmKEZTLmlzRmlsZShub2RlLm1vZGUpKXthdHRyLnNpemU9bm9kZS51c2VkQnl0ZXN9ZWxzZSBpZihGUy5pc0xpbmsobm9kZS5tb2RlKSl7YXR0ci5zaXplPW5vZGUubGluay5sZW5ndGh9ZWxzZXthdHRyLnNpemU9MH1hdHRyLmF0aW1lPW5ldyBEYXRlKG5vZGUudGltZXN0YW1wKTthdHRyLm10aW1lPW5ldyBEYXRlKG5vZGUudGltZXN0YW1wKTthdHRyLmN0aW1lPW5ldyBEYXRlKG5vZGUudGltZXN0YW1wKTthdHRyLmJsa3NpemU9NDA5NjthdHRyLmJsb2Nrcz1NYXRoLmNlaWwoYXR0ci5zaXplL2F0dHIuYmxrc2l6ZSk7cmV0dXJuIGF0dHJ9LHNldGF0dHIobm9kZSxhdHRyKXtpZihhdHRyLm1vZGUhPT11bmRlZmluZWQpe25vZGUubW9kZT1hdHRyLm1vZGV9aWYoYXR0ci50aW1lc3RhbXAhPT11bmRlZmluZWQpe25vZGUudGltZXN0YW1wPWF0dHIudGltZXN0YW1wfWlmKGF0dHIuc2l6ZSE9PXVuZGVmaW5lZCl7TUVNRlMucmVzaXplRmlsZVN0b3JhZ2Uobm9kZSxhdHRyLnNpemUpfX0sbG9va3VwKHBhcmVudCxuYW1lKXt0aHJvdyBGUy5nZW5lcmljRXJyb3JzWzQ0XX0sbWtub2QocGFyZW50LG5hbWUsbW9kZSxkZXYpe3JldHVybiBNRU1GUy5jcmVhdGVOb2RlKHBhcmVudCxuYW1lLG1vZGUsZGV2KX0scmVuYW1lKG9sZF9ub2RlLG5ld19kaXIsbmV3X25hbWUpe2lmKEZTLmlzRGlyKG9sZF9ub2RlLm1vZGUpKXt2YXIgbmV3X25vZGU7dHJ5e25ld19ub2RlPUZTLmxvb2t1cE5vZGUobmV3X2RpcixuZXdfbmFtZSl9Y2F0Y2goZSl7fWlmKG5ld19ub2RlKXtmb3IodmFyIGkgaW4gbmV3X25vZGUuY29udGVudHMpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDU1KX19fWRlbGV0ZSBvbGRfbm9kZS5wYXJlbnQuY29udGVudHNbb2xkX25vZGUubmFtZV07b2xkX25vZGUucGFyZW50LnRpbWVzdGFtcD1EYXRlLm5vdygpO29sZF9ub2RlLm5hbWU9bmV3X25hbWU7bmV3X2Rpci5jb250ZW50c1tuZXdfbmFtZV09b2xkX25vZGU7bmV3X2Rpci50aW1lc3RhbXA9b2xkX25vZGUucGFyZW50LnRpbWVzdGFtcH0sdW5saW5rKHBhcmVudCxuYW1lKXtkZWxldGUgcGFyZW50LmNvbnRlbnRzW25hbWVdO3BhcmVudC50aW1lc3RhbXA9RGF0ZS5ub3coKX0scm1kaXIocGFyZW50LG5hbWUpe3ZhciBub2RlPUZTLmxvb2t1cE5vZGUocGFyZW50LG5hbWUpO2Zvcih2YXIgaSBpbiBub2RlLmNvbnRlbnRzKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NSl9ZGVsZXRlIHBhcmVudC5jb250ZW50c1tuYW1lXTtwYXJlbnQudGltZXN0YW1wPURhdGUubm93KCl9LHJlYWRkaXIobm9kZSl7dmFyIGVudHJpZXM9W1wiLlwiLFwiLi5cIl07Zm9yKHZhciBrZXkgb2YgT2JqZWN0LmtleXMobm9kZS5jb250ZW50cykpe2VudHJpZXMucHVzaChrZXkpfXJldHVybiBlbnRyaWVzfSxzeW1saW5rKHBhcmVudCxuZXduYW1lLG9sZHBhdGgpe3ZhciBub2RlPU1FTUZTLmNyZWF0ZU5vZGUocGFyZW50LG5ld25hbWUsNTExfDQwOTYwLDApO25vZGUubGluaz1vbGRwYXRoO3JldHVybiBub2RlfSxyZWFkbGluayhub2RlKXtpZighRlMuaXNMaW5rKG5vZGUubW9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1yZXR1cm4gbm9kZS5saW5rfX0sc3RyZWFtX29wczp7cmVhZChzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24pe3ZhciBjb250ZW50cz1zdHJlYW0ubm9kZS5jb250ZW50cztpZihwb3NpdGlvbj49c3RyZWFtLm5vZGUudXNlZEJ5dGVzKXJldHVybiAwO3ZhciBzaXplPU1hdGgubWluKHN0cmVhbS5ub2RlLnVzZWRCeXRlcy1wb3NpdGlvbixsZW5ndGgpO2lmKHNpemU+OCYmY29udGVudHMuc3ViYXJyYXkpe2J1ZmZlci5zZXQoY29udGVudHMuc3ViYXJyYXkocG9zaXRpb24scG9zaXRpb24rc2l6ZSksb2Zmc2V0KX1lbHNle2Zvcih2YXIgaT0wO2k8c2l6ZTtpKyspYnVmZmVyW29mZnNldCtpXT1jb250ZW50c1twb3NpdGlvbitpXX1yZXR1cm4gc2l6ZX0sd3JpdGUoc3RyZWFtLGJ1ZmZlcixvZmZzZXQsbGVuZ3RoLHBvc2l0aW9uLGNhbk93bil7aWYoYnVmZmVyLmJ1ZmZlcj09PUhFQVA4LmJ1ZmZlcil7Y2FuT3duPWZhbHNlfWlmKCFsZW5ndGgpcmV0dXJuIDA7dmFyIG5vZGU9c3RyZWFtLm5vZGU7bm9kZS50aW1lc3RhbXA9RGF0ZS5ub3coKTtpZihidWZmZXIuc3ViYXJyYXkmJighbm9kZS5jb250ZW50c3x8bm9kZS5jb250ZW50cy5zdWJhcnJheSkpe2lmKGNhbk93bil7bm9kZS5jb250ZW50cz1idWZmZXIuc3ViYXJyYXkob2Zmc2V0LG9mZnNldCtsZW5ndGgpO25vZGUudXNlZEJ5dGVzPWxlbmd0aDtyZXR1cm4gbGVuZ3RofWVsc2UgaWYobm9kZS51c2VkQnl0ZXM9PT0wJiZwb3NpdGlvbj09PTApe25vZGUuY29udGVudHM9YnVmZmVyLnNsaWNlKG9mZnNldCxvZmZzZXQrbGVuZ3RoKTtub2RlLnVzZWRCeXRlcz1sZW5ndGg7cmV0dXJuIGxlbmd0aH1lbHNlIGlmKHBvc2l0aW9uK2xlbmd0aDw9bm9kZS51c2VkQnl0ZXMpe25vZGUuY29udGVudHMuc2V0KGJ1ZmZlci5zdWJhcnJheShvZmZzZXQsb2Zmc2V0K2xlbmd0aCkscG9zaXRpb24pO3JldHVybiBsZW5ndGh9fU1FTUZTLmV4cGFuZEZpbGVTdG9yYWdlKG5vZGUscG9zaXRpb24rbGVuZ3RoKTtpZihub2RlLmNvbnRlbnRzLnN1YmFycmF5JiZidWZmZXIuc3ViYXJyYXkpe25vZGUuY29udGVudHMuc2V0KGJ1ZmZlci5zdWJhcnJheShvZmZzZXQsb2Zmc2V0K2xlbmd0aCkscG9zaXRpb24pfWVsc2V7Zm9yKHZhciBpPTA7aTxsZW5ndGg7aSsrKXtub2RlLmNvbnRlbnRzW3Bvc2l0aW9uK2ldPWJ1ZmZlcltvZmZzZXQraV19fW5vZGUudXNlZEJ5dGVzPU1hdGgubWF4KG5vZGUudXNlZEJ5dGVzLHBvc2l0aW9uK2xlbmd0aCk7cmV0dXJuIGxlbmd0aH0sbGxzZWVrKHN0cmVhbSxvZmZzZXQsd2hlbmNlKXt2YXIgcG9zaXRpb249b2Zmc2V0O2lmKHdoZW5jZT09PTEpe3Bvc2l0aW9uKz1zdHJlYW0ucG9zaXRpb259ZWxzZSBpZih3aGVuY2U9PT0yKXtpZihGUy5pc0ZpbGUoc3RyZWFtLm5vZGUubW9kZSkpe3Bvc2l0aW9uKz1zdHJlYW0ubm9kZS51c2VkQnl0ZXN9fWlmKHBvc2l0aW9uPDApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1yZXR1cm4gcG9zaXRpb259LGFsbG9jYXRlKHN0cmVhbSxvZmZzZXQsbGVuZ3RoKXtNRU1GUy5leHBhbmRGaWxlU3RvcmFnZShzdHJlYW0ubm9kZSxvZmZzZXQrbGVuZ3RoKTtzdHJlYW0ubm9kZS51c2VkQnl0ZXM9TWF0aC5tYXgoc3RyZWFtLm5vZGUudXNlZEJ5dGVzLG9mZnNldCtsZW5ndGgpfSxtbWFwKHN0cmVhbSxsZW5ndGgscG9zaXRpb24scHJvdCxmbGFncyl7aWYoIUZTLmlzRmlsZShzdHJlYW0ubm9kZS5tb2RlKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDMpfXZhciBwdHI7dmFyIGFsbG9jYXRlZDt2YXIgY29udGVudHM9c3RyZWFtLm5vZGUuY29udGVudHM7aWYoIShmbGFncyYyKSYmY29udGVudHMmJmNvbnRlbnRzLmJ1ZmZlcj09PUhFQVA4LmJ1ZmZlcil7YWxsb2NhdGVkPWZhbHNlO3B0cj1jb250ZW50cy5ieXRlT2Zmc2V0fWVsc2V7YWxsb2NhdGVkPXRydWU7cHRyPW1tYXBBbGxvYyhsZW5ndGgpO2lmKCFwdHIpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ4KX1pZihjb250ZW50cyl7aWYocG9zaXRpb24+MHx8cG9zaXRpb24rbGVuZ3RoPGNvbnRlbnRzLmxlbmd0aCl7aWYoY29udGVudHMuc3ViYXJyYXkpe2NvbnRlbnRzPWNvbnRlbnRzLnN1YmFycmF5KHBvc2l0aW9uLHBvc2l0aW9uK2xlbmd0aCl9ZWxzZXtjb250ZW50cz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChjb250ZW50cyxwb3NpdGlvbixwb3NpdGlvbitsZW5ndGgpfX1IRUFQOC5zZXQoY29udGVudHMscHRyKX19cmV0dXJue3B0cixhbGxvY2F0ZWR9fSxtc3luYyhzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgsbW1hcEZsYWdzKXtNRU1GUy5zdHJlYW1fb3BzLndyaXRlKHN0cmVhbSxidWZmZXIsMCxsZW5ndGgsb2Zmc2V0LGZhbHNlKTtyZXR1cm4gMH19fTt2YXIgYXN5bmNMb2FkPSh1cmwsb25sb2FkLG9uZXJyb3Isbm9SdW5EZXApPT57dmFyIGRlcD0hbm9SdW5EZXA/Z2V0VW5pcXVlUnVuRGVwZW5kZW5jeShgYWwgJHt1cmx9YCk6XCJcIjtyZWFkQXN5bmModXJsKS50aGVuKGFycmF5QnVmZmVyPT57b25sb2FkKG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7aWYoZGVwKXJlbW92ZVJ1bkRlcGVuZGVuY3koZGVwKX0sZXJyPT57aWYob25lcnJvcil7b25lcnJvcigpfWVsc2V7dGhyb3dgTG9hZGluZyBkYXRhIGZpbGUgXCIke3VybH1cIiBmYWlsZWQuYH19KTtpZihkZXApYWRkUnVuRGVwZW5kZW5jeShkZXApfTt2YXIgRlNfY3JlYXRlRGF0YUZpbGU9KHBhcmVudCxuYW1lLGZpbGVEYXRhLGNhblJlYWQsY2FuV3JpdGUsY2FuT3duKT0+e0ZTLmNyZWF0ZURhdGFGaWxlKHBhcmVudCxuYW1lLGZpbGVEYXRhLGNhblJlYWQsY2FuV3JpdGUsY2FuT3duKX07dmFyIHByZWxvYWRQbHVnaW5zPU1vZHVsZVtcInByZWxvYWRQbHVnaW5zXCJdfHxbXTt2YXIgRlNfaGFuZGxlZEJ5UHJlbG9hZFBsdWdpbj0oYnl0ZUFycmF5LGZ1bGxuYW1lLGZpbmlzaCxvbmVycm9yKT0+e2lmKHR5cGVvZiBCcm93c2VyIT1cInVuZGVmaW5lZFwiKUJyb3dzZXIuaW5pdCgpO3ZhciBoYW5kbGVkPWZhbHNlO3ByZWxvYWRQbHVnaW5zLmZvckVhY2gocGx1Z2luPT57aWYoaGFuZGxlZClyZXR1cm47aWYocGx1Z2luW1wiY2FuSGFuZGxlXCJdKGZ1bGxuYW1lKSl7cGx1Z2luW1wiaGFuZGxlXCJdKGJ5dGVBcnJheSxmdWxsbmFtZSxmaW5pc2gsb25lcnJvcik7aGFuZGxlZD10cnVlfX0pO3JldHVybiBoYW5kbGVkfTt2YXIgRlNfY3JlYXRlUHJlbG9hZGVkRmlsZT0ocGFyZW50LG5hbWUsdXJsLGNhblJlYWQsY2FuV3JpdGUsb25sb2FkLG9uZXJyb3IsZG9udENyZWF0ZUZpbGUsY2FuT3duLHByZUZpbmlzaCk9Pnt2YXIgZnVsbG5hbWU9bmFtZT9QQVRIX0ZTLnJlc29sdmUoUEFUSC5qb2luMihwYXJlbnQsbmFtZSkpOnBhcmVudDt2YXIgZGVwPWdldFVuaXF1ZVJ1bkRlcGVuZGVuY3koYGNwICR7ZnVsbG5hbWV9YCk7ZnVuY3Rpb24gcHJvY2Vzc0RhdGEoYnl0ZUFycmF5KXtmdW5jdGlvbiBmaW5pc2goYnl0ZUFycmF5KXtwcmVGaW5pc2g/LigpO2lmKCFkb250Q3JlYXRlRmlsZSl7RlNfY3JlYXRlRGF0YUZpbGUocGFyZW50LG5hbWUsYnl0ZUFycmF5LGNhblJlYWQsY2FuV3JpdGUsY2FuT3duKX1vbmxvYWQ/LigpO3JlbW92ZVJ1bkRlcGVuZGVuY3koZGVwKX1pZihGU19oYW5kbGVkQnlQcmVsb2FkUGx1Z2luKGJ5dGVBcnJheSxmdWxsbmFtZSxmaW5pc2gsKCk9PntvbmVycm9yPy4oKTtyZW1vdmVSdW5EZXBlbmRlbmN5KGRlcCl9KSl7cmV0dXJufWZpbmlzaChieXRlQXJyYXkpfWFkZFJ1bkRlcGVuZGVuY3koZGVwKTtpZih0eXBlb2YgdXJsPT1cInN0cmluZ1wiKXthc3luY0xvYWQodXJsLHByb2Nlc3NEYXRhLG9uZXJyb3IpfWVsc2V7cHJvY2Vzc0RhdGEodXJsKX19O3ZhciBGU19tb2RlU3RyaW5nVG9GbGFncz1zdHI9Pnt2YXIgZmxhZ01vZGVzPXtyOjAsXCJyK1wiOjIsdzo1MTJ8NjR8MSxcIncrXCI6NTEyfDY0fDIsYToxMDI0fDY0fDEsXCJhK1wiOjEwMjR8NjR8Mn07dmFyIGZsYWdzPWZsYWdNb2Rlc1tzdHJdO2lmKHR5cGVvZiBmbGFncz09XCJ1bmRlZmluZWRcIil7dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZpbGUgb3BlbiBtb2RlOiAke3N0cn1gKX1yZXR1cm4gZmxhZ3N9O3ZhciBGU19nZXRNb2RlPShjYW5SZWFkLGNhbldyaXRlKT0+e3ZhciBtb2RlPTA7aWYoY2FuUmVhZCltb2RlfD0yOTJ8NzM7aWYoY2FuV3JpdGUpbW9kZXw9MTQ2O3JldHVybiBtb2RlfTt2YXIgRlM9e3Jvb3Q6bnVsbCxtb3VudHM6W10sZGV2aWNlczp7fSxzdHJlYW1zOltdLG5leHRJbm9kZToxLG5hbWVUYWJsZTpudWxsLGN1cnJlbnRQYXRoOlwiL1wiLGluaXRpYWxpemVkOmZhbHNlLGlnbm9yZVBlcm1pc3Npb25zOnRydWUsRXJybm9FcnJvcjpjbGFzc3tjb25zdHJ1Y3RvcihlcnJubyl7dGhpcy5uYW1lPVwiRXJybm9FcnJvclwiO3RoaXMuZXJybm89ZXJybm99fSxnZW5lcmljRXJyb3JzOnt9LGZpbGVzeXN0ZW1zOm51bGwsc3luY0ZTUmVxdWVzdHM6MCxyZWFkRmlsZXM6e30sRlNTdHJlYW06Y2xhc3N7Y29uc3RydWN0b3IoKXt0aGlzLnNoYXJlZD17fX1nZXQgb2JqZWN0KCl7cmV0dXJuIHRoaXMubm9kZX1zZXQgb2JqZWN0KHZhbCl7dGhpcy5ub2RlPXZhbH1nZXQgaXNSZWFkKCl7cmV0dXJuKHRoaXMuZmxhZ3MmMjA5NzE1NSkhPT0xfWdldCBpc1dyaXRlKCl7cmV0dXJuKHRoaXMuZmxhZ3MmMjA5NzE1NSkhPT0wfWdldCBpc0FwcGVuZCgpe3JldHVybiB0aGlzLmZsYWdzJjEwMjR9Z2V0IGZsYWdzKCl7cmV0dXJuIHRoaXMuc2hhcmVkLmZsYWdzfXNldCBmbGFncyh2YWwpe3RoaXMuc2hhcmVkLmZsYWdzPXZhbH1nZXQgcG9zaXRpb24oKXtyZXR1cm4gdGhpcy5zaGFyZWQucG9zaXRpb259c2V0IHBvc2l0aW9uKHZhbCl7dGhpcy5zaGFyZWQucG9zaXRpb249dmFsfX0sRlNOb2RlOmNsYXNze2NvbnN0cnVjdG9yKHBhcmVudCxuYW1lLG1vZGUscmRldil7aWYoIXBhcmVudCl7cGFyZW50PXRoaXN9dGhpcy5wYXJlbnQ9cGFyZW50O3RoaXMubW91bnQ9cGFyZW50Lm1vdW50O3RoaXMubW91bnRlZD1udWxsO3RoaXMuaWQ9RlMubmV4dElub2RlKys7dGhpcy5uYW1lPW5hbWU7dGhpcy5tb2RlPW1vZGU7dGhpcy5ub2RlX29wcz17fTt0aGlzLnN0cmVhbV9vcHM9e307dGhpcy5yZGV2PXJkZXY7dGhpcy5yZWFkTW9kZT0yOTJ8NzM7dGhpcy53cml0ZU1vZGU9MTQ2fWdldCByZWFkKCl7cmV0dXJuKHRoaXMubW9kZSZ0aGlzLnJlYWRNb2RlKT09PXRoaXMucmVhZE1vZGV9c2V0IHJlYWQodmFsKXt2YWw/dGhpcy5tb2RlfD10aGlzLnJlYWRNb2RlOnRoaXMubW9kZSY9fnRoaXMucmVhZE1vZGV9Z2V0IHdyaXRlKCl7cmV0dXJuKHRoaXMubW9kZSZ0aGlzLndyaXRlTW9kZSk9PT10aGlzLndyaXRlTW9kZX1zZXQgd3JpdGUodmFsKXt2YWw/dGhpcy5tb2RlfD10aGlzLndyaXRlTW9kZTp0aGlzLm1vZGUmPX50aGlzLndyaXRlTW9kZX1nZXQgaXNGb2xkZXIoKXtyZXR1cm4gRlMuaXNEaXIodGhpcy5tb2RlKX1nZXQgaXNEZXZpY2UoKXtyZXR1cm4gRlMuaXNDaHJkZXYodGhpcy5tb2RlKX19LGxvb2t1cFBhdGgocGF0aCxvcHRzPXt9KXtwYXRoPVBBVEhfRlMucmVzb2x2ZShwYXRoKTtpZighcGF0aClyZXR1cm57cGF0aDpcIlwiLG5vZGU6bnVsbH07dmFyIGRlZmF1bHRzPXtmb2xsb3dfbW91bnQ6dHJ1ZSxyZWN1cnNlX2NvdW50OjB9O29wdHM9T2JqZWN0LmFzc2lnbihkZWZhdWx0cyxvcHRzKTtpZihvcHRzLnJlY3Vyc2VfY291bnQ+OCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMzIpfXZhciBwYXJ0cz1wYXRoLnNwbGl0KFwiL1wiKS5maWx0ZXIocD0+ISFwKTt2YXIgY3VycmVudD1GUy5yb290O3ZhciBjdXJyZW50X3BhdGg9XCIvXCI7Zm9yKHZhciBpPTA7aTxwYXJ0cy5sZW5ndGg7aSsrKXt2YXIgaXNsYXN0PWk9PT1wYXJ0cy5sZW5ndGgtMTtpZihpc2xhc3QmJm9wdHMucGFyZW50KXticmVha31jdXJyZW50PUZTLmxvb2t1cE5vZGUoY3VycmVudCxwYXJ0c1tpXSk7Y3VycmVudF9wYXRoPVBBVEguam9pbjIoY3VycmVudF9wYXRoLHBhcnRzW2ldKTtpZihGUy5pc01vdW50cG9pbnQoY3VycmVudCkpe2lmKCFpc2xhc3R8fGlzbGFzdCYmb3B0cy5mb2xsb3dfbW91bnQpe2N1cnJlbnQ9Y3VycmVudC5tb3VudGVkLnJvb3R9fWlmKCFpc2xhc3R8fG9wdHMuZm9sbG93KXt2YXIgY291bnQ9MDt3aGlsZShGUy5pc0xpbmsoY3VycmVudC5tb2RlKSl7dmFyIGxpbms9RlMucmVhZGxpbmsoY3VycmVudF9wYXRoKTtjdXJyZW50X3BhdGg9UEFUSF9GUy5yZXNvbHZlKFBBVEguZGlybmFtZShjdXJyZW50X3BhdGgpLGxpbmspO3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChjdXJyZW50X3BhdGgse3JlY3Vyc2VfY291bnQ6b3B0cy5yZWN1cnNlX2NvdW50KzF9KTtjdXJyZW50PWxvb2t1cC5ub2RlO2lmKGNvdW50Kys+NDApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDMyKX19fX1yZXR1cm57cGF0aDpjdXJyZW50X3BhdGgsbm9kZTpjdXJyZW50fX0sZ2V0UGF0aChub2RlKXt2YXIgcGF0aDt3aGlsZSh0cnVlKXtpZihGUy5pc1Jvb3Qobm9kZSkpe3ZhciBtb3VudD1ub2RlLm1vdW50Lm1vdW50cG9pbnQ7aWYoIXBhdGgpcmV0dXJuIG1vdW50O3JldHVybiBtb3VudFttb3VudC5sZW5ndGgtMV0hPT1cIi9cIj9gJHttb3VudH0vJHtwYXRofWA6bW91bnQrcGF0aH1wYXRoPXBhdGg/YCR7bm9kZS5uYW1lfS8ke3BhdGh9YDpub2RlLm5hbWU7bm9kZT1ub2RlLnBhcmVudH19LGhhc2hOYW1lKHBhcmVudGlkLG5hbWUpe3ZhciBoYXNoPTA7Zm9yKHZhciBpPTA7aTxuYW1lLmxlbmd0aDtpKyspe2hhc2g9KGhhc2g8PDUpLWhhc2grbmFtZS5jaGFyQ29kZUF0KGkpfDB9cmV0dXJuKHBhcmVudGlkK2hhc2g+Pj4wKSVGUy5uYW1lVGFibGUubGVuZ3RofSxoYXNoQWRkTm9kZShub2RlKXt2YXIgaGFzaD1GUy5oYXNoTmFtZShub2RlLnBhcmVudC5pZCxub2RlLm5hbWUpO25vZGUubmFtZV9uZXh0PUZTLm5hbWVUYWJsZVtoYXNoXTtGUy5uYW1lVGFibGVbaGFzaF09bm9kZX0saGFzaFJlbW92ZU5vZGUobm9kZSl7dmFyIGhhc2g9RlMuaGFzaE5hbWUobm9kZS5wYXJlbnQuaWQsbm9kZS5uYW1lKTtpZihGUy5uYW1lVGFibGVbaGFzaF09PT1ub2RlKXtGUy5uYW1lVGFibGVbaGFzaF09bm9kZS5uYW1lX25leHR9ZWxzZXt2YXIgY3VycmVudD1GUy5uYW1lVGFibGVbaGFzaF07d2hpbGUoY3VycmVudCl7aWYoY3VycmVudC5uYW1lX25leHQ9PT1ub2RlKXtjdXJyZW50Lm5hbWVfbmV4dD1ub2RlLm5hbWVfbmV4dDticmVha31jdXJyZW50PWN1cnJlbnQubmFtZV9uZXh0fX19LGxvb2t1cE5vZGUocGFyZW50LG5hbWUpe3ZhciBlcnJDb2RlPUZTLm1heUxvb2t1cChwYXJlbnQpO2lmKGVyckNvZGUpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpfXZhciBoYXNoPUZTLmhhc2hOYW1lKHBhcmVudC5pZCxuYW1lKTtmb3IodmFyIG5vZGU9RlMubmFtZVRhYmxlW2hhc2hdO25vZGU7bm9kZT1ub2RlLm5hbWVfbmV4dCl7dmFyIG5vZGVOYW1lPW5vZGUubmFtZTtpZihub2RlLnBhcmVudC5pZD09PXBhcmVudC5pZCYmbm9kZU5hbWU9PT1uYW1lKXtyZXR1cm4gbm9kZX19cmV0dXJuIEZTLmxvb2t1cChwYXJlbnQsbmFtZSl9LGNyZWF0ZU5vZGUocGFyZW50LG5hbWUsbW9kZSxyZGV2KXt2YXIgbm9kZT1uZXcgRlMuRlNOb2RlKHBhcmVudCxuYW1lLG1vZGUscmRldik7RlMuaGFzaEFkZE5vZGUobm9kZSk7cmV0dXJuIG5vZGV9LGRlc3Ryb3lOb2RlKG5vZGUpe0ZTLmhhc2hSZW1vdmVOb2RlKG5vZGUpfSxpc1Jvb3Qobm9kZSl7cmV0dXJuIG5vZGU9PT1ub2RlLnBhcmVudH0saXNNb3VudHBvaW50KG5vZGUpe3JldHVybiEhbm9kZS5tb3VudGVkfSxpc0ZpbGUobW9kZSl7cmV0dXJuKG1vZGUmNjE0NDApPT09MzI3Njh9LGlzRGlyKG1vZGUpe3JldHVybihtb2RlJjYxNDQwKT09PTE2Mzg0fSxpc0xpbmsobW9kZSl7cmV0dXJuKG1vZGUmNjE0NDApPT09NDA5NjB9LGlzQ2hyZGV2KG1vZGUpe3JldHVybihtb2RlJjYxNDQwKT09PTgxOTJ9LGlzQmxrZGV2KG1vZGUpe3JldHVybihtb2RlJjYxNDQwKT09PTI0NTc2fSxpc0ZJRk8obW9kZSl7cmV0dXJuKG1vZGUmNjE0NDApPT09NDA5Nn0saXNTb2NrZXQobW9kZSl7cmV0dXJuKG1vZGUmNDkxNTIpPT09NDkxNTJ9LGZsYWdzVG9QZXJtaXNzaW9uU3RyaW5nKGZsYWcpe3ZhciBwZXJtcz1bXCJyXCIsXCJ3XCIsXCJyd1wiXVtmbGFnJjNdO2lmKGZsYWcmNTEyKXtwZXJtcys9XCJ3XCJ9cmV0dXJuIHBlcm1zfSxub2RlUGVybWlzc2lvbnMobm9kZSxwZXJtcyl7aWYoRlMuaWdub3JlUGVybWlzc2lvbnMpe3JldHVybiAwfWlmKHBlcm1zLmluY2x1ZGVzKFwiclwiKSYmIShub2RlLm1vZGUmMjkyKSl7cmV0dXJuIDJ9ZWxzZSBpZihwZXJtcy5pbmNsdWRlcyhcIndcIikmJiEobm9kZS5tb2RlJjE0Nikpe3JldHVybiAyfWVsc2UgaWYocGVybXMuaW5jbHVkZXMoXCJ4XCIpJiYhKG5vZGUubW9kZSY3Mykpe3JldHVybiAyfXJldHVybiAwfSxtYXlMb29rdXAoZGlyKXtpZighRlMuaXNEaXIoZGlyLm1vZGUpKXJldHVybiA1NDt2YXIgZXJyQ29kZT1GUy5ub2RlUGVybWlzc2lvbnMoZGlyLFwieFwiKTtpZihlcnJDb2RlKXJldHVybiBlcnJDb2RlO2lmKCFkaXIubm9kZV9vcHMubG9va3VwKXJldHVybiAyO3JldHVybiAwfSxtYXlDcmVhdGUoZGlyLG5hbWUpe3RyeXt2YXIgbm9kZT1GUy5sb29rdXBOb2RlKGRpcixuYW1lKTtyZXR1cm4gMjB9Y2F0Y2goZSl7fXJldHVybiBGUy5ub2RlUGVybWlzc2lvbnMoZGlyLFwid3hcIil9LG1heURlbGV0ZShkaXIsbmFtZSxpc2Rpcil7dmFyIG5vZGU7dHJ5e25vZGU9RlMubG9va3VwTm9kZShkaXIsbmFtZSl9Y2F0Y2goZSl7cmV0dXJuIGUuZXJybm99dmFyIGVyckNvZGU9RlMubm9kZVBlcm1pc3Npb25zKGRpcixcInd4XCIpO2lmKGVyckNvZGUpe3JldHVybiBlcnJDb2RlfWlmKGlzZGlyKXtpZighRlMuaXNEaXIobm9kZS5tb2RlKSl7cmV0dXJuIDU0fWlmKEZTLmlzUm9vdChub2RlKXx8RlMuZ2V0UGF0aChub2RlKT09PUZTLmN3ZCgpKXtyZXR1cm4gMTB9fWVsc2V7aWYoRlMuaXNEaXIobm9kZS5tb2RlKSl7cmV0dXJuIDMxfX1yZXR1cm4gMH0sbWF5T3Blbihub2RlLGZsYWdzKXtpZighbm9kZSl7cmV0dXJuIDQ0fWlmKEZTLmlzTGluayhub2RlLm1vZGUpKXtyZXR1cm4gMzJ9ZWxzZSBpZihGUy5pc0Rpcihub2RlLm1vZGUpKXtpZihGUy5mbGFnc1RvUGVybWlzc2lvblN0cmluZyhmbGFncykhPT1cInJcInx8ZmxhZ3MmNTEyKXtyZXR1cm4gMzF9fXJldHVybiBGUy5ub2RlUGVybWlzc2lvbnMobm9kZSxGUy5mbGFnc1RvUGVybWlzc2lvblN0cmluZyhmbGFncykpfSxNQVhfT1BFTl9GRFM6NDA5NixuZXh0ZmQoKXtmb3IodmFyIGZkPTA7ZmQ8PUZTLk1BWF9PUEVOX0ZEUztmZCsrKXtpZighRlMuc3RyZWFtc1tmZF0pe3JldHVybiBmZH19dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMzMpfSxnZXRTdHJlYW1DaGVja2VkKGZkKXt2YXIgc3RyZWFtPUZTLmdldFN0cmVhbShmZCk7aWYoIXN0cmVhbSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCl9cmV0dXJuIHN0cmVhbX0sZ2V0U3RyZWFtOmZkPT5GUy5zdHJlYW1zW2ZkXSxjcmVhdGVTdHJlYW0oc3RyZWFtLGZkPS0xKXtzdHJlYW09T2JqZWN0LmFzc2lnbihuZXcgRlMuRlNTdHJlYW0sc3RyZWFtKTtpZihmZD09LTEpe2ZkPUZTLm5leHRmZCgpfXN0cmVhbS5mZD1mZDtGUy5zdHJlYW1zW2ZkXT1zdHJlYW07cmV0dXJuIHN0cmVhbX0sY2xvc2VTdHJlYW0oZmQpe0ZTLnN0cmVhbXNbZmRdPW51bGx9LGR1cFN0cmVhbShvcmlnU3RyZWFtLGZkPS0xKXt2YXIgc3RyZWFtPUZTLmNyZWF0ZVN0cmVhbShvcmlnU3RyZWFtLGZkKTtzdHJlYW0uc3RyZWFtX29wcz8uZHVwPy4oc3RyZWFtKTtyZXR1cm4gc3RyZWFtfSxjaHJkZXZfc3RyZWFtX29wczp7b3BlbihzdHJlYW0pe3ZhciBkZXZpY2U9RlMuZ2V0RGV2aWNlKHN0cmVhbS5ub2RlLnJkZXYpO3N0cmVhbS5zdHJlYW1fb3BzPWRldmljZS5zdHJlYW1fb3BzO3N0cmVhbS5zdHJlYW1fb3BzLm9wZW4/LihzdHJlYW0pfSxsbHNlZWsoKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig3MCl9fSxtYWpvcjpkZXY9PmRldj4+OCxtaW5vcjpkZXY9PmRldiYyNTUsbWFrZWRldjoobWEsbWkpPT5tYTw8OHxtaSxyZWdpc3RlckRldmljZShkZXYsb3BzKXtGUy5kZXZpY2VzW2Rldl09e3N0cmVhbV9vcHM6b3BzfX0sZ2V0RGV2aWNlOmRldj0+RlMuZGV2aWNlc1tkZXZdLGdldE1vdW50cyhtb3VudCl7dmFyIG1vdW50cz1bXTt2YXIgY2hlY2s9W21vdW50XTt3aGlsZShjaGVjay5sZW5ndGgpe3ZhciBtPWNoZWNrLnBvcCgpO21vdW50cy5wdXNoKG0pO2NoZWNrLnB1c2goLi4ubS5tb3VudHMpfXJldHVybiBtb3VudHN9LHN5bmNmcyhwb3B1bGF0ZSxjYWxsYmFjayl7aWYodHlwZW9mIHBvcHVsYXRlPT1cImZ1bmN0aW9uXCIpe2NhbGxiYWNrPXBvcHVsYXRlO3BvcHVsYXRlPWZhbHNlfUZTLnN5bmNGU1JlcXVlc3RzKys7aWYoRlMuc3luY0ZTUmVxdWVzdHM+MSl7ZXJyKGB3YXJuaW5nOiAke0ZTLnN5bmNGU1JlcXVlc3RzfSBGUy5zeW5jZnMgb3BlcmF0aW9ucyBpbiBmbGlnaHQgYXQgb25jZSwgcHJvYmFibHkganVzdCBkb2luZyBleHRyYSB3b3JrYCl9dmFyIG1vdW50cz1GUy5nZXRNb3VudHMoRlMucm9vdC5tb3VudCk7dmFyIGNvbXBsZXRlZD0wO2Z1bmN0aW9uIGRvQ2FsbGJhY2soZXJyQ29kZSl7RlMuc3luY0ZTUmVxdWVzdHMtLTtyZXR1cm4gY2FsbGJhY2soZXJyQ29kZSl9ZnVuY3Rpb24gZG9uZShlcnJDb2RlKXtpZihlcnJDb2RlKXtpZighZG9uZS5lcnJvcmVkKXtkb25lLmVycm9yZWQ9dHJ1ZTtyZXR1cm4gZG9DYWxsYmFjayhlcnJDb2RlKX1yZXR1cm59aWYoKytjb21wbGV0ZWQ+PW1vdW50cy5sZW5ndGgpe2RvQ2FsbGJhY2sobnVsbCl9fW1vdW50cy5mb3JFYWNoKG1vdW50PT57aWYoIW1vdW50LnR5cGUuc3luY2ZzKXtyZXR1cm4gZG9uZShudWxsKX1tb3VudC50eXBlLnN5bmNmcyhtb3VudCxwb3B1bGF0ZSxkb25lKX0pfSxtb3VudCh0eXBlLG9wdHMsbW91bnRwb2ludCl7dmFyIHJvb3Q9bW91bnRwb2ludD09PVwiL1wiO3ZhciBwc2V1ZG89IW1vdW50cG9pbnQ7dmFyIG5vZGU7aWYocm9vdCYmRlMucm9vdCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMTApfWVsc2UgaWYoIXJvb3QmJiFwc2V1ZG8pe3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChtb3VudHBvaW50LHtmb2xsb3dfbW91bnQ6ZmFsc2V9KTttb3VudHBvaW50PWxvb2t1cC5wYXRoO25vZGU9bG9va3VwLm5vZGU7aWYoRlMuaXNNb3VudHBvaW50KG5vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigxMCl9aWYoIUZTLmlzRGlyKG5vZGUubW9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDU0KX19dmFyIG1vdW50PXt0eXBlLG9wdHMsbW91bnRwb2ludCxtb3VudHM6W119O3ZhciBtb3VudFJvb3Q9dHlwZS5tb3VudChtb3VudCk7bW91bnRSb290Lm1vdW50PW1vdW50O21vdW50LnJvb3Q9bW91bnRSb290O2lmKHJvb3Qpe0ZTLnJvb3Q9bW91bnRSb290fWVsc2UgaWYobm9kZSl7bm9kZS5tb3VudGVkPW1vdW50O2lmKG5vZGUubW91bnQpe25vZGUubW91bnQubW91bnRzLnB1c2gobW91bnQpfX1yZXR1cm4gbW91bnRSb290fSx1bm1vdW50KG1vdW50cG9pbnQpe3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChtb3VudHBvaW50LHtmb2xsb3dfbW91bnQ6ZmFsc2V9KTtpZighRlMuaXNNb3VudHBvaW50KGxvb2t1cC5ub2RlKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpfXZhciBub2RlPWxvb2t1cC5ub2RlO3ZhciBtb3VudD1ub2RlLm1vdW50ZWQ7dmFyIG1vdW50cz1GUy5nZXRNb3VudHMobW91bnQpO09iamVjdC5rZXlzKEZTLm5hbWVUYWJsZSkuZm9yRWFjaChoYXNoPT57dmFyIGN1cnJlbnQ9RlMubmFtZVRhYmxlW2hhc2hdO3doaWxlKGN1cnJlbnQpe3ZhciBuZXh0PWN1cnJlbnQubmFtZV9uZXh0O2lmKG1vdW50cy5pbmNsdWRlcyhjdXJyZW50Lm1vdW50KSl7RlMuZGVzdHJveU5vZGUoY3VycmVudCl9Y3VycmVudD1uZXh0fX0pO25vZGUubW91bnRlZD1udWxsO3ZhciBpZHg9bm9kZS5tb3VudC5tb3VudHMuaW5kZXhPZihtb3VudCk7bm9kZS5tb3VudC5tb3VudHMuc3BsaWNlKGlkeCwxKX0sbG9va3VwKHBhcmVudCxuYW1lKXtyZXR1cm4gcGFyZW50Lm5vZGVfb3BzLmxvb2t1cChwYXJlbnQsbmFtZSl9LG1rbm9kKHBhdGgsbW9kZSxkZXYpe3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChwYXRoLHtwYXJlbnQ6dHJ1ZX0pO3ZhciBwYXJlbnQ9bG9va3VwLm5vZGU7dmFyIG5hbWU9UEFUSC5iYXNlbmFtZShwYXRoKTtpZighbmFtZXx8bmFtZT09PVwiLlwifHxuYW1lPT09XCIuLlwiKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCl9dmFyIGVyckNvZGU9RlMubWF5Q3JlYXRlKHBhcmVudCxuYW1lKTtpZihlcnJDb2RlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKX1pZighcGFyZW50Lm5vZGVfb3BzLm1rbm9kKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2Myl9cmV0dXJuIHBhcmVudC5ub2RlX29wcy5ta25vZChwYXJlbnQsbmFtZSxtb2RlLGRldil9LGNyZWF0ZShwYXRoLG1vZGUpe21vZGU9bW9kZSE9PXVuZGVmaW5lZD9tb2RlOjQzODttb2RlJj00MDk1O21vZGV8PTMyNzY4O3JldHVybiBGUy5ta25vZChwYXRoLG1vZGUsMCl9LG1rZGlyKHBhdGgsbW9kZSl7bW9kZT1tb2RlIT09dW5kZWZpbmVkP21vZGU6NTExO21vZGUmPTUxMXw1MTI7bW9kZXw9MTYzODQ7cmV0dXJuIEZTLm1rbm9kKHBhdGgsbW9kZSwwKX0sbWtkaXJUcmVlKHBhdGgsbW9kZSl7dmFyIGRpcnM9cGF0aC5zcGxpdChcIi9cIik7dmFyIGQ9XCJcIjtmb3IodmFyIGk9MDtpPGRpcnMubGVuZ3RoOysraSl7aWYoIWRpcnNbaV0pY29udGludWU7ZCs9XCIvXCIrZGlyc1tpXTt0cnl7RlMubWtkaXIoZCxtb2RlKX1jYXRjaChlKXtpZihlLmVycm5vIT0yMCl0aHJvdyBlfX19LG1rZGV2KHBhdGgsbW9kZSxkZXYpe2lmKHR5cGVvZiBkZXY9PVwidW5kZWZpbmVkXCIpe2Rldj1tb2RlO21vZGU9NDM4fW1vZGV8PTgxOTI7cmV0dXJuIEZTLm1rbm9kKHBhdGgsbW9kZSxkZXYpfSxzeW1saW5rKG9sZHBhdGgsbmV3cGF0aCl7aWYoIVBBVEhfRlMucmVzb2x2ZShvbGRwYXRoKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpfXZhciBsb29rdXA9RlMubG9va3VwUGF0aChuZXdwYXRoLHtwYXJlbnQ6dHJ1ZX0pO3ZhciBwYXJlbnQ9bG9va3VwLm5vZGU7aWYoIXBhcmVudCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpfXZhciBuZXduYW1lPVBBVEguYmFzZW5hbWUobmV3cGF0aCk7dmFyIGVyckNvZGU9RlMubWF5Q3JlYXRlKHBhcmVudCxuZXduYW1lKTtpZihlcnJDb2RlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKX1pZighcGFyZW50Lm5vZGVfb3BzLnN5bWxpbmspe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKX1yZXR1cm4gcGFyZW50Lm5vZGVfb3BzLnN5bWxpbmsocGFyZW50LG5ld25hbWUsb2xkcGF0aCl9LHJlbmFtZShvbGRfcGF0aCxuZXdfcGF0aCl7dmFyIG9sZF9kaXJuYW1lPVBBVEguZGlybmFtZShvbGRfcGF0aCk7dmFyIG5ld19kaXJuYW1lPVBBVEguZGlybmFtZShuZXdfcGF0aCk7dmFyIG9sZF9uYW1lPVBBVEguYmFzZW5hbWUob2xkX3BhdGgpO3ZhciBuZXdfbmFtZT1QQVRILmJhc2VuYW1lKG5ld19wYXRoKTt2YXIgbG9va3VwLG9sZF9kaXIsbmV3X2Rpcjtsb29rdXA9RlMubG9va3VwUGF0aChvbGRfcGF0aCx7cGFyZW50OnRydWV9KTtvbGRfZGlyPWxvb2t1cC5ub2RlO2xvb2t1cD1GUy5sb29rdXBQYXRoKG5ld19wYXRoLHtwYXJlbnQ6dHJ1ZX0pO25ld19kaXI9bG9va3VwLm5vZGU7aWYoIW9sZF9kaXJ8fCFuZXdfZGlyKXRocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KTtpZihvbGRfZGlyLm1vdW50IT09bmV3X2Rpci5tb3VudCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNzUpfXZhciBvbGRfbm9kZT1GUy5sb29rdXBOb2RlKG9sZF9kaXIsb2xkX25hbWUpO3ZhciByZWxhdGl2ZT1QQVRIX0ZTLnJlbGF0aXZlKG9sZF9wYXRoLG5ld19kaXJuYW1lKTtpZihyZWxhdGl2ZS5jaGFyQXQoMCkhPT1cIi5cIil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpfXJlbGF0aXZlPVBBVEhfRlMucmVsYXRpdmUobmV3X3BhdGgsb2xkX2Rpcm5hbWUpO2lmKHJlbGF0aXZlLmNoYXJBdCgwKSE9PVwiLlwiKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig1NSl9dmFyIG5ld19ub2RlO3RyeXtuZXdfbm9kZT1GUy5sb29rdXBOb2RlKG5ld19kaXIsbmV3X25hbWUpfWNhdGNoKGUpe31pZihvbGRfbm9kZT09PW5ld19ub2RlKXtyZXR1cm59dmFyIGlzZGlyPUZTLmlzRGlyKG9sZF9ub2RlLm1vZGUpO3ZhciBlcnJDb2RlPUZTLm1heURlbGV0ZShvbGRfZGlyLG9sZF9uYW1lLGlzZGlyKTtpZihlcnJDb2RlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKX1lcnJDb2RlPW5ld19ub2RlP0ZTLm1heURlbGV0ZShuZXdfZGlyLG5ld19uYW1lLGlzZGlyKTpGUy5tYXlDcmVhdGUobmV3X2RpcixuZXdfbmFtZSk7aWYoZXJyQ29kZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSl9aWYoIW9sZF9kaXIubm9kZV9vcHMucmVuYW1lKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2Myl9aWYoRlMuaXNNb3VudHBvaW50KG9sZF9ub2RlKXx8bmV3X25vZGUmJkZTLmlzTW91bnRwb2ludChuZXdfbm9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDEwKX1pZihuZXdfZGlyIT09b2xkX2Rpcil7ZXJyQ29kZT1GUy5ub2RlUGVybWlzc2lvbnMob2xkX2RpcixcIndcIik7aWYoZXJyQ29kZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSl9fUZTLmhhc2hSZW1vdmVOb2RlKG9sZF9ub2RlKTt0cnl7b2xkX2Rpci5ub2RlX29wcy5yZW5hbWUob2xkX25vZGUsbmV3X2RpcixuZXdfbmFtZSk7b2xkX25vZGUucGFyZW50PW5ld19kaXJ9Y2F0Y2goZSl7dGhyb3cgZX1maW5hbGx5e0ZTLmhhc2hBZGROb2RlKG9sZF9ub2RlKX19LHJtZGlyKHBhdGgpe3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChwYXRoLHtwYXJlbnQ6dHJ1ZX0pO3ZhciBwYXJlbnQ9bG9va3VwLm5vZGU7dmFyIG5hbWU9UEFUSC5iYXNlbmFtZShwYXRoKTt2YXIgbm9kZT1GUy5sb29rdXBOb2RlKHBhcmVudCxuYW1lKTt2YXIgZXJyQ29kZT1GUy5tYXlEZWxldGUocGFyZW50LG5hbWUsdHJ1ZSk7aWYoZXJyQ29kZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSl9aWYoIXBhcmVudC5ub2RlX29wcy5ybWRpcil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpfWlmKEZTLmlzTW91bnRwb2ludChub2RlKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMTApfXBhcmVudC5ub2RlX29wcy5ybWRpcihwYXJlbnQsbmFtZSk7RlMuZGVzdHJveU5vZGUobm9kZSl9LHJlYWRkaXIocGF0aCl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzp0cnVlfSk7dmFyIG5vZGU9bG9va3VwLm5vZGU7aWYoIW5vZGUubm9kZV9vcHMucmVhZGRpcil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTQpfXJldHVybiBub2RlLm5vZGVfb3BzLnJlYWRkaXIobm9kZSl9LHVubGluayhwYXRoKXt2YXIgbG9va3VwPUZTLmxvb2t1cFBhdGgocGF0aCx7cGFyZW50OnRydWV9KTt2YXIgcGFyZW50PWxvb2t1cC5ub2RlO2lmKCFwYXJlbnQpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KX12YXIgbmFtZT1QQVRILmJhc2VuYW1lKHBhdGgpO3ZhciBub2RlPUZTLmxvb2t1cE5vZGUocGFyZW50LG5hbWUpO3ZhciBlcnJDb2RlPUZTLm1heURlbGV0ZShwYXJlbnQsbmFtZSxmYWxzZSk7aWYoZXJyQ29kZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSl9aWYoIXBhcmVudC5ub2RlX29wcy51bmxpbmspe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKX1pZihGUy5pc01vdW50cG9pbnQobm9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDEwKX1wYXJlbnQubm9kZV9vcHMudW5saW5rKHBhcmVudCxuYW1lKTtGUy5kZXN0cm95Tm9kZShub2RlKX0scmVhZGxpbmsocGF0aCl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgpO3ZhciBsaW5rPWxvb2t1cC5ub2RlO2lmKCFsaW5rKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0NCl9aWYoIWxpbmsubm9kZV9vcHMucmVhZGxpbmspe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1yZXR1cm4gUEFUSF9GUy5yZXNvbHZlKEZTLmdldFBhdGgobGluay5wYXJlbnQpLGxpbmsubm9kZV9vcHMucmVhZGxpbmsobGluaykpfSxzdGF0KHBhdGgsZG9udEZvbGxvdyl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzohZG9udEZvbGxvd30pO3ZhciBub2RlPWxvb2t1cC5ub2RlO2lmKCFub2RlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0NCl9aWYoIW5vZGUubm9kZV9vcHMuZ2V0YXR0cil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpfXJldHVybiBub2RlLm5vZGVfb3BzLmdldGF0dHIobm9kZSl9LGxzdGF0KHBhdGgpe3JldHVybiBGUy5zdGF0KHBhdGgsdHJ1ZSl9LGNobW9kKHBhdGgsbW9kZSxkb250Rm9sbG93KXt2YXIgbm9kZTtpZih0eXBlb2YgcGF0aD09XCJzdHJpbmdcIil7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzohZG9udEZvbGxvd30pO25vZGU9bG9va3VwLm5vZGV9ZWxzZXtub2RlPXBhdGh9aWYoIW5vZGUubm9kZV9vcHMuc2V0YXR0cil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNjMpfW5vZGUubm9kZV9vcHMuc2V0YXR0cihub2RlLHttb2RlOm1vZGUmNDA5NXxub2RlLm1vZGUmfjQwOTUsdGltZXN0YW1wOkRhdGUubm93KCl9KX0sbGNobW9kKHBhdGgsbW9kZSl7RlMuY2htb2QocGF0aCxtb2RlLHRydWUpfSxmY2htb2QoZmQsbW9kZSl7dmFyIHN0cmVhbT1GUy5nZXRTdHJlYW1DaGVja2VkKGZkKTtGUy5jaG1vZChzdHJlYW0ubm9kZSxtb2RlKX0sY2hvd24ocGF0aCx1aWQsZ2lkLGRvbnRGb2xsb3cpe3ZhciBub2RlO2lmKHR5cGVvZiBwYXRoPT1cInN0cmluZ1wiKXt2YXIgbG9va3VwPUZTLmxvb2t1cFBhdGgocGF0aCx7Zm9sbG93OiFkb250Rm9sbG93fSk7bm9kZT1sb29rdXAubm9kZX1lbHNle25vZGU9cGF0aH1pZighbm9kZS5ub2RlX29wcy5zZXRhdHRyKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig2Myl9bm9kZS5ub2RlX29wcy5zZXRhdHRyKG5vZGUse3RpbWVzdGFtcDpEYXRlLm5vdygpfSl9LGxjaG93bihwYXRoLHVpZCxnaWQpe0ZTLmNob3duKHBhdGgsdWlkLGdpZCx0cnVlKX0sZmNob3duKGZkLHVpZCxnaWQpe3ZhciBzdHJlYW09RlMuZ2V0U3RyZWFtQ2hlY2tlZChmZCk7RlMuY2hvd24oc3RyZWFtLm5vZGUsdWlkLGdpZCl9LHRydW5jYXRlKHBhdGgsbGVuKXtpZihsZW48MCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpfXZhciBub2RlO2lmKHR5cGVvZiBwYXRoPT1cInN0cmluZ1wiKXt2YXIgbG9va3VwPUZTLmxvb2t1cFBhdGgocGF0aCx7Zm9sbG93OnRydWV9KTtub2RlPWxvb2t1cC5ub2RlfWVsc2V7bm9kZT1wYXRofWlmKCFub2RlLm5vZGVfb3BzLnNldGF0dHIpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDYzKX1pZihGUy5pc0Rpcihub2RlLm1vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigzMSl9aWYoIUZTLmlzRmlsZShub2RlLm1vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCl9dmFyIGVyckNvZGU9RlMubm9kZVBlcm1pc3Npb25zKG5vZGUsXCJ3XCIpO2lmKGVyckNvZGUpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKGVyckNvZGUpfW5vZGUubm9kZV9vcHMuc2V0YXR0cihub2RlLHtzaXplOmxlbix0aW1lc3RhbXA6RGF0ZS5ub3coKX0pfSxmdHJ1bmNhdGUoZmQsbGVuKXt2YXIgc3RyZWFtPUZTLmdldFN0cmVhbUNoZWNrZWQoZmQpO2lmKChzdHJlYW0uZmxhZ3MmMjA5NzE1NSk9PT0wKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCl9RlMudHJ1bmNhdGUoc3RyZWFtLm5vZGUsbGVuKX0sdXRpbWUocGF0aCxhdGltZSxtdGltZSl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzp0cnVlfSk7dmFyIG5vZGU9bG9va3VwLm5vZGU7bm9kZS5ub2RlX29wcy5zZXRhdHRyKG5vZGUse3RpbWVzdGFtcDpNYXRoLm1heChhdGltZSxtdGltZSl9KX0sb3BlbihwYXRoLGZsYWdzLG1vZGUpe2lmKHBhdGg9PT1cIlwiKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0NCl9ZmxhZ3M9dHlwZW9mIGZsYWdzPT1cInN0cmluZ1wiP0ZTX21vZGVTdHJpbmdUb0ZsYWdzKGZsYWdzKTpmbGFncztpZihmbGFncyY2NCl7bW9kZT10eXBlb2YgbW9kZT09XCJ1bmRlZmluZWRcIj80Mzg6bW9kZTttb2RlPW1vZGUmNDA5NXwzMjc2OH1lbHNle21vZGU9MH12YXIgbm9kZTtpZih0eXBlb2YgcGF0aD09XCJvYmplY3RcIil7bm9kZT1wYXRofWVsc2V7cGF0aD1QQVRILm5vcm1hbGl6ZShwYXRoKTt0cnl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzohKGZsYWdzJjEzMTA3Mil9KTtub2RlPWxvb2t1cC5ub2RlfWNhdGNoKGUpe319dmFyIGNyZWF0ZWQ9ZmFsc2U7aWYoZmxhZ3MmNjQpe2lmKG5vZGUpe2lmKGZsYWdzJjEyOCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjApfX1lbHNle25vZGU9RlMubWtub2QocGF0aCxtb2RlLDApO2NyZWF0ZWQ9dHJ1ZX19aWYoIW5vZGUpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDQ0KX1pZihGUy5pc0NocmRldihub2RlLm1vZGUpKXtmbGFncyY9fjUxMn1pZihmbGFncyY2NTUzNiYmIUZTLmlzRGlyKG5vZGUubW9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDU0KX1pZighY3JlYXRlZCl7dmFyIGVyckNvZGU9RlMubWF5T3Blbihub2RlLGZsYWdzKTtpZihlcnJDb2RlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcihlcnJDb2RlKX19aWYoZmxhZ3MmNTEyJiYhY3JlYXRlZCl7RlMudHJ1bmNhdGUobm9kZSwwKX1mbGFncyY9figxMjh8NTEyfDEzMTA3Mik7dmFyIHN0cmVhbT1GUy5jcmVhdGVTdHJlYW0oe25vZGUscGF0aDpGUy5nZXRQYXRoKG5vZGUpLGZsYWdzLHNlZWthYmxlOnRydWUscG9zaXRpb246MCxzdHJlYW1fb3BzOm5vZGUuc3RyZWFtX29wcyx1bmdvdHRlbjpbXSxlcnJvcjpmYWxzZX0pO2lmKHN0cmVhbS5zdHJlYW1fb3BzLm9wZW4pe3N0cmVhbS5zdHJlYW1fb3BzLm9wZW4oc3RyZWFtKX1pZihNb2R1bGVbXCJsb2dSZWFkRmlsZXNcIl0mJiEoZmxhZ3MmMSkpe2lmKCEocGF0aCBpbiBGUy5yZWFkRmlsZXMpKXtGUy5yZWFkRmlsZXNbcGF0aF09MX19cmV0dXJuIHN0cmVhbX0sY2xvc2Uoc3RyZWFtKXtpZihGUy5pc0Nsb3NlZChzdHJlYW0pKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KX1pZihzdHJlYW0uZ2V0ZGVudHMpc3RyZWFtLmdldGRlbnRzPW51bGw7dHJ5e2lmKHN0cmVhbS5zdHJlYW1fb3BzLmNsb3NlKXtzdHJlYW0uc3RyZWFtX29wcy5jbG9zZShzdHJlYW0pfX1jYXRjaChlKXt0aHJvdyBlfWZpbmFsbHl7RlMuY2xvc2VTdHJlYW0oc3RyZWFtLmZkKX1zdHJlYW0uZmQ9bnVsbH0saXNDbG9zZWQoc3RyZWFtKXtyZXR1cm4gc3RyZWFtLmZkPT09bnVsbH0sbGxzZWVrKHN0cmVhbSxvZmZzZXQsd2hlbmNlKXtpZihGUy5pc0Nsb3NlZChzdHJlYW0pKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KX1pZighc3RyZWFtLnNlZWthYmxlfHwhc3RyZWFtLnN0cmVhbV9vcHMubGxzZWVrKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig3MCl9aWYod2hlbmNlIT0wJiZ3aGVuY2UhPTEmJndoZW5jZSE9Mil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpfXN0cmVhbS5wb3NpdGlvbj1zdHJlYW0uc3RyZWFtX29wcy5sbHNlZWsoc3RyZWFtLG9mZnNldCx3aGVuY2UpO3N0cmVhbS51bmdvdHRlbj1bXTtyZXR1cm4gc3RyZWFtLnBvc2l0aW9ufSxyZWFkKHN0cmVhbSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3NpdGlvbil7aWYobGVuZ3RoPDB8fHBvc2l0aW9uPDApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1pZihGUy5pc0Nsb3NlZChzdHJlYW0pKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig4KX1pZigoc3RyZWFtLmZsYWdzJjIwOTcxNTUpPT09MSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCl9aWYoRlMuaXNEaXIoc3RyZWFtLm5vZGUubW9kZSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDMxKX1pZighc3RyZWFtLnN0cmVhbV9vcHMucmVhZCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoMjgpfXZhciBzZWVraW5nPXR5cGVvZiBwb3NpdGlvbiE9XCJ1bmRlZmluZWRcIjtpZighc2Vla2luZyl7cG9zaXRpb249c3RyZWFtLnBvc2l0aW9ufWVsc2UgaWYoIXN0cmVhbS5zZWVrYWJsZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNzApfXZhciBieXRlc1JlYWQ9c3RyZWFtLnN0cmVhbV9vcHMucmVhZChzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24pO2lmKCFzZWVraW5nKXN0cmVhbS5wb3NpdGlvbis9Ynl0ZXNSZWFkO3JldHVybiBieXRlc1JlYWR9LHdyaXRlKHN0cmVhbSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3NpdGlvbixjYW5Pd24pe2lmKGxlbmd0aDwwfHxwb3NpdGlvbjwwKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCl9aWYoRlMuaXNDbG9zZWQoc3RyZWFtKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCl9aWYoKHN0cmVhbS5mbGFncyYyMDk3MTU1KT09PTApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpfWlmKEZTLmlzRGlyKHN0cmVhbS5ub2RlLm1vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigzMSl9aWYoIXN0cmVhbS5zdHJlYW1fb3BzLndyaXRlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOCl9aWYoc3RyZWFtLnNlZWthYmxlJiZzdHJlYW0uZmxhZ3MmMTAyNCl7RlMubGxzZWVrKHN0cmVhbSwwLDIpfXZhciBzZWVraW5nPXR5cGVvZiBwb3NpdGlvbiE9XCJ1bmRlZmluZWRcIjtpZighc2Vla2luZyl7cG9zaXRpb249c3RyZWFtLnBvc2l0aW9ufWVsc2UgaWYoIXN0cmVhbS5zZWVrYWJsZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNzApfXZhciBieXRlc1dyaXR0ZW49c3RyZWFtLnN0cmVhbV9vcHMud3JpdGUoc3RyZWFtLGJ1ZmZlcixvZmZzZXQsbGVuZ3RoLHBvc2l0aW9uLGNhbk93bik7aWYoIXNlZWtpbmcpc3RyZWFtLnBvc2l0aW9uKz1ieXRlc1dyaXR0ZW47cmV0dXJuIGJ5dGVzV3JpdHRlbn0sYWxsb2NhdGUoc3RyZWFtLG9mZnNldCxsZW5ndGgpe2lmKEZTLmlzQ2xvc2VkKHN0cmVhbSkpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDgpfWlmKG9mZnNldDwwfHxsZW5ndGg8PTApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1pZigoc3RyZWFtLmZsYWdzJjIwOTcxNTUpPT09MCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoOCl9aWYoIUZTLmlzRmlsZShzdHJlYW0ubm9kZS5tb2RlKSYmIUZTLmlzRGlyKHN0cmVhbS5ub2RlLm1vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0Myl9aWYoIXN0cmVhbS5zdHJlYW1fb3BzLmFsbG9jYXRlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigxMzgpfXN0cmVhbS5zdHJlYW1fb3BzLmFsbG9jYXRlKHN0cmVhbSxvZmZzZXQsbGVuZ3RoKX0sbW1hcChzdHJlYW0sbGVuZ3RoLHBvc2l0aW9uLHByb3QsZmxhZ3Mpe2lmKChwcm90JjIpIT09MCYmKGZsYWdzJjIpPT09MCYmKHN0cmVhbS5mbGFncyYyMDk3MTU1KSE9PTIpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDIpfWlmKChzdHJlYW0uZmxhZ3MmMjA5NzE1NSk9PT0xKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyKX1pZighc3RyZWFtLnN0cmVhbV9vcHMubW1hcCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDMpfWlmKCFsZW5ndGgpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI4KX1yZXR1cm4gc3RyZWFtLnN0cmVhbV9vcHMubW1hcChzdHJlYW0sbGVuZ3RoLHBvc2l0aW9uLHByb3QsZmxhZ3MpfSxtc3luYyhzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgsbW1hcEZsYWdzKXtpZighc3RyZWFtLnN0cmVhbV9vcHMubXN5bmMpe3JldHVybiAwfXJldHVybiBzdHJlYW0uc3RyZWFtX29wcy5tc3luYyhzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgsbW1hcEZsYWdzKX0saW9jdGwoc3RyZWFtLGNtZCxhcmcpe2lmKCFzdHJlYW0uc3RyZWFtX29wcy5pb2N0bCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTkpfXJldHVybiBzdHJlYW0uc3RyZWFtX29wcy5pb2N0bChzdHJlYW0sY21kLGFyZyl9LHJlYWRGaWxlKHBhdGgsb3B0cz17fSl7b3B0cy5mbGFncz1vcHRzLmZsYWdzfHwwO29wdHMuZW5jb2Rpbmc9b3B0cy5lbmNvZGluZ3x8XCJiaW5hcnlcIjtpZihvcHRzLmVuY29kaW5nIT09XCJ1dGY4XCImJm9wdHMuZW5jb2RpbmchPT1cImJpbmFyeVwiKXt0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZW5jb2RpbmcgdHlwZSBcIiR7b3B0cy5lbmNvZGluZ31cImApfXZhciByZXQ7dmFyIHN0cmVhbT1GUy5vcGVuKHBhdGgsb3B0cy5mbGFncyk7dmFyIHN0YXQ9RlMuc3RhdChwYXRoKTt2YXIgbGVuZ3RoPXN0YXQuc2l6ZTt2YXIgYnVmPW5ldyBVaW50OEFycmF5KGxlbmd0aCk7RlMucmVhZChzdHJlYW0sYnVmLDAsbGVuZ3RoLDApO2lmKG9wdHMuZW5jb2Rpbmc9PT1cInV0ZjhcIil7cmV0PVVURjhBcnJheVRvU3RyaW5nKGJ1Zil9ZWxzZSBpZihvcHRzLmVuY29kaW5nPT09XCJiaW5hcnlcIil7cmV0PWJ1Zn1GUy5jbG9zZShzdHJlYW0pO3JldHVybiByZXR9LHdyaXRlRmlsZShwYXRoLGRhdGEsb3B0cz17fSl7b3B0cy5mbGFncz1vcHRzLmZsYWdzfHw1Nzc7dmFyIHN0cmVhbT1GUy5vcGVuKHBhdGgsb3B0cy5mbGFncyxvcHRzLm1vZGUpO2lmKHR5cGVvZiBkYXRhPT1cInN0cmluZ1wiKXt2YXIgYnVmPW5ldyBVaW50OEFycmF5KGxlbmd0aEJ5dGVzVVRGOChkYXRhKSsxKTt2YXIgYWN0dWFsTnVtQnl0ZXM9c3RyaW5nVG9VVEY4QXJyYXkoZGF0YSxidWYsMCxidWYubGVuZ3RoKTtGUy53cml0ZShzdHJlYW0sYnVmLDAsYWN0dWFsTnVtQnl0ZXMsdW5kZWZpbmVkLG9wdHMuY2FuT3duKX1lbHNlIGlmKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSl7RlMud3JpdGUoc3RyZWFtLGRhdGEsMCxkYXRhLmJ5dGVMZW5ndGgsdW5kZWZpbmVkLG9wdHMuY2FuT3duKX1lbHNle3Rocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGRhdGEgdHlwZVwiKX1GUy5jbG9zZShzdHJlYW0pfSxjd2Q6KCk9PkZTLmN1cnJlbnRQYXRoLGNoZGlyKHBhdGgpe3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChwYXRoLHtmb2xsb3c6dHJ1ZX0pO2lmKGxvb2t1cC5ub2RlPT09bnVsbCl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpfWlmKCFGUy5pc0Rpcihsb29rdXAubm9kZS5tb2RlKSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNTQpfXZhciBlcnJDb2RlPUZTLm5vZGVQZXJtaXNzaW9ucyhsb29rdXAubm9kZSxcInhcIik7aWYoZXJyQ29kZSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoZXJyQ29kZSl9RlMuY3VycmVudFBhdGg9bG9va3VwLnBhdGh9LGNyZWF0ZURlZmF1bHREaXJlY3Rvcmllcygpe0ZTLm1rZGlyKFwiL3RtcFwiKTtGUy5ta2RpcihcIi9ob21lXCIpO0ZTLm1rZGlyKFwiL2hvbWUvd2ViX3VzZXJcIil9LGNyZWF0ZURlZmF1bHREZXZpY2VzKCl7RlMubWtkaXIoXCIvZGV2XCIpO0ZTLnJlZ2lzdGVyRGV2aWNlKEZTLm1ha2VkZXYoMSwzKSx7cmVhZDooKT0+MCx3cml0ZTooc3RyZWFtLGJ1ZmZlcixvZmZzZXQsbGVuZ3RoLHBvcyk9Pmxlbmd0aH0pO0ZTLm1rZGV2KFwiL2Rldi9udWxsXCIsRlMubWFrZWRldigxLDMpKTtUVFkucmVnaXN0ZXIoRlMubWFrZWRldig1LDApLFRUWS5kZWZhdWx0X3R0eV9vcHMpO1RUWS5yZWdpc3RlcihGUy5tYWtlZGV2KDYsMCksVFRZLmRlZmF1bHRfdHR5MV9vcHMpO0ZTLm1rZGV2KFwiL2Rldi90dHlcIixGUy5tYWtlZGV2KDUsMCkpO0ZTLm1rZGV2KFwiL2Rldi90dHkxXCIsRlMubWFrZWRldig2LDApKTt2YXIgcmFuZG9tQnVmZmVyPW5ldyBVaW50OEFycmF5KDEwMjQpLHJhbmRvbUxlZnQ9MDt2YXIgcmFuZG9tQnl0ZT0oKT0+e2lmKHJhbmRvbUxlZnQ9PT0wKXtyYW5kb21MZWZ0PXJhbmRvbUZpbGwocmFuZG9tQnVmZmVyKS5ieXRlTGVuZ3RofXJldHVybiByYW5kb21CdWZmZXJbLS1yYW5kb21MZWZ0XX07RlMuY3JlYXRlRGV2aWNlKFwiL2RldlwiLFwicmFuZG9tXCIscmFuZG9tQnl0ZSk7RlMuY3JlYXRlRGV2aWNlKFwiL2RldlwiLFwidXJhbmRvbVwiLHJhbmRvbUJ5dGUpO0ZTLm1rZGlyKFwiL2Rldi9zaG1cIik7RlMubWtkaXIoXCIvZGV2L3NobS90bXBcIil9LGNyZWF0ZVNwZWNpYWxEaXJlY3Rvcmllcygpe0ZTLm1rZGlyKFwiL3Byb2NcIik7dmFyIHByb2Nfc2VsZj1GUy5ta2RpcihcIi9wcm9jL3NlbGZcIik7RlMubWtkaXIoXCIvcHJvYy9zZWxmL2ZkXCIpO0ZTLm1vdW50KHttb3VudCgpe3ZhciBub2RlPUZTLmNyZWF0ZU5vZGUocHJvY19zZWxmLFwiZmRcIiwxNjM4NHw1MTEsNzMpO25vZGUubm9kZV9vcHM9e2xvb2t1cChwYXJlbnQsbmFtZSl7dmFyIGZkPStuYW1lO3ZhciBzdHJlYW09RlMuZ2V0U3RyZWFtQ2hlY2tlZChmZCk7dmFyIHJldD17cGFyZW50Om51bGwsbW91bnQ6e21vdW50cG9pbnQ6XCJmYWtlXCJ9LG5vZGVfb3BzOntyZWFkbGluazooKT0+c3RyZWFtLnBhdGh9fTtyZXQucGFyZW50PXJldDtyZXR1cm4gcmV0fX07cmV0dXJuIG5vZGV9fSx7fSxcIi9wcm9jL3NlbGYvZmRcIil9LGNyZWF0ZVN0YW5kYXJkU3RyZWFtcyhpbnB1dCxvdXRwdXQsZXJyb3Ipe2lmKGlucHV0KXtGUy5jcmVhdGVEZXZpY2UoXCIvZGV2XCIsXCJzdGRpblwiLGlucHV0KX1lbHNle0ZTLnN5bWxpbmsoXCIvZGV2L3R0eVwiLFwiL2Rldi9zdGRpblwiKX1pZihvdXRwdXQpe0ZTLmNyZWF0ZURldmljZShcIi9kZXZcIixcInN0ZG91dFwiLG51bGwsb3V0cHV0KX1lbHNle0ZTLnN5bWxpbmsoXCIvZGV2L3R0eVwiLFwiL2Rldi9zdGRvdXRcIil9aWYoZXJyb3Ipe0ZTLmNyZWF0ZURldmljZShcIi9kZXZcIixcInN0ZGVyclwiLG51bGwsZXJyb3IpfWVsc2V7RlMuc3ltbGluayhcIi9kZXYvdHR5MVwiLFwiL2Rldi9zdGRlcnJcIil9dmFyIHN0ZGluPUZTLm9wZW4oXCIvZGV2L3N0ZGluXCIsMCk7dmFyIHN0ZG91dD1GUy5vcGVuKFwiL2Rldi9zdGRvdXRcIiwxKTt2YXIgc3RkZXJyPUZTLm9wZW4oXCIvZGV2L3N0ZGVyclwiLDEpfSxzdGF0aWNJbml0KCl7WzQ0XS5mb3JFYWNoKGNvZGU9PntGUy5nZW5lcmljRXJyb3JzW2NvZGVdPW5ldyBGUy5FcnJub0Vycm9yKGNvZGUpO0ZTLmdlbmVyaWNFcnJvcnNbY29kZV0uc3RhY2s9XCI8Z2VuZXJpYyBlcnJvciwgbm8gc3RhY2s+XCJ9KTtGUy5uYW1lVGFibGU9bmV3IEFycmF5KDQwOTYpO0ZTLm1vdW50KE1FTUZTLHt9LFwiL1wiKTtGUy5jcmVhdGVEZWZhdWx0RGlyZWN0b3JpZXMoKTtGUy5jcmVhdGVEZWZhdWx0RGV2aWNlcygpO0ZTLmNyZWF0ZVNwZWNpYWxEaXJlY3RvcmllcygpO0ZTLmZpbGVzeXN0ZW1zPXtNRU1GU319LGluaXQoaW5wdXQsb3V0cHV0LGVycm9yKXtGUy5pbml0aWFsaXplZD10cnVlO2lucHV0Pz89TW9kdWxlW1wic3RkaW5cIl07b3V0cHV0Pz89TW9kdWxlW1wic3Rkb3V0XCJdO2Vycm9yPz89TW9kdWxlW1wic3RkZXJyXCJdO0ZTLmNyZWF0ZVN0YW5kYXJkU3RyZWFtcyhpbnB1dCxvdXRwdXQsZXJyb3IpfSxxdWl0KCl7RlMuaW5pdGlhbGl6ZWQ9ZmFsc2U7Zm9yKHZhciBpPTA7aTxGUy5zdHJlYW1zLmxlbmd0aDtpKyspe3ZhciBzdHJlYW09RlMuc3RyZWFtc1tpXTtpZighc3RyZWFtKXtjb250aW51ZX1GUy5jbG9zZShzdHJlYW0pfX0sZmluZE9iamVjdChwYXRoLGRvbnRSZXNvbHZlTGFzdExpbmspe3ZhciByZXQ9RlMuYW5hbHl6ZVBhdGgocGF0aCxkb250UmVzb2x2ZUxhc3RMaW5rKTtpZighcmV0LmV4aXN0cyl7cmV0dXJuIG51bGx9cmV0dXJuIHJldC5vYmplY3R9LGFuYWx5emVQYXRoKHBhdGgsZG9udFJlc29sdmVMYXN0TGluayl7dHJ5e3ZhciBsb29rdXA9RlMubG9va3VwUGF0aChwYXRoLHtmb2xsb3c6IWRvbnRSZXNvbHZlTGFzdExpbmt9KTtwYXRoPWxvb2t1cC5wYXRofWNhdGNoKGUpe312YXIgcmV0PXtpc1Jvb3Q6ZmFsc2UsZXhpc3RzOmZhbHNlLGVycm9yOjAsbmFtZTpudWxsLHBhdGg6bnVsbCxvYmplY3Q6bnVsbCxwYXJlbnRFeGlzdHM6ZmFsc2UscGFyZW50UGF0aDpudWxsLHBhcmVudE9iamVjdDpudWxsfTt0cnl7dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse3BhcmVudDp0cnVlfSk7cmV0LnBhcmVudEV4aXN0cz10cnVlO3JldC5wYXJlbnRQYXRoPWxvb2t1cC5wYXRoO3JldC5wYXJlbnRPYmplY3Q9bG9va3VwLm5vZGU7cmV0Lm5hbWU9UEFUSC5iYXNlbmFtZShwYXRoKTtsb29rdXA9RlMubG9va3VwUGF0aChwYXRoLHtmb2xsb3c6IWRvbnRSZXNvbHZlTGFzdExpbmt9KTtyZXQuZXhpc3RzPXRydWU7cmV0LnBhdGg9bG9va3VwLnBhdGg7cmV0Lm9iamVjdD1sb29rdXAubm9kZTtyZXQubmFtZT1sb29rdXAubm9kZS5uYW1lO3JldC5pc1Jvb3Q9bG9va3VwLnBhdGg9PT1cIi9cIn1jYXRjaChlKXtyZXQuZXJyb3I9ZS5lcnJub31yZXR1cm4gcmV0fSxjcmVhdGVQYXRoKHBhcmVudCxwYXRoLGNhblJlYWQsY2FuV3JpdGUpe3BhcmVudD10eXBlb2YgcGFyZW50PT1cInN0cmluZ1wiP3BhcmVudDpGUy5nZXRQYXRoKHBhcmVudCk7dmFyIHBhcnRzPXBhdGguc3BsaXQoXCIvXCIpLnJldmVyc2UoKTt3aGlsZShwYXJ0cy5sZW5ndGgpe3ZhciBwYXJ0PXBhcnRzLnBvcCgpO2lmKCFwYXJ0KWNvbnRpbnVlO3ZhciBjdXJyZW50PVBBVEguam9pbjIocGFyZW50LHBhcnQpO3RyeXtGUy5ta2RpcihjdXJyZW50KX1jYXRjaChlKXt9cGFyZW50PWN1cnJlbnR9cmV0dXJuIGN1cnJlbnR9LGNyZWF0ZUZpbGUocGFyZW50LG5hbWUscHJvcGVydGllcyxjYW5SZWFkLGNhbldyaXRlKXt2YXIgcGF0aD1QQVRILmpvaW4yKHR5cGVvZiBwYXJlbnQ9PVwic3RyaW5nXCI/cGFyZW50OkZTLmdldFBhdGgocGFyZW50KSxuYW1lKTt2YXIgbW9kZT1GU19nZXRNb2RlKGNhblJlYWQsY2FuV3JpdGUpO3JldHVybiBGUy5jcmVhdGUocGF0aCxtb2RlKX0sY3JlYXRlRGF0YUZpbGUocGFyZW50LG5hbWUsZGF0YSxjYW5SZWFkLGNhbldyaXRlLGNhbk93bil7dmFyIHBhdGg9bmFtZTtpZihwYXJlbnQpe3BhcmVudD10eXBlb2YgcGFyZW50PT1cInN0cmluZ1wiP3BhcmVudDpGUy5nZXRQYXRoKHBhcmVudCk7cGF0aD1uYW1lP1BBVEguam9pbjIocGFyZW50LG5hbWUpOnBhcmVudH12YXIgbW9kZT1GU19nZXRNb2RlKGNhblJlYWQsY2FuV3JpdGUpO3ZhciBub2RlPUZTLmNyZWF0ZShwYXRoLG1vZGUpO2lmKGRhdGEpe2lmKHR5cGVvZiBkYXRhPT1cInN0cmluZ1wiKXt2YXIgYXJyPW5ldyBBcnJheShkYXRhLmxlbmd0aCk7Zm9yKHZhciBpPTAsbGVuPWRhdGEubGVuZ3RoO2k8bGVuOysraSlhcnJbaV09ZGF0YS5jaGFyQ29kZUF0KGkpO2RhdGE9YXJyfUZTLmNobW9kKG5vZGUsbW9kZXwxNDYpO3ZhciBzdHJlYW09RlMub3Blbihub2RlLDU3Nyk7RlMud3JpdGUoc3RyZWFtLGRhdGEsMCxkYXRhLmxlbmd0aCwwLGNhbk93bik7RlMuY2xvc2Uoc3RyZWFtKTtGUy5jaG1vZChub2RlLG1vZGUpfX0sY3JlYXRlRGV2aWNlKHBhcmVudCxuYW1lLGlucHV0LG91dHB1dCl7dmFyIHBhdGg9UEFUSC5qb2luMih0eXBlb2YgcGFyZW50PT1cInN0cmluZ1wiP3BhcmVudDpGUy5nZXRQYXRoKHBhcmVudCksbmFtZSk7dmFyIG1vZGU9RlNfZ2V0TW9kZSghIWlucHV0LCEhb3V0cHV0KTtGUy5jcmVhdGVEZXZpY2UubWFqb3I/Pz02NDt2YXIgZGV2PUZTLm1ha2VkZXYoRlMuY3JlYXRlRGV2aWNlLm1ham9yKyssMCk7RlMucmVnaXN0ZXJEZXZpY2UoZGV2LHtvcGVuKHN0cmVhbSl7c3RyZWFtLnNlZWthYmxlPWZhbHNlfSxjbG9zZShzdHJlYW0pe2lmKG91dHB1dD8uYnVmZmVyPy5sZW5ndGgpe291dHB1dCgxMCl9fSxyZWFkKHN0cmVhbSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3Mpe3ZhciBieXRlc1JlYWQ9MDtmb3IodmFyIGk9MDtpPGxlbmd0aDtpKyspe3ZhciByZXN1bHQ7dHJ5e3Jlc3VsdD1pbnB1dCgpfWNhdGNoKGUpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI5KX1pZihyZXN1bHQ9PT11bmRlZmluZWQmJmJ5dGVzUmVhZD09PTApe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDYpfWlmKHJlc3VsdD09PW51bGx8fHJlc3VsdD09PXVuZGVmaW5lZClicmVhaztieXRlc1JlYWQrKztidWZmZXJbb2Zmc2V0K2ldPXJlc3VsdH1pZihieXRlc1JlYWQpe3N0cmVhbS5ub2RlLnRpbWVzdGFtcD1EYXRlLm5vdygpfXJldHVybiBieXRlc1JlYWR9LHdyaXRlKHN0cmVhbSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3Mpe2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krKyl7dHJ5e291dHB1dChidWZmZXJbb2Zmc2V0K2ldKX1jYXRjaChlKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcigyOSl9fWlmKGxlbmd0aCl7c3RyZWFtLm5vZGUudGltZXN0YW1wPURhdGUubm93KCl9cmV0dXJuIGl9fSk7cmV0dXJuIEZTLm1rZGV2KHBhdGgsbW9kZSxkZXYpfSxmb3JjZUxvYWRGaWxlKG9iail7aWYob2JqLmlzRGV2aWNlfHxvYmouaXNGb2xkZXJ8fG9iai5saW5rfHxvYmouY29udGVudHMpcmV0dXJuIHRydWU7aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0IT1cInVuZGVmaW5lZFwiKXt0aHJvdyBuZXcgRXJyb3IoXCJMYXp5IGxvYWRpbmcgc2hvdWxkIGhhdmUgYmVlbiBwZXJmb3JtZWQgKGNvbnRlbnRzIHNldCkgaW4gY3JlYXRlTGF6eUZpbGUsIGJ1dCBpdCB3YXMgbm90LiBMYXp5IGxvYWRpbmcgb25seSB3b3JrcyBpbiB3ZWIgd29ya2Vycy4gVXNlIC0tZW1iZWQtZmlsZSBvciAtLXByZWxvYWQtZmlsZSBpbiBlbWNjIG9uIHRoZSBtYWluIHRocmVhZC5cIil9ZWxzZXt0cnl7b2JqLmNvbnRlbnRzPXJlYWRCaW5hcnkob2JqLnVybCk7b2JqLnVzZWRCeXRlcz1vYmouY29udGVudHMubGVuZ3RofWNhdGNoKGUpe3Rocm93IG5ldyBGUy5FcnJub0Vycm9yKDI5KX19fSxjcmVhdGVMYXp5RmlsZShwYXJlbnQsbmFtZSx1cmwsY2FuUmVhZCxjYW5Xcml0ZSl7Y2xhc3MgTGF6eVVpbnQ4QXJyYXl7Y29uc3RydWN0b3IoKXt0aGlzLmxlbmd0aEtub3duPWZhbHNlO3RoaXMuY2h1bmtzPVtdfWdldChpZHgpe2lmKGlkeD50aGlzLmxlbmd0aC0xfHxpZHg8MCl7cmV0dXJuIHVuZGVmaW5lZH12YXIgY2h1bmtPZmZzZXQ9aWR4JXRoaXMuY2h1bmtTaXplO3ZhciBjaHVua051bT1pZHgvdGhpcy5jaHVua1NpemV8MDtyZXR1cm4gdGhpcy5nZXR0ZXIoY2h1bmtOdW0pW2NodW5rT2Zmc2V0XX1zZXREYXRhR2V0dGVyKGdldHRlcil7dGhpcy5nZXR0ZXI9Z2V0dGVyfWNhY2hlTGVuZ3RoKCl7dmFyIHhocj1uZXcgWE1MSHR0cFJlcXVlc3Q7eGhyLm9wZW4oXCJIRUFEXCIsdXJsLGZhbHNlKTt4aHIuc2VuZChudWxsKTtpZighKHhoci5zdGF0dXM+PTIwMCYmeGhyLnN0YXR1czwzMDB8fHhoci5zdGF0dXM9PT0zMDQpKXRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGxvYWQgXCIrdXJsK1wiLiBTdGF0dXM6IFwiK3hoci5zdGF0dXMpO3ZhciBkYXRhbGVuZ3RoPU51bWJlcih4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LWxlbmd0aFwiKSk7dmFyIGhlYWRlcjt2YXIgaGFzQnl0ZVNlcnZpbmc9KGhlYWRlcj14aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJBY2NlcHQtUmFuZ2VzXCIpKSYmaGVhZGVyPT09XCJieXRlc1wiO3ZhciB1c2VzR3ppcD0oaGVhZGVyPXhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtRW5jb2RpbmdcIikpJiZoZWFkZXI9PT1cImd6aXBcIjt2YXIgY2h1bmtTaXplPTEwMjQqMTAyNDtpZighaGFzQnl0ZVNlcnZpbmcpY2h1bmtTaXplPWRhdGFsZW5ndGg7dmFyIGRvWEhSPShmcm9tLHRvKT0+e2lmKGZyb20+dG8pdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCByYW5nZSAoXCIrZnJvbStcIiwgXCIrdG8rXCIpIG9yIG5vIGJ5dGVzIHJlcXVlc3RlZCFcIik7aWYodG8+ZGF0YWxlbmd0aC0xKXRocm93IG5ldyBFcnJvcihcIm9ubHkgXCIrZGF0YWxlbmd0aCtcIiBieXRlcyBhdmFpbGFibGUhIHByb2dyYW1tZXIgZXJyb3IhXCIpO3ZhciB4aHI9bmV3IFhNTEh0dHBSZXF1ZXN0O3hoci5vcGVuKFwiR0VUXCIsdXJsLGZhbHNlKTtpZihkYXRhbGVuZ3RoIT09Y2h1bmtTaXplKXhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiUmFuZ2VcIixcImJ5dGVzPVwiK2Zyb20rXCItXCIrdG8pO3hoci5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiO2lmKHhoci5vdmVycmlkZU1pbWVUeXBlKXt4aHIub3ZlcnJpZGVNaW1lVHlwZShcInRleHQvcGxhaW47IGNoYXJzZXQ9eC11c2VyLWRlZmluZWRcIil9eGhyLnNlbmQobnVsbCk7aWYoISh4aHIuc3RhdHVzPj0yMDAmJnhoci5zdGF0dXM8MzAwfHx4aHIuc3RhdHVzPT09MzA0KSl0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBsb2FkIFwiK3VybCtcIi4gU3RhdHVzOiBcIit4aHIuc3RhdHVzKTtpZih4aHIucmVzcG9uc2UhPT11bmRlZmluZWQpe3JldHVybiBuZXcgVWludDhBcnJheSh4aHIucmVzcG9uc2V8fFtdKX1yZXR1cm4gaW50QXJyYXlGcm9tU3RyaW5nKHhoci5yZXNwb25zZVRleHR8fFwiXCIsdHJ1ZSl9O3ZhciBsYXp5QXJyYXk9dGhpcztsYXp5QXJyYXkuc2V0RGF0YUdldHRlcihjaHVua051bT0+e3ZhciBzdGFydD1jaHVua051bSpjaHVua1NpemU7dmFyIGVuZD0oY2h1bmtOdW0rMSkqY2h1bmtTaXplLTE7ZW5kPU1hdGgubWluKGVuZCxkYXRhbGVuZ3RoLTEpO2lmKHR5cGVvZiBsYXp5QXJyYXkuY2h1bmtzW2NodW5rTnVtXT09XCJ1bmRlZmluZWRcIil7bGF6eUFycmF5LmNodW5rc1tjaHVua051bV09ZG9YSFIoc3RhcnQsZW5kKX1pZih0eXBlb2YgbGF6eUFycmF5LmNodW5rc1tjaHVua051bV09PVwidW5kZWZpbmVkXCIpdGhyb3cgbmV3IEVycm9yKFwiZG9YSFIgZmFpbGVkIVwiKTtyZXR1cm4gbGF6eUFycmF5LmNodW5rc1tjaHVua051bV19KTtpZih1c2VzR3ppcHx8IWRhdGFsZW5ndGgpe2NodW5rU2l6ZT1kYXRhbGVuZ3RoPTE7ZGF0YWxlbmd0aD10aGlzLmdldHRlcigwKS5sZW5ndGg7Y2h1bmtTaXplPWRhdGFsZW5ndGg7b3V0KFwiTGF6eUZpbGVzIG9uIGd6aXAgZm9yY2VzIGRvd25sb2FkIG9mIHRoZSB3aG9sZSBmaWxlIHdoZW4gbGVuZ3RoIGlzIGFjY2Vzc2VkXCIpfXRoaXMuX2xlbmd0aD1kYXRhbGVuZ3RoO3RoaXMuX2NodW5rU2l6ZT1jaHVua1NpemU7dGhpcy5sZW5ndGhLbm93bj10cnVlfWdldCBsZW5ndGgoKXtpZighdGhpcy5sZW5ndGhLbm93bil7dGhpcy5jYWNoZUxlbmd0aCgpfXJldHVybiB0aGlzLl9sZW5ndGh9Z2V0IGNodW5rU2l6ZSgpe2lmKCF0aGlzLmxlbmd0aEtub3duKXt0aGlzLmNhY2hlTGVuZ3RoKCl9cmV0dXJuIHRoaXMuX2NodW5rU2l6ZX19aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0IT1cInVuZGVmaW5lZFwiKXtpZighRU5WSVJPTk1FTlRfSVNfV09SS0VSKXRocm93XCJDYW5ub3QgZG8gc3luY2hyb25vdXMgYmluYXJ5IFhIUnMgb3V0c2lkZSB3ZWJ3b3JrZXJzIGluIG1vZGVybiBicm93c2Vycy4gVXNlIC0tZW1iZWQtZmlsZSBvciAtLXByZWxvYWQtZmlsZSBpbiBlbWNjXCI7dmFyIGxhenlBcnJheT1uZXcgTGF6eVVpbnQ4QXJyYXk7dmFyIHByb3BlcnRpZXM9e2lzRGV2aWNlOmZhbHNlLGNvbnRlbnRzOmxhenlBcnJheX19ZWxzZXt2YXIgcHJvcGVydGllcz17aXNEZXZpY2U6ZmFsc2UsdXJsfX12YXIgbm9kZT1GUy5jcmVhdGVGaWxlKHBhcmVudCxuYW1lLHByb3BlcnRpZXMsY2FuUmVhZCxjYW5Xcml0ZSk7aWYocHJvcGVydGllcy5jb250ZW50cyl7bm9kZS5jb250ZW50cz1wcm9wZXJ0aWVzLmNvbnRlbnRzfWVsc2UgaWYocHJvcGVydGllcy51cmwpe25vZGUuY29udGVudHM9bnVsbDtub2RlLnVybD1wcm9wZXJ0aWVzLnVybH1PYmplY3QuZGVmaW5lUHJvcGVydGllcyhub2RlLHt1c2VkQnl0ZXM6e2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbnRlbnRzLmxlbmd0aH19fSk7dmFyIHN0cmVhbV9vcHM9e307dmFyIGtleXM9T2JqZWN0LmtleXMobm9kZS5zdHJlYW1fb3BzKTtrZXlzLmZvckVhY2goa2V5PT57dmFyIGZuPW5vZGUuc3RyZWFtX29wc1trZXldO3N0cmVhbV9vcHNba2V5XT0oLi4uYXJncyk9PntGUy5mb3JjZUxvYWRGaWxlKG5vZGUpO3JldHVybiBmbiguLi5hcmdzKX19KTtmdW5jdGlvbiB3cml0ZUNodW5rcyhzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24pe3ZhciBjb250ZW50cz1zdHJlYW0ubm9kZS5jb250ZW50cztpZihwb3NpdGlvbj49Y29udGVudHMubGVuZ3RoKXJldHVybiAwO3ZhciBzaXplPU1hdGgubWluKGNvbnRlbnRzLmxlbmd0aC1wb3NpdGlvbixsZW5ndGgpO2lmKGNvbnRlbnRzLnNsaWNlKXtmb3IodmFyIGk9MDtpPHNpemU7aSsrKXtidWZmZXJbb2Zmc2V0K2ldPWNvbnRlbnRzW3Bvc2l0aW9uK2ldfX1lbHNle2Zvcih2YXIgaT0wO2k8c2l6ZTtpKyspe2J1ZmZlcltvZmZzZXQraV09Y29udGVudHMuZ2V0KHBvc2l0aW9uK2kpfX1yZXR1cm4gc2l6ZX1zdHJlYW1fb3BzLnJlYWQ9KHN0cmVhbSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3NpdGlvbik9PntGUy5mb3JjZUxvYWRGaWxlKG5vZGUpO3JldHVybiB3cml0ZUNodW5rcyhzdHJlYW0sYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24pfTtzdHJlYW1fb3BzLm1tYXA9KHN0cmVhbSxsZW5ndGgscG9zaXRpb24scHJvdCxmbGFncyk9PntGUy5mb3JjZUxvYWRGaWxlKG5vZGUpO3ZhciBwdHI9bW1hcEFsbG9jKGxlbmd0aCk7aWYoIXB0cil7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDgpfXdyaXRlQ2h1bmtzKHN0cmVhbSxIRUFQOCxwdHIsbGVuZ3RoLHBvc2l0aW9uKTtyZXR1cm57cHRyLGFsbG9jYXRlZDp0cnVlfX07bm9kZS5zdHJlYW1fb3BzPXN0cmVhbV9vcHM7cmV0dXJuIG5vZGV9fTt2YXIgVVRGOFRvU3RyaW5nPShwdHIsbWF4Qnl0ZXNUb1JlYWQpPT5wdHI/VVRGOEFycmF5VG9TdHJpbmcoSEVBUFU4LHB0cixtYXhCeXRlc1RvUmVhZCk6XCJcIjt2YXIgU1lTQ0FMTFM9e0RFRkFVTFRfUE9MTE1BU0s6NSxjYWxjdWxhdGVBdChkaXJmZCxwYXRoLGFsbG93RW1wdHkpe2lmKFBBVEguaXNBYnMocGF0aCkpe3JldHVybiBwYXRofXZhciBkaXI7aWYoZGlyZmQ9PT0tMTAwKXtkaXI9RlMuY3dkKCl9ZWxzZXt2YXIgZGlyc3RyZWFtPVNZU0NBTExTLmdldFN0cmVhbUZyb21GRChkaXJmZCk7ZGlyPWRpcnN0cmVhbS5wYXRofWlmKHBhdGgubGVuZ3RoPT0wKXtpZighYWxsb3dFbXB0eSl7dGhyb3cgbmV3IEZTLkVycm5vRXJyb3IoNDQpfXJldHVybiBkaXJ9cmV0dXJuIFBBVEguam9pbjIoZGlyLHBhdGgpfSxkb1N0YXQoZnVuYyxwYXRoLGJ1Zil7dmFyIHN0YXQ9ZnVuYyhwYXRoKTtIRUFQMzJbYnVmPj4yXT1zdGF0LmRldjtIRUFQMzJbYnVmKzQ+PjJdPXN0YXQubW9kZTtIRUFQVTMyW2J1Zis4Pj4yXT1zdGF0Lm5saW5rO0hFQVAzMltidWYrMTI+PjJdPXN0YXQudWlkO0hFQVAzMltidWYrMTY+PjJdPXN0YXQuZ2lkO0hFQVAzMltidWYrMjA+PjJdPXN0YXQucmRldjt0ZW1wSTY0PVtzdGF0LnNpemU+Pj4wLCh0ZW1wRG91YmxlPXN0YXQuc2l6ZSwrTWF0aC5hYnModGVtcERvdWJsZSk+PTE/dGVtcERvdWJsZT4wPytNYXRoLmZsb29yKHRlbXBEb3VibGUvNDI5NDk2NzI5Nik+Pj4wOn5+K01hdGguY2VpbCgodGVtcERvdWJsZS0rKH5+dGVtcERvdWJsZT4+PjApKS80Mjk0OTY3Mjk2KT4+PjA6MCldLEhFQVAzMltidWYrMjQ+PjJdPXRlbXBJNjRbMF0sSEVBUDMyW2J1ZisyOD4+Ml09dGVtcEk2NFsxXTtIRUFQMzJbYnVmKzMyPj4yXT00MDk2O0hFQVAzMltidWYrMzY+PjJdPXN0YXQuYmxvY2tzO3ZhciBhdGltZT1zdGF0LmF0aW1lLmdldFRpbWUoKTt2YXIgbXRpbWU9c3RhdC5tdGltZS5nZXRUaW1lKCk7dmFyIGN0aW1lPXN0YXQuY3RpbWUuZ2V0VGltZSgpO3RlbXBJNjQ9W01hdGguZmxvb3IoYXRpbWUvMWUzKT4+PjAsKHRlbXBEb3VibGU9TWF0aC5mbG9vcihhdGltZS8xZTMpLCtNYXRoLmFicyh0ZW1wRG91YmxlKT49MT90ZW1wRG91YmxlPjA/K01hdGguZmxvb3IodGVtcERvdWJsZS80Mjk0OTY3Mjk2KT4+PjA6fn4rTWF0aC5jZWlsKCh0ZW1wRG91YmxlLSsofn50ZW1wRG91YmxlPj4+MCkpLzQyOTQ5NjcyOTYpPj4+MDowKV0sSEVBUDMyW2J1Zis0MD4+Ml09dGVtcEk2NFswXSxIRUFQMzJbYnVmKzQ0Pj4yXT10ZW1wSTY0WzFdO0hFQVBVMzJbYnVmKzQ4Pj4yXT1hdGltZSUxZTMqMWUzKjFlMzt0ZW1wSTY0PVtNYXRoLmZsb29yKG10aW1lLzFlMyk+Pj4wLCh0ZW1wRG91YmxlPU1hdGguZmxvb3IobXRpbWUvMWUzKSwrTWF0aC5hYnModGVtcERvdWJsZSk+PTE/dGVtcERvdWJsZT4wPytNYXRoLmZsb29yKHRlbXBEb3VibGUvNDI5NDk2NzI5Nik+Pj4wOn5+K01hdGguY2VpbCgodGVtcERvdWJsZS0rKH5+dGVtcERvdWJsZT4+PjApKS80Mjk0OTY3Mjk2KT4+PjA6MCldLEhFQVAzMltidWYrNTY+PjJdPXRlbXBJNjRbMF0sSEVBUDMyW2J1Zis2MD4+Ml09dGVtcEk2NFsxXTtIRUFQVTMyW2J1Zis2ND4+Ml09bXRpbWUlMWUzKjFlMyoxZTM7dGVtcEk2ND1bTWF0aC5mbG9vcihjdGltZS8xZTMpPj4+MCwodGVtcERvdWJsZT1NYXRoLmZsb29yKGN0aW1lLzFlMyksK01hdGguYWJzKHRlbXBEb3VibGUpPj0xP3RlbXBEb3VibGU+MD8rTWF0aC5mbG9vcih0ZW1wRG91YmxlLzQyOTQ5NjcyOTYpPj4+MDp+fitNYXRoLmNlaWwoKHRlbXBEb3VibGUtKyh+fnRlbXBEb3VibGU+Pj4wKSkvNDI5NDk2NzI5Nik+Pj4wOjApXSxIRUFQMzJbYnVmKzcyPj4yXT10ZW1wSTY0WzBdLEhFQVAzMltidWYrNzY+PjJdPXRlbXBJNjRbMV07SEVBUFUzMltidWYrODA+PjJdPWN0aW1lJTFlMyoxZTMqMWUzO3RlbXBJNjQ9W3N0YXQuaW5vPj4+MCwodGVtcERvdWJsZT1zdGF0LmlubywrTWF0aC5hYnModGVtcERvdWJsZSk+PTE/dGVtcERvdWJsZT4wPytNYXRoLmZsb29yKHRlbXBEb3VibGUvNDI5NDk2NzI5Nik+Pj4wOn5+K01hdGguY2VpbCgodGVtcERvdWJsZS0rKH5+dGVtcERvdWJsZT4+PjApKS80Mjk0OTY3Mjk2KT4+PjA6MCldLEhFQVAzMltidWYrODg+PjJdPXRlbXBJNjRbMF0sSEVBUDMyW2J1Zis5Mj4+Ml09dGVtcEk2NFsxXTtyZXR1cm4gMH0sZG9Nc3luYyhhZGRyLHN0cmVhbSxsZW4sZmxhZ3Msb2Zmc2V0KXtpZighRlMuaXNGaWxlKHN0cmVhbS5ub2RlLm1vZGUpKXt0aHJvdyBuZXcgRlMuRXJybm9FcnJvcig0Myl9aWYoZmxhZ3MmMil7cmV0dXJuIDB9dmFyIGJ1ZmZlcj1IRUFQVTguc2xpY2UoYWRkcixhZGRyK2xlbik7RlMubXN5bmMoc3RyZWFtLGJ1ZmZlcixvZmZzZXQsbGVuLGZsYWdzKX0sZ2V0U3RyZWFtRnJvbUZEKGZkKXt2YXIgc3RyZWFtPUZTLmdldFN0cmVhbUNoZWNrZWQoZmQpO3JldHVybiBzdHJlYW19LHZhcmFyZ3M6dW5kZWZpbmVkLGdldFN0cihwdHIpe3ZhciByZXQ9VVRGOFRvU3RyaW5nKHB0cik7cmV0dXJuIHJldH19O2Z1bmN0aW9uIF9fX3N5c2NhbGxfY2htb2QocGF0aCxtb2RlKXt0cnl7cGF0aD1TWVNDQUxMUy5nZXRTdHIocGF0aCk7RlMuY2htb2QocGF0aCxtb2RlKTtyZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuLWUuZXJybm99fWZ1bmN0aW9uIF9fX3N5c2NhbGxfZmFjY2Vzc2F0KGRpcmZkLHBhdGgsYW1vZGUsZmxhZ3Mpe3RyeXtwYXRoPVNZU0NBTExTLmdldFN0cihwYXRoKTtwYXRoPVNZU0NBTExTLmNhbGN1bGF0ZUF0KGRpcmZkLHBhdGgpO2lmKGFtb2RlJn43KXtyZXR1cm4tMjh9dmFyIGxvb2t1cD1GUy5sb29rdXBQYXRoKHBhdGgse2ZvbGxvdzp0cnVlfSk7dmFyIG5vZGU9bG9va3VwLm5vZGU7aWYoIW5vZGUpe3JldHVybi00NH12YXIgcGVybXM9XCJcIjtpZihhbW9kZSY0KXBlcm1zKz1cInJcIjtpZihhbW9kZSYyKXBlcm1zKz1cIndcIjtpZihhbW9kZSYxKXBlcm1zKz1cInhcIjtpZihwZXJtcyYmRlMubm9kZVBlcm1pc3Npb25zKG5vZGUscGVybXMpKXtyZXR1cm4tMn1yZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuLWUuZXJybm99fWZ1bmN0aW9uIHN5c2NhbGxHZXRWYXJhcmdJKCl7dmFyIHJldD1IRUFQMzJbK1NZU0NBTExTLnZhcmFyZ3M+PjJdO1NZU0NBTExTLnZhcmFyZ3MrPTQ7cmV0dXJuIHJldH12YXIgc3lzY2FsbEdldFZhcmFyZ1A9c3lzY2FsbEdldFZhcmFyZ0k7ZnVuY3Rpb24gX19fc3lzY2FsbF9mY250bDY0KGZkLGNtZCx2YXJhcmdzKXtTWVNDQUxMUy52YXJhcmdzPXZhcmFyZ3M7dHJ5e3ZhciBzdHJlYW09U1lTQ0FMTFMuZ2V0U3RyZWFtRnJvbUZEKGZkKTtzd2l0Y2goY21kKXtjYXNlIDA6e3ZhciBhcmc9c3lzY2FsbEdldFZhcmFyZ0koKTtpZihhcmc8MCl7cmV0dXJuLTI4fXdoaWxlKEZTLnN0cmVhbXNbYXJnXSl7YXJnKyt9dmFyIG5ld1N0cmVhbTtuZXdTdHJlYW09RlMuZHVwU3RyZWFtKHN0cmVhbSxhcmcpO3JldHVybiBuZXdTdHJlYW0uZmR9Y2FzZSAxOmNhc2UgMjpyZXR1cm4gMDtjYXNlIDM6cmV0dXJuIHN0cmVhbS5mbGFncztjYXNlIDQ6e3ZhciBhcmc9c3lzY2FsbEdldFZhcmFyZ0koKTtzdHJlYW0uZmxhZ3N8PWFyZztyZXR1cm4gMH1jYXNlIDEyOnt2YXIgYXJnPXN5c2NhbGxHZXRWYXJhcmdQKCk7dmFyIG9mZnNldD0wO0hFQVAxNlthcmcrb2Zmc2V0Pj4xXT0yO3JldHVybiAwfWNhc2UgMTM6Y2FzZSAxNDpyZXR1cm4gMH1yZXR1cm4tMjh9Y2F0Y2goZSl7aWYodHlwZW9mIEZTPT1cInVuZGVmaW5lZFwifHwhKGUubmFtZT09PVwiRXJybm9FcnJvclwiKSl0aHJvdyBlO3JldHVybi1lLmVycm5vfX1mdW5jdGlvbiBfX19zeXNjYWxsX2ZzdGF0NjQoZmQsYnVmKXt0cnl7dmFyIHN0cmVhbT1TWVNDQUxMUy5nZXRTdHJlYW1Gcm9tRkQoZmQpO3JldHVybiBTWVNDQUxMUy5kb1N0YXQoRlMuc3RhdCxzdHJlYW0ucGF0aCxidWYpfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09XCJ1bmRlZmluZWRcInx8IShlLm5hbWU9PT1cIkVycm5vRXJyb3JcIikpdGhyb3cgZTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbF9pb2N0bChmZCxvcCx2YXJhcmdzKXtTWVNDQUxMUy52YXJhcmdzPXZhcmFyZ3M7dHJ5e3ZhciBzdHJlYW09U1lTQ0FMTFMuZ2V0U3RyZWFtRnJvbUZEKGZkKTtzd2l0Y2gob3Ape2Nhc2UgMjE1MDk6e2lmKCFzdHJlYW0udHR5KXJldHVybi01OTtyZXR1cm4gMH1jYXNlIDIxNTA1OntpZighc3RyZWFtLnR0eSlyZXR1cm4tNTk7aWYoc3RyZWFtLnR0eS5vcHMuaW9jdGxfdGNnZXRzKXt2YXIgdGVybWlvcz1zdHJlYW0udHR5Lm9wcy5pb2N0bF90Y2dldHMoc3RyZWFtKTt2YXIgYXJncD1zeXNjYWxsR2V0VmFyYXJnUCgpO0hFQVAzMlthcmdwPj4yXT10ZXJtaW9zLmNfaWZsYWd8fDA7SEVBUDMyW2FyZ3ArND4+Ml09dGVybWlvcy5jX29mbGFnfHwwO0hFQVAzMlthcmdwKzg+PjJdPXRlcm1pb3MuY19jZmxhZ3x8MDtIRUFQMzJbYXJncCsxMj4+Ml09dGVybWlvcy5jX2xmbGFnfHwwO2Zvcih2YXIgaT0wO2k8MzI7aSsrKXtIRUFQOFthcmdwK2krMTddPXRlcm1pb3MuY19jY1tpXXx8MH1yZXR1cm4gMH1yZXR1cm4gMH1jYXNlIDIxNTEwOmNhc2UgMjE1MTE6Y2FzZSAyMTUxMjp7aWYoIXN0cmVhbS50dHkpcmV0dXJuLTU5O3JldHVybiAwfWNhc2UgMjE1MDY6Y2FzZSAyMTUwNzpjYXNlIDIxNTA4OntpZighc3RyZWFtLnR0eSlyZXR1cm4tNTk7aWYoc3RyZWFtLnR0eS5vcHMuaW9jdGxfdGNzZXRzKXt2YXIgYXJncD1zeXNjYWxsR2V0VmFyYXJnUCgpO3ZhciBjX2lmbGFnPUhFQVAzMlthcmdwPj4yXTt2YXIgY19vZmxhZz1IRUFQMzJbYXJncCs0Pj4yXTt2YXIgY19jZmxhZz1IRUFQMzJbYXJncCs4Pj4yXTt2YXIgY19sZmxhZz1IRUFQMzJbYXJncCsxMj4+Ml07dmFyIGNfY2M9W107Zm9yKHZhciBpPTA7aTwzMjtpKyspe2NfY2MucHVzaChIRUFQOFthcmdwK2krMTddKX1yZXR1cm4gc3RyZWFtLnR0eS5vcHMuaW9jdGxfdGNzZXRzKHN0cmVhbS50dHksb3Ase2NfaWZsYWcsY19vZmxhZyxjX2NmbGFnLGNfbGZsYWcsY19jY30pfXJldHVybiAwfWNhc2UgMjE1MTk6e2lmKCFzdHJlYW0udHR5KXJldHVybi01OTt2YXIgYXJncD1zeXNjYWxsR2V0VmFyYXJnUCgpO0hFQVAzMlthcmdwPj4yXT0wO3JldHVybiAwfWNhc2UgMjE1MjA6e2lmKCFzdHJlYW0udHR5KXJldHVybi01OTtyZXR1cm4tMjh9Y2FzZSAyMTUzMTp7dmFyIGFyZ3A9c3lzY2FsbEdldFZhcmFyZ1AoKTtyZXR1cm4gRlMuaW9jdGwoc3RyZWFtLG9wLGFyZ3ApfWNhc2UgMjE1MjM6e2lmKCFzdHJlYW0udHR5KXJldHVybi01OTtpZihzdHJlYW0udHR5Lm9wcy5pb2N0bF90aW9jZ3dpbnN6KXt2YXIgd2luc2l6ZT1zdHJlYW0udHR5Lm9wcy5pb2N0bF90aW9jZ3dpbnN6KHN0cmVhbS50dHkpO3ZhciBhcmdwPXN5c2NhbGxHZXRWYXJhcmdQKCk7SEVBUDE2W2FyZ3A+PjFdPXdpbnNpemVbMF07SEVBUDE2W2FyZ3ArMj4+MV09d2luc2l6ZVsxXX1yZXR1cm4gMH1jYXNlIDIxNTI0OntpZighc3RyZWFtLnR0eSlyZXR1cm4tNTk7cmV0dXJuIDB9Y2FzZSAyMTUxNTp7aWYoIXN0cmVhbS50dHkpcmV0dXJuLTU5O3JldHVybiAwfWRlZmF1bHQ6cmV0dXJuLTI4fX1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuLWUuZXJybm99fWZ1bmN0aW9uIF9fX3N5c2NhbGxfbHN0YXQ2NChwYXRoLGJ1Zil7dHJ5e3BhdGg9U1lTQ0FMTFMuZ2V0U3RyKHBhdGgpO3JldHVybiBTWVNDQUxMUy5kb1N0YXQoRlMubHN0YXQscGF0aCxidWYpfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09XCJ1bmRlZmluZWRcInx8IShlLm5hbWU9PT1cIkVycm5vRXJyb3JcIikpdGhyb3cgZTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbF9uZXdmc3RhdGF0KGRpcmZkLHBhdGgsYnVmLGZsYWdzKXt0cnl7cGF0aD1TWVNDQUxMUy5nZXRTdHIocGF0aCk7dmFyIG5vZm9sbG93PWZsYWdzJjI1Njt2YXIgYWxsb3dFbXB0eT1mbGFncyY0MDk2O2ZsYWdzPWZsYWdzJn42NDAwO3BhdGg9U1lTQ0FMTFMuY2FsY3VsYXRlQXQoZGlyZmQscGF0aCxhbGxvd0VtcHR5KTtyZXR1cm4gU1lTQ0FMTFMuZG9TdGF0KG5vZm9sbG93P0ZTLmxzdGF0OkZTLnN0YXQscGF0aCxidWYpfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09XCJ1bmRlZmluZWRcInx8IShlLm5hbWU9PT1cIkVycm5vRXJyb3JcIikpdGhyb3cgZTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbF9vcGVuYXQoZGlyZmQscGF0aCxmbGFncyx2YXJhcmdzKXtTWVNDQUxMUy52YXJhcmdzPXZhcmFyZ3M7dHJ5e3BhdGg9U1lTQ0FMTFMuZ2V0U3RyKHBhdGgpO3BhdGg9U1lTQ0FMTFMuY2FsY3VsYXRlQXQoZGlyZmQscGF0aCk7dmFyIG1vZGU9dmFyYXJncz9zeXNjYWxsR2V0VmFyYXJnSSgpOjA7cmV0dXJuIEZTLm9wZW4ocGF0aCxmbGFncyxtb2RlKS5mZH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuLWUuZXJybm99fWZ1bmN0aW9uIF9fX3N5c2NhbGxfcm1kaXIocGF0aCl7dHJ5e3BhdGg9U1lTQ0FMTFMuZ2V0U3RyKHBhdGgpO0ZTLnJtZGlyKHBhdGgpO3JldHVybiAwfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09XCJ1bmRlZmluZWRcInx8IShlLm5hbWU9PT1cIkVycm5vRXJyb3JcIikpdGhyb3cgZTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbF9zdGF0NjQocGF0aCxidWYpe3RyeXtwYXRoPVNZU0NBTExTLmdldFN0cihwYXRoKTtyZXR1cm4gU1lTQ0FMTFMuZG9TdGF0KEZTLnN0YXQscGF0aCxidWYpfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09XCJ1bmRlZmluZWRcInx8IShlLm5hbWU9PT1cIkVycm5vRXJyb3JcIikpdGhyb3cgZTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbF91bmxpbmthdChkaXJmZCxwYXRoLGZsYWdzKXt0cnl7cGF0aD1TWVNDQUxMUy5nZXRTdHIocGF0aCk7cGF0aD1TWVNDQUxMUy5jYWxjdWxhdGVBdChkaXJmZCxwYXRoKTtpZihmbGFncz09PTApe0ZTLnVubGluayhwYXRoKX1lbHNlIGlmKGZsYWdzPT09NTEyKXtGUy5ybWRpcihwYXRoKX1lbHNle2Fib3J0KFwiSW52YWxpZCBmbGFncyBwYXNzZWQgdG8gdW5saW5rYXRcIil9cmV0dXJuIDB9Y2F0Y2goZSl7aWYodHlwZW9mIEZTPT1cInVuZGVmaW5lZFwifHwhKGUubmFtZT09PVwiRXJybm9FcnJvclwiKSl0aHJvdyBlO3JldHVybi1lLmVycm5vfX12YXIgX19hYm9ydF9qcz0oKT0+e2Fib3J0KFwiXCIpfTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfYmlnaW50PShwcmltaXRpdmVUeXBlLG5hbWUsc2l6ZSxtaW5SYW5nZSxtYXhSYW5nZSk9Pnt9O3ZhciBlbWJpbmRfaW5pdF9jaGFyQ29kZXM9KCk9Pnt2YXIgY29kZXM9bmV3IEFycmF5KDI1Nik7Zm9yKHZhciBpPTA7aTwyNTY7KytpKXtjb2Rlc1tpXT1TdHJpbmcuZnJvbUNoYXJDb2RlKGkpfWVtYmluZF9jaGFyQ29kZXM9Y29kZXN9O3ZhciBlbWJpbmRfY2hhckNvZGVzO3ZhciByZWFkTGF0aW4xU3RyaW5nPXB0cj0+e3ZhciByZXQ9XCJcIjt2YXIgYz1wdHI7d2hpbGUoSEVBUFU4W2NdKXtyZXQrPWVtYmluZF9jaGFyQ29kZXNbSEVBUFU4W2MrK11dfXJldHVybiByZXR9O3ZhciBhd2FpdGluZ0RlcGVuZGVuY2llcz17fTt2YXIgcmVnaXN0ZXJlZFR5cGVzPXt9O3ZhciB0eXBlRGVwZW5kZW5jaWVzPXt9O3ZhciBCaW5kaW5nRXJyb3I7dmFyIHRocm93QmluZGluZ0Vycm9yPW1lc3NhZ2U9Pnt0aHJvdyBuZXcgQmluZGluZ0Vycm9yKG1lc3NhZ2UpfTt2YXIgSW50ZXJuYWxFcnJvcjt2YXIgdGhyb3dJbnRlcm5hbEVycm9yPW1lc3NhZ2U9Pnt0aHJvdyBuZXcgSW50ZXJuYWxFcnJvcihtZXNzYWdlKX07dmFyIHdoZW5EZXBlbmRlbnRUeXBlc0FyZVJlc29sdmVkPShteVR5cGVzLGRlcGVuZGVudFR5cGVzLGdldFR5cGVDb252ZXJ0ZXJzKT0+e215VHlwZXMuZm9yRWFjaCh0eXBlPT50eXBlRGVwZW5kZW5jaWVzW3R5cGVdPWRlcGVuZGVudFR5cGVzKTtmdW5jdGlvbiBvbkNvbXBsZXRlKHR5cGVDb252ZXJ0ZXJzKXt2YXIgbXlUeXBlQ29udmVydGVycz1nZXRUeXBlQ29udmVydGVycyh0eXBlQ29udmVydGVycyk7aWYobXlUeXBlQ29udmVydGVycy5sZW5ndGghPT1teVR5cGVzLmxlbmd0aCl7dGhyb3dJbnRlcm5hbEVycm9yKFwiTWlzbWF0Y2hlZCB0eXBlIGNvbnZlcnRlciBjb3VudFwiKX1mb3IodmFyIGk9MDtpPG15VHlwZXMubGVuZ3RoOysraSl7cmVnaXN0ZXJUeXBlKG15VHlwZXNbaV0sbXlUeXBlQ29udmVydGVyc1tpXSl9fXZhciB0eXBlQ29udmVydGVycz1uZXcgQXJyYXkoZGVwZW5kZW50VHlwZXMubGVuZ3RoKTt2YXIgdW5yZWdpc3RlcmVkVHlwZXM9W107dmFyIHJlZ2lzdGVyZWQ9MDtkZXBlbmRlbnRUeXBlcy5mb3JFYWNoKChkdCxpKT0+e2lmKHJlZ2lzdGVyZWRUeXBlcy5oYXNPd25Qcm9wZXJ0eShkdCkpe3R5cGVDb252ZXJ0ZXJzW2ldPXJlZ2lzdGVyZWRUeXBlc1tkdF19ZWxzZXt1bnJlZ2lzdGVyZWRUeXBlcy5wdXNoKGR0KTtpZighYXdhaXRpbmdEZXBlbmRlbmNpZXMuaGFzT3duUHJvcGVydHkoZHQpKXthd2FpdGluZ0RlcGVuZGVuY2llc1tkdF09W119YXdhaXRpbmdEZXBlbmRlbmNpZXNbZHRdLnB1c2goKCk9Pnt0eXBlQ29udmVydGVyc1tpXT1yZWdpc3RlcmVkVHlwZXNbZHRdOysrcmVnaXN0ZXJlZDtpZihyZWdpc3RlcmVkPT09dW5yZWdpc3RlcmVkVHlwZXMubGVuZ3RoKXtvbkNvbXBsZXRlKHR5cGVDb252ZXJ0ZXJzKX19KX19KTtpZigwPT09dW5yZWdpc3RlcmVkVHlwZXMubGVuZ3RoKXtvbkNvbXBsZXRlKHR5cGVDb252ZXJ0ZXJzKX19O2Z1bmN0aW9uIHNoYXJlZFJlZ2lzdGVyVHlwZShyYXdUeXBlLHJlZ2lzdGVyZWRJbnN0YW5jZSxvcHRpb25zPXt9KXt2YXIgbmFtZT1yZWdpc3RlcmVkSW5zdGFuY2UubmFtZTtpZighcmF3VHlwZSl7dGhyb3dCaW5kaW5nRXJyb3IoYHR5cGUgXCIke25hbWV9XCIgbXVzdCBoYXZlIGEgcG9zaXRpdmUgaW50ZWdlciB0eXBlaWQgcG9pbnRlcmApfWlmKHJlZ2lzdGVyZWRUeXBlcy5oYXNPd25Qcm9wZXJ0eShyYXdUeXBlKSl7aWYob3B0aW9ucy5pZ25vcmVEdXBsaWNhdGVSZWdpc3RyYXRpb25zKXtyZXR1cm59ZWxzZXt0aHJvd0JpbmRpbmdFcnJvcihgQ2Fubm90IHJlZ2lzdGVyIHR5cGUgJyR7bmFtZX0nIHR3aWNlYCl9fXJlZ2lzdGVyZWRUeXBlc1tyYXdUeXBlXT1yZWdpc3RlcmVkSW5zdGFuY2U7ZGVsZXRlIHR5cGVEZXBlbmRlbmNpZXNbcmF3VHlwZV07aWYoYXdhaXRpbmdEZXBlbmRlbmNpZXMuaGFzT3duUHJvcGVydHkocmF3VHlwZSkpe3ZhciBjYWxsYmFja3M9YXdhaXRpbmdEZXBlbmRlbmNpZXNbcmF3VHlwZV07ZGVsZXRlIGF3YWl0aW5nRGVwZW5kZW5jaWVzW3Jhd1R5cGVdO2NhbGxiYWNrcy5mb3JFYWNoKGNiPT5jYigpKX19ZnVuY3Rpb24gcmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnM9e30pe3JldHVybiBzaGFyZWRSZWdpc3RlclR5cGUocmF3VHlwZSxyZWdpc3RlcmVkSW5zdGFuY2Usb3B0aW9ucyl9dmFyIEdlbmVyaWNXaXJlVHlwZVNpemU9ODt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfYm9vbD0ocmF3VHlwZSxuYW1lLHRydWVWYWx1ZSxmYWxzZVZhbHVlKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTtyZWdpc3RlclR5cGUocmF3VHlwZSx7bmFtZSxmcm9tV2lyZVR5cGU6ZnVuY3Rpb24od3Qpe3JldHVybiEhd3R9LHRvV2lyZVR5cGU6ZnVuY3Rpb24oZGVzdHJ1Y3RvcnMsbyl7cmV0dXJuIG8/dHJ1ZVZhbHVlOmZhbHNlVmFsdWV9LGFyZ1BhY2tBZHZhbmNlOkdlbmVyaWNXaXJlVHlwZVNpemUscmVhZFZhbHVlRnJvbVBvaW50ZXI6ZnVuY3Rpb24ocG9pbnRlcil7cmV0dXJuIHRoaXNbXCJmcm9tV2lyZVR5cGVcIl0oSEVBUFU4W3BvaW50ZXJdKX0sZGVzdHJ1Y3RvckZ1bmN0aW9uOm51bGx9KX07dmFyIGVtdmFsX2ZyZWVsaXN0PVtdO3ZhciBlbXZhbF9oYW5kbGVzPVtdO3ZhciBfX2VtdmFsX2RlY3JlZj1oYW5kbGU9PntpZihoYW5kbGU+OSYmMD09PS0tZW12YWxfaGFuZGxlc1toYW5kbGUrMV0pe2VtdmFsX2hhbmRsZXNbaGFuZGxlXT11bmRlZmluZWQ7ZW12YWxfZnJlZWxpc3QucHVzaChoYW5kbGUpfX07dmFyIGNvdW50X2VtdmFsX2hhbmRsZXM9KCk9PmVtdmFsX2hhbmRsZXMubGVuZ3RoLzItNS1lbXZhbF9mcmVlbGlzdC5sZW5ndGg7dmFyIGluaXRfZW12YWw9KCk9PntlbXZhbF9oYW5kbGVzLnB1c2goMCwxLHVuZGVmaW5lZCwxLG51bGwsMSx0cnVlLDEsZmFsc2UsMSk7TW9kdWxlW1wiY291bnRfZW12YWxfaGFuZGxlc1wiXT1jb3VudF9lbXZhbF9oYW5kbGVzfTt2YXIgRW12YWw9e3RvVmFsdWU6aGFuZGxlPT57aWYoIWhhbmRsZSl7dGhyb3dCaW5kaW5nRXJyb3IoXCJDYW5ub3QgdXNlIGRlbGV0ZWQgdmFsLiBoYW5kbGUgPSBcIitoYW5kbGUpfXJldHVybiBlbXZhbF9oYW5kbGVzW2hhbmRsZV19LHRvSGFuZGxlOnZhbHVlPT57c3dpdGNoKHZhbHVlKXtjYXNlIHVuZGVmaW5lZDpyZXR1cm4gMjtjYXNlIG51bGw6cmV0dXJuIDQ7Y2FzZSB0cnVlOnJldHVybiA2O2Nhc2UgZmFsc2U6cmV0dXJuIDg7ZGVmYXVsdDp7Y29uc3QgaGFuZGxlPWVtdmFsX2ZyZWVsaXN0LnBvcCgpfHxlbXZhbF9oYW5kbGVzLmxlbmd0aDtlbXZhbF9oYW5kbGVzW2hhbmRsZV09dmFsdWU7ZW12YWxfaGFuZGxlc1toYW5kbGUrMV09MTtyZXR1cm4gaGFuZGxlfX19fTtmdW5jdGlvbiByZWFkUG9pbnRlcihwb2ludGVyKXtyZXR1cm4gdGhpc1tcImZyb21XaXJlVHlwZVwiXShIRUFQVTMyW3BvaW50ZXI+PjJdKX12YXIgRW1WYWxUeXBlPXtuYW1lOlwiZW1zY3JpcHRlbjo6dmFsXCIsZnJvbVdpcmVUeXBlOmhhbmRsZT0+e3ZhciBydj1FbXZhbC50b1ZhbHVlKGhhbmRsZSk7X19lbXZhbF9kZWNyZWYoaGFuZGxlKTtyZXR1cm4gcnZ9LHRvV2lyZVR5cGU6KGRlc3RydWN0b3JzLHZhbHVlKT0+RW12YWwudG9IYW5kbGUodmFsdWUpLGFyZ1BhY2tBZHZhbmNlOkdlbmVyaWNXaXJlVHlwZVNpemUscmVhZFZhbHVlRnJvbVBvaW50ZXI6cmVhZFBvaW50ZXIsZGVzdHJ1Y3RvckZ1bmN0aW9uOm51bGx9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9lbXZhbD1yYXdUeXBlPT5yZWdpc3RlclR5cGUocmF3VHlwZSxFbVZhbFR5cGUpO3ZhciBmbG9hdFJlYWRWYWx1ZUZyb21Qb2ludGVyPShuYW1lLHdpZHRoKT0+e3N3aXRjaCh3aWR0aCl7Y2FzZSA0OnJldHVybiBmdW5jdGlvbihwb2ludGVyKXtyZXR1cm4gdGhpc1tcImZyb21XaXJlVHlwZVwiXShIRUFQRjMyW3BvaW50ZXI+PjJdKX07Y2FzZSA4OnJldHVybiBmdW5jdGlvbihwb2ludGVyKXtyZXR1cm4gdGhpc1tcImZyb21XaXJlVHlwZVwiXShIRUFQRjY0W3BvaW50ZXI+PjNdKX07ZGVmYXVsdDp0aHJvdyBuZXcgVHlwZUVycm9yKGBpbnZhbGlkIGZsb2F0IHdpZHRoICgke3dpZHRofSk6ICR7bmFtZX1gKX19O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9mbG9hdD0ocmF3VHlwZSxuYW1lLHNpemUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lLGZyb21XaXJlVHlwZTp2YWx1ZT0+dmFsdWUsdG9XaXJlVHlwZTooZGVzdHJ1Y3RvcnMsdmFsdWUpPT52YWx1ZSxhcmdQYWNrQWR2YW5jZTpHZW5lcmljV2lyZVR5cGVTaXplLHJlYWRWYWx1ZUZyb21Qb2ludGVyOmZsb2F0UmVhZFZhbHVlRnJvbVBvaW50ZXIobmFtZSxzaXplKSxkZXN0cnVjdG9yRnVuY3Rpb246bnVsbH0pfTt2YXIgY3JlYXRlTmFtZWRGdW5jdGlvbj0obmFtZSxib2R5KT0+T2JqZWN0LmRlZmluZVByb3BlcnR5KGJvZHksXCJuYW1lXCIse3ZhbHVlOm5hbWV9KTt2YXIgcnVuRGVzdHJ1Y3RvcnM9ZGVzdHJ1Y3RvcnM9Pnt3aGlsZShkZXN0cnVjdG9ycy5sZW5ndGgpe3ZhciBwdHI9ZGVzdHJ1Y3RvcnMucG9wKCk7dmFyIGRlbD1kZXN0cnVjdG9ycy5wb3AoKTtkZWwocHRyKX19O2Z1bmN0aW9uIHVzZXNEZXN0cnVjdG9yU3RhY2soYXJnVHlwZXMpe2Zvcih2YXIgaT0xO2k8YXJnVHlwZXMubGVuZ3RoOysraSl7aWYoYXJnVHlwZXNbaV0hPT1udWxsJiZhcmdUeXBlc1tpXS5kZXN0cnVjdG9yRnVuY3Rpb249PT11bmRlZmluZWQpe3JldHVybiB0cnVlfX1yZXR1cm4gZmFsc2V9ZnVuY3Rpb24gbmV3RnVuYyhjb25zdHJ1Y3Rvcixhcmd1bWVudExpc3Qpe2lmKCEoY29uc3RydWN0b3IgaW5zdGFuY2VvZiBGdW5jdGlvbikpe3Rocm93IG5ldyBUeXBlRXJyb3IoYG5ld18gY2FsbGVkIHdpdGggY29uc3RydWN0b3IgdHlwZSAke3R5cGVvZiBjb25zdHJ1Y3Rvcn0gd2hpY2ggaXMgbm90IGEgZnVuY3Rpb25gKX12YXIgZHVtbXk9Y3JlYXRlTmFtZWRGdW5jdGlvbihjb25zdHJ1Y3Rvci5uYW1lfHxcInVua25vd25GdW5jdGlvbk5hbWVcIixmdW5jdGlvbigpe30pO2R1bW15LnByb3RvdHlwZT1jb25zdHJ1Y3Rvci5wcm90b3R5cGU7dmFyIG9iaj1uZXcgZHVtbXk7dmFyIHI9Y29uc3RydWN0b3IuYXBwbHkob2JqLGFyZ3VtZW50TGlzdCk7cmV0dXJuIHIgaW5zdGFuY2VvZiBPYmplY3Q/cjpvYmp9ZnVuY3Rpb24gY3JlYXRlSnNJbnZva2VyKGFyZ1R5cGVzLGlzQ2xhc3NNZXRob2RGdW5jLHJldHVybnMsaXNBc3luYyl7dmFyIG5lZWRzRGVzdHJ1Y3RvclN0YWNrPXVzZXNEZXN0cnVjdG9yU3RhY2soYXJnVHlwZXMpO3ZhciBhcmdDb3VudD1hcmdUeXBlcy5sZW5ndGgtMjt2YXIgYXJnc0xpc3Q9W107dmFyIGFyZ3NMaXN0V2lyZWQ9W1wiZm5cIl07aWYoaXNDbGFzc01ldGhvZEZ1bmMpe2FyZ3NMaXN0V2lyZWQucHVzaChcInRoaXNXaXJlZFwiKX1mb3IodmFyIGk9MDtpPGFyZ0NvdW50OysraSl7YXJnc0xpc3QucHVzaChgYXJnJHtpfWApO2FyZ3NMaXN0V2lyZWQucHVzaChgYXJnJHtpfVdpcmVkYCl9YXJnc0xpc3Q9YXJnc0xpc3Quam9pbihcIixcIik7YXJnc0xpc3RXaXJlZD1hcmdzTGlzdFdpcmVkLmpvaW4oXCIsXCIpO3ZhciBpbnZva2VyRm5Cb2R5PWByZXR1cm4gZnVuY3Rpb24gKCR7YXJnc0xpc3R9KSB7XFxuYDtpZihuZWVkc0Rlc3RydWN0b3JTdGFjayl7aW52b2tlckZuQm9keSs9XCJ2YXIgZGVzdHJ1Y3RvcnMgPSBbXTtcXG5cIn12YXIgZHRvclN0YWNrPW5lZWRzRGVzdHJ1Y3RvclN0YWNrP1wiZGVzdHJ1Y3RvcnNcIjpcIm51bGxcIjt2YXIgYXJnczE9W1wiaHVtYW5OYW1lXCIsXCJ0aHJvd0JpbmRpbmdFcnJvclwiLFwiaW52b2tlclwiLFwiZm5cIixcInJ1bkRlc3RydWN0b3JzXCIsXCJyZXRUeXBlXCIsXCJjbGFzc1BhcmFtXCJdO2lmKGlzQ2xhc3NNZXRob2RGdW5jKXtpbnZva2VyRm5Cb2R5Kz1gdmFyIHRoaXNXaXJlZCA9IGNsYXNzUGFyYW1bJ3RvV2lyZVR5cGUnXSgke2R0b3JTdGFja30sIHRoaXMpO1xcbmB9Zm9yKHZhciBpPTA7aTxhcmdDb3VudDsrK2kpe2ludm9rZXJGbkJvZHkrPWB2YXIgYXJnJHtpfVdpcmVkID0gYXJnVHlwZSR7aX1bJ3RvV2lyZVR5cGUnXSgke2R0b3JTdGFja30sIGFyZyR7aX0pO1xcbmA7YXJnczEucHVzaChgYXJnVHlwZSR7aX1gKX1pbnZva2VyRm5Cb2R5Kz0ocmV0dXJuc3x8aXNBc3luYz9cInZhciBydiA9IFwiOlwiXCIpK2BpbnZva2VyKCR7YXJnc0xpc3RXaXJlZH0pO1xcbmA7aWYobmVlZHNEZXN0cnVjdG9yU3RhY2spe2ludm9rZXJGbkJvZHkrPVwicnVuRGVzdHJ1Y3RvcnMoZGVzdHJ1Y3RvcnMpO1xcblwifWVsc2V7Zm9yKHZhciBpPWlzQ2xhc3NNZXRob2RGdW5jPzE6MjtpPGFyZ1R5cGVzLmxlbmd0aDsrK2kpe3ZhciBwYXJhbU5hbWU9aT09PTE/XCJ0aGlzV2lyZWRcIjpcImFyZ1wiKyhpLTIpK1wiV2lyZWRcIjtpZihhcmdUeXBlc1tpXS5kZXN0cnVjdG9yRnVuY3Rpb24hPT1udWxsKXtpbnZva2VyRm5Cb2R5Kz1gJHtwYXJhbU5hbWV9X2R0b3IoJHtwYXJhbU5hbWV9KTtcXG5gO2FyZ3MxLnB1c2goYCR7cGFyYW1OYW1lfV9kdG9yYCl9fX1pZihyZXR1cm5zKXtpbnZva2VyRm5Cb2R5Kz1cInZhciByZXQgPSByZXRUeXBlWydmcm9tV2lyZVR5cGUnXShydik7XFxuXCIrXCJyZXR1cm4gcmV0O1xcblwifWVsc2V7fWludm9rZXJGbkJvZHkrPVwifVxcblwiO3JldHVyblthcmdzMSxpbnZva2VyRm5Cb2R5XX1mdW5jdGlvbiBjcmFmdEludm9rZXJGdW5jdGlvbihodW1hbk5hbWUsYXJnVHlwZXMsY2xhc3NUeXBlLGNwcEludm9rZXJGdW5jLGNwcFRhcmdldEZ1bmMsaXNBc3luYyl7dmFyIGFyZ0NvdW50PWFyZ1R5cGVzLmxlbmd0aDtpZihhcmdDb3VudDwyKXt0aHJvd0JpbmRpbmdFcnJvcihcImFyZ1R5cGVzIGFycmF5IHNpemUgbWlzbWF0Y2ghIE11c3QgYXQgbGVhc3QgZ2V0IHJldHVybiB2YWx1ZSBhbmQgJ3RoaXMnIHR5cGVzIVwiKX12YXIgaXNDbGFzc01ldGhvZEZ1bmM9YXJnVHlwZXNbMV0hPT1udWxsJiZjbGFzc1R5cGUhPT1udWxsO3ZhciBuZWVkc0Rlc3RydWN0b3JTdGFjaz11c2VzRGVzdHJ1Y3RvclN0YWNrKGFyZ1R5cGVzKTt2YXIgcmV0dXJucz1hcmdUeXBlc1swXS5uYW1lIT09XCJ2b2lkXCI7dmFyIGNsb3N1cmVBcmdzPVtodW1hbk5hbWUsdGhyb3dCaW5kaW5nRXJyb3IsY3BwSW52b2tlckZ1bmMsY3BwVGFyZ2V0RnVuYyxydW5EZXN0cnVjdG9ycyxhcmdUeXBlc1swXSxhcmdUeXBlc1sxXV07Zm9yKHZhciBpPTA7aTxhcmdDb3VudC0yOysraSl7Y2xvc3VyZUFyZ3MucHVzaChhcmdUeXBlc1tpKzJdKX1pZighbmVlZHNEZXN0cnVjdG9yU3RhY2spe2Zvcih2YXIgaT1pc0NsYXNzTWV0aG9kRnVuYz8xOjI7aTxhcmdUeXBlcy5sZW5ndGg7KytpKXtpZihhcmdUeXBlc1tpXS5kZXN0cnVjdG9yRnVuY3Rpb24hPT1udWxsKXtjbG9zdXJlQXJncy5wdXNoKGFyZ1R5cGVzW2ldLmRlc3RydWN0b3JGdW5jdGlvbil9fX1sZXRbYXJncyxpbnZva2VyRm5Cb2R5XT1jcmVhdGVKc0ludm9rZXIoYXJnVHlwZXMsaXNDbGFzc01ldGhvZEZ1bmMscmV0dXJucyxpc0FzeW5jKTthcmdzLnB1c2goaW52b2tlckZuQm9keSk7dmFyIGludm9rZXJGbj1uZXdGdW5jKEZ1bmN0aW9uLGFyZ3MpKC4uLmNsb3N1cmVBcmdzKTtyZXR1cm4gY3JlYXRlTmFtZWRGdW5jdGlvbihodW1hbk5hbWUsaW52b2tlckZuKX12YXIgZW5zdXJlT3ZlcmxvYWRUYWJsZT0ocHJvdG8sbWV0aG9kTmFtZSxodW1hbk5hbWUpPT57aWYodW5kZWZpbmVkPT09cHJvdG9bbWV0aG9kTmFtZV0ub3ZlcmxvYWRUYWJsZSl7dmFyIHByZXZGdW5jPXByb3RvW21ldGhvZE5hbWVdO3Byb3RvW21ldGhvZE5hbWVdPWZ1bmN0aW9uKC4uLmFyZ3Mpe2lmKCFwcm90b1ttZXRob2ROYW1lXS5vdmVybG9hZFRhYmxlLmhhc093blByb3BlcnR5KGFyZ3MubGVuZ3RoKSl7dGhyb3dCaW5kaW5nRXJyb3IoYEZ1bmN0aW9uICcke2h1bWFuTmFtZX0nIGNhbGxlZCB3aXRoIGFuIGludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cyAoJHthcmdzLmxlbmd0aH0pIC0gZXhwZWN0cyBvbmUgb2YgKCR7cHJvdG9bbWV0aG9kTmFtZV0ub3ZlcmxvYWRUYWJsZX0pIWApfXJldHVybiBwcm90b1ttZXRob2ROYW1lXS5vdmVybG9hZFRhYmxlW2FyZ3MubGVuZ3RoXS5hcHBseSh0aGlzLGFyZ3MpfTtwcm90b1ttZXRob2ROYW1lXS5vdmVybG9hZFRhYmxlPVtdO3Byb3RvW21ldGhvZE5hbWVdLm92ZXJsb2FkVGFibGVbcHJldkZ1bmMuYXJnQ291bnRdPXByZXZGdW5jfX07dmFyIGV4cG9zZVB1YmxpY1N5bWJvbD0obmFtZSx2YWx1ZSxudW1Bcmd1bWVudHMpPT57aWYoTW9kdWxlLmhhc093blByb3BlcnR5KG5hbWUpKXtpZih1bmRlZmluZWQ9PT1udW1Bcmd1bWVudHN8fHVuZGVmaW5lZCE9PU1vZHVsZVtuYW1lXS5vdmVybG9hZFRhYmxlJiZ1bmRlZmluZWQhPT1Nb2R1bGVbbmFtZV0ub3ZlcmxvYWRUYWJsZVtudW1Bcmd1bWVudHNdKXt0aHJvd0JpbmRpbmdFcnJvcihgQ2Fubm90IHJlZ2lzdGVyIHB1YmxpYyBuYW1lICcke25hbWV9JyB0d2ljZWApfWVuc3VyZU92ZXJsb2FkVGFibGUoTW9kdWxlLG5hbWUsbmFtZSk7aWYoTW9kdWxlLmhhc093blByb3BlcnR5KG51bUFyZ3VtZW50cykpe3Rocm93QmluZGluZ0Vycm9yKGBDYW5ub3QgcmVnaXN0ZXIgbXVsdGlwbGUgb3ZlcmxvYWRzIG9mIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBudW1iZXIgb2YgYXJndW1lbnRzICgke251bUFyZ3VtZW50c30pIWApfU1vZHVsZVtuYW1lXS5vdmVybG9hZFRhYmxlW251bUFyZ3VtZW50c109dmFsdWV9ZWxzZXtNb2R1bGVbbmFtZV09dmFsdWU7aWYodW5kZWZpbmVkIT09bnVtQXJndW1lbnRzKXtNb2R1bGVbbmFtZV0ubnVtQXJndW1lbnRzPW51bUFyZ3VtZW50c319fTt2YXIgaGVhcDMyVmVjdG9yVG9BcnJheT0oY291bnQsZmlyc3RFbGVtZW50KT0+e3ZhciBhcnJheT1bXTtmb3IodmFyIGk9MDtpPGNvdW50O2krKyl7YXJyYXkucHVzaChIRUFQVTMyW2ZpcnN0RWxlbWVudCtpKjQ+PjJdKX1yZXR1cm4gYXJyYXl9O3ZhciByZXBsYWNlUHVibGljU3ltYm9sPShuYW1lLHZhbHVlLG51bUFyZ3VtZW50cyk9PntpZighTW9kdWxlLmhhc093blByb3BlcnR5KG5hbWUpKXt0aHJvd0ludGVybmFsRXJyb3IoXCJSZXBsYWNpbmcgbm9uZXhpc3RlbnQgcHVibGljIHN5bWJvbFwiKX1pZih1bmRlZmluZWQhPT1Nb2R1bGVbbmFtZV0ub3ZlcmxvYWRUYWJsZSYmdW5kZWZpbmVkIT09bnVtQXJndW1lbnRzKXtNb2R1bGVbbmFtZV0ub3ZlcmxvYWRUYWJsZVtudW1Bcmd1bWVudHNdPXZhbHVlfWVsc2V7TW9kdWxlW25hbWVdPXZhbHVlO01vZHVsZVtuYW1lXS5hcmdDb3VudD1udW1Bcmd1bWVudHN9fTt2YXIgZHluQ2FsbExlZ2FjeT0oc2lnLHB0cixhcmdzKT0+e3NpZz1zaWcucmVwbGFjZSgvcC9nLFwiaVwiKTt2YXIgZj1Nb2R1bGVbXCJkeW5DYWxsX1wiK3NpZ107cmV0dXJuIGYocHRyLC4uLmFyZ3MpfTt2YXIgd2FzbVRhYmxlTWlycm9yPVtdO3ZhciB3YXNtVGFibGU7dmFyIGdldFdhc21UYWJsZUVudHJ5PWZ1bmNQdHI9Pnt2YXIgZnVuYz13YXNtVGFibGVNaXJyb3JbZnVuY1B0cl07aWYoIWZ1bmMpe2lmKGZ1bmNQdHI+PXdhc21UYWJsZU1pcnJvci5sZW5ndGgpd2FzbVRhYmxlTWlycm9yLmxlbmd0aD1mdW5jUHRyKzE7d2FzbVRhYmxlTWlycm9yW2Z1bmNQdHJdPWZ1bmM9d2FzbVRhYmxlLmdldChmdW5jUHRyKX1yZXR1cm4gZnVuY307dmFyIGR5bkNhbGw9KHNpZyxwdHIsYXJncz1bXSk9PntpZihzaWcuaW5jbHVkZXMoXCJqXCIpKXtyZXR1cm4gZHluQ2FsbExlZ2FjeShzaWcscHRyLGFyZ3MpfXZhciBydG49Z2V0V2FzbVRhYmxlRW50cnkocHRyKSguLi5hcmdzKTtyZXR1cm4gcnRufTt2YXIgZ2V0RHluQ2FsbGVyPShzaWcscHRyKT0+KC4uLmFyZ3MpPT5keW5DYWxsKHNpZyxwdHIsYXJncyk7dmFyIGVtYmluZF9fcmVxdWlyZUZ1bmN0aW9uPShzaWduYXR1cmUscmF3RnVuY3Rpb24pPT57c2lnbmF0dXJlPXJlYWRMYXRpbjFTdHJpbmcoc2lnbmF0dXJlKTtmdW5jdGlvbiBtYWtlRHluQ2FsbGVyKCl7aWYoc2lnbmF0dXJlLmluY2x1ZGVzKFwialwiKSl7cmV0dXJuIGdldER5bkNhbGxlcihzaWduYXR1cmUscmF3RnVuY3Rpb24pfXJldHVybiBnZXRXYXNtVGFibGVFbnRyeShyYXdGdW5jdGlvbil9dmFyIGZwPW1ha2VEeW5DYWxsZXIoKTtpZih0eXBlb2YgZnAhPVwiZnVuY3Rpb25cIil7dGhyb3dCaW5kaW5nRXJyb3IoYHVua25vd24gZnVuY3Rpb24gcG9pbnRlciB3aXRoIHNpZ25hdHVyZSAke3NpZ25hdHVyZX06ICR7cmF3RnVuY3Rpb259YCl9cmV0dXJuIGZwfTt2YXIgZXh0ZW5kRXJyb3I9KGJhc2VFcnJvclR5cGUsZXJyb3JOYW1lKT0+e3ZhciBlcnJvckNsYXNzPWNyZWF0ZU5hbWVkRnVuY3Rpb24oZXJyb3JOYW1lLGZ1bmN0aW9uKG1lc3NhZ2Upe3RoaXMubmFtZT1lcnJvck5hbWU7dGhpcy5tZXNzYWdlPW1lc3NhZ2U7dmFyIHN0YWNrPW5ldyBFcnJvcihtZXNzYWdlKS5zdGFjaztpZihzdGFjayE9PXVuZGVmaW5lZCl7dGhpcy5zdGFjaz10aGlzLnRvU3RyaW5nKCkrXCJcXG5cIitzdGFjay5yZXBsYWNlKC9eRXJyb3IoOlteXFxuXSopP1xcbi8sXCJcIil9fSk7ZXJyb3JDbGFzcy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShiYXNlRXJyb3JUeXBlLnByb3RvdHlwZSk7ZXJyb3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3I9ZXJyb3JDbGFzcztlcnJvckNsYXNzLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe2lmKHRoaXMubWVzc2FnZT09PXVuZGVmaW5lZCl7cmV0dXJuIHRoaXMubmFtZX1lbHNle3JldHVybmAke3RoaXMubmFtZX06ICR7dGhpcy5tZXNzYWdlfWB9fTtyZXR1cm4gZXJyb3JDbGFzc307dmFyIFVuYm91bmRUeXBlRXJyb3I7dmFyIGdldFR5cGVOYW1lPXR5cGU9Pnt2YXIgcHRyPV9fX2dldFR5cGVOYW1lKHR5cGUpO3ZhciBydj1yZWFkTGF0aW4xU3RyaW5nKHB0cik7X2ZyZWUocHRyKTtyZXR1cm4gcnZ9O3ZhciB0aHJvd1VuYm91bmRUeXBlRXJyb3I9KG1lc3NhZ2UsdHlwZXMpPT57dmFyIHVuYm91bmRUeXBlcz1bXTt2YXIgc2Vlbj17fTtmdW5jdGlvbiB2aXNpdCh0eXBlKXtpZihzZWVuW3R5cGVdKXtyZXR1cm59aWYocmVnaXN0ZXJlZFR5cGVzW3R5cGVdKXtyZXR1cm59aWYodHlwZURlcGVuZGVuY2llc1t0eXBlXSl7dHlwZURlcGVuZGVuY2llc1t0eXBlXS5mb3JFYWNoKHZpc2l0KTtyZXR1cm59dW5ib3VuZFR5cGVzLnB1c2godHlwZSk7c2Vlblt0eXBlXT10cnVlfXR5cGVzLmZvckVhY2godmlzaXQpO3Rocm93IG5ldyBVbmJvdW5kVHlwZUVycm9yKGAke21lc3NhZ2V9OiBgK3VuYm91bmRUeXBlcy5tYXAoZ2V0VHlwZU5hbWUpLmpvaW4oW1wiLCBcIl0pKX07dmFyIGdldEZ1bmN0aW9uTmFtZT1zaWduYXR1cmU9PntzaWduYXR1cmU9c2lnbmF0dXJlLnRyaW0oKTtjb25zdCBhcmdzSW5kZXg9c2lnbmF0dXJlLmluZGV4T2YoXCIoXCIpO2lmKGFyZ3NJbmRleCE9PS0xKXtyZXR1cm4gc2lnbmF0dXJlLnN1YnN0cigwLGFyZ3NJbmRleCl9ZWxzZXtyZXR1cm4gc2lnbmF0dXJlfX07dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2Z1bmN0aW9uPShuYW1lLGFyZ0NvdW50LHJhd0FyZ1R5cGVzQWRkcixzaWduYXR1cmUscmF3SW52b2tlcixmbixpc0FzeW5jLGlzTm9ubnVsbFJldHVybik9Pnt2YXIgYXJnVHlwZXM9aGVhcDMyVmVjdG9yVG9BcnJheShhcmdDb3VudCxyYXdBcmdUeXBlc0FkZHIpO25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTtuYW1lPWdldEZ1bmN0aW9uTmFtZShuYW1lKTtyYXdJbnZva2VyPWVtYmluZF9fcmVxdWlyZUZ1bmN0aW9uKHNpZ25hdHVyZSxyYXdJbnZva2VyKTtleHBvc2VQdWJsaWNTeW1ib2wobmFtZSxmdW5jdGlvbigpe3Rocm93VW5ib3VuZFR5cGVFcnJvcihgQ2Fubm90IGNhbGwgJHtuYW1lfSBkdWUgdG8gdW5ib3VuZCB0eXBlc2AsYXJnVHlwZXMpfSxhcmdDb3VudC0xKTt3aGVuRGVwZW5kZW50VHlwZXNBcmVSZXNvbHZlZChbXSxhcmdUeXBlcyxhcmdUeXBlcz0+e3ZhciBpbnZva2VyQXJnc0FycmF5PVthcmdUeXBlc1swXSxudWxsXS5jb25jYXQoYXJnVHlwZXMuc2xpY2UoMSkpO3JlcGxhY2VQdWJsaWNTeW1ib2wobmFtZSxjcmFmdEludm9rZXJGdW5jdGlvbihuYW1lLGludm9rZXJBcmdzQXJyYXksbnVsbCxyYXdJbnZva2VyLGZuLGlzQXN5bmMpLGFyZ0NvdW50LTEpO3JldHVybltdfSl9O3ZhciBpbnRlZ2VyUmVhZFZhbHVlRnJvbVBvaW50ZXI9KG5hbWUsd2lkdGgsc2lnbmVkKT0+e3N3aXRjaCh3aWR0aCl7Y2FzZSAxOnJldHVybiBzaWduZWQ/cG9pbnRlcj0+SEVBUDhbcG9pbnRlcl06cG9pbnRlcj0+SEVBUFU4W3BvaW50ZXJdO2Nhc2UgMjpyZXR1cm4gc2lnbmVkP3BvaW50ZXI9PkhFQVAxNltwb2ludGVyPj4xXTpwb2ludGVyPT5IRUFQVTE2W3BvaW50ZXI+PjFdO2Nhc2UgNDpyZXR1cm4gc2lnbmVkP3BvaW50ZXI9PkhFQVAzMltwb2ludGVyPj4yXTpwb2ludGVyPT5IRUFQVTMyW3BvaW50ZXI+PjJdO2RlZmF1bHQ6dGhyb3cgbmV3IFR5cGVFcnJvcihgaW52YWxpZCBpbnRlZ2VyIHdpZHRoICgke3dpZHRofSk6ICR7bmFtZX1gKX19O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9pbnRlZ2VyPShwcmltaXRpdmVUeXBlLG5hbWUsc2l6ZSxtaW5SYW5nZSxtYXhSYW5nZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7aWYobWF4UmFuZ2U9PT0tMSl7bWF4UmFuZ2U9NDI5NDk2NzI5NX12YXIgZnJvbVdpcmVUeXBlPXZhbHVlPT52YWx1ZTtpZihtaW5SYW5nZT09PTApe3ZhciBiaXRzaGlmdD0zMi04KnNpemU7ZnJvbVdpcmVUeXBlPXZhbHVlPT52YWx1ZTw8Yml0c2hpZnQ+Pj5iaXRzaGlmdH12YXIgaXNVbnNpZ25lZFR5cGU9bmFtZS5pbmNsdWRlcyhcInVuc2lnbmVkXCIpO3ZhciBjaGVja0Fzc2VydGlvbnM9KHZhbHVlLHRvVHlwZU5hbWUpPT57fTt2YXIgdG9XaXJlVHlwZTtpZihpc1Vuc2lnbmVkVHlwZSl7dG9XaXJlVHlwZT1mdW5jdGlvbihkZXN0cnVjdG9ycyx2YWx1ZSl7Y2hlY2tBc3NlcnRpb25zKHZhbHVlLHRoaXMubmFtZSk7cmV0dXJuIHZhbHVlPj4+MH19ZWxzZXt0b1dpcmVUeXBlPWZ1bmN0aW9uKGRlc3RydWN0b3JzLHZhbHVlKXtjaGVja0Fzc2VydGlvbnModmFsdWUsdGhpcy5uYW1lKTtyZXR1cm4gdmFsdWV9fXJlZ2lzdGVyVHlwZShwcmltaXRpdmVUeXBlLHtuYW1lLGZyb21XaXJlVHlwZSx0b1dpcmVUeXBlLGFyZ1BhY2tBZHZhbmNlOkdlbmVyaWNXaXJlVHlwZVNpemUscmVhZFZhbHVlRnJvbVBvaW50ZXI6aW50ZWdlclJlYWRWYWx1ZUZyb21Qb2ludGVyKG5hbWUsc2l6ZSxtaW5SYW5nZSE9PTApLGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSl9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9tZW1vcnlfdmlldz0ocmF3VHlwZSxkYXRhVHlwZUluZGV4LG5hbWUpPT57dmFyIHR5cGVNYXBwaW5nPVtJbnQ4QXJyYXksVWludDhBcnJheSxJbnQxNkFycmF5LFVpbnQxNkFycmF5LEludDMyQXJyYXksVWludDMyQXJyYXksRmxvYXQzMkFycmF5LEZsb2F0NjRBcnJheV07dmFyIFRBPXR5cGVNYXBwaW5nW2RhdGFUeXBlSW5kZXhdO2Z1bmN0aW9uIGRlY29kZU1lbW9yeVZpZXcoaGFuZGxlKXt2YXIgc2l6ZT1IRUFQVTMyW2hhbmRsZT4+Ml07dmFyIGRhdGE9SEVBUFUzMltoYW5kbGUrND4+Ml07cmV0dXJuIG5ldyBUQShIRUFQOC5idWZmZXIsZGF0YSxzaXplKX1uYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWUsZnJvbVdpcmVUeXBlOmRlY29kZU1lbW9yeVZpZXcsYXJnUGFja0FkdmFuY2U6R2VuZXJpY1dpcmVUeXBlU2l6ZSxyZWFkVmFsdWVGcm9tUG9pbnRlcjpkZWNvZGVNZW1vcnlWaWV3fSx7aWdub3JlRHVwbGljYXRlUmVnaXN0cmF0aW9uczp0cnVlfSl9O3ZhciBzdHJpbmdUb1VURjg9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+c3RyaW5nVG9VVEY4QXJyYXkoc3RyLEhFQVBVOCxvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfc3RkX3N0cmluZz0ocmF3VHlwZSxuYW1lKT0+e25hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTt2YXIgc3RkU3RyaW5nSXNVVEY4PW5hbWU9PT1cInN0ZDo6c3RyaW5nXCI7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWUsZnJvbVdpcmVUeXBlKHZhbHVlKXt2YXIgbGVuZ3RoPUhFQVBVMzJbdmFsdWU+PjJdO3ZhciBwYXlsb2FkPXZhbHVlKzQ7dmFyIHN0cjtpZihzdGRTdHJpbmdJc1VURjgpe3ZhciBkZWNvZGVTdGFydFB0cj1wYXlsb2FkO2Zvcih2YXIgaT0wO2k8PWxlbmd0aDsrK2kpe3ZhciBjdXJyZW50Qnl0ZVB0cj1wYXlsb2FkK2k7aWYoaT09bGVuZ3RofHxIRUFQVThbY3VycmVudEJ5dGVQdHJdPT0wKXt2YXIgbWF4UmVhZD1jdXJyZW50Qnl0ZVB0ci1kZWNvZGVTdGFydFB0cjt2YXIgc3RyaW5nU2VnbWVudD1VVEY4VG9TdHJpbmcoZGVjb2RlU3RhcnRQdHIsbWF4UmVhZCk7aWYoc3RyPT09dW5kZWZpbmVkKXtzdHI9c3RyaW5nU2VnbWVudH1lbHNle3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSgwKTtzdHIrPXN0cmluZ1NlZ21lbnR9ZGVjb2RlU3RhcnRQdHI9Y3VycmVudEJ5dGVQdHIrMX19fWVsc2V7dmFyIGE9bmV3IEFycmF5KGxlbmd0aCk7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXthW2ldPVN0cmluZy5mcm9tQ2hhckNvZGUoSEVBUFU4W3BheWxvYWQraV0pfXN0cj1hLmpvaW4oXCJcIil9X2ZyZWUodmFsdWUpO3JldHVybiBzdHJ9LHRvV2lyZVR5cGUoZGVzdHJ1Y3RvcnMsdmFsdWUpe2lmKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe3ZhbHVlPW5ldyBVaW50OEFycmF5KHZhbHVlKX12YXIgbGVuZ3RoO3ZhciB2YWx1ZUlzT2ZUeXBlU3RyaW5nPXR5cGVvZiB2YWx1ZT09XCJzdHJpbmdcIjtpZighKHZhbHVlSXNPZlR5cGVTdHJpbmd8fHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheXx8dmFsdWUgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheXx8dmFsdWUgaW5zdGFuY2VvZiBJbnQ4QXJyYXkpKXt0aHJvd0JpbmRpbmdFcnJvcihcIkNhbm5vdCBwYXNzIG5vbi1zdHJpbmcgdG8gc3RkOjpzdHJpbmdcIil9aWYoc3RkU3RyaW5nSXNVVEY4JiZ2YWx1ZUlzT2ZUeXBlU3RyaW5nKXtsZW5ndGg9bGVuZ3RoQnl0ZXNVVEY4KHZhbHVlKX1lbHNle2xlbmd0aD12YWx1ZS5sZW5ndGh9dmFyIGJhc2U9X21hbGxvYyg0K2xlbmd0aCsxKTt2YXIgcHRyPWJhc2UrNDtIRUFQVTMyW2Jhc2U+PjJdPWxlbmd0aDtpZihzdGRTdHJpbmdJc1VURjgmJnZhbHVlSXNPZlR5cGVTdHJpbmcpe3N0cmluZ1RvVVRGOCh2YWx1ZSxwdHIsbGVuZ3RoKzEpfWVsc2V7aWYodmFsdWVJc09mVHlwZVN0cmluZyl7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXt2YXIgY2hhckNvZGU9dmFsdWUuY2hhckNvZGVBdChpKTtpZihjaGFyQ29kZT4yNTUpe19mcmVlKHB0cik7dGhyb3dCaW5kaW5nRXJyb3IoXCJTdHJpbmcgaGFzIFVURi0xNiBjb2RlIHVuaXRzIHRoYXQgZG8gbm90IGZpdCBpbiA4IGJpdHNcIil9SEVBUFU4W3B0citpXT1jaGFyQ29kZX19ZWxzZXtmb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe0hFQVBVOFtwdHIraV09dmFsdWVbaV19fX1pZihkZXN0cnVjdG9ycyE9PW51bGwpe2Rlc3RydWN0b3JzLnB1c2goX2ZyZWUsYmFzZSl9cmV0dXJuIGJhc2V9LGFyZ1BhY2tBZHZhbmNlOkdlbmVyaWNXaXJlVHlwZVNpemUscmVhZFZhbHVlRnJvbVBvaW50ZXI6cmVhZFBvaW50ZXIsZGVzdHJ1Y3RvckZ1bmN0aW9uKHB0cil7X2ZyZWUocHRyKX19KX07dmFyIFVURjE2RGVjb2Rlcj10eXBlb2YgVGV4dERlY29kZXIhPVwidW5kZWZpbmVkXCI/bmV3IFRleHREZWNvZGVyKFwidXRmLTE2bGVcIik6dW5kZWZpbmVkO3ZhciBVVEYxNlRvU3RyaW5nPShwdHIsbWF4Qnl0ZXNUb1JlYWQpPT57dmFyIGVuZFB0cj1wdHI7dmFyIGlkeD1lbmRQdHI+PjE7dmFyIG1heElkeD1pZHgrbWF4Qnl0ZXNUb1JlYWQvMjt3aGlsZSghKGlkeD49bWF4SWR4KSYmSEVBUFUxNltpZHhdKSsraWR4O2VuZFB0cj1pZHg8PDE7aWYoZW5kUHRyLXB0cj4zMiYmVVRGMTZEZWNvZGVyKXJldHVybiBVVEYxNkRlY29kZXIuZGVjb2RlKEhFQVBVOC5zdWJhcnJheShwdHIsZW5kUHRyKSk7dmFyIHN0cj1cIlwiO2Zvcih2YXIgaT0wOyEoaT49bWF4Qnl0ZXNUb1JlYWQvMik7KytpKXt2YXIgY29kZVVuaXQ9SEVBUDE2W3B0citpKjI+PjFdO2lmKGNvZGVVbml0PT0wKWJyZWFrO3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZShjb2RlVW5pdCl9cmV0dXJuIHN0cn07dmFyIHN0cmluZ1RvVVRGMTY9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+e21heEJ5dGVzVG9Xcml0ZT8/PTIxNDc0ODM2NDc7aWYobWF4Qnl0ZXNUb1dyaXRlPDIpcmV0dXJuIDA7bWF4Qnl0ZXNUb1dyaXRlLT0yO3ZhciBzdGFydFB0cj1vdXRQdHI7dmFyIG51bUNoYXJzVG9Xcml0ZT1tYXhCeXRlc1RvV3JpdGU8c3RyLmxlbmd0aCoyP21heEJ5dGVzVG9Xcml0ZS8yOnN0ci5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1DaGFyc1RvV3JpdGU7KytpKXt2YXIgY29kZVVuaXQ9c3RyLmNoYXJDb2RlQXQoaSk7SEVBUDE2W291dFB0cj4+MV09Y29kZVVuaXQ7b3V0UHRyKz0yfUhFQVAxNltvdXRQdHI+PjFdPTA7cmV0dXJuIG91dFB0ci1zdGFydFB0cn07dmFyIGxlbmd0aEJ5dGVzVVRGMTY9c3RyPT5zdHIubGVuZ3RoKjI7dmFyIFVURjMyVG9TdHJpbmc9KHB0cixtYXhCeXRlc1RvUmVhZCk9Pnt2YXIgaT0wO3ZhciBzdHI9XCJcIjt3aGlsZSghKGk+PW1heEJ5dGVzVG9SZWFkLzQpKXt2YXIgdXRmMzI9SEVBUDMyW3B0citpKjQ+PjJdO2lmKHV0ZjMyPT0wKWJyZWFrOysraTtpZih1dGYzMj49NjU1MzYpe3ZhciBjaD11dGYzMi02NTUzNjtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTZ8Y2g+PjEwLDU2MzIwfGNoJjEwMjMpfWVsc2V7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHV0ZjMyKX19cmV0dXJuIHN0cn07dmFyIHN0cmluZ1RvVVRGMzI9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+e21heEJ5dGVzVG9Xcml0ZT8/PTIxNDc0ODM2NDc7aWYobWF4Qnl0ZXNUb1dyaXRlPDQpcmV0dXJuIDA7dmFyIHN0YXJ0UHRyPW91dFB0cjt2YXIgZW5kUHRyPXN0YXJ0UHRyK21heEJ5dGVzVG9Xcml0ZS00O2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjb2RlVW5pdD1zdHIuY2hhckNvZGVBdChpKTtpZihjb2RlVW5pdD49NTUyOTYmJmNvZGVVbml0PD01NzM0Myl7dmFyIHRyYWlsU3Vycm9nYXRlPXN0ci5jaGFyQ29kZUF0KCsraSk7Y29kZVVuaXQ9NjU1MzYrKChjb2RlVW5pdCYxMDIzKTw8MTApfHRyYWlsU3Vycm9nYXRlJjEwMjN9SEVBUDMyW291dFB0cj4+Ml09Y29kZVVuaXQ7b3V0UHRyKz00O2lmKG91dFB0cis0PmVuZFB0cilicmVha31IRUFQMzJbb3V0UHRyPj4yXT0wO3JldHVybiBvdXRQdHItc3RhcnRQdHJ9O3ZhciBsZW5ndGhCeXRlc1VURjMyPXN0cj0+e3ZhciBsZW49MDtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXt2YXIgY29kZVVuaXQ9c3RyLmNoYXJDb2RlQXQoaSk7aWYoY29kZVVuaXQ+PTU1Mjk2JiZjb2RlVW5pdDw9NTczNDMpKytpO2xlbis9NH1yZXR1cm4gbGVufTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfc3RkX3dzdHJpbmc9KHJhd1R5cGUsY2hhclNpemUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7dmFyIGRlY29kZVN0cmluZyxlbmNvZGVTdHJpbmcscmVhZENoYXJBdCxsZW5ndGhCeXRlc1VURjtpZihjaGFyU2l6ZT09PTIpe2RlY29kZVN0cmluZz1VVEYxNlRvU3RyaW5nO2VuY29kZVN0cmluZz1zdHJpbmdUb1VURjE2O2xlbmd0aEJ5dGVzVVRGPWxlbmd0aEJ5dGVzVVRGMTY7cmVhZENoYXJBdD1wb2ludGVyPT5IRUFQVTE2W3BvaW50ZXI+PjFdfWVsc2UgaWYoY2hhclNpemU9PT00KXtkZWNvZGVTdHJpbmc9VVRGMzJUb1N0cmluZztlbmNvZGVTdHJpbmc9c3RyaW5nVG9VVEYzMjtsZW5ndGhCeXRlc1VURj1sZW5ndGhCeXRlc1VURjMyO3JlYWRDaGFyQXQ9cG9pbnRlcj0+SEVBUFUzMltwb2ludGVyPj4yXX1yZWdpc3RlclR5cGUocmF3VHlwZSx7bmFtZSxmcm9tV2lyZVR5cGU6dmFsdWU9Pnt2YXIgbGVuZ3RoPUhFQVBVMzJbdmFsdWU+PjJdO3ZhciBzdHI7dmFyIGRlY29kZVN0YXJ0UHRyPXZhbHVlKzQ7Zm9yKHZhciBpPTA7aTw9bGVuZ3RoOysraSl7dmFyIGN1cnJlbnRCeXRlUHRyPXZhbHVlKzQraSpjaGFyU2l6ZTtpZihpPT1sZW5ndGh8fHJlYWRDaGFyQXQoY3VycmVudEJ5dGVQdHIpPT0wKXt2YXIgbWF4UmVhZEJ5dGVzPWN1cnJlbnRCeXRlUHRyLWRlY29kZVN0YXJ0UHRyO3ZhciBzdHJpbmdTZWdtZW50PWRlY29kZVN0cmluZyhkZWNvZGVTdGFydFB0cixtYXhSZWFkQnl0ZXMpO2lmKHN0cj09PXVuZGVmaW5lZCl7c3RyPXN0cmluZ1NlZ21lbnR9ZWxzZXtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoMCk7c3RyKz1zdHJpbmdTZWdtZW50fWRlY29kZVN0YXJ0UHRyPWN1cnJlbnRCeXRlUHRyK2NoYXJTaXplfX1fZnJlZSh2YWx1ZSk7cmV0dXJuIHN0cn0sdG9XaXJlVHlwZTooZGVzdHJ1Y3RvcnMsdmFsdWUpPT57aWYoISh0eXBlb2YgdmFsdWU9PVwic3RyaW5nXCIpKXt0aHJvd0JpbmRpbmdFcnJvcihgQ2Fubm90IHBhc3Mgbm9uLXN0cmluZyB0byBDKysgc3RyaW5nIHR5cGUgJHtuYW1lfWApfXZhciBsZW5ndGg9bGVuZ3RoQnl0ZXNVVEYodmFsdWUpO3ZhciBwdHI9X21hbGxvYyg0K2xlbmd0aCtjaGFyU2l6ZSk7SEVBUFUzMltwdHI+PjJdPWxlbmd0aC9jaGFyU2l6ZTtlbmNvZGVTdHJpbmcodmFsdWUscHRyKzQsbGVuZ3RoK2NoYXJTaXplKTtpZihkZXN0cnVjdG9ycyE9PW51bGwpe2Rlc3RydWN0b3JzLnB1c2goX2ZyZWUscHRyKX1yZXR1cm4gcHRyfSxhcmdQYWNrQWR2YW5jZTpHZW5lcmljV2lyZVR5cGVTaXplLHJlYWRWYWx1ZUZyb21Qb2ludGVyOnJlYWRQb2ludGVyLGRlc3RydWN0b3JGdW5jdGlvbihwdHIpe19mcmVlKHB0cil9fSl9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl92b2lkPShyYXdUeXBlLG5hbWUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtpc1ZvaWQ6dHJ1ZSxuYW1lLGFyZ1BhY2tBZHZhbmNlOjAsZnJvbVdpcmVUeXBlOigpPT51bmRlZmluZWQsdG9XaXJlVHlwZTooZGVzdHJ1Y3RvcnMsbyk9PnVuZGVmaW5lZH0pfTt2YXIgbm93SXNNb25vdG9uaWM9MTt2YXIgX19lbXNjcmlwdGVuX2dldF9ub3dfaXNfbW9ub3RvbmljPSgpPT5ub3dJc01vbm90b25pYzt2YXIgaW5ldFB0b240PXN0cj0+e3ZhciBiPXN0ci5zcGxpdChcIi5cIik7Zm9yKHZhciBpPTA7aTw0O2krKyl7dmFyIHRtcD1OdW1iZXIoYltpXSk7aWYoaXNOYU4odG1wKSlyZXR1cm4gbnVsbDtiW2ldPXRtcH1yZXR1cm4oYlswXXxiWzFdPDw4fGJbMl08PDE2fGJbM108PDI0KT4+PjB9O3ZhciBqc3RvaV9xPXN0cj0+cGFyc2VJbnQoc3RyKTt2YXIgaW5ldFB0b242PXN0cj0+e3ZhciB3b3Jkczt2YXIgdyxvZmZzZXQsejt2YXIgdmFsaWQ2cmVneD0vXigoPz0uKjo6KSg/IS4qOjouKzo6KSg6Oik/KFtcXGRBLUZdezEsNH06KDp8XFxiKXwpezV9fChbXFxkQS1GXXsxLDR9Oil7Nn0pKCgoW1xcZEEtRl17MSw0fSgoPyFcXDMpOjp8OlxcYnwkKSl8KD8hXFwyXFwzKSl7Mn18KCgoMlswLTRdfDFcXGR8WzEtOV0pP1xcZHwyNVswLTVdKVxcLj9cXGIpezR9KSQvaTt2YXIgcGFydHM9W107aWYoIXZhbGlkNnJlZ3gudGVzdChzdHIpKXtyZXR1cm4gbnVsbH1pZihzdHI9PT1cIjo6XCIpe3JldHVyblswLDAsMCwwLDAsMCwwLDBdfWlmKHN0ci5zdGFydHNXaXRoKFwiOjpcIikpe3N0cj1zdHIucmVwbGFjZShcIjo6XCIsXCJaOlwiKX1lbHNle3N0cj1zdHIucmVwbGFjZShcIjo6XCIsXCI6WjpcIil9aWYoc3RyLmluZGV4T2YoXCIuXCIpPjApe3N0cj1zdHIucmVwbGFjZShuZXcgUmVnRXhwKFwiWy5dXCIsXCJnXCIpLFwiOlwiKTt3b3Jkcz1zdHIuc3BsaXQoXCI6XCIpO3dvcmRzW3dvcmRzLmxlbmd0aC00XT1qc3RvaV9xKHdvcmRzW3dvcmRzLmxlbmd0aC00XSkranN0b2lfcSh3b3Jkc1t3b3Jkcy5sZW5ndGgtM10pKjI1Njt3b3Jkc1t3b3Jkcy5sZW5ndGgtM109anN0b2lfcSh3b3Jkc1t3b3Jkcy5sZW5ndGgtMl0pK2pzdG9pX3Eod29yZHNbd29yZHMubGVuZ3RoLTFdKSoyNTY7d29yZHM9d29yZHMuc2xpY2UoMCx3b3Jkcy5sZW5ndGgtMil9ZWxzZXt3b3Jkcz1zdHIuc3BsaXQoXCI6XCIpfW9mZnNldD0wO3o9MDtmb3Iodz0wO3c8d29yZHMubGVuZ3RoO3crKyl7aWYodHlwZW9mIHdvcmRzW3ddPT1cInN0cmluZ1wiKXtpZih3b3Jkc1t3XT09PVwiWlwiKXtmb3Ioej0wO3o8OC13b3Jkcy5sZW5ndGgrMTt6Kyspe3BhcnRzW3crel09MH1vZmZzZXQ9ei0xfWVsc2V7cGFydHNbdytvZmZzZXRdPV9odG9ucyhwYXJzZUludCh3b3Jkc1t3XSwxNikpfX1lbHNle3BhcnRzW3crb2Zmc2V0XT13b3Jkc1t3XX19cmV0dXJuW3BhcnRzWzFdPDwxNnxwYXJ0c1swXSxwYXJ0c1szXTw8MTZ8cGFydHNbMl0scGFydHNbNV08PDE2fHBhcnRzWzRdLHBhcnRzWzddPDwxNnxwYXJ0c1s2XV19O3ZhciBETlM9e2FkZHJlc3NfbWFwOntpZDoxLGFkZHJzOnt9LG5hbWVzOnt9fSxsb29rdXBfbmFtZShuYW1lKXt2YXIgcmVzPWluZXRQdG9uNChuYW1lKTtpZihyZXMhPT1udWxsKXtyZXR1cm4gbmFtZX1yZXM9aW5ldFB0b242KG5hbWUpO2lmKHJlcyE9PW51bGwpe3JldHVybiBuYW1lfXZhciBhZGRyO2lmKEROUy5hZGRyZXNzX21hcC5hZGRyc1tuYW1lXSl7YWRkcj1ETlMuYWRkcmVzc19tYXAuYWRkcnNbbmFtZV19ZWxzZXt2YXIgaWQ9RE5TLmFkZHJlc3NfbWFwLmlkKys7YXNzZXJ0KGlkPDY1NTM1LFwiZXhjZWVkZWQgbWF4IGFkZHJlc3MgbWFwcGluZ3Mgb2YgNjU1MzVcIik7YWRkcj1cIjE3Mi4yOS5cIisoaWQmMjU1KStcIi5cIisoaWQmNjUyODApO0ROUy5hZGRyZXNzX21hcC5uYW1lc1thZGRyXT1uYW1lO0ROUy5hZGRyZXNzX21hcC5hZGRyc1tuYW1lXT1hZGRyfXJldHVybiBhZGRyfSxsb29rdXBfYWRkcihhZGRyKXtpZihETlMuYWRkcmVzc19tYXAubmFtZXNbYWRkcl0pe3JldHVybiBETlMuYWRkcmVzc19tYXAubmFtZXNbYWRkcl19cmV0dXJuIG51bGx9fTt2YXIgX19lbXNjcmlwdGVuX2xvb2t1cF9uYW1lPW5hbWU9Pnt2YXIgbmFtZVN0cmluZz1VVEY4VG9TdHJpbmcobmFtZSk7cmV0dXJuIGluZXRQdG9uNChETlMubG9va3VwX25hbWUobmFtZVN0cmluZykpfTt2YXIgX19lbXNjcmlwdGVuX21lbWNweV9qcz0oZGVzdCxzcmMsbnVtKT0+SEVBUFU4LmNvcHlXaXRoaW4oZGVzdCxzcmMsc3JjK251bSk7dmFyIHJlcXVpcmVSZWdpc3RlcmVkVHlwZT0ocmF3VHlwZSxodW1hbk5hbWUpPT57dmFyIGltcGw9cmVnaXN0ZXJlZFR5cGVzW3Jhd1R5cGVdO2lmKHVuZGVmaW5lZD09PWltcGwpe3Rocm93QmluZGluZ0Vycm9yKGAke2h1bWFuTmFtZX0gaGFzIHVua25vd24gdHlwZSAke2dldFR5cGVOYW1lKHJhd1R5cGUpfWApfXJldHVybiBpbXBsfTt2YXIgZW12YWxfcmV0dXJuVmFsdWU9KHJldHVyblR5cGUsZGVzdHJ1Y3RvcnNSZWYsaGFuZGxlKT0+e3ZhciBkZXN0cnVjdG9ycz1bXTt2YXIgcmVzdWx0PXJldHVyblR5cGVbXCJ0b1dpcmVUeXBlXCJdKGRlc3RydWN0b3JzLGhhbmRsZSk7aWYoZGVzdHJ1Y3RvcnMubGVuZ3RoKXtIRUFQVTMyW2Rlc3RydWN0b3JzUmVmPj4yXT1FbXZhbC50b0hhbmRsZShkZXN0cnVjdG9ycyl9cmV0dXJuIHJlc3VsdH07dmFyIF9fZW12YWxfYXM9KGhhbmRsZSxyZXR1cm5UeXBlLGRlc3RydWN0b3JzUmVmKT0+e2hhbmRsZT1FbXZhbC50b1ZhbHVlKGhhbmRsZSk7cmV0dXJuVHlwZT1yZXF1aXJlUmVnaXN0ZXJlZFR5cGUocmV0dXJuVHlwZSxcImVtdmFsOjphc1wiKTtyZXR1cm4gZW12YWxfcmV0dXJuVmFsdWUocmV0dXJuVHlwZSxkZXN0cnVjdG9yc1JlZixoYW5kbGUpfTt2YXIgZW12YWxfc3ltYm9scz17fTt2YXIgZ2V0U3RyaW5nT3JTeW1ib2w9YWRkcmVzcz0+e3ZhciBzeW1ib2w9ZW12YWxfc3ltYm9sc1thZGRyZXNzXTtpZihzeW1ib2w9PT11bmRlZmluZWQpe3JldHVybiByZWFkTGF0aW4xU3RyaW5nKGFkZHJlc3MpfXJldHVybiBzeW1ib2x9O3ZhciBlbXZhbF9tZXRob2RDYWxsZXJzPVtdO3ZhciBfX2VtdmFsX2NhbGxfbWV0aG9kPShjYWxsZXIsb2JqSGFuZGxlLG1ldGhvZE5hbWUsZGVzdHJ1Y3RvcnNSZWYsYXJncyk9PntjYWxsZXI9ZW12YWxfbWV0aG9kQ2FsbGVyc1tjYWxsZXJdO29iakhhbmRsZT1FbXZhbC50b1ZhbHVlKG9iakhhbmRsZSk7bWV0aG9kTmFtZT1nZXRTdHJpbmdPclN5bWJvbChtZXRob2ROYW1lKTtyZXR1cm4gY2FsbGVyKG9iakhhbmRsZSxvYmpIYW5kbGVbbWV0aG9kTmFtZV0sZGVzdHJ1Y3RvcnNSZWYsYXJncyl9O3ZhciBlbXZhbF9nZXRfZ2xvYmFsPSgpPT57aWYodHlwZW9mIGdsb2JhbFRoaXM9PVwib2JqZWN0XCIpe3JldHVybiBnbG9iYWxUaGlzfXJldHVybiBmdW5jdGlvbigpe3JldHVybiBGdW5jdGlvbn0oKShcInJldHVybiB0aGlzXCIpKCl9O3ZhciBfX2VtdmFsX2dldF9nbG9iYWw9bmFtZT0+e2lmKG5hbWU9PT0wKXtyZXR1cm4gRW12YWwudG9IYW5kbGUoZW12YWxfZ2V0X2dsb2JhbCgpKX1lbHNle25hbWU9Z2V0U3RyaW5nT3JTeW1ib2wobmFtZSk7cmV0dXJuIEVtdmFsLnRvSGFuZGxlKGVtdmFsX2dldF9nbG9iYWwoKVtuYW1lXSl9fTt2YXIgZW12YWxfYWRkTWV0aG9kQ2FsbGVyPWNhbGxlcj0+e3ZhciBpZD1lbXZhbF9tZXRob2RDYWxsZXJzLmxlbmd0aDtlbXZhbF9tZXRob2RDYWxsZXJzLnB1c2goY2FsbGVyKTtyZXR1cm4gaWR9O3ZhciBlbXZhbF9sb29rdXBUeXBlcz0oYXJnQ291bnQsYXJnVHlwZXMpPT57dmFyIGE9bmV3IEFycmF5KGFyZ0NvdW50KTtmb3IodmFyIGk9MDtpPGFyZ0NvdW50OysraSl7YVtpXT1yZXF1aXJlUmVnaXN0ZXJlZFR5cGUoSEVBUFUzMlthcmdUeXBlcytpKjQ+PjJdLFwicGFyYW1ldGVyIFwiK2kpfXJldHVybiBhfTt2YXIgcmVmbGVjdENvbnN0cnVjdD1SZWZsZWN0LmNvbnN0cnVjdDt2YXIgX19lbXZhbF9nZXRfbWV0aG9kX2NhbGxlcj0oYXJnQ291bnQsYXJnVHlwZXMsa2luZCk9Pnt2YXIgdHlwZXM9ZW12YWxfbG9va3VwVHlwZXMoYXJnQ291bnQsYXJnVHlwZXMpO3ZhciByZXRUeXBlPXR5cGVzLnNoaWZ0KCk7YXJnQ291bnQtLTt2YXIgZnVuY3Rpb25Cb2R5PWByZXR1cm4gZnVuY3Rpb24gKG9iaiwgZnVuYywgZGVzdHJ1Y3RvcnNSZWYsIGFyZ3MpIHtcXG5gO3ZhciBvZmZzZXQ9MDt2YXIgYXJnc0xpc3Q9W107aWYoa2luZD09PTApe2FyZ3NMaXN0LnB1c2goXCJvYmpcIil9dmFyIHBhcmFtcz1bXCJyZXRUeXBlXCJdO3ZhciBhcmdzPVtyZXRUeXBlXTtmb3IodmFyIGk9MDtpPGFyZ0NvdW50OysraSl7YXJnc0xpc3QucHVzaChcImFyZ1wiK2kpO3BhcmFtcy5wdXNoKFwiYXJnVHlwZVwiK2kpO2FyZ3MucHVzaCh0eXBlc1tpXSk7ZnVuY3Rpb25Cb2R5Kz1gICB2YXIgYXJnJHtpfSA9IGFyZ1R5cGUke2l9LnJlYWRWYWx1ZUZyb21Qb2ludGVyKGFyZ3Mke29mZnNldD9cIitcIitvZmZzZXQ6XCJcIn0pO1xcbmA7b2Zmc2V0Kz10eXBlc1tpXS5hcmdQYWNrQWR2YW5jZX12YXIgaW52b2tlcj1raW5kPT09MT9cIm5ldyBmdW5jXCI6XCJmdW5jLmNhbGxcIjtmdW5jdGlvbkJvZHkrPWAgIHZhciBydiA9ICR7aW52b2tlcn0oJHthcmdzTGlzdC5qb2luKFwiLCBcIil9KTtcXG5gO2lmKCFyZXRUeXBlLmlzVm9pZCl7cGFyYW1zLnB1c2goXCJlbXZhbF9yZXR1cm5WYWx1ZVwiKTthcmdzLnB1c2goZW12YWxfcmV0dXJuVmFsdWUpO2Z1bmN0aW9uQm9keSs9XCIgIHJldHVybiBlbXZhbF9yZXR1cm5WYWx1ZShyZXRUeXBlLCBkZXN0cnVjdG9yc1JlZiwgcnYpO1xcblwifWZ1bmN0aW9uQm9keSs9XCJ9O1xcblwiO3BhcmFtcy5wdXNoKGZ1bmN0aW9uQm9keSk7dmFyIGludm9rZXJGdW5jdGlvbj1uZXdGdW5jKEZ1bmN0aW9uLHBhcmFtcykoLi4uYXJncyk7dmFyIGZ1bmN0aW9uTmFtZT1gbWV0aG9kQ2FsbGVyPCgke3R5cGVzLm1hcCh0PT50Lm5hbWUpLmpvaW4oXCIsIFwiKX0pID0+ICR7cmV0VHlwZS5uYW1lfT5gO3JldHVybiBlbXZhbF9hZGRNZXRob2RDYWxsZXIoY3JlYXRlTmFtZWRGdW5jdGlvbihmdW5jdGlvbk5hbWUsaW52b2tlckZ1bmN0aW9uKSl9O3ZhciBfX2VtdmFsX2dldF9wcm9wZXJ0eT0oaGFuZGxlLGtleSk9PntoYW5kbGU9RW12YWwudG9WYWx1ZShoYW5kbGUpO2tleT1FbXZhbC50b1ZhbHVlKGtleSk7cmV0dXJuIEVtdmFsLnRvSGFuZGxlKGhhbmRsZVtrZXldKX07dmFyIF9fZW12YWxfaW5jcmVmPWhhbmRsZT0+e2lmKGhhbmRsZT45KXtlbXZhbF9oYW5kbGVzW2hhbmRsZSsxXSs9MX19O3ZhciBfX2VtdmFsX25ld19hcnJheT0oKT0+RW12YWwudG9IYW5kbGUoW10pO3ZhciBfX2VtdmFsX25ld19jc3RyaW5nPXY9PkVtdmFsLnRvSGFuZGxlKGdldFN0cmluZ09yU3ltYm9sKHYpKTt2YXIgX19lbXZhbF9uZXdfb2JqZWN0PSgpPT5FbXZhbC50b0hhbmRsZSh7fSk7dmFyIF9fZW12YWxfcnVuX2Rlc3RydWN0b3JzPWhhbmRsZT0+e3ZhciBkZXN0cnVjdG9ycz1FbXZhbC50b1ZhbHVlKGhhbmRsZSk7cnVuRGVzdHJ1Y3RvcnMoZGVzdHJ1Y3RvcnMpO19fZW12YWxfZGVjcmVmKGhhbmRsZSl9O3ZhciBfX2VtdmFsX3NldF9wcm9wZXJ0eT0oaGFuZGxlLGtleSx2YWx1ZSk9PntoYW5kbGU9RW12YWwudG9WYWx1ZShoYW5kbGUpO2tleT1FbXZhbC50b1ZhbHVlKGtleSk7dmFsdWU9RW12YWwudG9WYWx1ZSh2YWx1ZSk7aGFuZGxlW2tleV09dmFsdWV9O3ZhciBfX2VtdmFsX3Rha2VfdmFsdWU9KHR5cGUsYXJnKT0+e3R5cGU9cmVxdWlyZVJlZ2lzdGVyZWRUeXBlKHR5cGUsXCJfZW12YWxfdGFrZV92YWx1ZVwiKTt2YXIgdj10eXBlW1wicmVhZFZhbHVlRnJvbVBvaW50ZXJcIl0oYXJnKTtyZXR1cm4gRW12YWwudG9IYW5kbGUodil9O3ZhciBpc0xlYXBZZWFyPXllYXI9PnllYXIlND09PTAmJih5ZWFyJTEwMCE9PTB8fHllYXIlNDAwPT09MCk7dmFyIE1PTlRIX0RBWVNfTEVBUF9DVU1VTEFUSVZFPVswLDMxLDYwLDkxLDEyMSwxNTIsMTgyLDIxMywyNDQsMjc0LDMwNSwzMzVdO3ZhciBNT05USF9EQVlTX1JFR1VMQVJfQ1VNVUxBVElWRT1bMCwzMSw1OSw5MCwxMjAsMTUxLDE4MSwyMTIsMjQzLDI3MywzMDQsMzM0XTt2YXIgeWRheUZyb21EYXRlPWRhdGU9Pnt2YXIgbGVhcD1pc0xlYXBZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSk7dmFyIG1vbnRoRGF5c0N1bXVsYXRpdmU9bGVhcD9NT05USF9EQVlTX0xFQVBfQ1VNVUxBVElWRTpNT05USF9EQVlTX1JFR1VMQVJfQ1VNVUxBVElWRTt2YXIgeWRheT1tb250aERheXNDdW11bGF0aXZlW2RhdGUuZ2V0TW9udGgoKV0rZGF0ZS5nZXREYXRlKCktMTtyZXR1cm4geWRheX07dmFyIGNvbnZlcnRJMzJQYWlyVG9JNTNDaGVja2VkPShsbyxoaSk9PmhpKzIwOTcxNTI+Pj4wPDQxOTQzMDUtISFsbz8obG8+Pj4wKStoaSo0Mjk0OTY3Mjk2Ok5hTjtmdW5jdGlvbiBfX2xvY2FsdGltZV9qcyh0aW1lX2xvdyx0aW1lX2hpZ2gsdG1QdHIpe3ZhciB0aW1lPWNvbnZlcnRJMzJQYWlyVG9JNTNDaGVja2VkKHRpbWVfbG93LHRpbWVfaGlnaCk7dmFyIGRhdGU9bmV3IERhdGUodGltZSoxZTMpO0hFQVAzMlt0bVB0cj4+Ml09ZGF0ZS5nZXRTZWNvbmRzKCk7SEVBUDMyW3RtUHRyKzQ+PjJdPWRhdGUuZ2V0TWludXRlcygpO0hFQVAzMlt0bVB0cis4Pj4yXT1kYXRlLmdldEhvdXJzKCk7SEVBUDMyW3RtUHRyKzEyPj4yXT1kYXRlLmdldERhdGUoKTtIRUFQMzJbdG1QdHIrMTY+PjJdPWRhdGUuZ2V0TW9udGgoKTtIRUFQMzJbdG1QdHIrMjA+PjJdPWRhdGUuZ2V0RnVsbFllYXIoKS0xOTAwO0hFQVAzMlt0bVB0cisyND4+Ml09ZGF0ZS5nZXREYXkoKTt2YXIgeWRheT15ZGF5RnJvbURhdGUoZGF0ZSl8MDtIRUFQMzJbdG1QdHIrMjg+PjJdPXlkYXk7SEVBUDMyW3RtUHRyKzM2Pj4yXT0tKGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSo2MCk7dmFyIHN0YXJ0PW5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwwLDEpO3ZhciBzdW1tZXJPZmZzZXQ9bmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLDYsMSkuZ2V0VGltZXpvbmVPZmZzZXQoKTt2YXIgd2ludGVyT2Zmc2V0PXN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCk7dmFyIGRzdD0oc3VtbWVyT2Zmc2V0IT13aW50ZXJPZmZzZXQmJmRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKT09TWF0aC5taW4od2ludGVyT2Zmc2V0LHN1bW1lck9mZnNldCkpfDA7SEVBUDMyW3RtUHRyKzMyPj4yXT1kc3R9ZnVuY3Rpb24gX19tdW5tYXBfanMoYWRkcixsZW4scHJvdCxmbGFncyxmZCxvZmZzZXRfbG93LG9mZnNldF9oaWdoKXt2YXIgb2Zmc2V0PWNvbnZlcnRJMzJQYWlyVG9JNTNDaGVja2VkKG9mZnNldF9sb3csb2Zmc2V0X2hpZ2gpO3RyeXt2YXIgc3RyZWFtPVNZU0NBTExTLmdldFN0cmVhbUZyb21GRChmZCk7aWYocHJvdCYyKXtTWVNDQUxMUy5kb01zeW5jKGFkZHIsc3RyZWFtLGxlbixmbGFncyxvZmZzZXQpfX1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuLWUuZXJybm99fXZhciBfX3R6c2V0X2pzPSh0aW1lem9uZSxkYXlsaWdodCxzdGRfbmFtZSxkc3RfbmFtZSk9Pnt2YXIgY3VycmVudFllYXI9KG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpO3ZhciB3aW50ZXI9bmV3IERhdGUoY3VycmVudFllYXIsMCwxKTt2YXIgc3VtbWVyPW5ldyBEYXRlKGN1cnJlbnRZZWFyLDYsMSk7dmFyIHdpbnRlck9mZnNldD13aW50ZXIuZ2V0VGltZXpvbmVPZmZzZXQoKTt2YXIgc3VtbWVyT2Zmc2V0PXN1bW1lci5nZXRUaW1lem9uZU9mZnNldCgpO3ZhciBzdGRUaW1lem9uZU9mZnNldD1NYXRoLm1heCh3aW50ZXJPZmZzZXQsc3VtbWVyT2Zmc2V0KTtIRUFQVTMyW3RpbWV6b25lPj4yXT1zdGRUaW1lem9uZU9mZnNldCo2MDtIRUFQMzJbZGF5bGlnaHQ+PjJdPU51bWJlcih3aW50ZXJPZmZzZXQhPXN1bW1lck9mZnNldCk7dmFyIGV4dHJhY3Rab25lPXRpbWV6b25lT2Zmc2V0PT57dmFyIHNpZ249dGltZXpvbmVPZmZzZXQ+PTA/XCItXCI6XCIrXCI7dmFyIGFic09mZnNldD1NYXRoLmFicyh0aW1lem9uZU9mZnNldCk7dmFyIGhvdXJzPVN0cmluZyhNYXRoLmZsb29yKGFic09mZnNldC82MCkpLnBhZFN0YXJ0KDIsXCIwXCIpO3ZhciBtaW51dGVzPVN0cmluZyhhYnNPZmZzZXQlNjApLnBhZFN0YXJ0KDIsXCIwXCIpO3JldHVybmBVVEMke3NpZ259JHtob3Vyc30ke21pbnV0ZXN9YH07dmFyIHdpbnRlck5hbWU9ZXh0cmFjdFpvbmUod2ludGVyT2Zmc2V0KTt2YXIgc3VtbWVyTmFtZT1leHRyYWN0Wm9uZShzdW1tZXJPZmZzZXQpO2lmKHN1bW1lck9mZnNldDx3aW50ZXJPZmZzZXQpe3N0cmluZ1RvVVRGOCh3aW50ZXJOYW1lLHN0ZF9uYW1lLDE3KTtzdHJpbmdUb1VURjgoc3VtbWVyTmFtZSxkc3RfbmFtZSwxNyl9ZWxzZXtzdHJpbmdUb1VURjgod2ludGVyTmFtZSxkc3RfbmFtZSwxNyk7c3RyaW5nVG9VVEY4KHN1bW1lck5hbWUsc3RkX25hbWUsMTcpfX07dmFyIF9lbXNjcmlwdGVuX2RhdGVfbm93PSgpPT5EYXRlLm5vdygpO2Z1bmN0aW9uIGpzU3RhY2tUcmFjZSgpe3JldHVybihuZXcgRXJyb3IpLnN0YWNrLnRvU3RyaW5nKCl9dmFyIHdhcm5PbmNlPXRleHQ9Pnt3YXJuT25jZS5zaG93bnx8PXt9O2lmKCF3YXJuT25jZS5zaG93blt0ZXh0XSl7d2Fybk9uY2Uuc2hvd25bdGV4dF09MTtpZihFTlZJUk9OTUVOVF9JU19OT0RFKXRleHQ9XCJ3YXJuaW5nOiBcIit0ZXh0O2Vycih0ZXh0KX19O2Z1bmN0aW9uIGdldENhbGxzdGFjayhmbGFncyl7dmFyIGNhbGxzdGFjaz1qc1N0YWNrVHJhY2UoKTt2YXIgaVRoaXNGdW5jPWNhbGxzdGFjay5sYXN0SW5kZXhPZihcIl9lbXNjcmlwdGVuX2xvZ1wiKTt2YXIgaVRoaXNGdW5jMj1jYWxsc3RhY2subGFzdEluZGV4T2YoXCJfZW1zY3JpcHRlbl9nZXRfY2FsbHN0YWNrXCIpO3ZhciBpTmV4dExpbmU9Y2FsbHN0YWNrLmluZGV4T2YoXCJcXG5cIixNYXRoLm1heChpVGhpc0Z1bmMsaVRoaXNGdW5jMikpKzE7Y2FsbHN0YWNrPWNhbGxzdGFjay5zbGljZShpTmV4dExpbmUpO2lmKGZsYWdzJjgmJnR5cGVvZiBlbXNjcmlwdGVuX3NvdXJjZV9tYXA9PVwidW5kZWZpbmVkXCIpe3dhcm5PbmNlKCdTb3VyY2UgbWFwIGluZm9ybWF0aW9uIGlzIG5vdCBhdmFpbGFibGUsIGVtc2NyaXB0ZW5fbG9nIHdpdGggRU1fTE9HX0NfU1RBQ0sgd2lsbCBiZSBpZ25vcmVkLiBCdWlsZCB3aXRoIFwiLS1wcmUtanMgJEVNU0NSSVBURU4vc3JjL2Vtc2NyaXB0ZW4tc291cmNlLW1hcC5taW4uanNcIiBsaW5rZXIgZmxhZyB0byBhZGQgc291cmNlIG1hcCBsb2FkaW5nIHRvIGNvZGUuJyk7ZmxhZ3NePTg7ZmxhZ3N8PTE2fXZhciBsaW5lcz1jYWxsc3RhY2suc3BsaXQoXCJcXG5cIik7Y2FsbHN0YWNrPVwiXCI7dmFyIG5ld0ZpcmVmb3hSZT1uZXcgUmVnRXhwKFwiXFxcXHMqKC4qPylAKC4qPyk6KFswLTldKyk6KFswLTldKylcIik7dmFyIGZpcmVmb3hSZT1uZXcgUmVnRXhwKFwiXFxcXHMqKC4qPylAKC4qKTooLiopKDooLiopKT9cIik7dmFyIGNocm9tZVJlPW5ldyBSZWdFeHAoXCJcXFxccyphdCAoLio/KSBcXFxcKCguKik6KC4qKTooLiopXFxcXClcIik7Zm9yKHZhciBsIGluIGxpbmVzKXt2YXIgbGluZT1saW5lc1tsXTt2YXIgc3ltYm9sTmFtZT1cIlwiO3ZhciBmaWxlPVwiXCI7dmFyIGxpbmVubz0wO3ZhciBjb2x1bW49MDt2YXIgcGFydHM9Y2hyb21lUmUuZXhlYyhsaW5lKTtpZihwYXJ0cyYmcGFydHMubGVuZ3RoPT01KXtzeW1ib2xOYW1lPXBhcnRzWzFdO2ZpbGU9cGFydHNbMl07bGluZW5vPXBhcnRzWzNdO2NvbHVtbj1wYXJ0c1s0XX1lbHNle3BhcnRzPW5ld0ZpcmVmb3hSZS5leGVjKGxpbmUpfHxmaXJlZm94UmUuZXhlYyhsaW5lKTtpZihwYXJ0cyYmcGFydHMubGVuZ3RoPj00KXtzeW1ib2xOYW1lPXBhcnRzWzFdO2ZpbGU9cGFydHNbMl07bGluZW5vPXBhcnRzWzNdO2NvbHVtbj1wYXJ0c1s0XXwwfWVsc2V7Y2FsbHN0YWNrKz1saW5lK1wiXFxuXCI7Y29udGludWV9fXZhciBoYXZlU291cmNlTWFwPWZhbHNlO2lmKGZsYWdzJjgpe3ZhciBvcmlnPWVtc2NyaXB0ZW5fc291cmNlX21hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtsaW5lOmxpbmVubyxjb2x1bW59KTtoYXZlU291cmNlTWFwPW9yaWc/LnNvdXJjZTtpZihoYXZlU291cmNlTWFwKXtpZihmbGFncyY2NCl7b3JpZy5zb3VyY2U9b3JpZy5zb3VyY2Uuc3Vic3RyaW5nKG9yaWcuc291cmNlLnJlcGxhY2UoL1xcXFwvZyxcIi9cIikubGFzdEluZGV4T2YoXCIvXCIpKzEpfWNhbGxzdGFjays9YCAgICBhdCAke3N5bWJvbE5hbWV9ICgke29yaWcuc291cmNlfToke29yaWcubGluZX06JHtvcmlnLmNvbHVtbn0pXFxuYH19aWYoZmxhZ3MmMTZ8fCFoYXZlU291cmNlTWFwKXtpZihmbGFncyY2NCl7ZmlsZT1maWxlLnN1YnN0cmluZyhmaWxlLnJlcGxhY2UoL1xcXFwvZyxcIi9cIikubGFzdEluZGV4T2YoXCIvXCIpKzEpfWNhbGxzdGFjays9KGhhdmVTb3VyY2VNYXA/YCAgICAgPSAke3N5bWJvbE5hbWV9YDpgICAgIGF0ICR7c3ltYm9sTmFtZX1gKStgICgke2ZpbGV9OiR7bGluZW5vfToke2NvbHVtbn0pXFxuYH19Y2FsbHN0YWNrPWNhbGxzdGFjay5yZXBsYWNlKC9cXHMrJC8sXCJcIik7cmV0dXJuIGNhbGxzdGFja31mdW5jdGlvbiBfZW1zY3JpcHRlbl9nZXRfY2FsbHN0YWNrKGZsYWdzLHN0cixtYXhieXRlcyl7dmFyIGNhbGxzdGFjaz1nZXRDYWxsc3RhY2soZmxhZ3MpO2lmKCFzdHJ8fG1heGJ5dGVzPD0wKXtyZXR1cm4gbGVuZ3RoQnl0ZXNVVEY4KGNhbGxzdGFjaykrMX12YXIgYnl0ZXNXcml0dGVuRXhjbHVkaW5nTnVsbD1zdHJpbmdUb1VURjgoY2FsbHN0YWNrLHN0cixtYXhieXRlcyk7cmV0dXJuIGJ5dGVzV3JpdHRlbkV4Y2x1ZGluZ051bGwrMX12YXIgZ2V0SGVhcE1heD0oKT0+MjE0NzQ4MzY0ODt2YXIgX2Vtc2NyaXB0ZW5fZ2V0X2hlYXBfbWF4PSgpPT5nZXRIZWFwTWF4KCk7dmFyIGdyb3dNZW1vcnk9c2l6ZT0+e3ZhciBiPXdhc21NZW1vcnkuYnVmZmVyO3ZhciBwYWdlcz0oc2l6ZS1iLmJ5dGVMZW5ndGgrNjU1MzUpLzY1NTM2fDA7dHJ5e3dhc21NZW1vcnkuZ3JvdyhwYWdlcyk7dXBkYXRlTWVtb3J5Vmlld3MoKTtyZXR1cm4gMX1jYXRjaChlKXt9fTt2YXIgX2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXA9cmVxdWVzdGVkU2l6ZT0+e3ZhciBvbGRTaXplPUhFQVBVOC5sZW5ndGg7cmVxdWVzdGVkU2l6ZT4+Pj0wO3ZhciBtYXhIZWFwU2l6ZT1nZXRIZWFwTWF4KCk7aWYocmVxdWVzdGVkU2l6ZT5tYXhIZWFwU2l6ZSl7cmV0dXJuIGZhbHNlfWZvcih2YXIgY3V0RG93bj0xO2N1dERvd248PTQ7Y3V0RG93bio9Mil7dmFyIG92ZXJHcm93bkhlYXBTaXplPW9sZFNpemUqKDErLjIvY3V0RG93bik7b3Zlckdyb3duSGVhcFNpemU9TWF0aC5taW4ob3Zlckdyb3duSGVhcFNpemUscmVxdWVzdGVkU2l6ZSsxMDA2NjMyOTYpO3ZhciBuZXdTaXplPU1hdGgubWluKG1heEhlYXBTaXplLGFsaWduTWVtb3J5KE1hdGgubWF4KHJlcXVlc3RlZFNpemUsb3Zlckdyb3duSGVhcFNpemUpLDY1NTM2KSk7dmFyIHJlcGxhY2VtZW50PWdyb3dNZW1vcnkobmV3U2l6ZSk7aWYocmVwbGFjZW1lbnQpe3JldHVybiB0cnVlfX1yZXR1cm4gZmFsc2V9O3ZhciBFTlY9e307dmFyIGdldEV4ZWN1dGFibGVOYW1lPSgpPT50aGlzUHJvZ3JhbXx8XCIuL3RoaXMucHJvZ3JhbVwiO3ZhciBnZXRFbnZTdHJpbmdzPSgpPT57aWYoIWdldEVudlN0cmluZ3Muc3RyaW5ncyl7dmFyIGxhbmc9KHR5cGVvZiBuYXZpZ2F0b3I9PVwib2JqZWN0XCImJm5hdmlnYXRvci5sYW5ndWFnZXMmJm5hdmlnYXRvci5sYW5ndWFnZXNbMF18fFwiQ1wiKS5yZXBsYWNlKFwiLVwiLFwiX1wiKStcIi5VVEYtOFwiO3ZhciBlbnY9e1VTRVI6XCJ3ZWJfdXNlclwiLExPR05BTUU6XCJ3ZWJfdXNlclwiLFBBVEg6XCIvXCIsUFdEOlwiL1wiLEhPTUU6XCIvaG9tZS93ZWJfdXNlclwiLExBTkc6bGFuZyxfOmdldEV4ZWN1dGFibGVOYW1lKCl9O2Zvcih2YXIgeCBpbiBFTlYpe2lmKEVOVlt4XT09PXVuZGVmaW5lZClkZWxldGUgZW52W3hdO2Vsc2UgZW52W3hdPUVOVlt4XX12YXIgc3RyaW5ncz1bXTtmb3IodmFyIHggaW4gZW52KXtzdHJpbmdzLnB1c2goYCR7eH09JHtlbnZbeF19YCl9Z2V0RW52U3RyaW5ncy5zdHJpbmdzPXN0cmluZ3N9cmV0dXJuIGdldEVudlN0cmluZ3Muc3RyaW5nc307dmFyIHN0cmluZ1RvQXNjaWk9KHN0cixidWZmZXIpPT57Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7SEVBUDhbYnVmZmVyKytdPXN0ci5jaGFyQ29kZUF0KGkpfUhFQVA4W2J1ZmZlcl09MH07dmFyIF9lbnZpcm9uX2dldD0oX19lbnZpcm9uLGVudmlyb25fYnVmKT0+e3ZhciBidWZTaXplPTA7Z2V0RW52U3RyaW5ncygpLmZvckVhY2goKHN0cmluZyxpKT0+e3ZhciBwdHI9ZW52aXJvbl9idWYrYnVmU2l6ZTtIRUFQVTMyW19fZW52aXJvbitpKjQ+PjJdPXB0cjtzdHJpbmdUb0FzY2lpKHN0cmluZyxwdHIpO2J1ZlNpemUrPXN0cmluZy5sZW5ndGgrMX0pO3JldHVybiAwfTt2YXIgX2Vudmlyb25fc2l6ZXNfZ2V0PShwZW52aXJvbl9jb3VudCxwZW52aXJvbl9idWZfc2l6ZSk9Pnt2YXIgc3RyaW5ncz1nZXRFbnZTdHJpbmdzKCk7SEVBUFUzMltwZW52aXJvbl9jb3VudD4+Ml09c3RyaW5ncy5sZW5ndGg7dmFyIGJ1ZlNpemU9MDtzdHJpbmdzLmZvckVhY2goc3RyaW5nPT5idWZTaXplKz1zdHJpbmcubGVuZ3RoKzEpO0hFQVBVMzJbcGVudmlyb25fYnVmX3NpemU+PjJdPWJ1ZlNpemU7cmV0dXJuIDB9O3ZhciBydW50aW1lS2VlcGFsaXZlQ291bnRlcj0wO3ZhciBrZWVwUnVudGltZUFsaXZlPSgpPT5ub0V4aXRSdW50aW1lfHxydW50aW1lS2VlcGFsaXZlQ291bnRlcj4wO3ZhciBfcHJvY19leGl0PWNvZGU9PntFWElUU1RBVFVTPWNvZGU7aWYoIWtlZXBSdW50aW1lQWxpdmUoKSl7TW9kdWxlW1wib25FeGl0XCJdPy4oY29kZSk7QUJPUlQ9dHJ1ZX1xdWl0Xyhjb2RlLG5ldyBFeGl0U3RhdHVzKGNvZGUpKX07dmFyIGV4aXRKUz0oc3RhdHVzLGltcGxpY2l0KT0+e0VYSVRTVEFUVVM9c3RhdHVzO19wcm9jX2V4aXQoc3RhdHVzKX07dmFyIF9leGl0PWV4aXRKUztmdW5jdGlvbiBfZmRfY2xvc2UoZmQpe3RyeXt2YXIgc3RyZWFtPVNZU0NBTExTLmdldFN0cmVhbUZyb21GRChmZCk7RlMuY2xvc2Uoc3RyZWFtKTtyZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuIGUuZXJybm99fXZhciBkb1JlYWR2PShzdHJlYW0saW92LGlvdmNudCxvZmZzZXQpPT57dmFyIHJldD0wO2Zvcih2YXIgaT0wO2k8aW92Y250O2krKyl7dmFyIHB0cj1IRUFQVTMyW2lvdj4+Ml07dmFyIGxlbj1IRUFQVTMyW2lvdis0Pj4yXTtpb3YrPTg7dmFyIGN1cnI9RlMucmVhZChzdHJlYW0sSEVBUDgscHRyLGxlbixvZmZzZXQpO2lmKGN1cnI8MClyZXR1cm4tMTtyZXQrPWN1cnI7aWYoY3VycjxsZW4pYnJlYWs7aWYodHlwZW9mIG9mZnNldCE9XCJ1bmRlZmluZWRcIil7b2Zmc2V0Kz1jdXJyfX1yZXR1cm4gcmV0fTtmdW5jdGlvbiBfZmRfcmVhZChmZCxpb3YsaW92Y250LHBudW0pe3RyeXt2YXIgc3RyZWFtPVNZU0NBTExTLmdldFN0cmVhbUZyb21GRChmZCk7dmFyIG51bT1kb1JlYWR2KHN0cmVhbSxpb3YsaW92Y250KTtIRUFQVTMyW3BudW0+PjJdPW51bTtyZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuIGUuZXJybm99fWZ1bmN0aW9uIF9mZF9zZWVrKGZkLG9mZnNldF9sb3csb2Zmc2V0X2hpZ2gsd2hlbmNlLG5ld09mZnNldCl7dmFyIG9mZnNldD1jb252ZXJ0STMyUGFpclRvSTUzQ2hlY2tlZChvZmZzZXRfbG93LG9mZnNldF9oaWdoKTt0cnl7aWYoaXNOYU4ob2Zmc2V0KSlyZXR1cm4gNjE7dmFyIHN0cmVhbT1TWVNDQUxMUy5nZXRTdHJlYW1Gcm9tRkQoZmQpO0ZTLmxsc2VlayhzdHJlYW0sb2Zmc2V0LHdoZW5jZSk7dGVtcEk2ND1bc3RyZWFtLnBvc2l0aW9uPj4+MCwodGVtcERvdWJsZT1zdHJlYW0ucG9zaXRpb24sK01hdGguYWJzKHRlbXBEb3VibGUpPj0xP3RlbXBEb3VibGU+MD8rTWF0aC5mbG9vcih0ZW1wRG91YmxlLzQyOTQ5NjcyOTYpPj4+MDp+fitNYXRoLmNlaWwoKHRlbXBEb3VibGUtKyh+fnRlbXBEb3VibGU+Pj4wKSkvNDI5NDk2NzI5Nik+Pj4wOjApXSxIRUFQMzJbbmV3T2Zmc2V0Pj4yXT10ZW1wSTY0WzBdLEhFQVAzMltuZXdPZmZzZXQrND4+Ml09dGVtcEk2NFsxXTtpZihzdHJlYW0uZ2V0ZGVudHMmJm9mZnNldD09PTAmJndoZW5jZT09PTApc3RyZWFtLmdldGRlbnRzPW51bGw7cmV0dXJuIDB9Y2F0Y2goZSl7aWYodHlwZW9mIEZTPT1cInVuZGVmaW5lZFwifHwhKGUubmFtZT09PVwiRXJybm9FcnJvclwiKSl0aHJvdyBlO3JldHVybiBlLmVycm5vfX12YXIgZG9Xcml0ZXY9KHN0cmVhbSxpb3YsaW92Y250LG9mZnNldCk9Pnt2YXIgcmV0PTA7Zm9yKHZhciBpPTA7aTxpb3ZjbnQ7aSsrKXt2YXIgcHRyPUhFQVBVMzJbaW92Pj4yXTt2YXIgbGVuPUhFQVBVMzJbaW92KzQ+PjJdO2lvdis9ODt2YXIgY3Vycj1GUy53cml0ZShzdHJlYW0sSEVBUDgscHRyLGxlbixvZmZzZXQpO2lmKGN1cnI8MClyZXR1cm4tMTtyZXQrPWN1cnI7aWYoY3VycjxsZW4pe2JyZWFrfWlmKHR5cGVvZiBvZmZzZXQhPVwidW5kZWZpbmVkXCIpe29mZnNldCs9Y3Vycn19cmV0dXJuIHJldH07ZnVuY3Rpb24gX2ZkX3dyaXRlKGZkLGlvdixpb3ZjbnQscG51bSl7dHJ5e3ZhciBzdHJlYW09U1lTQ0FMTFMuZ2V0U3RyZWFtRnJvbUZEKGZkKTt2YXIgbnVtPWRvV3JpdGV2KHN0cmVhbSxpb3YsaW92Y250KTtIRUFQVTMyW3BudW0+PjJdPW51bTtyZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PVwidW5kZWZpbmVkXCJ8fCEoZS5uYW1lPT09XCJFcnJub0Vycm9yXCIpKXRocm93IGU7cmV0dXJuIGUuZXJybm99fUZTLmNyZWF0ZVByZWxvYWRlZEZpbGU9RlNfY3JlYXRlUHJlbG9hZGVkRmlsZTtGUy5zdGF0aWNJbml0KCk7ZW1iaW5kX2luaXRfY2hhckNvZGVzKCk7QmluZGluZ0Vycm9yPU1vZHVsZVtcIkJpbmRpbmdFcnJvclwiXT1jbGFzcyBCaW5kaW5nRXJyb3IgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihtZXNzYWdlKXtzdXBlcihtZXNzYWdlKTt0aGlzLm5hbWU9XCJCaW5kaW5nRXJyb3JcIn19O0ludGVybmFsRXJyb3I9TW9kdWxlW1wiSW50ZXJuYWxFcnJvclwiXT1jbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IobWVzc2FnZSl7c3VwZXIobWVzc2FnZSk7dGhpcy5uYW1lPVwiSW50ZXJuYWxFcnJvclwifX07aW5pdF9lbXZhbCgpO1VuYm91bmRUeXBlRXJyb3I9TW9kdWxlW1wiVW5ib3VuZFR5cGVFcnJvclwiXT1leHRlbmRFcnJvcihFcnJvcixcIlVuYm91bmRUeXBlRXJyb3JcIik7dmFyIHdhc21JbXBvcnRzPXtNOl9fX3N5c2NhbGxfY2htb2QsTjpfX19zeXNjYWxsX2ZhY2Nlc3NhdCxoOl9fX3N5c2NhbGxfZmNudGw2NCxJOl9fX3N5c2NhbGxfZnN0YXQ2NCxROl9fX3N5c2NhbGxfaW9jdGwsRjpfX19zeXNjYWxsX2xzdGF0NjQsRzpfX19zeXNjYWxsX25ld2ZzdGF0YXQsajpfX19zeXNjYWxsX29wZW5hdCxCOl9fX3N5c2NhbGxfcm1kaXIsSDpfX19zeXNjYWxsX3N0YXQ2NCxDOl9fX3N5c2NhbGxfdW5saW5rYXQsQTpfX2Fib3J0X2pzLHc6X19lbWJpbmRfcmVnaXN0ZXJfYmlnaW50LFY6X19lbWJpbmRfcmVnaXN0ZXJfYm9vbCxVOl9fZW1iaW5kX3JlZ2lzdGVyX2VtdmFsLG46X19lbWJpbmRfcmVnaXN0ZXJfZmxvYXQsZjpfX2VtYmluZF9yZWdpc3Rlcl9mdW5jdGlvbixiOl9fZW1iaW5kX3JlZ2lzdGVyX2ludGVnZXIsYTpfX2VtYmluZF9yZWdpc3Rlcl9tZW1vcnlfdmlldyxtOl9fZW1iaW5kX3JlZ2lzdGVyX3N0ZF9zdHJpbmcsaTpfX2VtYmluZF9yZWdpc3Rlcl9zdGRfd3N0cmluZyxXOl9fZW1iaW5kX3JlZ2lzdGVyX3ZvaWQsSjpfX2Vtc2NyaXB0ZW5fZ2V0X25vd19pc19tb25vdG9uaWMseDpfX2Vtc2NyaXB0ZW5fbG9va3VwX25hbWUsTDpfX2Vtc2NyaXB0ZW5fbWVtY3B5X2pzLGU6X19lbXZhbF9hcyxxOl9fZW12YWxfY2FsbF9tZXRob2QsVDpfX2VtdmFsX2RlY3JlZix1Ol9fZW12YWxfZ2V0X2dsb2JhbCxwOl9fZW12YWxfZ2V0X21ldGhvZF9jYWxsZXIsazpfX2VtdmFsX2dldF9wcm9wZXJ0eSxZOl9fZW12YWxfaW5jcmVmLFg6X19lbXZhbF9uZXdfYXJyYXkscjpfX2VtdmFsX25ld19jc3RyaW5nLFo6X19lbXZhbF9uZXdfb2JqZWN0LG86X19lbXZhbF9ydW5fZGVzdHJ1Y3RvcnMsYzpfX2VtdmFsX3NldF9wcm9wZXJ0eSxkOl9fZW12YWxfdGFrZV92YWx1ZSx0Ol9fbG9jYWx0aW1lX2pzLHM6X19tdW5tYXBfanMsTzpfX3R6c2V0X2pzLEs6X2Vtc2NyaXB0ZW5fZGF0ZV9ub3csUjpfZW1zY3JpcHRlbl9nZXRfY2FsbHN0YWNrLHo6X2Vtc2NyaXB0ZW5fZ2V0X2hlYXBfbWF4LHk6X2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXAsRDpfZW52aXJvbl9nZXQsRTpfZW52aXJvbl9zaXplc19nZXQsUzpfZXhpdCxnOl9mZF9jbG9zZSxQOl9mZF9yZWFkLHY6X2ZkX3NlZWssbDpfZmRfd3JpdGV9O3ZhciB3YXNtRXhwb3J0cz1jcmVhdGVXYXNtKCk7dmFyIF9fX3dhc21fY2FsbF9jdG9ycz0oKT0+KF9fX3dhc21fY2FsbF9jdG9ycz13YXNtRXhwb3J0c1tcIiRcIl0pKCk7dmFyIF9fX2dldFR5cGVOYW1lPWEwPT4oX19fZ2V0VHlwZU5hbWU9d2FzbUV4cG9ydHNbXCJhYVwiXSkoYTApO3ZhciBfbWFsbG9jPWEwPT4oX21hbGxvYz13YXNtRXhwb3J0c1tcImNhXCJdKShhMCk7dmFyIF9mcmVlPWEwPT4oX2ZyZWU9d2FzbUV4cG9ydHNbXCJkYVwiXSkoYTApO3ZhciBfaHRvbnM9YTA9PihfaHRvbnM9d2FzbUV4cG9ydHNbXCJlYVwiXSkoYTApO3ZhciBfZW1zY3JpcHRlbl9idWlsdGluX21lbWFsaWduPShhMCxhMSk9PihfZW1zY3JpcHRlbl9idWlsdGluX21lbWFsaWduPXdhc21FeHBvcnRzW1wiZmFcIl0pKGEwLGExKTt2YXIgX19fdHJhcD0oKT0+KF9fX3RyYXA9d2FzbUV4cG9ydHNbXCJnYVwiXSkoKTt2YXIgZHluQ2FsbF92aWlqaWk9TW9kdWxlW1wiZHluQ2FsbF92aWlqaWlcIl09KGEwLGExLGEyLGEzLGE0LGE1LGE2KT0+KGR5bkNhbGxfdmlpamlpPU1vZHVsZVtcImR5bkNhbGxfdmlpamlpXCJdPXdhc21FeHBvcnRzW1wiaGFcIl0pKGEwLGExLGEyLGEzLGE0LGE1LGE2KTt2YXIgZHluQ2FsbF92aWlpaWppPU1vZHVsZVtcImR5bkNhbGxfdmlpaWlqaVwiXT0oYTAsYTEsYTIsYTMsYTQsYTUsYTYsYTcpPT4oZHluQ2FsbF92aWlpaWppPU1vZHVsZVtcImR5bkNhbGxfdmlpaWlqaVwiXT13YXNtRXhwb3J0c1tcImlhXCJdKShhMCxhMSxhMixhMyxhNCxhNSxhNixhNyk7dmFyIGR5bkNhbGxfamlqaT1Nb2R1bGVbXCJkeW5DYWxsX2ppamlcIl09KGEwLGExLGEyLGEzLGE0KT0+KGR5bkNhbGxfamlqaT1Nb2R1bGVbXCJkeW5DYWxsX2ppamlcIl09d2FzbUV4cG9ydHNbXCJqYVwiXSkoYTAsYTEsYTIsYTMsYTQpO3ZhciBkeW5DYWxsX2lpaWlpaj1Nb2R1bGVbXCJkeW5DYWxsX2lpaWlpalwiXT0oYTAsYTEsYTIsYTMsYTQsYTUsYTYpPT4oZHluQ2FsbF9paWlpaWo9TW9kdWxlW1wiZHluQ2FsbF9paWlpaWpcIl09d2FzbUV4cG9ydHNbXCJrYVwiXSkoYTAsYTEsYTIsYTMsYTQsYTUsYTYpO3ZhciBkeW5DYWxsX2lpaWlpamo9TW9kdWxlW1wiZHluQ2FsbF9paWlpaWpqXCJdPShhMCxhMSxhMixhMyxhNCxhNSxhNixhNyxhOCk9PihkeW5DYWxsX2lpaWlpamo9TW9kdWxlW1wiZHluQ2FsbF9paWlpaWpqXCJdPXdhc21FeHBvcnRzW1wibGFcIl0pKGEwLGExLGEyLGEzLGE0LGE1LGE2LGE3LGE4KTt2YXIgZHluQ2FsbF9paWlpaWlqaj1Nb2R1bGVbXCJkeW5DYWxsX2lpaWlpaWpqXCJdPShhMCxhMSxhMixhMyxhNCxhNSxhNixhNyxhOCxhOSk9PihkeW5DYWxsX2lpaWlpaWpqPU1vZHVsZVtcImR5bkNhbGxfaWlpaWlpampcIl09d2FzbUV4cG9ydHNbXCJtYVwiXSkoYTAsYTEsYTIsYTMsYTQsYTUsYTYsYTcsYTgsYTkpO3ZhciBjYWxsZWRSdW47dmFyIGNhbGxlZFByZXJ1bjtkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9ZnVuY3Rpb24gcnVuQ2FsbGVyKCl7aWYoIWNhbGxlZFJ1bilydW4oKTtpZighY2FsbGVkUnVuKWRlcGVuZGVuY2llc0Z1bGZpbGxlZD1ydW5DYWxsZXJ9O2Z1bmN0aW9uIHJ1bigpe2lmKHJ1bkRlcGVuZGVuY2llcz4wKXtyZXR1cm59aWYoIWNhbGxlZFByZXJ1bil7Y2FsbGVkUHJlcnVuPTE7cHJlUnVuKCk7aWYocnVuRGVwZW5kZW5jaWVzPjApe3JldHVybn19ZnVuY3Rpb24gZG9SdW4oKXtpZihjYWxsZWRSdW4pcmV0dXJuO2NhbGxlZFJ1bj0xO01vZHVsZVtcImNhbGxlZFJ1blwiXT0xO2lmKEFCT1JUKXJldHVybjtpbml0UnVudGltZSgpO3JlYWR5UHJvbWlzZVJlc29sdmUoTW9kdWxlKTtNb2R1bGVbXCJvblJ1bnRpbWVJbml0aWFsaXplZFwiXT8uKCk7cG9zdFJ1bigpfWlmKE1vZHVsZVtcInNldFN0YXR1c1wiXSl7TW9kdWxlW1wic2V0U3RhdHVzXCJdKFwiUnVubmluZy4uLlwiKTtzZXRUaW1lb3V0KCgpPT57c2V0VGltZW91dCgoKT0+TW9kdWxlW1wic2V0U3RhdHVzXCJdKFwiXCIpLDEpO2RvUnVuKCl9LDEpfWVsc2V7ZG9SdW4oKX19aWYoTW9kdWxlW1wicHJlSW5pdFwiXSl7aWYodHlwZW9mIE1vZHVsZVtcInByZUluaXRcIl09PVwiZnVuY3Rpb25cIilNb2R1bGVbXCJwcmVJbml0XCJdPVtNb2R1bGVbXCJwcmVJbml0XCJdXTt3aGlsZShNb2R1bGVbXCJwcmVJbml0XCJdLmxlbmd0aD4wKXtNb2R1bGVbXCJwcmVJbml0XCJdLnBvcCgpKCl9fXJ1bigpO21vZHVsZVJ0bj1yZWFkeVByb21pc2U7XHJcblxyXG5cclxuICByZXR1cm4gbW9kdWxlUnRuO1xyXG59XHJcbik7XHJcbn0pKCk7XHJcbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBvY2N0aW1wb3J0anM7XHJcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSlcclxuICBkZWZpbmUoW10sICgpID0+IG9jY3RpbXBvcnRqcyk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IGltcG9ydC5tZXRhLlJPTExET1dOX0ZJTEVfVVJMX1ZSQWt1NmZqZ2hrQXBJSVNpQldQemciLCIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuaW1wb3J0IG9jY3RpbXBvcnRqcyBmcm9tICdvY2N0LWltcG9ydC1qcydcbmltcG9ydCB3YXNtVXJsIGZyb20gJ29jY3QtaW1wb3J0LWpzL2Rpc3Qvb2NjdC1pbXBvcnQtanMud2FzbT91cmwnXG5cbmludGVyZmFjZSBSZXF1ZXN0IHsgaWQ6IG51bWJlcjsgYnVmZmVyOiBBcnJheUJ1ZmZlciB9XG5pbnRlcmZhY2UgT2NjdE1lc2gge1xuICBuYW1lPzogc3RyaW5nXG4gIGF0dHJpYnV0ZXM6IHsgcG9zaXRpb246IHsgYXJyYXk6IEFycmF5TGlrZTxudW1iZXI+IH0gfVxuICBpbmRleDogeyBhcnJheTogQXJyYXlMaWtlPG51bWJlcj4gfVxufVxuaW50ZXJmYWNlIE9jY3RSZXN1bHQgeyBzdWNjZXNzOiBib29sZWFuOyBtZXNoZXM6IE9jY3RNZXNoW10gfVxuaW50ZXJmYWNlIE9jY3QgeyBSZWFkU3RlcEZpbGUoY29udGVudDogVWludDhBcnJheSwgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwpOiBPY2N0UmVzdWx0IH1cblxuY29uc3QgY3R4ID0gc2VsZiBhcyB1bmtub3duIGFzIHtcbiAgb25tZXNzYWdlOiAoKGV2OiBNZXNzYWdlRXZlbnQ8UmVxdWVzdD4pID0+IHZvaWQpIHwgbnVsbFxuICBwb3N0TWVzc2FnZShtc2c6IHVua25vd24sIHRyYW5zZmVyPzogVHJhbnNmZXJhYmxlW10pOiB2b2lkXG59XG5cbmxldCBvY2N0OiBQcm9taXNlPE9jY3Q+IHwgbnVsbCA9IG51bGxcblxuY3R4Lm9ubWVzc2FnZSA9IGFzeW5jIChldikgPT4ge1xuICBjb25zdCB7IGlkLCBidWZmZXIgfSA9IGV2LmRhdGFcbiAgdHJ5IHtcbiAgICBvY2N0ID8/PSAob2NjdGltcG9ydGpzIGFzIChvOiB1bmtub3duKSA9PiBQcm9taXNlPE9jY3Q+KSh7IGxvY2F0ZUZpbGU6ICgpID0+IHdhc21VcmwgfSlcbiAgICBjb25zdCByZXN1bHQgPSAoYXdhaXQgb2NjdCkuUmVhZFN0ZXBGaWxlKG5ldyBVaW50OEFycmF5KGJ1ZmZlciksIHtcbiAgICAgIGxpbmVhclVuaXQ6ICdtaWxsaW1ldGVyJyxcbiAgICAgIGxpbmVhckRlZmxlY3Rpb25UeXBlOiAnYWJzb2x1dGVfdmFsdWUnLFxuICAgICAgbGluZWFyRGVmbGVjdGlvbjogMC4wMSxcbiAgICAgIGFuZ3VsYXJEZWZsZWN0aW9uOiAwLjUsXG4gICAgfSlcbiAgICBjb25zdCBtZXNoZXMgPSByZXN1bHQuc3VjY2VzcyA/IHJlc3VsdC5tZXNoZXMubWFwKChtKSA9PiAoe1xuICAgICAgbmFtZTogbS5uYW1lLFxuICAgICAgcG9zaXRpb25zOiBGbG9hdDMyQXJyYXkuZnJvbShtLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXkpLFxuICAgICAgaW5kaWNlczogVWludDMyQXJyYXkuZnJvbShtLmluZGV4LmFycmF5KSxcbiAgICB9KSkgOiBbXVxuICAgIGNvbnN0IHRyYW5zZmVyOiBUcmFuc2ZlcmFibGVbXSA9IFtdXG4gICAgZm9yIChjb25zdCBtIG9mIG1lc2hlcykgdHJhbnNmZXIucHVzaChtLnBvc2l0aW9ucy5idWZmZXIsIG0uaW5kaWNlcy5idWZmZXIpXG4gICAgY3R4LnBvc3RNZXNzYWdlKHsgaWQsIG9rOiB0cnVlLCBtZXNoZXMgfSwgdHJhbnNmZXIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGN0eC5wb3N0TWVzc2FnZSh7IGlkLCBvazogZmFsc2UsIG1lc3NhZ2U6IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnU1RFUCBpbXBvcnQgZmFpbGVkLicgfSlcbiAgfVxufVxuIl0sImlnbm9yZUxpc3QiOlsxLDJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBLE9BQU8sVUFBVSxDQUFDOzs7O0VDQ2xCLElBQUksc0JBQXNCO0dBQ3hCLElBQUksY0FBYyxPQUFPLFlBQVksY0FBYyxTQUFTLGVBQWUsTUFBTSxLQUFBO0dBQ2pGLElBQUksT0FBTyxjQUFjLGFBQWEsY0FBYyxlQUFlO0dBQ25FLFFBQ0YsU0FBUyxZQUFZLENBQUMsR0FBRztJQUN2QixJQUFJO0lBRU4sSUFBSSxTQUFPO0lBQVUsSUFBSSxxQkFBb0I7SUFBbUIsSUFBSSxlQUFhLElBQUksU0FBUyxTQUFRLFdBQVM7S0FBQyxzQkFBb0I7S0FBUSxxQkFBbUI7SUFBTSxDQUFDO0lBQUUsSUFBSSxxQkFBbUIsT0FBTyxVQUFRO0lBQVMsSUFBSSx3QkFBc0IsT0FBTyxpQkFBZTtJQUFXLElBQUksc0JBQW9CLE9BQU8sV0FBUyxZQUFVLE9BQU8sUUFBUSxZQUFVLFlBQVUsT0FBTyxRQUFRLFNBQVMsUUFBTSxZQUFVLFFBQVEsUUFBTTtJQUFXLElBQUcscUJBQW9CLENBQUM7SUFBQyxJQUFJLGtCQUFnQixPQUFPLE9BQU8sQ0FBQyxHQUFFLE1BQU07SUFBb0IsSUFBSSxjQUFZO0lBQWlCLElBQUksU0FBTyxRQUFPLFlBQVU7S0FBQyxNQUFNO0lBQU87SUFBRSxJQUFJLGtCQUFnQjtJQUFHLFNBQVMsV0FBVyxNQUFLO0tBQUMsSUFBRyxPQUFPLGVBQWUsT0FBTyxPQUFPLGFBQWEsQ0FBQyxNQUFLLGVBQWU7S0FBRSxPQUFPLGtCQUFnQjtJQUFJO0lBQUMsSUFBSSxXQUFVO0lBQVcsSUFBRyxxQkFBb0I7S0FBQyxJQUFJLEtBQUEsZ0NBQUE7S0FB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QU07S0FBQyxXQUFVO0tBQUssTUFBTSxPQUFNO01BQUMsT0FBTyxNQUFNLFdBQVcsTUFBSyxLQUFJLE9BQVUsQ0FBQztLQUFDO0tBQUUsV0FBVyxRQUFPLE1BQUssTUFBSyxLQUFJO01BQUMsSUFBRyxHQUFHLFNBQVMsSUFBSSxLQUFHLEdBQUcsT0FBTyxJQUFJLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsTUFBTSxjQUFZO09BQUMsS0FBSTtRQUFDLE1BQUs7U0FBQyxTQUFRLE1BQU0sU0FBUztTQUFRLFNBQVEsTUFBTSxTQUFTO1NBQVEsUUFBTyxNQUFNLFNBQVM7U0FBTyxPQUFNLE1BQU0sU0FBUztTQUFNLFFBQU8sTUFBTSxTQUFTO1NBQU8sUUFBTyxNQUFNLFNBQVM7U0FBTyxPQUFNLE1BQU0sU0FBUztTQUFNLFNBQVEsTUFBTSxTQUFTO1NBQVEsU0FBUSxNQUFNLFNBQVM7UUFBTztRQUFFLFFBQU8sRUFBQyxRQUFPLE1BQU0sV0FBVyxPQUFNO09BQUM7T0FBRSxNQUFLO1FBQUMsTUFBSztTQUFDLFNBQVEsTUFBTSxTQUFTO1NBQVEsU0FBUSxNQUFNLFNBQVM7UUFBTztRQUFFLFFBQU87U0FBQyxRQUFPLE1BQU0sV0FBVztTQUFPLE1BQUssTUFBTSxXQUFXO1NBQUssT0FBTSxNQUFNLFdBQVc7U0FBTSxVQUFTLE1BQU0sV0FBVztTQUFTLE1BQUssTUFBTSxXQUFXO1NBQUssT0FBTSxNQUFNLFdBQVc7UUFBSztPQUFDO09BQUUsTUFBSztRQUFDLE1BQUs7U0FBQyxTQUFRLE1BQU0sU0FBUztTQUFRLFNBQVEsTUFBTSxTQUFTO1NBQVEsVUFBUyxNQUFNLFNBQVM7UUFBUTtRQUFFLFFBQU8sQ0FBQztPQUFDO09BQUUsUUFBTztRQUFDLE1BQUs7U0FBQyxTQUFRLE1BQU0sU0FBUztTQUFRLFNBQVEsTUFBTSxTQUFTO1FBQU87UUFBRSxRQUFPLEdBQUc7T0FBaUI7TUFBQztNQUFFLElBQUksT0FBSyxHQUFHLFdBQVcsUUFBTyxNQUFLLE1BQUssR0FBRztNQUFFLElBQUcsR0FBRyxNQUFNLEtBQUssSUFBSSxHQUFFO09BQUMsS0FBSyxXQUFTLE1BQU0sVUFBVSxJQUFJO09BQUssS0FBSyxhQUFXLE1BQU0sVUFBVSxJQUFJO09BQU8sS0FBSyxXQUFTLENBQUM7TUFBQyxPQUFNLElBQUcsR0FBRyxPQUFPLEtBQUssSUFBSSxHQUFFO09BQUMsS0FBSyxXQUFTLE1BQU0sVUFBVSxLQUFLO09BQUssS0FBSyxhQUFXLE1BQU0sVUFBVSxLQUFLO09BQU8sS0FBSyxZQUFVO09BQUUsS0FBSyxXQUFTO01BQUksT0FBTSxJQUFHLEdBQUcsT0FBTyxLQUFLLElBQUksR0FBRTtPQUFDLEtBQUssV0FBUyxNQUFNLFVBQVUsS0FBSztPQUFLLEtBQUssYUFBVyxNQUFNLFVBQVUsS0FBSztNQUFNLE9BQU0sSUFBRyxHQUFHLFNBQVMsS0FBSyxJQUFJLEdBQUU7T0FBQyxLQUFLLFdBQVMsTUFBTSxVQUFVLE9BQU87T0FBSyxLQUFLLGFBQVcsTUFBTSxVQUFVLE9BQU87TUFBTTtNQUFDLEtBQUssWUFBVSxLQUFLLElBQUk7TUFBRSxJQUFHLFFBQU87T0FBQyxPQUFPLFNBQVMsUUFBTTtPQUFLLE9BQU8sWUFBVSxLQUFLO01BQVM7TUFBQyxPQUFPO0tBQUk7S0FBRSx3QkFBd0IsTUFBSztNQUFDLElBQUcsQ0FBQyxLQUFLLFVBQVMsdUJBQU8sSUFBSSxXQUFXLENBQUM7TUFBRSxJQUFHLEtBQUssU0FBUyxVQUFTLE9BQU8sS0FBSyxTQUFTLFNBQVMsR0FBRSxLQUFLLFNBQVM7TUFBRSxPQUFPLElBQUksV0FBVyxLQUFLLFFBQVE7S0FBQztLQUFFLGtCQUFrQixNQUFLLGFBQVk7TUFBQyxJQUFJLGVBQWEsS0FBSyxXQUFTLEtBQUssU0FBUyxTQUFPO01BQUUsSUFBRyxnQkFBYyxhQUFZO01BQTJDLGNBQVksS0FBSyxJQUFJLGFBQVksZ0JBQWMsZUFBYSxVQUFzQixJQUFFLFdBQVMsQ0FBQztNQUFFLElBQUcsZ0JBQWMsR0FBRSxjQUFZLEtBQUssSUFBSSxhQUFZLEdBQUc7TUFBRSxJQUFJLGNBQVksS0FBSztNQUFTLEtBQUssV0FBUyxJQUFJLFdBQVcsV0FBVztNQUFFLElBQUcsS0FBSyxZQUFVLEdBQUUsS0FBSyxTQUFTLElBQUksWUFBWSxTQUFTLEdBQUUsS0FBSyxTQUFTLEdBQUUsQ0FBQztLQUFDO0tBQUUsa0JBQWtCLE1BQUssU0FBUTtNQUFDLElBQUcsS0FBSyxhQUFXLFNBQVE7TUFBTyxJQUFHLFdBQVMsR0FBRTtPQUFDLEtBQUssV0FBUztPQUFLLEtBQUssWUFBVTtNQUFDLE9BQUs7T0FBQyxJQUFJLGNBQVksS0FBSztPQUFTLEtBQUssV0FBUyxJQUFJLFdBQVcsT0FBTztPQUFFLElBQUcsYUFBYSxLQUFLLFNBQVMsSUFBSSxZQUFZLFNBQVMsR0FBRSxLQUFLLElBQUksU0FBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDO09BQUUsS0FBSyxZQUFVO01BQU87S0FBQztLQUFFLFVBQVM7TUFBQyxRQUFRLE1BQUs7T0FBQyxJQUFJLE9BQUssQ0FBQztPQUFFLEtBQUssTUFBSSxHQUFHLFNBQVMsS0FBSyxJQUFJLElBQUUsS0FBSyxLQUFHO09BQUUsS0FBSyxNQUFJLEtBQUs7T0FBRyxLQUFLLE9BQUssS0FBSztPQUFLLEtBQUssUUFBTTtPQUFFLEtBQUssTUFBSTtPQUFFLEtBQUssTUFBSTtPQUFFLEtBQUssT0FBSyxLQUFLO09BQUssSUFBRyxHQUFHLE1BQU0sS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFLO1lBQVUsSUFBRyxHQUFHLE9BQU8sS0FBSyxJQUFJLEdBQUcsS0FBSyxPQUFLLEtBQUs7WUFBZSxJQUFHLEdBQUcsT0FBTyxLQUFLLElBQUksR0FBRyxLQUFLLE9BQUssS0FBSyxLQUFLO1lBQVksS0FBSyxPQUFLO09BQUUsS0FBSyxRQUFNLElBQUksS0FBSyxLQUFLLFNBQVM7T0FBRSxLQUFLLFFBQU0sSUFBSSxLQUFLLEtBQUssU0FBUztPQUFFLEtBQUssUUFBTSxJQUFJLEtBQUssS0FBSyxTQUFTO09BQUUsS0FBSyxVQUFRO09BQUssS0FBSyxTQUFPLEtBQUssS0FBSyxLQUFLLE9BQUssS0FBSyxPQUFPO09BQUUsT0FBTztNQUFJO01BQUUsUUFBUSxNQUFLLE1BQUs7T0FBQyxJQUFHLEtBQUssU0FBTyxLQUFBLEdBQVcsS0FBSyxPQUFLLEtBQUs7T0FBSyxJQUFHLEtBQUssY0FBWSxLQUFBLEdBQVcsS0FBSyxZQUFVLEtBQUs7T0FBVSxJQUFHLEtBQUssU0FBTyxLQUFBLEdBQVcsTUFBTSxrQkFBa0IsTUFBSyxLQUFLLElBQUk7TUFBRTtNQUFFLE9BQU8sUUFBTyxNQUFLO09BQUMsTUFBTSxHQUFHLGNBQWM7TUFBRztNQUFFLE1BQU0sUUFBTyxNQUFLLE1BQUssS0FBSTtPQUFDLE9BQU8sTUFBTSxXQUFXLFFBQU8sTUFBSyxNQUFLLEdBQUc7TUFBQztNQUFFLE9BQU8sVUFBUyxTQUFRLFVBQVM7T0FBQyxJQUFHLEdBQUcsTUFBTSxTQUFTLElBQUksR0FBRTtRQUFDLElBQUk7UUFBUyxJQUFHO1NBQUMsV0FBUyxHQUFHLFdBQVcsU0FBUSxRQUFRO1FBQUMsU0FBTyxHQUFFLENBQUM7UUFBQyxJQUFHLFVBQVUsS0FBSSxJQUFJLEtBQUssU0FBUyxVQUFVLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtPQUFHO09BQUMsT0FBTyxTQUFTLE9BQU8sU0FBUyxTQUFTO09BQU0sU0FBUyxPQUFPLFlBQVUsS0FBSyxJQUFJO09BQUUsU0FBUyxPQUFLO09BQVMsUUFBUSxTQUFTLFlBQVU7T0FBUyxRQUFRLFlBQVUsU0FBUyxPQUFPO01BQVM7TUFBRSxPQUFPLFFBQU8sTUFBSztPQUFDLE9BQU8sT0FBTyxTQUFTO09BQU0sT0FBTyxZQUFVLEtBQUssSUFBSTtNQUFDO01BQUUsTUFBTSxRQUFPLE1BQUs7T0FBcUMsS0FBSSxJQUFJLEtBQW5DLEdBQUcsV0FBVyxRQUFPLElBQXNCLENBQUMsQ0FBQyxVQUFVLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtPQUFFLE9BQU8sT0FBTyxTQUFTO09BQU0sT0FBTyxZQUFVLEtBQUssSUFBSTtNQUFDO01BQUUsUUFBUSxNQUFLO09BQUMsSUFBSSxVQUFRLENBQUMsS0FBSSxJQUFJO09BQUUsS0FBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxHQUFHLFFBQVEsS0FBSyxHQUFHO09BQUUsT0FBTztNQUFPO01BQUUsUUFBUSxRQUFPLFNBQVEsU0FBUTtPQUFDLElBQUksT0FBSyxNQUFNLFdBQVcsUUFBTyxTQUFRLE9BQVUsQ0FBQztPQUFFLEtBQUssT0FBSztPQUFRLE9BQU87TUFBSTtNQUFFLFNBQVMsTUFBSztPQUFDLElBQUcsQ0FBQyxHQUFHLE9BQU8sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO09BQUUsT0FBTyxLQUFLO01BQUk7S0FBQztLQUFFLFlBQVc7TUFBQyxLQUFLLFFBQU8sUUFBTyxRQUFPLFFBQU8sVUFBUztPQUFDLElBQUksV0FBUyxPQUFPLEtBQUs7T0FBUyxJQUFHLFlBQVUsT0FBTyxLQUFLLFdBQVUsT0FBTztPQUFFLElBQUksT0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLFlBQVUsVUFBUyxNQUFNO09BQUUsSUFBRyxPQUFLLEtBQUcsU0FBUyxVQUFVLE9BQU8sSUFBSSxTQUFTLFNBQVMsVUFBUyxXQUFTLElBQUksR0FBRSxNQUFNO1lBQU8sS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLE1BQUssS0FBSSxPQUFPLFNBQU8sS0FBRyxTQUFTLFdBQVM7T0FBRyxPQUFPO01BQUk7TUFBRSxNQUFNLFFBQU8sUUFBTyxRQUFPLFFBQU8sVUFBUyxRQUFPO09BQUMsSUFBRyxPQUFPLFdBQVMsTUFBTSxRQUFRLFNBQU87T0FBTSxJQUFHLENBQUMsUUFBTyxPQUFPO09BQUUsSUFBSSxPQUFLLE9BQU87T0FBSyxLQUFLLFlBQVUsS0FBSyxJQUFJO09BQUUsSUFBRyxPQUFPLGFBQVcsQ0FBQyxLQUFLLFlBQVUsS0FBSyxTQUFTLFdBQVU7UUFBQyxJQUFHLFFBQU87U0FBQyxLQUFLLFdBQVMsT0FBTyxTQUFTLFFBQU8sU0FBTyxNQUFNO1NBQUUsS0FBSyxZQUFVO1NBQU8sT0FBTztRQUFNLE9BQU0sSUFBRyxLQUFLLGNBQVksS0FBRyxhQUFXLEdBQUU7U0FBQyxLQUFLLFdBQVMsT0FBTyxNQUFNLFFBQU8sU0FBTyxNQUFNO1NBQUUsS0FBSyxZQUFVO1NBQU8sT0FBTztRQUFNLE9BQU0sSUFBRyxXQUFTLFVBQVEsS0FBSyxXQUFVO1NBQUMsS0FBSyxTQUFTLElBQUksT0FBTyxTQUFTLFFBQU8sU0FBTyxNQUFNLEdBQUUsUUFBUTtTQUFFLE9BQU87UUFBTTtPQUFDO09BQUMsTUFBTSxrQkFBa0IsTUFBSyxXQUFTLE1BQU07T0FBRSxJQUFHLEtBQUssU0FBUyxZQUFVLE9BQU8sVUFBVSxLQUFLLFNBQVMsSUFBSSxPQUFPLFNBQVMsUUFBTyxTQUFPLE1BQU0sR0FBRSxRQUFRO1lBQU8sS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFFBQU8sS0FBSyxLQUFLLFNBQVMsV0FBUyxLQUFHLE9BQU8sU0FBTztPQUFJLEtBQUssWUFBVSxLQUFLLElBQUksS0FBSyxXQUFVLFdBQVMsTUFBTTtPQUFFLE9BQU87TUFBTTtNQUFFLE9BQU8sUUFBTyxRQUFPLFFBQU87T0FBQyxJQUFJLFdBQVM7T0FBTyxJQUFHLFdBQVMsR0FBRyxZQUFVLE9BQU87WUFBYyxJQUFHLFdBQVMsR0FBTTtZQUFBLEdBQUcsT0FBTyxPQUFPLEtBQUssSUFBSSxHQUFHLFlBQVUsT0FBTyxLQUFLO09BQUE7T0FBVyxJQUFHLFdBQVMsR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7T0FBRSxPQUFPO01BQVE7TUFBRSxTQUFTLFFBQU8sUUFBTyxRQUFPO09BQUMsTUFBTSxrQkFBa0IsT0FBTyxNQUFLLFNBQU8sTUFBTTtPQUFFLE9BQU8sS0FBSyxZQUFVLEtBQUssSUFBSSxPQUFPLEtBQUssV0FBVSxTQUFPLE1BQU07TUFBQztNQUFFLEtBQUssUUFBTyxRQUFPLFVBQVMsTUFBSyxPQUFNO09BQUMsSUFBRyxDQUFDLEdBQUcsT0FBTyxPQUFPLEtBQUssSUFBSSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtPQUFFLElBQUk7T0FBSSxJQUFJO09BQVUsSUFBSSxXQUFTLE9BQU8s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LE1BQUs7TUFBQyxJQUFJLE9BQUssR0FBRyxTQUFTLEtBQUssT0FBTyxJQUFHLEtBQUssSUFBSTtNQUFFLEtBQUssWUFBVSxHQUFHLFVBQVU7TUFBTSxHQUFHLFVBQVUsUUFBTTtLQUFJO0tBQUUsZUFBZSxNQUFLO01BQUMsSUFBSSxPQUFLLEdBQUcsU0FBUyxLQUFLLE9BQU8sSUFBRyxLQUFLLElBQUk7TUFBRSxJQUFHLEdBQUcsVUFBVSxVQUFRLE1BQU0sR0FBRyxVQUFVLFFBQU0sS0FBSztXQUFjO09BQUMsSUFBSSxVQUFRLEdBQUcsVUFBVTtPQUFNLE9BQU0sU0FBUTtRQUFDLElBQUcsUUFBUSxjQUFZLE1BQUs7U0FBQyxRQUFRLFlBQVUsS0FBSztTQUFVO1FBQUs7UUFBQyxVQUFRLFFBQVE7T0FBUztNQUFDO0tBQUM7S0FBRSxXQUFXLFFBQU8sTUFBSztNQUFDLElBQUksVUFBUSxHQUFHLFVBQVUsTUFBTTtNQUFFLElBQUcsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLE9BQU87TUFBRSxJQUFJLE9BQUssR0FBRyxTQUFTLE9BQU8sSUFBRyxJQUFJO01BQUUsS0FBSSxJQUFJLE9BQUssR0FBRyxVQUFVLE9BQU0sTUFBSyxPQUFLLEtBQUssV0FBVTtPQUFDLElBQUksV0FBUyxLQUFLO09BQUssSUFBRyxLQUFLLE9BQU8sT0FBSyxPQUFPLE1BQUksYUFBVyxNQUFNLE9BQU87TUFBSztNQUFDLE9BQU8sR0FBRyxPQUFPLFFBQU8sSUFBSTtLQUFDO0tBQUUsV0FBVyxRQUFPLE1BQUssTUFBSyxNQUFLO01BQUMsSUFBSSxPQUFLLElBQUksR0FBRyxPQUFPLFFBQU8sTUFBSyxNQUFLLElBQUk7TUFBRSxHQUFHLFlBQVksSUFBSTtNQUFFLE9BQU87S0FBSTtLQUFFLFlBQVksTUFBSztNQUFDLEdBQUcsZUFBZSxJQUFJO0tBQUM7S0FBRSxPQUFPLE1BQUs7TUFBQyxPQUFPLFNBQU8sS0FBSztLQUFNO0tBQUUsYUFBYSxNQUFLO01BQUMsT0FBTSxDQUFDLENBQUMsS0FBSztLQUFPO0tBQUUsT0FBTyxNQUFL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SUFBSSxZQUFVO01BQUUsU0FBUyxXQUFXLFNBQVE7T0FBQyxHQUFHO09BQWlCLE9BQU8sU0FBUyxPQUFPO01BQUM7TUFBQyxTQUFTLEtBQUssU0FBUTtPQUFDLElBQUcsU0FBUTtRQUFDLElBQUcsQ0FBQyxLQUFLLFNBQVE7U0FBQyxLQUFLLFVBQVE7U0FBSyxPQUFPLFdBQVcsT0FBTztRQUFDO1FBQUM7T0FBTTtPQUFDLElBQUcsRUFBRSxhQUFXLE9BQU8sUUFBUSxXQUFXLElBQUk7TUFBRTtNQUFDLE9BQU8sU0FBUSxVQUFPO09BQUMsSUFBRyxDQUFDLE1BQU0sS0FBSyxRQUFRLE9BQU8sS0FBSyxJQUFJO09BQUUsTUFBTSxLQUFLLE9BQU8sT0FBTSxVQUFTLElBQUk7TUFBQyxDQUFDO0tBQUM7S0FBRSxNQUFNLE1BQUssTUFBSyxZQUFXO01BQUMsSUFBSSxPQUFLLGVBQWE7TUFBSSxJQUFJLFNBQU8sQ0FBQztNQUFXLElBQUk7TUFBSyxJQUFHLFFBQU0sR0FBRyxNQUFNLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtXQUFPLElBQUcsQ0FBQyxRQUFNLENBQUMsUUFBTztPQUFDLElBQUksU0FBTyxHQUFHLFdBQVcsWUFBVyxFQUFDLGNBQWEsTUFBSyxDQUFDO09BQUUsYUFBVyxPQUFPO09BQUssT0FBSyxPQUFPO09BQUssSUFBRyxHQUFHLGFBQWEsSUFBSSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtPQUFFLElBQUcsQ0FBQyxHQUFHLE1BQU0sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUU7TUFBQyxJQUFJLFFBQU07T0FBQztPQUFLO09BQUs7T0FBVyxRQUFPLENBQUM7TUFBQztNQUFFLElBQUksWUFBVSxLQUFLLE1BQU0sS0FBSztNQUFFLFVBQVUsUUFBTTtNQUFNLE1BQU0sT0FBSztNQUFVLElBQUcsTUFBTSxHQUFHLE9BQUs7V0FBZSxJQUFHLE1BQUs7T0FBQyxLQUFLLFVBQVE7T0FBTSxJQUFHLEtBQUssT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFLLEtBQUs7TUFBRTtNQUFDLE9BQU87S0FBUztLQUFFLFFBQVEsWUFBVztNQUFDLElBQUksU0FBTyxHQUFHLFdBQVcsWUFBVyxFQUFDLGNBQWEsTUFBSyxDQUFDO01BQUUsSUFBRyxDQUFDLEdBQUcsYUFBYSxPQUFPLElBQUksR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFJLE9BQUssT0FBTztNQUFLLElBQUksUUFBTSxLQUFLO01BQVEsSUFBSSxTQUFPLEdBQUcsVUFBVSxLQUFLO01BQUUsT0FBTyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsU0FBUSxTQUFNO09BQUMsSUFBSSxVQUFRLEdBQUcsVUFBVTtPQUFNLE9BQU0sU0FBUTtRQUFDLElBQUksT0FBSyxRQUFRO1FBQVUsSUFBRyxPQUFPLFNBQVMsUUFBUSxLQUFLLEdBQUcsR0FBRyxZQUFZLE9BQU87UUFBRSxVQUFRO09BQUk7TUFBQyxDQUFDO01BQUUsS0FBSyxVQUFRO01BQUssSUFBSSxNQUFJLEtBQUssTUFBTSxPQUFPLFFBQVEsS0FBSztNQUFFLEtBQUssTUFBTSxPQUFPLE9BQU8sS0FBSSxDQUFDO0tBQUM7S0FBRSxPQUFPLFFBQU8sTUFBSztNQUFDLE9BQU8sT0FBTyxTQUFTLE9BQU8sUUFBTyxJQUFJO0tBQUM7S0FBRSxNQUFNLE1BQUssTUFBSyxLQUFJO01BQThDLElBQUksU0FBdEMsR0FBRyxXQUFXLE1BQUssRUFBQyxRQUFPLEtBQUksQ0FBbUIsQ0FBQyxDQUFDO01BQUssSUFBSSxPQUFLLEtBQUssU0FBUyxJQUFJO01BQUUsSUFBRyxDQUFDLFFBQU0sU0FBTyxPQUFLLFNBQU8sTUFBTSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFJLFVBQVEsR0FBRyxVQUFVLFFBQU8sSUFBSTtNQUFFLElBQUcsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLE9BQU87TUFBRSxJQUFHLENBQUMsT0FBTyxTQUFTLE9BQU8sTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsT0FBTyxPQUFPLFNBQVMsTUFBTSxRQUFPLE1BQUssTUFBSyxHQUFHO0tBQUM7S0FBRSxPQUFPLE1BQUssTUFBSztNQUFDLE9BQUssU0FBTyxLQUFBLElBQVUsT0FBSztNQUFJLFFBQU07TUFBSyxRQUFNO01BQU0sT0FBTyxHQUFHLE1BQU0sTUFBSyxNQUFLLENBQUM7S0FBQztLQUFFLE1BQU0sTUFBSyxNQUFLO01BQUMsT0FBSyxTQUFPLEtBQUEsSUFBVSxPQUFLO01BQUksUUFBTTtNQUFRLFFBQU07TUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFLLE1BQUssQ0FBQztLQUFDO0tBQUUsVUFBVSxNQUFLLE1BQUs7TUFBQyxJQUFJLE9BQUssS0FBSyxNQUFNLEdBQUc7TUFBRSxJQUFJLElBQUU7TUFBRyxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsS0FBSyxRQUFPLEVBQUUsR0FBRTtPQUFDLElBQUcsQ0FBQyxLQUFLLElBQUc7T0FBUyxLQUFHLE1BQUksS0FBSztPQUFHLElBQUc7UUFBQyxHQUFHLE1BQU0sR0FBRSxJQUFJO09BQUMsU0FBTyxHQUFFO1FBQUMsSUFBRyxFQUFFLFNBQU8sSUFBRyxNQUFNO09BQUM7TUFBQztLQUFDO0tBQUUsTUFBTSxNQUFLLE1BQUssS0FBSTtNQUFDLElBQUcsT0FBTyxPQUFLLGFBQVk7T0FBQyxNQUFJO09BQUssT0FBSztNQUFHO01BQUMsUUFBTTtNQUFLLE9BQU8sR0FBRyxNQUFNLE1BQUssTUFBSyxHQUFHO0tBQUM7S0FBRSxRQUFRLFNBQVEsU0FBUTtNQUFDLElBQUcsQ0FBQyxRQUFRLFFBQVEsT0FBTyxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFrRCxJQUFJLFNBQXpDLEdBQUcsV0FBVyxTQUFRLEVBQUMsUUFBTyxLQUFJLENBQW1CLENBQUMsQ0FBQztNQUFLLElBQUcsQ0FBQyxRQUFRLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUksVUFBUSxLQUFLLFNBQVMsT0FBTztNQUFFLElBQUksVUFBUSxHQUFHLFVBQVUsUUFBTyxPQUFPO01BQUUsSUFBRyxTQUFTLE1BQU0sSUFBSSxHQUFHLFdBQVcsT0FBTztNQUFFLElBQUcsQ0FBQyxPQUFPLFNBQVMsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxPQUFPLE9BQU8sU0FBUyxRQUFRLFFBQU8sU0FBUSxPQUFPO0tBQUM7S0FBRSxPQUFPLFVBQVMsVUFBUztNQUFDLElBQUksY0FBWSxLQUFLLFFBQVEsUUFBUTtNQUFFLElBQUksY0FBWSxLQUFLLFFBQVEsUUFBUTtNQUFFLElBQUksV0FBUyxLQUFLLFNBQVMsUUFBUTtNQUFFLElBQUksV0FBUyxLQUFLLFNBQVMsUUFBUTtNQUFFLElBQUksU0FBOEIsR0FBRyxXQUFXLFVBQVMsRUFBQyxRQUFPLEtBQUksQ0FBQyxHQUEzRCxVQUFxRSxPQUFPLE1BQXBFO01BQXlFLFNBQU8sR0FBRyxXQUFXLFVBQVMsRUFBQyxRQUFPLEtBQUksQ0FBQztNQUFFLFVBQVEsT0FBTztNQUFLLElBQUcsQ0FBQyxXQUFTLENBQUMsU0FBUSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLFFBQVEsVUFBUSxRQUFRLE9BQU8sTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBSSxXQUFTLEdBQUcsV0FBVyxTQUFRLFFBQVE7TUFBRSxJQUFJLFdBQVMsUUFBUSxTQUFTLFVBQVMsV0FBVztNQUFFLElBQUcsU0FBUyxPQUFPLENBQUMsTUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLFdBQVMsUUFBUSxTQUFTLFVBQVMsV0FBVztNQUFFLElBQUcsU0FBUyxPQUFPLENBQUMsTUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUk7TUFBUyxJQUFHO09BQUMsV0FBUyxHQUFHLFdBQVcsU0FBUSxRQUFRO01BQUMsU0FBTyxHQUFFLENBQUM7TUFBQyxJQUFHLGFBQVcsVUFBVTtNQUFPLElBQUksUUFBTSxHQUFHLE1BQU0sU0FBUyxJQUFJO01BQUUsSUFBSSxVQUFRLEdBQUcsVUFBVSxTQUFRLFVBQVMsS0FBSztNQUFFLElBQUcsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLE9BQU87TUFBRSxVQUFRLFdBQVMsR0FBRyxVQUFVLFNBQVEsVUFBUyxLQUFLLElBQUUsR0FBRyxVQUFVLFNBQVEsUUFBUTtNQUFFLElBQUcsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLE9BQU87TUFBRSxJQUFHLENBQUMsUUFBUSxTQUFTLFFBQVEsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBRyxHQUFHLGFBQWEsUUFBUSxLQUFHLFlBQVUsR0FBRyxhQUFhLFFBQVEsR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLFlBQVUsU0FBUTtPQUFDLFVBQVEsR0FBRyxnQkFBZ0IsU0FBUSxHQUFHO09BQUUsSUFBRyxTQUFTLE1BQU0sSUFBSSxHQUFHLFdBQVcsT0FBTztNQUFFO01BQUMsR0FBRyxlQUFlLFFBQVE7TUFBRSxJQUFHO09BQUMsUUFBUSxTQUFTLE9BQU8sVUFBUyxTQUFRLFFBQVE7T0FBRSxTQUFTLFNBQU87TUFBTyxTQUFPLEdBQUU7T0FBQyxNQUFNO01BQUMsVUFBUTtPQUFDLEdBQUcsWUFBWSxRQUFRO01BQUM7S0FBQztLQUFFLE1BQU0sTUFBSztNQUE4QyxJQUFJLFNBQXRDLEdBQUcsV0FBVyxNQUFLLEVBQUMsUUFBTyxLQUFJLENBQW1CLENBQUMsQ0FBQztNQUFLLElBQUksT0FBSyxLQUFLLFNBQVMsSUFBSTtNQUFFLElBQUksT0FBSyxHQUFHLFdBQVcsUUFBTyxJQUFJO01BQUUsSUFBSSxVQUFRLEdBQUcsVUFBVSxRQUFPLE1BQUssSUFBSTtNQUFFLElBQUcsU0FBUyxNQUFNLElBQUksR0FBRyxXQUFXLE9BQU87TUFBRSxJQUFHLENBQUMsT0FBTyxTQUFTLE9BQU8sTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBRyxHQUFHLGFBQWEsSUFBSSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLE9BQU8sU0FBUyxNQUFNLFFBQU8sSUFBSTtNQUFFLEdBQUcsWUFBWSxJQUFJO0tBQUM7S0FBRSxRQUFRLE1BQUs7TUFBOEMsSUFBSSxPQUF0QyxHQUFHLFdBQVcsTUFBSyxFQUFDLFFBQU8sS0FBSSxDQUFpQixDQUFDLENBQUM7TUFBSyxJQUFHLENBQUMsS0FBSyxTQUFTLFNBQVMsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsT0FBTyxLQUFLLFNBQVMsUUFBUSxJQUFJO0tBQUM7S0FBRSxPQUFPLE1BQUs7TUFBOEMsSUFBSSxTQUF0QyxHQUFHLFdBQVcsTUFBSyxFQUFDLFFBQU8sS0FBSSxDQUFtQixDQUFDLENBQUM7TUFBSyxJQUFHLENBQUMsUUFBUSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFJLE9BQUssS0FBSyxTQUFTLElBQUk7TUFBRSxJQUFJLE9BQUssR0FBRyxXQUFXLFFBQU8sSUFBSTtNQUFFLElBQUksVUFBUSxHQUFHLFVBQVUsUUFBTyxNQUFLLEtBQUs7TUFBRSxJQUFHLFNBQVMsTUFBTSxJQUFJLEdBQUcsV0FBVyxPQUFPO01BQUUsSUFBRyxDQUFDLE9BQU8sU0FBUyxRQUFRLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUcsR0FBRyxhQUFhLElBQUksR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxPQUFPLFNBQVMsT0FBTyxRQUFPLElBQUk7TUFBRSxHQUFHLFlBQVksSUFBSTtLQUFDO0tBQUUsU0FBUyxNQUFLO01BQWdDLElBQUksT0FBeEIsR0FBRyxXQUFXLElBQW9CLENBQUMsQ0FBQztNQUFLLElBQUcsQ0FBQyxNQUFNLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUcsQ0FBQyxLQUFLLFNBQVMsVUFBVSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxPQUFPLFFBQVEsUUFBUSxHQUFHLFFBQVEsS0FBSyxNQUFNLEdBQUUsS0FBSyxTQUFTLFNBQVMsSUFBSSxDQUFDO0tBQUM7S0FBRSxLQUFLLE1BQUssWUFBVztNQUFxRCxJQUFJLE9BQTdDLEdBQUcsV0FBVyxNQUFLLEVBQUMsUUFBTyxDQUFDLFdB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LEdBQUcsUUFBUSxJQUFJO09BQUU7T0FBTSxVQUFTO09BQUssVUFBUztPQUFFLFlBQVcsS0FBSztPQUFXLFVBQVMsQ0FBQztPQUFFLE9BQU07TUFBSyxDQUFDO01BQUUsSUFBRyxPQUFPLFdBQVcsTUFBTSxPQUFPLFdBQVcsS0FBSyxNQUFNO01BQUUsSUFBRyxPQUFPLG1CQUFpQixFQUFFLFFBQU0sSUFBTztXQUFBLEVBQUUsUUFBUSxHQUFHLFlBQVksR0FBRyxVQUFVLFFBQU07TUFBQTtNQUFHLE9BQU87S0FBTTtLQUFFLE1BQU0sUUFBTztNQUFDLElBQUcsR0FBRyxTQUFTLE1BQU0sR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUM7TUFBRSxJQUFHLE9BQU8sVUFBUyxPQUFPLFdBQVM7TUFBSyxJQUFHO09BQUMsSUFBRyxPQUFPLFdBQVcsT0FBTyxPQUFPLFdBQVcsTUFBTSxNQUFNO01BQUUsU0FBTyxHQUFFO09BQUMsTUFBTTtNQUFDLFVBQVE7T0FBQyxHQUFHLFlBQVksT0FBTyxFQUFFO01BQUM7TUFBQyxPQUFPLEtBQUc7S0FBSTtLQUFFLFNBQVMsUUFBTztNQUFDLE9BQU8sT0FBTyxPQUFLO0tBQUk7S0FBRSxPQUFPLFFBQU8sUUFBTyxRQUFPO01BQUMsSUFBRyxHQUFHLFNBQVMsTUFBTSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQztNQUFFLElBQUcsQ0FBQyxPQUFPLFlBQVUsQ0FBQyxPQUFPLFdBQVcsUUFBUSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLFVBQVEsS0FBRyxVQUFRLEtBQUcsVUFBUSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLE9BQU8sV0FBUyxPQUFPLFdBQVcsT0FBTyxRQUFPLFFBQU8sTUFBTTtNQUFFLE9BQU8sV0FBUyxDQUFDO01BQUUsT0FBTyxPQUFPO0tBQVE7S0FBRSxLQUFLLFFBQU8sUUFBTyxRQUFPLFFBQU8sVUFBUztNQUFDLElBQUcsU0FBTyxLQUFHLFdBQVMsR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLEdBQUcsU0FBUyxNQUFNLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO01BQUUsS0FBSSxPQUFPLFFBQU0sYUFBVyxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQztNQUFFLElBQUcsR0FBRyxNQUFNLE9BQU8sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBRyxDQUFDLE9BQU8sV0FBVyxNQUFNLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUksVUFBUSxPQUFPLFlBQVU7TUFBWSxJQUFHLENBQUMsU0FBUyxXQUFTLE9BQU87V0FBYyxJQUFHLENBQUMsT0FBTyxVQUFVLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUksWUFBVSxPQUFPLFdBQVcsS0FBSyxRQUFPLFFBQU8sUUFBTyxRQUFPLFFBQVE7TUFBRSxJQUFHLENBQUMsU0FBUSxPQUFPLFlBQVU7TUFBVSxPQUFPO0tBQVM7S0FBRSxNQUFNLFFBQU8sUUFBTyxRQUFPLFFBQU8sVUFBUyxRQUFPO01BQUMsSUFBRyxTQUFPLEtBQUcsV0FBUyxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUcsR0FBRyxTQUFTLE1BQU0sR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUM7TUFBRSxLQUFJLE9BQU8sUUFBTSxhQUFXLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO01BQUUsSUFBRyxHQUFHLE1BQU0sT0FBTyxLQUFLLElBQUksR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLENBQUMsT0FBTyxXQUFXLE9BQU8sTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBRyxPQUFPLFlBQVUsT0FBTyxRQUFNLE1BQU0sR0FBRyxPQUFPLFFBQU8sR0FBRSxDQUFDO01BQUUsSUFBSSxVQUFRLE9BQU8sWUFBVTtNQUFZLElBQUcsQ0FBQyxTQUFTLFdBQVMsT0FBTztXQUFjLElBQUcsQ0FBQyxPQUFPLFVBQVUsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBSSxlQUFhLE9BQU8sV0FBVyxNQUFNLFFBQU8sUUFBTyxRQUFPLFFBQU8sVUFBUyxNQUFNO01BQUUsSUFBRyxDQUFDLFNBQVEsT0FBTyxZQUFVO01BQWEsT0FBTztLQUFZO0tBQUUsU0FBUyxRQUFPLFFBQU8sUUFBTztNQUFDLElBQUcsR0FBRyxTQUFTLE1BQU0sR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUM7TUFBRSxJQUFHLFNBQU8sS0FBRyxVQUFRLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsS0FBSSxPQUFPLFFBQU0sYUFBVyxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQztNQUFFLElBQUcsQ0FBQyxHQUFHLE9BQU8sT0FBTyxLQUFLLElBQUksS0FBRyxDQUFDLEdBQUcsTUFBTSxPQUFPLEtBQUssSUFBSSxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLElBQUcsQ0FBQyxPQUFPLFdBQVcsVUFBVSxNQUFNLElBQUksR0FBRyxXQUFXLEdBQUc7TUFBRSxPQUFPLFdBQVcsU0FBUyxRQUFPLFFBQU8sTUFBTTtLQUFDO0tBQUUsS0FBSyxRQUFPLFFBQU8sVUFBUyxNQUFLLE9BQU07TUFBQyxLQUFJLE9BQUssT0FBSyxNQUFJLFFBQU0sT0FBSyxNQUFJLE9BQU8sUUFBTSxhQUFXLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO01BQUUsS0FBSSxPQUFPLFFBQU0sYUFBVyxHQUFHLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQztNQUFFLElBQUcsQ0FBQyxPQUFPLFdBQVcsTUFBTSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLENBQUMsUUFBUSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxPQUFPLE9BQU8sV0FBVyxLQUFLLFFBQU8sUUFBTyxVQUFTLE1BQUssS0FBSztLQUFDO0tBQUUsTUFBTSxRQUFPLFFBQU8sUUFBTyxRQUFPLFdBQVU7TUFBQyxJQUFHLENBQUMsT0FBTyxXQUFXLE9BQU8sT0FBTztNQUFFLE9BQU8sT0FBTyxXQUFXLE1BQU0sUUFBTyxRQUFPLFFBQU8sUUFBTyxTQUFTO0tBQUM7S0FBRSxNQUFNLFFBQU8sS0FBSSxLQUFJO01BQUMsSUFBRyxDQUFDLE9BQU8sV0FBVyxPQUFPLE1BQU0sSUFBSSxHQUFHLFdBQVcsRUFBRTtNQUFFLE9BQU8sT0FBTyxXQUFXLE1BQU0sUUFBTyxLQUFJLEdBQUc7S0FBQztLQUFFLFNBQVMsTUFBSyxPQUFLLENBQUMsR0FBRTtNQUFDLEtBQUssUUFBTSxLQUFLLFNBQU87TUFBRSxLQUFLLFdBQVMsS0FBSyxZQUFVO01BQVMsSUFBRyxLQUFLLGFBQVcsVUFBUSxLQUFLLGFBQVcsVUFBVSxNQUFNLElBQUksTUFBTSwwQkFBMEIsS0FBSyxTQUFTLEVBQUU7TUFBRSxJQUFJO01BQUksSUFBSSxTQUFPLEdBQUcsS0FBSyxNQUFLLEtBQUssS0FBSztNQUF5QixJQUFJLFNBQWxCLEdBQUcsS0FBSyxJQUFvQixDQUFDLENBQUM7TUFBSyxJQUFJLE1BQUksSUFBSSxXQUFXLE1BQU07TUFBRSxHQUFHLEtBQUssUUFBTyxLQUFJLEdBQUUsUUFBTyxDQUFDO01BQUUsSUFBRyxLQUFLLGFBQVcsUUFBUSxNQUFJLGtCQUFrQixHQUFHO1dBQU8sSUFBRyxLQUFLLGFBQVcsVUFBVSxNQUFJO01BQUksR0FBRyxNQUFNLE1BQU07TUFBRSxPQUFPO0tBQUc7S0FBRSxVQUFVLE1BQUssTUFBSyxPQUFLLENBQUMsR0FBRTtNQUFDLEtBQUssUUFBTSxLQUFLLFNBQU87TUFBSSxJQUFJLFNBQU8sR0FBRyxLQUFLLE1BQUssS0FBSyxPQUFNLEtBQUssSUFBSTtNQUFFLElBQUcsT0FBTyxRQUFNLFVBQVM7T0FBQyxJQUFJLE1BQUksSUFBSSxXQUFXLGdCQUFnQixJQUFJLElBQUUsQ0FBQztPQUFFLElBQUksaUJBQWUsa0JBQWtCLE1BQUssS0FBSSxHQUFFLElBQUksTUFBTTtPQUFFLEdBQUcsTUFBTSxRQUFPLEtBQUksR0FBRSxnQkFBZSxLQUFBLEdBQVUsS0FBSyxNQUFNO01BQUMsT0FBTSxJQUFHLFlBQVksT0FBTyxJQUFJLEdBQUcsR0FBRyxNQUFNLFFBQU8sTUFBSyxHQUFFLEtBQUssWUFBVyxLQUFBLEdBQVUsS0FBSyxNQUFNO1dBQU8sTUFBTSxJQUFJLE1BQU0sdUJBQXVCO01BQUUsR0FBRyxNQUFNLE1BQU07S0FBQztLQUFFLFdBQVEsR0FBRztLQUFZLE1BQU0sTUFBSztNQUFDLElBQUksU0FBTyxHQUFHLFdBQVcsTUFBSyxFQUFDLFFBQU8sS0FBSSxDQUFDO01BQUUsSUFBRyxPQUFPLFNBQU8sTUFBTSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLENBQUMsR0FBRyxNQUFNLE9BQU8sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO01BQUUsSUFBSSxVQUFRLEdBQUcsZ0JBQWdCLE9BQU8sTUFBSyxHQUFHO01BQUUsSUFBRyxTQUFTLE1BQU0sSUFBSSxHQUFHLFdBQVcsT0FBTztNQUFFLEdBQUcsY0FBWSxPQUFPO0tBQUk7S0FBRSwyQkFBMEI7TUFBQyxHQUFHLE1BQU0sTUFBTTtNQUFFLEdBQUcsTUFBTSxPQUFPO01BQUUsR0FBRyxNQUFNLGdCQUFnQjtLQUFDO0tBQUUsdUJBQXNCO01BQUMsR0FBRyxNQUFNLE1BQU07TUFBRSxHQUFHLGVBQWUsR0FBRyxRQUFRLEdBQUUsQ0FBQyxHQUFFO09BQUMsWUFBUztPQUFFLFFBQU8sUUFBTyxRQUFPLFFBQU8sUUFBTyxRQUFNO01BQU0sQ0FBQztNQUFFLEdBQUcsTUFBTSxhQUFZLEdBQUcsUUFBUSxHQUFFLENBQUMsQ0FBQztNQUFFLElBQUksU0FBUyxHQUFHLFFBQVEsR0FBRSxDQUFDLEdBQUUsSUFBSSxlQUFlO01BQUUsSUFBSSxTQUFTLEdBQUcsUUFBUSxHQUFFLENBQUMsR0FBRSxJQUFJLGdCQUFnQjtNQUFFLEdBQUcsTUFBTSxZQUFXLEdBQUcsUUFBUSxHQUFFLENBQUMsQ0FBQztNQUFFLEdBQUcsTUFBTSxhQUFZLEdBQUcsUUFBUSxHQUFFLENBQUMsQ0FBQztNQUFFLElBQUksK0JBQWEsSUFBSSxXQUFXLElBQUksR0FBRSxhQUFXO01BQUUsSUFBSSxtQkFBZTtPQUFDLElBQUcsZUFBYSxHQUFHLGFBQVcsV0FBVyxZQUFZLENBQUMsQ0FBQztPQUFXLE9BQU8sYUFBYSxFQUFFO01BQVc7TUFBRSxHQUFHLGFBQWEsUUFBTyxVQUFTLFVBQVU7TUFBRSxHQUFHLGFBQWEsUUFBTyxXQUFVLFVBQVU7TUFBRSxHQUFHLE1BQU0sVUFBVTtNQUFFLEdBQUcsTUFBTSxjQUFjO0tBQUM7S0FBRSwyQkFBMEI7TUFBQyxHQUFHLE1BQU0sT0FBTztNQUFFLElBQUksWUFBVSxHQUFHLE1BQU0sWUFBWTtNQUFFLEdBQUcsTUFBTSxlQUFlO01BQUUsR0FBRyxNQUFNLEVBQUMsUUFBTztPQUFDLElBQUksT0FBSyxHQUFHLFdBQVcsV0FBVSxNQUFLLE9BQVUsRUFBRTtPQUFFLEtBQUssV0FBUyxFQUFDLE9BQU8sUUFBTyxNQUFLO1FBQUMsSUFBSSxLQUFHLENBQUM7UUFBSyxJQUFJLFNBQU8sR0FBRyxpQkFBaUIsRUFBRTtRQUFFLElBQUksTUFBSTtTQUFDLFFBQU87U0FBSyxPQUFNLEVBQUMsWUFBVyxPQUFNO1NBQUUsVUFBUyxFQUFDLGdCQUFhLE9BQU8sS0FBSTtRQUFDO1FBQUUsSUFBSSxTQUFPO1FBQUksT0FBTztPQUFHLEVBQUM7T0FBRSxPQUFPO01BQUksRUFBQyxHQUFFLENBQUMsR0FBRSxlQUFlO0tBQUM7S0FBRSxzQkFBc0IsT0FBTSxRQUFPLE9BQU07TUFBQyxJQUFHLE9BQU8sR0FBRyxhQUFhLFFBQU8sU0FBUSxLQUFLO1dBQU8sR0FBRyxRQUFRLFlBQVcsWUFBWTtNQUFFLElBQUcsUUFBUSxHQUFHLGFBQWEsUUFBTyxVQUFTLE1BQUssTUFBTTtXQUFPLEdBQUcsUUFBUSxZQUFXLGFBQWE7TUFBRSxJQUFHLE9BQU8sR0FBRyxhQUFhLFFBQU8sVUFBUyxNQUFLLEtBQUs7V0FBTyxHQUFHLFFBQVEsYUFBWSxhQUFhO01BQVksR0FBRyxLQUFLLGNBQWEsQ0FBQztNQUFhLEdBQUcsS0FBSyxlQUFjLENBQUM7TUFBYSxHQUFHLEtBQUssZUFBYyxDQUFDO0tBQUM7S0FBRSxhQUFZO01BQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFRLFNBQU07T0FBQyxHQUFHLGNBQWMsUUFBTSxJQUFJLEdBQUcsV0FBVyxJQUFJO09BQUUsR0FBRyxjQUFjLEtBQUssQ0FBQyxRQUFNO01BQTJCLENBQUM7TUFBRSxHQUFHLFlBQVUsSUFBSSxNQUFNLElBQUk7TUFBRSxHQUFHLE1BQU0sT0FBTSxDQUFDLEdBQUUsR0FBRztNQUFFLEdBQUcseUJBQXlCO01BQUUsR0FBRyxxQkFBcUI7TUFBRSxHQUFHLHlCQUF5QjtNQUFFLEdBQUcsY0FBWSxFQUFDLE1BQUs7S0FBQztLQUFFLEtBQUssT0FBTSxRQUFPLE9BQU07TUFBQyxHQUFHLGNBQVk7TUFBSyxVQUFRLE9BQU87TUFBUyxXQUFTLE9BQU87TUFBVSxVQUFRLE9BQU87TUFBVSxHQUFHLHNCQUFzQixPQUFNLFFBQU8sS0FBSztLQUFDO0tBQUUsT0FBTTtNQUFDLEdBQUcsY0FBWTtNQUFNLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxHQUFHLFFBQVEsUUFBTyxLQUFJO09BQUMsSUFBSSxTQUFPLEdBQUcsUUFBUTtPQUFHLElBQUcsQ0FBQyxRQUFRO09BQVMsR0FBRyxNQUFNLE1BQU07TUFBQztLQUFDO0tBQUUsV0FBVyxNQUFLLHFCQUFvQjtNQUFDLElBQUksTUFBSSxHQUFHLFlBQVksTUFBSyxtQkFBbUI7TUFBRSxJQUFHLENBQUMsSUFBSSxRQUFRLE9BQU87TUFBSyxPQUFPLElBQUk7S0FBTTtLQUFFLFlBQVksTUFBSyxxQkFBb0I7TUFBQyxJQUFHO09BQUMsSUFBSSxTQUFPLEdBQUcsV0FBVyxNQUFLLEVBQUMsUUFBTyxDQUFDLG9CQUFtQixDQUFDO09BQUUsT0FBSyxPQUFPO01BQUksU0FBTyxHQUFFLENBQUM7TUFBQyxJQUFJLE1BQUk7T0FBQyxRQUFPO09BQU0sUUFBTztPQUFNLE9BQU07T0FBRSxNQUFLO09BQUssTUFBSztPQUFLLFFBQU87T0FBSyxjQUFhO09BQU0sWUFBVztPQUFLLGNBQWE7TUFBSTtNQUFFLElBQUc7T0FBQyxJQUFJLFNBQU8sR0FBRyxXQUFXLE1BQUssRUFBQyxRQUFPLEtBQUksQ0FBQztPQUFFLElBQUksZUFBYTtPQUFLLElBQUksYUFBVyxPQUFPO09BQUssSUFBSSxlQUFhLE9BQU87T0FBSyxJQUFJLE9BQUssS0FBSyxTQUFTLElBQUk7T0FBRSxTQUFPLEdBQUcsV0FBVyxNQUFLLEVBQUMsUUFBTyxDQUFDLG9CQUFtQixDQUFDO09BQUUsSUFBSSxTQUFPO09BQUssSUFBSSxPQUFLLE9BQU87T0FBSyxJQUFJLFNBQU8sT0FBTztPQUFLLElBQUksT0FBSyxPQUFPLEtBQUs7T0FBSyxJQUFJLFNBQU8sT0FBTyxTQUFPO01BQUcsU0FBTyxHQUFFO09BQUMsSUFBSSxRQUFNLEVBQUU7TUFBSztNQUFDLE9BQU87S0FBRztLQUFFLFdBQVcsUUFBTyxNQUFLLFNBQVEsVUFBUztNQUFDLFNBQU8sT0FBTyxVQUFRLFdBQVMsU0FBTyxHQUFHLFFBQVEsTUFBTTtNQUFFLElBQUksUUFBTSxLQUFLLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUTtNQUFFLE9BQU0sTUFBTSxRQUFPO09BQUMsSUFBSSxPQUFLLE1BQU0sSUFBSTtPQUFFLElBQUcsQ0FBQyxNQUFLO09BQVMsSUFBSSxVQUFRLEtBQUssTUFBTSxRQUFPLElBQUk7T0FBRSxJQUFHO1FBQUMsR0FBRyxNQUFNLE9BQU87T0FBQyxTQUFPLEdBQUUsQ0FBQztPQUFDLFNBQU87TUFBTztNQUFDLE9BQU87S0FBTztLQUFFLFdBQVcsUUFBTyxNQUFLLFlBQVcsU0FBUSxVQUFTO01BQUMsSUFBSSxPQUFLLEtBQUssTUFBTSxPQUFPLFVBQVEsV0FBUyxTQUFPLEdBQUcsUUFBUSxNQUFNLEdBQUUsSUFBSTtNQUFFLElBQUksT0FBSyxXQUFXLFNBQVEsUUFBUTtNQUFFLE9BQU8sR0FBRyxPQUFPLE1BQUssSUFBSTtLQUFDO0tBQUUsZUFBZSxRQUFPLE1BQUssTUFBSyxTQUFRLFVBQVMsUUFBTztNQUFDLElBQUksT0FBSztNQUFLLElBQUcsUUFBTztPQUFDLFNBQU8sT0FBTyxVQUFRLFdBQVMsU0FBTyxHQUFHLFFBQVEsTUFBTTtPQUFFLE9BQUssT0FBSyxLQUFLLE1BQU0sUUFBTyxJQUFJLElBQUU7TUFBTTtNQUFDLElBQUksT0FBSyxXQUFXLFNBQVEsUUFBUTtNQUFFLElBQUksT0FBSyxHQUFHLE9BQU8sTUFBSyxJQUFJO01BQUUsSUFBRyxNQUFLO09BQUMsSUFBRyxPQUFPLFFBQU0sVUFBUztRQUFDLElBQUksTUFBSSxJQUFJLE1BQU0sS0FBSyxNQUFNO1FBQUUsS0FBSSxJQUFJLElBQUUsR0FBRSxNQUFJLEtBQUssUUFBTyxJQUFFLEtBQUksRUFBRSxHQUFFLElBQUksS0FBRyxLQUFLLFdBQVcsQ0FBQztRQUFFLE9BQUs7T0FBRztPQUFDLEdBQUcsTUFBTSxNQUFLLE9BQUssR0FBRztPQUFFLElBQUksU0FBTyxHQUFHLEtBQUssTUFBSyxHQUFHO09BQUUsR0FBRyxNQUFNLFFBQU8sTUFBSyxHQUFFLEtBQUssUUFBTyxHQUFFLE1BQU07T0FBRSxHQUFHLE1BQU0sTUFBTTtPQUFFLEdBQUcsTUFBTSxNQUFLLElBQUk7TUFBQztLQUFDO0tBQUUsYUFBYSxRQUFPLE1BQUssT0FBTSxRQUFPO01BQUMsSUFBSSxPQUFLLEtBQUssTUFBTSxPQUFPLFVBQVEsV0FBUyxTQUFPLEdBQUcsUUFBUSxNQUFNLEdBQUUsSUFBSTtNQUFFLElBQUksT0FBSyxXQUFXLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxNQUFNO01BQUUsR0FBRyxhQUFhLFVBQVE7TUFBRyxJQUFJLE1BQUksR0FBRyxRQUFRLEdBQUcsYUFBYSxTQUFRLENBQUM7TUFBRSxHQUFHLGVBQWUsS0FBSTtPQUFDLEtBQUssUUFBTztRQUFDLE9BQU8sV0FBUztPQUFLO09BQUUsTUFBTSxRQUFPO1FBQUMsSUFBRyxRQUFRLFFBQVEsUUFBUSxPQUFPLEVBQUU7T0FBRTtPQUFFLEtBQUssUUFBTyxRQUFPLFFBQU8sUUFBTyxLQUFJO1FBQUMsSUFBSSxZQUFVO1FBQUUsS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFFBQU8sS0FBSTtTQUFDLElBQUk7U0FBTyxJQUFHO1VBQUMsU0FBTyxNQUFNO1NBQUMsU0FBTyxHQUFFO1VBQUMsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO1NBQUM7U0FBQyxJQUFHLFdBQVMsS0FBQSxLQUFXLGNBQVksR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUM7U0FBRSxJQUFHLFdBQVMsUUFBTSxXQUFTLEtBQUEsR0FBVTtTQUFNO1NBQVksT0FBTyxTQUFPLEtBQUc7UUFBTTtRQUFDLElBQUcsV0FBVyxPQUFPLEtBQUssWUFBVSxLQUFLLElBQUk7UUFBRSxPQUFPO09BQVM7T0FBRSxNQUFNLFFBQU8sUUFBTyxRQUFPLFFBQU8sS0FBSTtRQUFDLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxRQUFPLEtBQUssSUFBRztTQUFDLE9BQU8sT0FBTyxTQUFPLEVBQUU7UUFBQyxTQUFPLEdBQUU7U0FBQyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7UUFBQztRQUFFLElBQUcsUUFBUSxPQUFPLEtBQUssWUFBVSxLQUFLLElBQUk7UUFBRSxPQUFPO09BQUM7TUFBQyxDQUFDO01BQUUsT0FBTyxHQUFHLE1BQU0sTUFBSyxNQUFLLEdBQUc7S0FBQztLQUFFLGNBQWMsS0FBSTtNQUFDLElBQUcsSUFBSSxZQUFVLElBQUksWUFBVSxJQUFJLFFBQU0sSUFBSSxVQUFTLE9BQU87TUFBSyxJQUFHLE9BQU8sa0JBQWdCLGFBQWEsTUFBTSxJQUFJLE1BQU0sa01BQWtNO1dBQU8sSUFBRztPQUFDLElBQUksV0FBUyxXQUFXLElBQUksR0FBRztPQUFFLElBQUksWUFBVSxJQUFJLFNBQVM7TUFBTSxTQUFPLEdBQUU7T0FBQyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBQztLQUFFO0tBQUUsZUFBZSxRQUFPLE1BQUssS0FBSSxTQUFRLFVBQVM7TUFBQyxNQUFNLGVBQWM7T0FBQyxjQUFhO1FBQUMsS0FBSyxjQUFZO1FBQU0s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QStEO09BQUM7TUFBQyxPQUFNLElBQUksYUFBVztPQUFDLFVBQVM7T0FBTTtNQUFHO01BQUUsSUFBSSxPQUFLLEdBQUcsV0FBVyxRQUFPLE1BQUssWUFBVyxTQUFRLFFBQVE7TUFBRSxJQUFHLFdBQVcsVUFBVSxLQUFLLFdBQVMsV0FBVztXQUFjLElBQUcsV0FBVyxLQUFJO09BQUMsS0FBSyxXQUFTO09BQUssS0FBSyxNQUFJLFdBQVc7TUFBRztNQUFDLE9BQU8saUJBQWlCLE1BQUssRUFBQyxXQUFVLEVBQUMsS0FBSSxXQUFVO09BQUMsT0FBTyxLQUFLLFNBQVM7TUFBTSxFQUFDLEVBQUMsQ0FBQztNQUFFLElBQUksYUFBVyxDQUFDO01BQXdDLE9BQXRCLEtBQUssS0FBSyxVQUFlLENBQUMsQ0FBQyxTQUFRLFFBQUs7T0FBQyxJQUFJLEtBQUcsS0FBSyxXQUFXO09BQUssV0FBVyxRQUFNLEdBQUcsU0FBTztRQUFDLEdBQUcsY0FBYyxJQUFJO1FBQUUsT0FBTyxHQUFHLEdBQUcsSUFBSTtPQUFDO01BQUMsQ0FBQztNQUFFLFNBQVMsWUFBWSxRQUFPLFFBQU8sUUFBTyxRQUFPLFVBQVM7T0FBQyxJQUFJLFdBQVMsT0FBTyxLQUFLO09BQVMsSUFBRyxZQUFVLFNBQVMsUUFBTyxPQUFPO09BQUUsSUFBSSxPQUFLLEtBQUssSUFBSSxTQUFTLFNBQU8sVUFBUyxNQUFNO09BQUUsSUFBRyxTQUFTLE9BQU8sS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLE1BQUssS0FBSyxPQUFPLFNBQU8sS0FBRyxTQUFTLFdBQVM7WUFBUyxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsTUFBSyxLQUFLLE9BQU8sU0FBTyxLQUFHLFNBQVMsSUFBSSxXQUFTLENBQUM7T0FBRyxPQUFPO01BQUk7TUFBQyxXQUFXLFFBQU0sUUFBTyxRQUFPLFFBQU8sUUFBTyxhQUFXO09BQUMsR0FBRyxjQUFjLElBQUk7T0FBRSxPQUFPLFlBQVksUUFBTyxRQUFPLFFBQU8sUUFBTyxRQUFRO01BQUM7TUFBRSxXQUFXLFFBQU0sUUFBTyxRQUFPLFVBQVMsTUFBSyxVQUFRO09BQUMsR0FBRyxjQUFjLElBQUk7T0FBRSxJQUFJLE1BQUksVUFBVSxNQUFNO09BQUUsSUFBRyxDQUFDLEtBQUssTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFO09BQUUsWUFBWSxRQUFPLE9BQU0sS0FBSSxRQUFPLFFBQVE7T0FBRSxPQUFNO1FBQUM7UUFBSSxXQUFVO09BQUk7TUFBQztNQUFFLEtBQUssYUFBVztNQUFXLE9BQU87S0FBSTtJQUFDO0lBQUUsSUFBSSxnQkFBYyxLQUFJLG1CQUFpQixNQUFJLGtCQUFrQixRQUFPLEtBQUksY0FBYyxJQUFFO0lBQUcsSUFBSSxXQUFTO0tBQUMsa0JBQWlCO0tBQUUsWUFBWSxPQUFNLE1BQUssWUFBVztNQUFDLElBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxPQUFPO01BQUssSUFBSTtNQUFJLElBQUcsVUFBUSxNQUFNLE1BQUksR0FBRyxJQUFJO1dBQXFELE1BQWhDLFNBQVMsZ0JBQWdCLEtBQW1CLENBQUMsQ0FBQztNQUFLLElBQUcsS0FBSyxVQUFRLEdBQUU7T0FBQyxJQUFHLENBQUMsWUFBWSxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7T0FBRSxPQUFPO01BQUc7TUFBQyxPQUFPLEtBQUssTUFBTSxLQUFJLElBQUk7S0FBQztLQUFFLE9BQU8sTUFBSyxNQUFLLEtBQUk7TUFBQyxJQUFJLE9BQUssS0FBSyxJQUFJO01BQUUsT0FBTyxPQUFLLEtBQUcsS0FBSztNQUFJLE9BQU8sTUFBSSxLQUFHLEtBQUcsS0FBSztNQUFLLFFBQVEsTUFBSSxLQUFHLEtBQUcsS0FBSztNQUFNLE9BQU8sTUFBSSxNQUFJLEtBQUcsS0FBSztNQUFJLE9BQU8sTUFBSSxNQUFJLEtBQUcsS0FBSztNQUFJLE9BQU8sTUFBSSxNQUFJLEtBQUcsS0FBSztNQUFLLFVBQVEsQ0FBQyxLQUFLLFNBQU8sSUFBRyxhQUFXLEtBQUssTUFBSyxDQUFDLEtBQUssSUFBSSxVQUFVLEtBQUcsSUFBRSxhQUFXLElBQUUsQ0FBQyxLQUFLLE1BQU0sYUFBVyxVQUFVLE1BQUksSUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sYUFBVyxFQUFFLENBQUMsQ0FBQyxlQUFhLE1BQUksVUFBVSxNQUFJLElBQUUsRUFBRSxHQUFFLE9BQU8sTUFBSSxNQUFJLEtBQUcsUUFBUSxJQUFHLE9BQU8sTUFBSSxNQUFJLEtBQUcsUUFBUTtNQUFHLE9BQU8sTUFBSSxNQUFJLEtBQUc7TUFBSyxPQUFPLE1BQUksTUFBSSxLQUFHLEtBQUs7TUFBTyxJQUFJLFFBQU0sS0FBSyxNQUFNLFFBQVE7TUFBRSxJQUFJLFFBQU0sS0FBSyxNQUFNLFFBQVE7TUFBRSxJQUFJLFFBQU0sS0FBSyxNQUFNLFFBQVE7TUFBRSxVQUFRLENBQUMsS0FBSyxNQUFNLFFBQU0sR0FBRyxNQUFJLElBQUcsYUFBVyxLQUFLLE1BQU0sUUFBTSxHQUFHLEdBQUUsQ0FBQyxLQUFLLElBQUksVUFBVSxLQUFHLElBQUUsYUFBVyxJQUFFLENBQUMsS0FBSyxNQUFNLGFBQVcsVUFBVSxNQUFJLElBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLGFBQVcsRUFBRSxDQUFDLENBQUMsZUFBYSxNQUFJLFVBQVUsTUFBSSxJQUFFLEVBQUUsR0FBRSxPQUFPLE1BQUksTUFBSSxLQUFHLFFBQVEsSUFBRyxPQUFPLE1BQUksTUFBSSxLQUFHLFFBQVE7TUFBRyxRQUFRLE1BQUksTUFBSSxLQUFHLFFBQU0sTUFBSSxNQUFJO01BQUksVUFBUSxDQUFDLEtBQUssTUFBTSxRQUFNLEdBQUcsTUFBSSxJQUFHLGFBQVcsS0FBSyxNQUFNLFFBQU0sR0FBRyxHQUFFLENBQUMsS0FBSyxJQUFJLFVBQVUsS0FBRyxJQUFFLGFBQVcsSUFBRSxDQUFDLEtBQUssTUFBTSxhQUFXLFVBQVUsTUFBSSxJQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxhQUFXLEVBQUUsQ0FBQyxDQUFDLGVBQWEsTUFBSSxVQUFVLE1BQUksSUFBRSxFQUFFLEdBQUUsT0FBTyxNQUFJLE1BQUksS0FBRyxRQUFRLElBQUcsT0FBTyxNQUFJLE1BQUksS0FBRyxRQUFRO01BQUcsUUFBUSxNQUFJLE1BQUksS0FBRyxRQUFNLE1BQUksTUFBSTtNQUFJLFVBQVEsQ0FBQyxLQUFLLE1BQU0sUUFBTSxHQUFHLE1BQUksSUFBRyxhQUFXLEtBQUssTUFBTSxRQUFNLEdBQUcsR0FBRSxDQUFDLEtBQUssSUFBSSxVQUFVLEtBQUcsSUFBRSxhQUFXLElBQUUsQ0FBQyxLQUFLLE1BQU0sYUFBVyxVQUFVLE1BQUksSUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sYUFBVyxFQUFFLENBQUMsQ0FBQyxlQUFhLE1BQUksVUFBVSxNQUFJLElBQUUsRUFBRSxHQUFFLE9BQU8sTUFBSSxNQUFJLEtBQUcsUUFBUSxJQUFHLE9BQU8sTUFBSSxNQUFJLEtBQUcsUUFBUTtNQUFHLFFBQVEsTUFBSSxNQUFJLEtBQUcsUUFBTSxNQUFJLE1BQUk7TUFBSSxVQUFRLENBQUMsS0FBSyxRQUFNLElBQUcsYUFBVyxLQUFLLEtBQUksQ0FBQyxLQUFLLElBQUksVUFBVSxLQUFHLElBQUUsYUFBVyxJQUFFLENBQUMsS0FBSyxNQUFNLGFBQVcsVUFBVSxNQUFJLElBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLGFBQVcsRUFBRSxDQUFDLENBQUMsZUFBYSxNQUFJLFVBQVUsTUFBSSxJQUFFLEVBQUUsR0FBRSxPQUFPLE1BQUksTUFBSSxLQUFHLFFBQVEsSUFBRyxPQUFPLE1BQUksTUFBSSxLQUFHLFFBQVE7TUFBRyxPQUFPO0tBQUM7S0FBRSxRQUFRLE1BQUssUUFBTyxLQUFJLE9BQU0sUUFBTztNQUFDLElBQUcsQ0FBQyxHQUFHLE9BQU8sT0FBTyxLQUFLLElBQUksR0FBRyxNQUFNLElBQUksR0FBRyxXQUFXLEVBQUU7TUFBRSxJQUFHLFFBQU0sR0FBRyxPQUFPO01BQUUsSUFBSSxTQUFPLE9BQU8sTUFBTSxNQUFLLE9BQUssR0FBRztNQUFFLEdBQUcsTUFBTSxRQUFPLFFBQU8sUUFBTyxLQUFJLEtBQUs7S0FBQztLQUFFLGdCQUFnQixJQUFHO01BQW9DLE9BQXhCLEdBQUcsaUJBQWlCLEVBQWdCO0tBQUM7S0FBRSxTQUFRLEtBQUE7S0FBVSxPQUFPLEtBQUk7TUFBMkIsT0FBbEIsYUFBYSxHQUFjO0tBQUM7SUFBQztJQUFFLFNBQVMsaUJBQWlCLE1BQUssTUFBSztLQUFDLElBQUc7TUFBQyxPQUFLLFNBQVMsT0FBTyxJQUFJO01BQUUsR0FBRyxNQUFNLE1BQUssSUFBSTtNQUFFLE9BQU87S0FBQyxTQUFPLEdBQUU7TUFBQyxJQUFHLE9BQU8sTUFBSSxlQUFhLEVBQUUsRUFBRSxTQUFPLGVBQWMsTUFBTTtNQUFFLE9BQU0sQ0FBQyxFQUFFO0tBQUs7SUFBQztJQUFDLFNBQVMscUJBQXFCLE9BQU0sTUFBSyxPQUFNLE9BQU07S0FBQyxJQUFHO01BQUMsT0FBSyxTQUFTLE9BQU8sSUFBSTtNQUFFLE9BQUssU0FBUyxZQUFZLE9BQU0sSUFBSTtNQUFFLElBQUcsUUFBTSxJQUFJLE9BQU07TUFBaUQsSUFBSSxPQUF0QyxHQUFHLFdBQVcsTUFBSyxFQUFDLFFBQU8sS0FBSSxDQUFpQixDQUFDLENBQUM7TUFBSyxJQUFHLENBQUMsTUFBTSxPQUFNO01BQUksSUFBSSxRQUFNO01BQUcsSUFBRyxRQUFNLEdBQUUsU0FBTztNQUFJLElBQUcsUUFBTSxHQUFFLFNBQU87TUFBSSxJQUFHLFFBQU0sR0FBRSxTQUFPO01BQUksSUFBRyxTQUFPLEdBQUcsZ0JBQWdCLE1BQUssS0FBSyxHQUFHLE9BQU07TUFBRyxPQUFPO0tBQUMsU0FBTyxHQUFFO01BQUMsSUFBRyxPQUFPLE1BQUksZUFBYSxFQUFFLEVBQUUsU0FBTyxlQUFjLE1BQU07TUFBRSxPQUFNLENBQUMsRUFBRTtLQUFLO0lBQUM7SUFBQyxTQUFTLG9CQUFtQjtLQUFDLElBQUksTUFBSSxPQUFPLENBQUMsU0FBUyxXQUFTO0tBQUcsU0FBUyxXQUFTO0tBQUUsT0FBTztJQUFHO0lBQUMsSUFBSSxvQkFBa0I7SUFBa0IsU0FBUyxtQkFBbUIsSUFBRyxLQUFJLFNBQVE7S0FBQyxTQUFTLFVBQVE7S0FBUSxJQUFHO01BQUMsSUFBSSxTQUFPLFNBQVMsZ0JBQWdCLEVBQUU7TUFBRSxRQUFPLEtBQVA7T0FBWSxLQUFLO1FBQUcsSUFBSSxNQUFJLGtCQUFrQjtRQUFFLElBQUcsTUFBSSxHQUFHLE9BQU07UUFBSSxPQUFNLEdBQUcsUUFBUSxNQUFNO1FBQXVELE9BQXpCLEdBQUcsVUFBVSxRQUFPLEdBQW9CLENBQUMsQ0FBQztPQUFHLEtBQUs7T0FBRSxLQUFLLEdBQUUsT0FBTztPQUFFLEtBQUssR0FBRSxPQUFPLE9BQU87T0FBTSxLQUFLO1FBQUcsSUFBSSxNQUFJLGtCQUFrQjtRQUFFLE9BQU8sU0FBTztRQUFJLE9BQU87T0FBRSxLQUFLO1FBQUksSUFBSSxNQUFJLGtCQUFrQjtRQUFFLElBQUksU0FBTztRQUFFLE9BQU8sTUFBSSxVQUFRLEtBQUc7UUFBRSxPQUFPO09BQUUsS0FBSztPQUFHLEtBQUssSUFBRyxPQUFPO01BQUM7TUFBQyxPQUFNO0tBQUcsU0FBTyxHQUFFO01BQUMsSUFBRyxPQUFPLE1BQUksZUFBYSxFQUFFLEVBQUUsU0FBTyxlQUFjLE1BQU07TUFBRSxPQUFNLENBQUMsRUFBRTtLQUFLO0lBQUM7SUFBQyxTQUFTLG1CQUFtQixJQUFHLEtBQUk7S0FBQyxJQUFHO01BQUMsSUFBSSxTQUFPLFNBQVMsZ0JBQWdCLEVBQUU7TUFBRSxPQUFPLFNBQVMsT0FBTyxHQUFHLE1BQUssT0FBTyxNQUFLLEdBQUc7S0FBQyxTQUFPLEdBQUU7TUFBQyxJQUFHLE9BQU8sTUFBSSxlQUFhLEVBQUUsRUFBRSxTQUFPLGVBQWMsTUFBTTtNQUFFLE9BQU0sQ0FBQyxFQUFFO0tBQUs7SUFBQztJQUFDLFNBQVMsaUJBQWlCLElBQUcsSUFBRyxTQUFRO0tBQUMsU0FBUyxVQUFRO0tBQVEsSUFBRztNQUFDLElBQUksU0FBTyxTQUFTLGdCQUFnQixFQUFFO01BQUUsUUFBTyxJQUFQO09BQVcsS0FBSztRQUFPLElBQUcsQ0FBQyxPQUFPLEtBQUksT0FBTTtRQUFJLE9BQU87T0FBRSxLQUFLO1FBQU8sSUFBRyxDQUFDLE9BQU8sS0FBSSxPQUFNO1FBQUksSUFBRyxPQUFPLElBQUksSUFBSSxjQUFhO1NBQUMsSUFBSSxVQUFRLE9BQU8sSUFBSSxJQUFJLGFBQWEsTUFBTTtTQUFFLElBQUksT0FBSyxrQkFBa0I7U0FBRSxPQUFPLFFBQU0sS0FBRyxRQUFRLFdBQVM7U0FBRSxPQUFPLE9BQUssS0FBRyxLQUFHLFFBQVEsV0FBUztTQUFFLE9BQU8sT0FBSyxLQUFHLEtBQUcsUUFBUSxXQUFTO1NBQUUsT0FBTyxPQUFLLE1BQUksS0FBRyxRQUFRLFdBQVM7U0FBRSxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsSUFBRyxLQUFLLE1BQU0sT0FBSyxJQUFFLE1BQUksUUFBUSxLQUFLLE1BQUk7U0FBRSxPQUFPO1FBQUM7UUFBQyxPQUFPO09BQUUsS0FBSztPQUFNLEtBQUs7T0FBTSxLQUFLO1FBQU8sSUFBRyxDQUFDLE9BQU8sS0FBSSxPQUFNO1FBQUksT0FBTztPQUFFLEtBQUs7T0FBTSxLQUFLO09BQU0sS0FBSztRQUFPLElBQUcsQ0FBQyxPQUFPLEtBQUksT0FBTTtRQUFJLElBQUcsT0FBTyxJQUFJLElBQUksY0FBYTtTQUFDLElBQUksT0FBSyxrQkFBa0I7U0FBRSxJQUFJLFVBQVEsT0FBTyxRQUFNO1NBQUcsSUFBSSxVQUFRLE9BQU8sT0FBSyxLQUFHO1NBQUcsSUFBSSxVQUFRLE9BQU8sT0FBSyxLQUFHO1NBQUcsSUFBSSxVQUFRLE9BQU8sT0FBSyxNQUFJO1NBQUcsSUFBSSxPQUFLLENBQUM7U0FBRSxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsSUFBRyxLQUFLLEtBQUssS0FBSyxNQUFNLE9BQUssSUFBRSxHQUFHO1NBQUUsT0FBTyxPQUFPLElBQUksSUFBSSxhQUFhLE9BQU8sS0FBSSxJQUFHO1VBQUM7VUFBUTtVQUFRO1VBQVE7VUFBUTtTQUFJLENBQUM7UUFBQztRQUFDLE9BQU87T0FBRSxLQUFLO1FBQU8sSUFBRyxDQUFDLE9BQU8sS0FBSSxPQUFNO1FBQUksSUFBSSxPQUFLLGtCQUFrQjtRQUFFLE9BQU8sUUFBTSxLQUFHO1FBQUUsT0FBTztPQUFFLEtBQUs7UUFBTyxJQUFHLENBQUMsT0FBTyxLQUFJLE9BQU07UUFBSSxPQUFNO09BQUksS0FBSztRQUFPLElBQUksT0FBSyxrQkFBa0I7UUFBRSxPQUFPLEdBQUcsTUFBTSxRQUFPLElBQUcsSUFBSTtPQUFFLEtBQUs7UUFBTyxJQUFHLENBQUMsT0FBTyxLQUFJLE9BQU07UUFBSSxJQUFHLE9BQU8sSUFBSSxJQUFJLGtCQUFpQjtTQUFDLElBQUksVUFBUSxPQUFPLElBQUksSUFBSSxpQkFBaUIsT0FBTyxHQUFHO1NBQUUsSUFBSSxPQUFLLGtCQUFrQjtTQUFFLE9BQU8sUUFBTSxLQUFHLFFBQVE7U0FBRyxPQUFPLE9BQUssS0FBRyxLQUFHLFFBQVE7UUFBRTtRQUFDLE9BQU87T0FBRSxLQUFLO1FBQU8sSUFBRyxDQUFDLE9BQU8sS0FBSSxPQUFNO1FBQUksT0FBTztPQUFFLEtBQUs7UUFBTyxJQUFHLENBQUMsT0FBTyxLQUFJLE9BQU07UUFBSSxPQUFPO09BQUUsU0FBUSxPQUFNO01BQUc7S0FBQyxTQUFPLEdBQUU7TUFBQyxJQUFHLE9BQU8sTUFBSSxlQUFhLEVBQUUsRUFBRSxTQUFPLGVBQWMsTUFBTTtNQUFFLE9BQU0sQ0FBQyxFQUFFO0tBQUs7SUFBQztJQUFDLFNBQVMsbUJBQW1CLE1BQUssS0FBSTtLQUFDLElBQUc7TUFBQyxPQUFLLFNBQVMsT0FBTyxJQUFJO01BQUUsT0FBTyxTQUFTLE9BQU8sR0FBRyxPQUFNLE1BQUssR0FBRztLQUFDLFNBQU8sR0FBRTtNQUFDLElBQUcsT0FBTyxNQUFJLGVBQWEsRUFBRSxFQUFFLFNBQU8sZUFBYyxNQUFNO01BQUUsT0FBTSxDQUFDLEVBQUU7S0FBSztJQUFDO0lBQUMsU0FBUyxzQkFBc0IsT0FBTSxNQUFLLEtBQUksT0FBTTtLQUFDLElBQUc7TUFBQyxPQUFLLFNBQVMsT0FBTyxJQUFJO01BQUUsSUFBSSxXQUFTLFFBQU07TUFBSSxJQUFJLGFBQVcsUUFBTTtNQUFLLFFBQU0sUUFBTTtNQUFNLE9BQUssU0FBUyxZQUFZLE9BQU0sTUFBSyxVQUFVO01BQUUsT0FBTyxTQUFTLE9BQU8sV0FBUyxHQUFHLFFBQU0sR0FBRyxNQUFLLE1BQUssR0FBRztLQUFDLFNBQU8sR0FBRTtNQUFDLElBQUcsT0FBTyxNQUFJLGVBQWEsRUFBRSxFQUFFLFNBQU8sZUFBYyxNQUFNO01BQUUsT0FBTSxDQUFDLEVBQUU7S0FBSztJQUFDO0lBQUMsU0FBUyxrQkFBa0IsT0FBTSxNQUFLLE9BQU0sU0FBUTtLQUFDLFNBQVMsVUFBUTtLQUFRLElBQUc7TUFBQyxPQUFLLFNBQVMsT0FBTyxJQUFJO01BQUUsT0FBSyxTQUFTLFlBQVksT0FBTSxJQUFJO01BQUUsSUFBSSxPQUFLLFVBQVEsa0JBQWtCLElBQUU7TUFBRSxPQUFPLEdBQUcsS0FBSyxNQUFLLE9BQU0sSUFBSSxDQUFDLENBQUM7S0FBRSxTQUFPLEdBQUU7TUFBQyxJQUFHLE9BQU8sTUFBSSxlQUFhLEVBQUUsRUFBRSxTQUFPLGVBQWMsTUFBTTtNQUFFLE9BQU0sQ0FBQyxFQUFFO0tBQUs7SUFBQztJQUFDLFNBQVMsaUJBQWlCLE1BQUs7S0FBQyxJQUFHO01BQUMsT0FBSyxTQUFTLE9BQU8sSUFBSTtNQUFFLEdBQUcsTUFBTSxJQUFJO01BQUUsT0FBTztLQUFDLFNBQU8sR0FBRTtNQUFDLElBQUcsT0FBTyxNQUFJLGVBQWEsRUFBRSxFQUFFLFNBQU8sZUFBYyxNQUFNO01BQUUsT0FBTSxDQUFDLEVBQUU7S0FBSztJQUFDO0lBQUMsU0FBUyxrQkFBa0IsTUFBSyxLQUFJO0tBQUMsSUFBRztNQUFDLE9BQUssU0FBUyxPQUFPLElBQUk7TUFBRSxPQUFPLFNBQVMsT0FBTyxHQUFHLE1BQUssTUFBSyxHQUFHO0tBQUMsU0FBTyxHQUFFO01BQUMsSUFBRyxPQUFPLE1BQUksZUFBYSxFQUFFLEVBQUUsU0FBTyxlQUFjLE1BQU07TUFBRSxPQUFNLENBQUMsRUFBRTtLQUFLO0lBQUM7SUFBQyxTQUFTLG9CQUFvQixPQUFNLE1BQUssT0FBTTtLQUFDLElBQUc7TUFBQyxPQUFLLFNBQVMsT0FBTyxJQUFJO01BQUUsT0FBSyxTQUFTLFlBQVksT0FBTSxJQUFJO01BQUUsSUFBRyxVQUFRLEdBQUcsR0FBRyxPQUFPLElBQUk7V0FBTyxJQUFHLFVBQVEsS0FBSyxHQUFHLE1BQU0sSUFBSTtXQUFPLE1BQU0sa0NBQWtDO01BQUUsT0FBTztLQUFDLFNBQU8sR0FBRTtNQUFDLElBQUcsT0FBTyxNQUFJLGVBQWEsRUFBRSxFQUFFLFNBQU8sZUFBYyxNQUFNO01BQUUsT0FBTSxDQUFDLEVBQUU7S0FBSztJQUFDO0lBQUMsSUFBSSxtQkFBZTtLQUFDLE1BQU0sRUFBRTtJQUFDO0lBQUUsSUFBSSw0QkFBMEIsZUFBYyxNQUFLLE1BQUssVUFBUyxhQUFXLENBQUM7SUFBRSxJQUFJLDhCQUEwQjtLQUFDLElBQUksUUFBTSxJQUFJLE1BQU0sR0FBRztLQUFFLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxLQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUcsT0FBTyxhQUFhLENBQUM7S0FBRSxtQkFBaUI7SUFBSztJQUFFLElBQUk7SUFBaUIsSUFBSSxvQkFBaUIsUUFBSztLQUFDLElBQUksTUFBSTtLQUFHLElBQUksSUFBRTtLQUFJLE9BQU0sT0FBTyxJQUFJLE9BQUssaUJBQWlCLE9BQU87S0FBTSxPQUFPO0lBQUc7SUFBRSxJQUFJLHVCQUFxQixDQUFDO0lBQUUsSUFBSSxrQkFBZ0IsQ0FBQztJQUFFLElBQUksbUJBQWlCLENBQUM7SUFBRSxJQUFJO0lBQWEsSUFBSSxxQkFBa0IsWUFBUztLQUFDLE1BQU0sSUFBSSxhQUFhLE9BQU87SUFBQztJQUFFLElBQUk7SUFBYyxJQUFJLHNCQUFtQixZQUFTO0tBQUMsTUFBTSxJQUFJLGNBQWMsT0FBTztJQUFDO0lBQUUsSUFBSSxpQ0FBK0IsU0FBUSxnQkFBZSxzQkFBb0I7S0FBQyxRQUFRLFNBQVEsU0FBTSxpQkFBaUIsUUFBTSxjQUFjO0tBQUUsU0FBUyxXQUFXLGdCQUFlO01BQUMsSUFBSSxtQkFBaUIsa0JBQWtCLGNBQWM7TUFBRSxJQUFHLGlCQUFpQixXQUFTLFFBQVEsUUFBUSxtQkFBbUIsaUNBQWlDO01BQUUsS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFFBQVEsUUFBTyxFQUFFLEdBQUcsYUFBYSxRQUFRLElBQUcsaUJBQWlCLEVBQUU7S0FBRTtLQUFDLElBQUksaUJBQWUsSUFBSSxNQUFNLGVBQWUsTUFBTTtLQUFFLElBQUksb0JBQWtCLENBQUM7S0FBRSxJQUFJLGFBQVc7S0FBRSxlQUFlLFNBQVMsSUFBRyxNQUFJO01BQUMsSUFBRyxnQkFBZ0IsZUFBZSxFQUFFLEdBQUcsZUFBZSxLQUFHLGdCQUFnQjtXQUFRO09BQUMsa0JBQWtCLEtBQUssRUFBRTtPQUFFLElBQUcsQ0FBQyxxQkFBcUIsZUFBZSxFQUFFLEdBQUcscUJBQXFCLE1BQUksQ0FBQztPQUFFLHFCQUFxQixHQUFHLENBQUMsV0FBUztRQUFDLGVBQWUsS0FBRyxnQkFBZ0I7UUFBSSxFQUFFO1FBQVcsSUFBRyxlQUFhLGtCQUFrQixRQUFRLFdBQVcsY0FBYztPQUFFLENBQUM7TUFBQztLQUFDLENBQUM7S0FBRSxJQUFHLE1BQUksa0JBQWtCLFFBQVEsV0FBVyxjQUFjO0lBQUU7SUFBRSxTQUFTLG1CQUFtQixTQUFRLG9CQUFtQixVQUFRLENBQUMsR0FBRTtLQUFDLElBQUksT0FBSyxtQkFBbUI7S0FBSyxJQUFHLENBQUMsU0FBUyxrQkFBa0IsU0FBUyxLQUFLLDhDQUE4QztLQUFFLElBQUcsZ0JBQWdCLGVBQWUsT0FBTyxHQUFFO01BQUMsSUFBRyxRQUFRLDhCQUE4QjtXQUFZLGtCQUFrQix5QkFBeUIsS0FBSyxRQUFRO0tBQUU7S0FBQyxnQkFBZ0IsV0FBUztLQUFtQixPQUFPLGlCQUFpQjtLQUFTLElBQUcscUJBQXFCLGVBQWUsT0FBTyxHQUFFO01BQUMsSUFBSSxZQUFVLHFCQUFxQjtNQUFTLE9BQU8scUJBQXFCO01BQVMsVUFBVSxTQUFRLE9BQUksR0FBRyxDQUFDO0tBQUM7SUFBQztJQUFDLFNBQVMsYUFBYSxTQUFRLG9CQUFtQixVQUFRLENBQUMsR0FBRTtLQUFDLE9BQU8sbUJBQW1CLFNBQVEsb0JBQW1CLE9BQU87SUFBQztJQUFDLElBQUksc0JBQW9CO0lBQUUsSUFBSSwwQkFBd0IsU0FBUSxNQUFLLFdBQVUsZUFBYTtLQUFDLE9BQUssaUJBQWlCLElBQUk7S0FBRSxhQUFhLFNBQVE7TUFBQztNQUFLLGNBQWEsU0FBUyxJQUFHO09BQUMsT0FBTSxDQUFDLENBQUM7TUFBRTtNQUFFLFlBQVcsU0FBUyxhQUFZLEdBQUU7T0FBQyxPQUFPLElBQUUsWUFBVTtNQUFVO01BQUUsZ0JBQWU7TUFBb0Isc0JBQXFCLFNBQVMsU0FBUTtPQUFDLE9BQU8sS0FBSyxlQUFlLENBQUMsT0FBTyxRQUFRO01BQUM7TUFBRSxvQkFBbUI7S0FBSSxDQUFDO0lBQUM7SUFBRSxJQUFJLGlCQUFlLENBQUM7SUFBRSxJQUFJLGdCQUFjLENBQUM7SUFBRSxJQUFJLGtCQUFlLFdBQVE7S0FBQyxJQUFHLFNBQU8sS0FBRyxNQUFJLEVBQUUsY0FBYyxTQUFPLElBQUc7TUFBQyxjQUFjLFVBQVEsS0FBQTtNQUFVLGVBQWUsS0FBSyxNQUFNO0tBQUM7SUFBQztJQUFFLElBQUksNEJBQXdCLGNBQWMsU0FBTyxJQUFFLElBQUUsZUFBZTtJQUFPLElBQUksbUJBQWU7S0FBQyxjQUFjLEtBQUssR0FBRSxHQUFFLEtBQUEsR0FBVSxHQUFFLE1BQUssR0FBRSxNQUFLLEdBQUUsT0FBTSxDQUFDO0tBQUUsT0FBTyx5QkFBdUI7SUFBbUI7SUFBRSxJQUFJLFFBQU07S0FBQyxVQUFRLFdBQVE7TUFBQyxJQUFHLENBQUMsUUFBUSxrQkFBa0Isc0NBQW9DLE1BQU07TUFBRSxPQUFPLGNBQWM7S0FBTztLQUFFLFdBQVMsVUFBTztNQUFDLFFBQU8sT0FBUDtPQUFjLEtBQUssS0FBQSxHQUFVLE9BQU87T0FBRSxLQUFLLE1BQUssT0FBTztPQUFFLEtBQUssTUFBSyxPQUFPO09BQUUsS0FBSyxPQUFNLE9BQU87T0FBRSxTQUFRO1FBQUMsTUFBTSxTQUFPLGVBQWUsSUFBSSxLQUFHLGNBQWM7UUFBTyxjQUFjLFVBQVE7UUFBTSxjQUFjLFNBQU8sS0FBRztRQUFFLE9BQU87T0FBTTtNQUFDO0tBQUM7SUFBQztJQUFFLFNBQVMsWUFBWSxTQUFRO0tBQUMsT0FBTyxLQUFLLGVBQWUsQ0FBQyxRQUFRLFdBQVMsRUFBRTtJQUFDO0lBQUMsSUFBSSxZQUFVO0tBQUMsTUFBSztLQUFrQixlQUFhLFdBQVE7TUFBQyxJQUFJLEtBQUcsTUFBTSxRQUFRLE1BQU07TUFBRSxlQUFlLE1BQU07TUFBRSxPQUFPO0tBQUU7S0FBRSxhQUFZLGFBQVksVUFBUSxNQUFNLFNBQVMsS0FBSztLQUFFLGdCQUFlO0tBQW9CLHNCQUFxQjtLQUFZLG9CQUFtQjtJQUFJO0lBQUUsSUFBSSwyQkFBd0IsWUFBUyxhQUFhLFNBQVEsU0FBUztJQUFFLElBQUksNkJBQTJCLE1BQUssVUFBUTtLQUFDLFFBQU8sT0FBUDtNQUFjLEtBQUssR0FBRSxPQUFPLFNBQVMsU0FBUTtPQUFDLE9BQU8sS0FBSyxlQUFlLENBQUMsUUFBUSxXQUFTLEVBQUU7TUFBQztNQUFFLEtBQUssR0FBRSxPQUFPLFNBQVMsU0FBUTtPQUFDLE9BQU8sS0FBSyxlQUFlLENBQUMsUUFBUSxXQUFTLEVBQUU7TUFBQztNQUFFLFNBQVEsTUFBTSxJQUFJLFVBQVUsd0JBQXdCLE1BQU0sS0FBSyxNQUFNO0tBQUM7SUFBQztJQUFFLElBQUksMkJBQXlCLFNBQVEsTUFBSyxTQUFPO0tBQUMsT0FBSyxpQkFBaUIsSUFBSTtLQUFFLGFBQWEsU0FBUTtNQUFDO01BQUssZUFBYSxVQUFPO01BQU0sYUFBWSxhQUFZLFVBQVE7TUFBTSxnQkFBZTtNQUFvQixzQkFBcUIsMEJBQTBCLE1BQUssSUFBSTtNQUFFLG9CQUFtQjtLQUFJLENBQUM7SUFBQztJQUFFLElBQUksdUJBQXFCLE1BQUssU0FBTyxPQUFPLGVBQWUsTUFBSyxRQUFPLEVBQUMsT0FBTSxLQUFJLENBQUM7SUFBRSxJQUFJLGtCQUFlLGdCQUFhO0tBQUMsT0FBTSxZQUFZLFFBQU87TUFBQyxJQUFJLE1BQUksWUFBWSxJQUFJO01BQTRCLFlBQU4sSUFBUSxDQUFDLENBQUMsR0FBRztLQUFDO0lBQUM7SUFBRSxTQUFTLG9CQUFvQixVQUFTO0tBQUMsS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFNBQVMsUUFBTyxFQUFFLEdBQUcsSUFBRyxTQUFTLE9BQUssUUFBTSxTQUFTLEVBQUUsQ0FBQyx1QkFBcUIsS0FBQSxHQUFXLE9BQU87S0FBTSxPQUFPO0lBQUs7SUFBQyxTQUFTLFFBQVEsYUFBWSxjQUFhO0tBQUMsSUFBRyxFQUFFLHVCQUF1QixXQUFXLE1BQU0sSUFBSSxVQUFVLHFDQUFxQyxPQUFPLFlBQVkseUJBQXlCO0tBQUUsSUFBSSxRQUFNLG9CQUFvQixZQUFZLFFBQU0sdUJBQXNCLFdBQVUsQ0FBQyxDQUFDO0tBQUUsTUFBTSxZQUFVLFlBQVk7S0FBVSxJQUFJLE1BQUksSUFBSSxNQUFJO0tBQUUsSUFBSSxJQUFFLFlBQVksTUFBTSxLQUFJLFlBQVk7S0FBRSxPQUFPLGFBQWEsU0FBTyxJQUFFO0lBQUc7SUFBQyxTQUFTLGdCQUFnQixVQUFTLG1CQUFrQixTQUFRLFNBQVE7S0FBQyxJQUFJLHVCQUFxQixvQkFBb0IsUUFBUTtLQUFFLElBQUksV0FBUyxTQUFTLFNBQU87S0FBRSxJQUFJLFdBQVMsQ0FBQztLQUFFLElBQUksZ0JBQWMsQ0FBQyxJQUFJO0tBQUUsSUFBRyxtQkFBbUIsY0FBYyxLQUFLLFdBQVc7S0FBRSxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsVUFBUyxFQUFFLEdBQUU7TUFBQyxTQUFTLEtBQUssTUFBTSxHQUFHO01BQUUsY0FBYyxLQUFLLE1BQU0sRUFBRSxNQUFNO0tBQUM7S0FBQyxXQUFTLFNBQVMsS0FBSyxHQUFHO0tBQUUsZ0JBQWMsY0FBYyxLQUFLLEdBQUc7S0FBRSxJQUFJLGdCQUFjLG9CQUFvQixTQUFTO0tBQU8sSUFBRyxzQkFBc0IsaUJBQWU7S0FBMEIsSUFBSSxZQUFVLHVCQUFxQixnQkFBYztLQUFPLElBQUksUUFBTTtNQUFDO01BQVk7TUFBb0I7TUFBVTtNQUFLO01BQWlCO01BQVU7S0FBWTtLQUFFLElBQUcsbUJBQW1CLGlCQUFlLDRDQUE0QyxVQUFVO0tBQVksS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFVBQVMsRUFBRSxHQUFFO01BQUMsaUJBQWUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixVQUFVLE9BQU8sRUFBRTtNQUFNLE1BQU0sS0FBSyxVQUFVLEdBQUc7S0FBQztLQUFDLGtCQUFnQixXQUFTLFVBQVEsY0FBWSxNQUFJLFdBQVcsY0FBYztLQUFNLElBQUcsc0JBQXNCLGlCQUFlO1VBQXNDLEtBQUksSUFBSSxJQUFFLG9CQUFrQixJQUFFLEdBQUUsSUFBRSxTQUFTLFFBQU8sRUFBRSxHQUFFO01BQUMsSUFBSSxZQUFVLE1BQUksSUFBRSxjQUFZLFNBQU8sSUFBRSxLQUFHO01BQVEsSUFBRyxTQUFTLEVBQUUsQ0FBQyx1QkFBcUIsTUFBSztPQUFDLGlCQUFlLEdBQUcsVUFBVSxRQUFRLFVBQVU7T0FBTSxNQUFNLEtBQUssR0FBRyxVQUFVLE1BQU07TUFBQztLQUFDO0tBQUUsSUFBRyxTQUFTLGlCQUFlO0tBQWlFLGlCQUFlO0tBQU0sT0FBTSxDQUFDLE9BQU0sYUFBYTtJQUFDO0lBQUMsU0FBUyxxQkFBcUIsV0FBVSxVQUFTLFdBQVUsZ0JBQWUsZUFBYyxTQUFRO0tBQUMsSUFBSSxXQUFTLFNBQVM7S0FBTyxJQUFHLFdBQVMsR0FBRyxrQkFBa0IsZ0ZBQWdGO0tBQUUsSUFBSSxvQkFBa0IsU0FBUyxPQUFLLFFBQU0sY0FBWTtLQUFLLElBQUksdUJBQXFCLG9CQUFvQixRQUFRO0tBQUUsSUFBSSxVQUFRLFNBQVMsRUFBRSxDQUFDLFNBQU87S0FBTyxJQUFJLGNBQVk7TUFBQztNQUFVO01BQWtCO01BQWU7TUFBYztNQUFlLFNBQVM7TUFBRyxTQUFTO0tBQUU7S0FBRSxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsV0FBUyxHQUFFLEVBQUUsR0FBRyxZQUFZLEtBQUssU0FBUyxJQUFFLEVBQUU7S0FBRSxJQUFHLENBQUMsc0JBQTBCO1dBQUEsSUFBSSxJQUFFLG9CQUFrQixJQUFFLEdBQUUsSUFBRSxTQUFTLFFBQU8sRUFBRSxHQUFHLElBQUcsU0FBUyxFQUFFLENBQUMsdUJBQXFCLE1BQU0sWUFBWSxLQUFLLFNBQVMsRUFBRSxDQUFDLGtCQUFrQjtLQUFBO0tBQUksSUFBRyxDQUFDLE1BQUssaUJBQWUsZ0JBQWdCLFVBQVMsbUJBQWtCLFNBQVEsT0FBTztLQUFFLEtBQUssS0FBSyxhQUFhO0tBQXVELE9BQU8sb0JBQW9CLFdBQWxFLFFBQVEsVUFBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLFdBQTBELENBQUM7SUFBQztJQUFDLElBQUksdUJBQXFCLE9BQU0sWUFBVyxjQUFZO0tBQUMsSUFBRyxLQUFBLE1BQVksTUFBTSxXQUFXLENBQUMsZUFBYztNQUFDLElBQUksV0FBUyxNQUFNO01BQVksTUFBTSxjQUFZLFNBQVMsR0FBRyxNQUFLO09BQUMsSUFBRyxDQUFDLE1BQU0sV0FBVyxDQUFDLGNBQWMsZUFBZSxLQUFLLE1BQU0sR0FBRyxrQkFBa0IsYUFBYSxVQUFVLGdEQUFnRCxLQUFLLE9BQU8sc0JBQXNCLE1BQU0sV0FBVyxDQUFDLGNBQWMsR0FBRztPQUFFLE9BQU8sTUFBTSxXQUFXLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQyxNQUFNLE1BQUssSUFBSTtNQUFDO01BQUUsTUFBTSxXQUFXLENBQUMsZ0JBQWMsQ0FBQztNQUFFLE1BQU0sV0FBVyxDQUFDLGNBQWMsU0FBUyxZQUFVO0tBQVE7SUFBQztJQUFFLElBQUksc0JBQW9CLE1BQUssT0FBTSxpQkFBZTtLQUFDLElBQUcsT0FBTyxlQUFlLElBQUksR0FBRTtNQUFDLElBQUcsS0FBQSxNQUFZLGdCQUFjLEtBQUEsTUFBWSxPQUFPLEtBQUssQ0FBQyxpQkFBZSxLQUFBLE1BQVksT0FBTyxLQUFLLENBQUMsY0FBYyxlQUFlLGtCQUFrQixnQ0FBZ0MsS0FBSyxRQUFRO01BQUUsb0JBQW9CLFFBQU8sTUFBSyxJQUFJO01BQUUsSUFBRyxPQUFPLGVBQWUsWUFBWSxHQUFHLGtCQUFrQix1RkFBdUYsYUFBYSxHQUFHO01BQUUsT0FBTyxLQUFLLENBQUMsY0FBYyxnQkFBYztLQUFLLE9BQUs7TUFBQyxPQUFPLFFBQU07TUFBTSxJQUFHLEtBQUEsTUFBWSxjQUFjLE9BQU8sS0FBSyxDQUFDLGVBQWE7S0FBYTtJQUFDO0lBQUUsSUFBSSx1QkFBcUIsT0FBTSxpQkFBZTtLQUFDLElBQUksUUFBTSxDQUFDO0tBQUUsS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLE9BQU0sS0FBSyxNQUFNLEtBQUssUUFBUSxlQUFhLElBQUUsS0FBRyxFQUFFO0tBQUUsT0FBTztJQUFLO0lBQUUsSUFBSSx1QkFBcUIsTUFBSyxPQUFNLGlCQUFlO0tBQUMsSUFBRyxDQUFDLE9BQU8sZUFBZSxJQUFJLEdBQUcsbUJBQW1CLHFDQUFxQztLQUFFLElBQUcsS0FBQSxNQUFZLE9BQU8sS0FBSyxDQUFDLGlCQUFlLEtBQUEsTUFBWSxjQUFjLE9BQU8sS0FBSyxDQUFDLGNBQWMsZ0JBQWM7VUFBVTtNQUFDLE9BQU8sUUFBTTtNQUFNLE9BQU8sS0FBSyxDQUFDLFdBQVM7S0FBWTtJQUFDO0lBQUUsSUFBSSxpQkFBZSxLQUFJLEtBQUksU0FBTztLQUFDLE1BQUksSUFBSSxRQUFRLE1BQUssR0FBRztLQUFFLElBQUksSUFBRSxPQUFPLGFBQVc7S0FBSyxPQUFPLEVBQUUsS0FBSSxHQUFHLElBQUk7SUFBQztJQUFFLElBQUksa0JBQWdCLENBQUM7SUFBRSxJQUFJO0lBQVUsSUFBSSxxQkFBa0IsWUFBUztLQUFDLElBQUksT0FBSyxnQkFBZ0I7S0FBUyxJQUFHLENBQUMsTUFBSztNQUFDLElBQUcsV0FBUyxnQkFBZ0IsUUFBTyxnQkFBZ0IsU0FBTyxVQUFRO01BQUUsZ0JBQWdCLFdBQVMsT0FBSyxVQUFVLElBQUksT0FBTztLQUFDO0tBQUMsT0FBTztJQUFJO0lBQUUsSUFBSSxXQUFTLEtBQUksS0FBSSxPQUFLLENBQUMsTUFBSTtLQUFDLElBQUcsSUFBSSxTQUFTLEdBQUcsR0FBRyxPQUFPLGNBQWMsS0FBSSxLQUFJLElBQUk7S0FBMEMsT0FBaEMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBZTtJQUFDO0lBQUUsSUFBSSxnQkFBYyxLQUFJLFNBQU8sR0FBRyxTQUFPLFFBQVEsS0FBSSxLQUFJLElBQUk7SUFBRSxJQUFJLDJCQUF5QixXQUFVLGdCQUFjO0tBQUMsWUFBVSxpQkFBaUIsU0FBUztLQUFFLFNBQVMsZ0JBQWU7TUFBQyxJQUFHLFVBQVUsU0FBUyxHQUFHLEdBQUcsT0FBTyxhQUFhLFdBQVUsV0FBVztNQUFFLE9BQU8sa0JBQWtCLFdBQVc7S0FBQztLQUFDLElBQUksS0FBRyxjQUFjO0tBQUUsSUFBRyxPQUFPLE1BQUksWUFBWSxrQkFBa0IsMkNBQTJDLFVBQVUsSUFBSSxhQUFhO0tBQUUsT0FBTztJQUFFO0lBQUUsSUFBSSxlQUFhLGVBQWMsY0FBWTtLQUFDLElBQUksYUFBVyxvQkFBb0IsV0FBVSxTQUFTLFNBQVE7TUFBQyxLQUFLLE9BQUs7TUFBVSxLQUFLLFVBQVE7TUFBUSxJQUFJLFFBQU0sSUFBSSxNQUFNLE9BQU8sQ0FBQyxDQUFDO01BQU0sSUFBRyxVQUFRLEtBQUEsR0FBVyxLQUFLLFFBQU0sS0FBSyxTQUFTLElBQUUsT0FBSyxNQUFNLFFBQVEsc0JBQXFCLEVBQUU7S0FBRSxDQUFDO0tBQUUsV0FBVyxZQUFVLE9BQU8sT0FBTyxjQUFjLFNBQVM7S0FBRSxXQUFXLFVBQVUsY0FBWTtLQUFXLFdBQVcsVUFBVSxXQUFTLFdBQVU7TUFBQyxJQUFHLEtBQUssWUFBVSxLQUFBLEdBQVcsT0FBTyxLQUFLO1dBQVUsT0FBTSxHQUFHLEtBQUssS0FBSyxJQUFJLEtBQUs7S0FBVTtLQUFFLE9BQU87SUFBVTtJQUFFLElBQUk7SUFBaUIsSUFBSSxlQUFZLFNBQU07S0FBQyxJQUFJLE1BQUksZUFBZSxJQUFJO0tBQUUsSUFBSSxLQUFHLGlCQUFpQixHQUFHO0tBQUUsTUFBTSxHQUFHO0tBQUUsT0FBTztJQUFFO0lBQUUsSUFBSSx5QkFBdUIsU0FBUSxVQUFRO0tBQUMsSUFBSSxlQUFhLENBQUM7S0FBRSxJQUFJLE9BQUssQ0FBQztLQUFFLFNBQVMsTUFBTSxNQUFLO01BQUMsSUFBRyxLQUFLLE9BQU87TUFBTyxJQUFHLGdCQUFnQixPQUFPO01BQU8sSUFBRyxpQkFBaUIsT0FBTTtPQUFDLGlCQUFpQixLQUFLLENBQUMsUUFBUSxLQUFLO09BQUU7TUFBTTtNQUFDLGFBQWEsS0FBSyxJQUFJO01BQUUsS0FBSyxRQUFNO0tBQUk7S0FBQyxNQUFNLFFBQVEsS0FBSztLQUFFLE1BQU0sSUFBSSxpQkFBaUIsR0FBRyxRQUFRLE1BQUksYUFBYSxJQUFJLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUFDO0lBQUUsSUFBSSxtQkFBZ0IsY0FBVztLQUFDLFlBQVUsVUFBVSxLQUFLO0tBQUUsTUFBTSxZQUFVLFVBQVUsUUFBUSxHQUFHO0tBQUUsSUFBRyxjQUFZLElBQUksT0FBTyxVQUFVLE9BQU8sR0FBRSxTQUFTO1VBQU8sT0FBTztJQUFVO0lBQUUsSUFBSSw4QkFBNEIsTUFBSyxVQUFTLGlCQUFnQixXQUFVLFlBQVcsSUFBRyxTQUFRLG9CQUFrQjtLQUFDLElBQUksV0FBUyxvQkFBb0IsVUFBUyxlQUFlO0tBQUUsT0FBSyxpQkFBaUIsSUFBSTtLQUFFLE9BQUssZ0JBQWdCLElBQUk7S0FBRSxhQUFXLHdCQUF3QixXQUFVLFVBQVU7S0FBRSxtQkFBbUIsTUFBSyxXQUFVO01BQUMsc0JBQXNCLGVBQWUsS0FBSyx3QkFBdUIsUUFBUTtLQUFDLEdBQUUsV0FBUyxDQUFDO0tBQUUsOEJBQThCLENBQUMsR0FBRSxXQUFTLGFBQVU7TUFBQyxJQUFJLG1CQUFpQixDQUFDLFNBQVMsSUFBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLFNBQVMsTUFBTSxDQUFDLENBQUM7TUFBRSxvQkFBb0IsTUFBSyxxQkFBcUIsTUFBSyxrQkFBaUIsTUFBSyxZQUFXLElBQUcsT0FBTyxHQUFFLFdBQVMsQ0FBQztNQUFFLE9BQU0sQ0FBQztLQUFDLENBQUM7SUFBQztJQUFFLElBQUksK0JBQTZCLE1BQUssT0FBTSxXQUFTO0tBQUMsUUFBTyxPQUFQO01BQWMsS0FBSyxHQUFFLE9BQU8sVUFBTyxZQUFTLE1BQU0sWUFBUyxZQUFTLE9BQU87TUFBUyxLQUFLLEdBQUUsT0FBTyxVQUFPLFlBQVMsT0FBTyxXQUFTLE1BQUcsWUFBUyxRQUFRLFdBQVM7TUFBRyxLQUFLLEdBQUUsT0FBTyxVQUFPLFlBQVMsT0FBTyxXQUFTLE1BQUcsWUFBUyxRQUFRLFdBQVM7TUFBRyxTQUFRLE1BQU0sSUFBSSxVQUFVLDBCQUEwQixNQUFNLEtBQUssTUFBTTtLQUFDO0lBQUM7SUFBRSxJQUFJLDZCQUEyQixlQUFjLE1BQUssTUFBSyxVQUFTLGFBQVc7S0FBQyxPQUFLLGlCQUFpQixJQUFJO0tBQUUsSUFBRyxhQUFXLElBQUksV0FBUztLQUFXLElBQUksZ0JBQWEsVUFBTztLQUFNLElBQUcsYUFBVyxHQUFFO01BQUMsSUFBSSxXQUFTLEtBQUcsSUFBRTtNQUFLLGdCQUFhLFVBQU8sU0FBTyxhQUFXO0tBQVE7S0FBQyxJQUFJLGlCQUFlLEtBQUssU0FBUyxVQUFVO0tBQTZDLElBQUk7S0FBVyxJQUFHLGdCQUFnQixhQUFXLFNBQVMsYUFBWSxPQUFNO01BQUMsS0FBMkI7TUFBTSxPQUFPLFVBQVE7S0FBQztVQUFPLGFBQVcsU0FBUyxhQUFZLE9BQU07TUFBQyxLQUEyQjtNQUFNLE9BQU87S0FBSztLQUFFLGFBQWEsZUFBYztNQUFDO01BQUs7TUFBYTtNQUFXLGdCQUFlO01BQW9CLHNCQUFxQiw0QkFBNEIsTUFBSyxNQUFLLGFBQVcsQ0FBQztNQUFFLG9CQUFtQjtLQUFJLENBQUM7SUFBQztJQUFFLElBQUksaUNBQStCLFNBQVEsZUFBYyxTQUFPO0tBQWdILElBQUksS0FBRztNQUFyRztNQUFVO01BQVc7TUFBVztNQUFZO01BQVc7TUFBWTtNQUFhO0tBQStCLENBQUMsQ0FBQztLQUFlLFNBQVMsaUJBQWlCLFFBQU87TUFBQyxJQUFJLE9BQUssUUFBUSxVQUFRO01BQUcsSUFBSSxPQUFLLFFBQVEsU0FBTyxLQUFHO01BQUcsT0FBTyxJQUFJLEdBQUcsTUFBTSxRQUFPLE1BQUssSUFBSTtLQUFDO0tBQUMsT0FBSyxpQkFBaUIsSUFBSTtLQUFFLGFBQWEsU0FBUTtNQUFDO01BQUssY0FBYTtNQUFpQixnQkFBZTtNQUFvQixzQkFBcUI7S0FBZ0IsR0FBRSxFQUFDLDhCQUE2QixLQUFJLENBQUM7SUFBQztJQUFFLElBQUksZ0JBQWMsS0FBSSxRQUFPLG9CQUFrQixrQkFBa0IsS0FBSSxRQUFPLFFBQU8sZUFBZTtJQUFFLElBQUksZ0NBQThCLFNBQVEsU0FBTztLQUFDLE9BQUssaUJBQWlCLElBQUk7S0FBRSxJQUFJLGtCQUFnQixTQUFPO0tBQWMsYUFBYSxTQUFRO01BQUM7TUFBSyxhQUFhLE9BQU07T0FBQyxJQUFJLFNBQU8sUUFBUSxTQUFPO09BQUcsSUFBSSxVQUFRLFFBQU07T0FBRSxJQUFJO09BQUksSUFBRyxpQkFBZ0I7UUFBQyxJQUFJLGlCQUFlO1FBQVEsS0FBSSxJQUFJLElBQUUsR0FBRSxLQUFHLFFBQU8sRUFBRSxHQUFFO1NBQUMsSUFBSSxpQkFBZSxVQUFRO1NBQUUsSUFBRyxLQUFHLFVBQVEsT0FBTyxtQkFBaUIsR0FBRTtVQUFDLElBQUksVUFBUSxpQkFBZTtVQUFlLElBQUksZ0JBQWMsYUFBYSxnQkFBZSxPQUFPO1VBQUUsSUFBRyxRQUFNLEtBQUEsR0FBVyxNQUFJO2VBQWtCO1dBQUMsT0FBSyxPQUFPLGFBQWEsQ0FBQztXQUFFLE9BQUs7VUFBYTtVQUFDLGlCQUFlLGlCQUFlO1NBQUM7UUFBQztPQUFDLE9BQUs7UUFBQyxJQUFJLElBQUUsSUFBSSxNQUFNLE1BQU07UUFBRSxLQUFJLElBQUksSUFBRSxHQUFFLElBQUUsUUFBTyxFQUFFLEdBQUcsRUFBRSxLQUFHLE9BQU8sYUFBYSxPQUFPLFVBQVEsRUFBRTtRQUFFLE1BQUksRUFBRSxLQUFLLEVBQUU7T0FBQztPQUFDLE1BQU0sS0FBSztPQUFFLE9BQU87TUFBRztNQUFFLFdBQVcsYUFBWSxPQUFNO09BQUMsSUFBRyxpQkFBaUIsYUFBYSxRQUFNLElBQUksV0FBVyxLQUFLO09BQUUsSUFBSTtPQUFPLElBQUksc0JBQW9CLE9BQU8sU0FBTztPQUFTLElBQUcsRUFBRSx1QkFBcUIsaUJBQWlCLGNBQVksaUJBQWlCLHFCQUFtQixpQkFBaUIsWUFBWSxrQkFBa0IsdUNBQXVDO09BQUUsSUFBRyxtQkFBaUIscUJBQXFCLFNBQU8sZ0JBQWdCLEtBQUs7WUFBTyxTQUFPLE1BQU07T0FBTyxJQUFJLE9BQUssUUFBUSxJQUFFLFNBQU8sQ0FBQztPQUFFLElBQUksTUFBSSxPQUFLO09BQUUsUUFBUSxRQUFNLEtBQUc7T0FBTyxJQUFHLG1CQUFpQixxQkFBcUIsYUFBYSxPQUFNLEtBQUksU0FBTyxDQUFDO1lBQU8sSUFBRyxxQkFBcUIsS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFFBQU8sRUFBRSxHQUFFO1FBQUMsSUFBSSxXQUFTLE1BQU0sV0FBVyxDQUFDO1FBQUUsSUFBRyxXQUFTLEtBQUk7U0FBQyxNQUFNLEdBQUc7U0FBRSxrQkFBa0Isd0RBQXdEO1FBQUM7UUFBQyxPQUFPLE1BQUksS0FBRztPQUFRO1lBQU8sS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLFFBQU8sRUFBRSxHQUFHLE9BQU8sTUFBSSxLQUFHLE1BQU07T0FBSyxJQUFHLGdCQUFjLE1BQU0sWUFBWSxLQUFLLE9BQU0sSUFBSTtPQUFFLE9BQU87TUFBSTtNQUFFLGdCQUFlO01BQW9CLHNCQUFxQjtNQUFZLG1CQUFtQixLQUFJO09BQUMsTUFBTSxHQUFHO01BQUM7S0FBQyxDQUFDO0lBQUM7SUFBRSxJQUFJLGVBQWEsT0FBTyxlQUFhLGNBQVksSUFBSSxZQUFZLFVBQVUsSUFBRSxLQUFBO0lBQVUsSUFBSSxpQkFBZSxLQUFJLG1CQUFpQjtLQUFDLElBQUksU0FBTztLQUFJLElBQUksTUFBSSxVQUFRO0tBQUUsSUFBSSxTQUFPLE1BQUksaUJBQWU7S0FBRSxPQUFNLEVBQUUsT0FBSyxXQUFTLFFBQVEsTUFBSyxFQUFFO0tBQUksU0FBTyxPQUFLO0tBQUUsSUFBRyxTQUFPLE1BQUksTUFBSSxjQUFhLE9BQU8sYUFBYSxPQUFPLE9BQU8sU0FBUyxLQUFJLE1BQU0sQ0FBQztLQUFFLElBQUksTUFBSTtLQUFHLEtBQUksSUFBSSxJQUFFLEdBQUUsRUFBRSxLQUFHLGlCQUFlLElBQUcsRUFBRSxHQUFFO01BQUMsSUFBSSxXQUFTLE9BQU8sTUFBSSxJQUFFLEtBQUc7TUFBRyxJQUFHLFlBQVUsR0FBRTtNQUFNLE9BQUssT0FBTyxhQUFhLFFBQVE7S0FBQztLQUFDLE9BQU87SUFBRztJQUFFLElBQUksaUJBQWUsS0FBSSxRQUFPLG9CQUFrQjtLQUFDLG9CQUFrQjtLQUFXLElBQUcsa0JBQWdCLEdBQUUsT0FBTztLQUFFLG1CQUFpQjtLQUFFLElBQUksV0FBUztLQUFPLElBQUksa0JBQWdCLGtCQUFnQixJQUFJLFNBQU8sSUFBRSxrQkFBZ0IsSUFBRSxJQUFJO0tBQU8sS0FBSSxJQUFJLElBQUUsR0FBRSxJQUFFLGlCQUFnQixFQUFFLEdBQUU7TUFBQyxJQUFJLFdBQVMsSUFBSSxXQUFXLENBQUM7TUFBRSxPQUFPLFVBQVEsS0FBRztNQUFTLFVBQVE7S0FBQztLQUFDLE9BQU8sVUFBUSxLQUFHO0tBQUUsT0FBTyxTQUFPO0lBQVE7SUFBRSxJQUFJLG9CQUFpQixRQUFLLElBQUksU0FBTztJQUFFLElBQUksaUJBQWUsS0FBSSxtQkFBaUI7S0FBQyxJQUFJLElBQUU7S0FBRSxJQUFJLE1BQUk7S0FBRyxPQUFNLEVBQUUsS0FBRyxpQkFBZSxJQUFHO01BQUMsSUFBSSxRQUFNLE9BQU8sTUFBSSxJQUFFLEtBQUc7TUFBRyxJQUFHLFNBQU8sR0FBRTtNQUFNLEVBQUU7TUFBRSxJQUFHLFNBQU8sT0FBTTtPQUFDLElBQUksS0FBRyxRQUFNO09BQU0sT0FBSyxPQUFPLGFBQWEsUUFBTSxNQUFJLElBQUcsUUFBTSxLQUFHLElBQUk7TUFBQyxPQUFNLE9BQUssT0FBTyxhQUFhLEtBQUs7S0FBRTtLQUFDLE9BQU87SUFBRztJQUFFLElBQUksaUJBQWUsS0FBSSxRQUFPLG9CQUFrQjtLQUFDLG9CQUFrQjtLQUFXLElBQUcsa0JBQWdCLEdBQUUsT0FBTztLQUFFLElBQUksV0FBUztLQUFPLElBQUksU0FBTyxXQUFTLGtCQUFnQjtLQUFFLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxJQUFJLFFBQU8sRUFBRSxHQUFFO01BQUMsSUFBSSxXQUFTLElBQUksV0FBVyxDQUFDO01BQUUsSUFBRyxZQUFVLFNBQU8sWUFBVSxPQUFNO09BQUMsSUFBSSxpQkFBZSxJQUFJLFdBQVcsRUFBRSxDQUFDO09BQUUsV0FBUyxVQUFRLFdBQVMsU0FBTyxNQUFJLGlCQUFlO01BQUk7TUFBQyxPQUFPLFVBQVEsS0FBRztNQUFTLFVBQVE7TUFBRSxJQUFHLFNBQU8sSUFBRSxRQUFPO0tBQUs7S0FBQyxPQUFPLFVBQVEsS0FBRztLQUFFLE9BQU8sU0FBTztJQUFRO0lBQUUsSUFBSSxvQkFBaUIsUUFBSztLQUFDLElBQUksTUFBSTtLQUFFLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxJQUFJLFFBQU8sRUFBRSxHQUFFO01BQUMsSUFBSSxXQUFTLElBQUksV0FBVyxDQUFDO01BQUUsSUFBRyxZQUFVLFNBQU8sWUFBVSxPQUFNLEVBQUU7TUFBRSxPQUFLO0tBQUM7S0FBQyxPQUFPO0lBQUc7SUFBRSxJQUFJLGlDQUErQixTQUFRLFVBQVMsU0FBTztLQUFDLE9BQUssaUJBQWlCLElBQUk7S0FBRSxJQUFJLGNBQWEsY0FBYSxZQUFXO0tBQWUsSUFBRyxhQUFXLEdBQUU7TUFBQyxlQUFhO01BQWMsZUFBYTtNQUFjLGlCQUFlO01BQWlCLGNBQVcsWUFBUyxRQUFRLFdBQVM7S0FBRSxPQUFNLElBQUcsYUFBVyxHQUFFO01BQUMsZUFBYTtNQUFjLGVBQWE7TUFBYyxpQkFBZTtNQUFpQixjQUFXLFlBQVMsUUFBUSxXQUFTO0tBQUU7S0FBQyxhQUFhLFNBQVE7TUFBQztNQUFLLGVBQWEsVUFBTztPQUFDLElBQUksU0FBTyxRQUFRLFNBQU87T0FBRyxJQUFJO09BQUksSUFBSSxpQkFBZSxRQUFNO09BQUUsS0FBSSxJQUFJLElBQUUsR0FBRSxLQUFHLFFBQU8sRUFBRSxHQUFFO1FBQUMsSUFBSSxpQkFBZSxRQUFNLElBQUUsSUFBRTtRQUFTLElBQUcsS0FBRyxVQUFRLFdBQVcsY0FBYyxLQUFHLEdBQUU7U0FBQyxJQUFJLGVBQWEsaUJBQWU7U0FBZSxJQUFJLGdCQUFjLGFBQWEsZ0JBQWUsWUFBWTtTQUFFLElBQUcsUUFBTSxLQUFBLEdBQVcsTUFBSTtjQUFrQjtVQUFDLE9BQUssT0FBTyxhQUFhLENBQUM7VUFBRSxPQUFLO1NBQWE7U0FBQyxpQkFBZSxpQkFBZTtRQUFRO09BQUM7T0FBQyxNQUFNLEtBQUs7T0FBRSxPQUFPO01BQUc7TUFBRSxhQUFZLGFBQVksVUFBUTtPQUFDLElBQUcsRUFBRSxPQUFPLFNBQU8sV0FBVyxrQkFBa0IsNkNBQTZDLE1BQU07T0FBRSxJQUFJLFNBQU8sZUFBZSxLQUFLO09BQUUsSUFBSSxNQUFJLFFBQVEsSUFBRSxTQUFPLFFBQVE7T0FBRSxRQUFRLE9BQUssS0FBRyxTQUFPO09BQVMsYUFBYSxPQUFNLE1BQUksR0FBRSxTQUFPLFFBQVE7T0FBRSxJQUFHLGdCQUFjLE1BQU0sWUFBWSxLQUFLLE9BQU0sR0FBRztPQUFFLE9BQU87TUFBRztNQUFFLGdCQUFlO01BQW9CLHNCQUFxQjtNQUFZLG1CQUFtQixLQUFJO09BQUMsTUFBTSxHQUFHO01BQUM7S0FBQyxDQUFDO0lBQUM7SUFBRSxJQUFJLDBCQUF3QixTQUFRLFNBQU87S0FBQyxPQUFLLGlCQUFpQixJQUFJO0tBQUUsYUFBYSxTQUFRO01BQUMsUUFBTztNQUFLO01BQUssZ0JBQWU7TUFBRSxvQkFBaUIsS0FBQTtNQUFVLGFBQVksYUFBWSxNQUFJLEtBQUE7S0FBUyxDQUFDO0lBQUM7SUFBRSxJQUFJLGlCQUFlO0lBQUUsSUFBSSwwQ0FBc0M7SUFBZSxJQUFJLGFBQVUsUUFBSztLQUFDLElBQUksSUFBRSxJQUFJLE1BQU0sR0FBRztLQUFFLEtBQUksSUFBSSxJQUFFLEdBQUUsSUFBRSxHQUFFLEtBQUk7TUFBQyxJQUFJLE1BQUksT0FBTyxFQUFFLEVBQUU7TUFBRSxJQUFHLE1BQU0sR0FBRyxHQUFFLE9BQU87TUFBSyxFQUFFLEtBQUc7S0FBRztLQUFDLFFBQU8sRUFBRSxLQUFHLEVBQUUsTUFBSSxJQUFFLEVBQUUsTUFBSSxLQUFHLEVBQUUsTUFBSSxRQUFNO0lBQUM7SUFBRSxJQUFJLFdBQVEsUUFBSyxTQUFTLEdBQUc7SUFBRSxJQUFJLGFBQVUsUUFBSztLQUFDLElBQUk7S0FBTSxJQUFJLEdBQUUsUUFBTztLQUFFLElBQUksYUFBVztLQUFxSyxJQUFJLFFBQU0sQ0FBQztLQUFFLElBQUcsQ0FBQyxXQUFXLEtBQUssR0FBRyxHQUFHLE9BQU87S0FBSyxJQUFHLFFBQU0sTUFBTSxPQUFNO01BQUM7TUFBRTtNQUFFO01BQUU7TUFBRTtNQUFFO01BQUU7TUFBRTtLQUFDO0tBQUUsSUFBRyxJQUFJLFdBQVcsSUFBSSxHQUFHLE1BQUksSUFBSSxRQUFRLE1BQUssSUFBSTtVQUFPLE1BQUksSUFBSSxRQUFRLE1BQUssS0FBSztLQUFFLElBQUcsSUFBSSxRQUFRLEdBQUcsSUFBRSxHQUFFO01BQUMsTUFBSSxJQUFJLHdCQUFRLElBQUksT0FBTyxPQUFNLEdBQUcsR0FBRSxHQUFHO01BQUUsUUFBTSxJQUFJLE1BQU0sR0FBRztNQUFFLE1BQU0sTUFBTSxTQUFPLEtBQUcsUUFBUSxNQUFNLE1BQU0sU0FBTyxFQUFFLElBQUUsUUFBUSxNQUFNLE1BQU0sU0FBTyxFQUFFLElBQUU7TUFBSSxNQUFNLE1BQU0sU0FBTyxLQUFHLFFBQVEsTUFBTSxNQUFNLFNBQU8sRUFBRSxJQUFFLFFBQVEsTUFBTSxNQUFNLFNBQU8sRUFBRSxJQUFFO01BQUksUUFBTSxNQUFNLE1BQU0sR0FBRSxNQUFNLFNBQU8sQ0FBQztLQUFDLE9BQU0sUUFBTSxJQUFJLE1BQU0sR0FBRztLQUFFLFNBQU87S0FBRSxJQUFFO0tBQUUsS0FBSSxJQUFFLEdBQUUsSUFBRSxNQUFNLFFBQU8sS0FBSyxJQUFHLE9BQU8sTUFBTSxNQUFJLFVBQVM7TUFBQyxJQUFHLE1BQU0sT0FBSyxLQUFJO09BQUMsS0FBSSxJQUFFLEdBQUUsSUFBRSxJQUFFLE1BQU0sU0FBTyxHQUFFLEtBQUssTUFBTSxJQUFFLEtBQUc7T0FBRSxTQUFPLElBQUU7TUFBQyxPQUFNLE1BQU0sSUFBRSxVQUFRLE9BQU8sU0FBUyxNQUFNLElBQUcsRUFBRSxDQUFDO0tBQUUsT0FB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