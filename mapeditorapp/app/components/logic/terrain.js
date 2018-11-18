import pako from "pako";
import { StringDecoder } from "string_decoder";

let THREE = require("../../libs/threemin.js");

const PIXEL_PER_METER = 4;

let waterMaterial = new THREE.MeshBasicMaterial({
	color: 0x0000ff,
	side: THREE.FrontSide,
	transparent: true,
	opacity: 0.5
});

let planeMaterial = new THREE.MeshLambertMaterial({
	color: 0xffffff,
	side: THREE.FrontSide
});
let planeWireMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
	wireframe: true,
	transparent: true,
	opacity: 0.05
});

class Terrain {
	constructor(mapsize, indiceworldsize, indiceSize, baseline, min, max) {
		this.mapSize = mapsize;
		this.indiceWorlSize = indiceworldsize * PIXEL_PER_METER;
		this.min = Math.max(0, min);
		this.baseline = Math.max(baseline, this.min);
		this.max = max;

		let indiceCount = this.mapSize / indiceSize;
		let waterGeometry = new THREE.PlaneBufferGeometry(this.indiceWorlSize * indiceCount, this.indiceWorlSize * indiceCount, 1, 1);

		this._water = new THREE.Mesh(waterGeometry, waterMaterial);
		this._water.name = "Water";
		this._water.renderDepth = 10;
		this._water.rotation.x = -Math.PI / 2;
		this._water.position.y = 99.8;

		let planeGeometry = new THREE.PlaneBufferGeometry(this.indiceWorlSize, this.indiceWorlSize, indiceSize, indiceSize);

		this._indiceSize = indiceSize + 1;
		this._meshes = [];
		this._grid = [];

		for (let x = 0; x < indiceCount; x++) {
			for (let z = 0; z < indiceCount; z++) {
				let geometryClone = planeGeometry.clone();
				let mesh = new THREE.Mesh(geometryClone, planeMaterial);
				mesh.name = "mesh:x" + x + ":z" + z;
				let grid = new THREE.Mesh(geometryClone, planeWireMaterial);
				grid.name = "grid:x" + x + ":z" + z;

				mesh.renderDepth = 0;
				grid.renderDepth = 1;

				mesh.rotation.x = -Math.PI / 2;
				grid.rotation.x = -Math.PI / 2;

				mesh.position.x = this.indiceWorlSize * x - (this.indiceWorlSize * (indiceCount - 1)) / 2; // - this.indiceWorlSize / 2;
				mesh.position.z = this.indiceWorlSize * z - (this.indiceWorlSize * (indiceCount - 1)) / 2; // - this.indiceWorlSize / 2;
				mesh.position.y = baseline;

				grid.position.x = this.indiceWorlSize * x - (this.indiceWorlSize * (indiceCount - 1)) / 2; // - this.indiceWorlSize / 2;
				grid.position.z = this.indiceWorlSize * z - (this.indiceWorlSize * (indiceCount - 1)) / 2; // - this.indiceWorlSize / 2;
				grid.position.y = baseline;

				this._meshes.push(mesh);
				this._grid.push(grid);
			}
		}
		setNeighbours(this._meshes, indiceCount);
	}

	addToScene(scene) {
		this._meshes.forEach(mesh => {
			scene.add(mesh);
		});

		this._grid.forEach(grid => {
			scene.add(grid);
		});

		scene.add(this._water);
	}

	removeFromScene(scene) {
		this._meshes.forEach(mesh => {
			scene.remove(mesh);
			mesh.geometry.dispose();
			mesh.geometry = null;
			mesh.material.dispose();
			mesh.material = null;
			mesh = null;
		});

		this._grid.forEach(grid => {
			scene.remove(grid);
			grid.geometry.dispose();
			grid.geometry = null;
			grid.material.dispose();
			grid.material = null;
			grid = null;
		});

		scene.remove(this._water);
		this._water.geometry.dispose();
		this._water.geometry = null;
		this._water.material.dispose();
		this._water.material = null;
		this._water = null;
	}

	getHeightValues() {
		let height = new Array((this.mapSize + 1) * (this.mapSize + 1));
		let indice = this._indiceSize - 1;

		this._meshes.forEach(mesh => {
			for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
				let vertex = getVertex(mesh.geometry, i);
				let pos = mesh.position.clone();

				//Transform to globalspace, map to indexes and set minimum at (0,0)
				//(500,-500) -> (1,-1) -> (2,0)
				pos.x = (pos.x + vertex.x) / (this.indiceWorlSize / indice) + this.mapSize / 2;
				pos.z = (pos.z - vertex.y) / (this.indiceWorlSize / indice) + this.mapSize / 2;

				pos.x = Math.round(pos.x);
				pos.z = Math.round(pos.z);
				height[pos.x + pos.z * (this.mapSize + 1)] = vertex.z + this.baseline;
			}
		});

		return height;
	}
	setHeights(array) {
		console.log(this.mapSize / (this._indiceSize - 1));

		array.forEach((height, i) => {
			let indexer = newMap2dTo1d(i % (this.mapSize + 1), (i / (this.mapSize + 1)) >> 0, this._indiceSize, this._meshes[0]);

			if (indexer != null) {
				indexer.affected.geometry.attributes.position.array[indexer.index * 3 + 2] = height - this.baseline;

				indexer.edgeSharingNeighbours.forEach(sharer => {
					let targetNeighbour = indexer.affected.neighbour[sharer.neighbour];
					if (targetNeighbour != null) {
						targetNeighbour.geometry.attributes.position.array[sharer.index * 3 + 2] = height - this.baseline;
					}
				});
			}
		});

		this.updateGeometries(this._meshes.map(x => x.geometry));
	}
	getAffectedMeshesAndVertices(raycaster, brush2d) {
		// the mesh clicked is found:
		let intersects = raycaster.intersectObjects(this._meshes);
		if (intersects.length > 0) {
			// ------------------------------------------------------------------
			// --------------- Find closest vertex and clicked object------------
			// ------------------------------------------------------------------

			//Clicked face
			let faceVerticesIndexes = [intersects[0].face.a, intersects[0].face.b, intersects[0].face.c];
			let distance = Number.MAX_VALUE;
			let closest = null;

			//Find closest vertex
			faceVerticesIndexes.forEach(vertexIndex => {
				let vertex = getVertex(intersects[0].object.geometry, vertexIndex);
				//var vertex = intersects[0].object.geometry.vertices[vertexIndex].clone();

				vertex.applyMatrix4(intersects[0].object.matrixWorld);
				let newdistance = intersects[0].point.distanceTo(vertex);

				if (newdistance < distance) {
					closest = vertexIndex;
					distance = newdistance;
				}
			});
			let target = intersects[0].object;

			// ------------------------------------------------------------------
			// ---------------- Find affected vertices and meshes ---------------
			// ------------------------------------------------------------------

			let verticesToTransform = [];
			let meshgeometriesToUpdate = [target.geometry];

			//Converts 1d index to 2d indexes for easier
			let vertex2dIndex = {
				y: (closest / this._indiceSize) >> 0,
				x: closest % this._indiceSize
			};
			//Center toolbrush around cursor
			let brushOffset = {
				x: (brush2d[0].length / 2) >> 0,
				y: (brush2d.length / 2) >> 0
			};

			//Loop through the brush matrix
			for (let y = vertex2dIndex.y - brushOffset.y; y < vertex2dIndex.y - brushOffset.y + brush2d.length; y++) {
				for (
					let x = vertex2dIndex.x - brushOffset.x;
					x < vertex2dIndex.x - brushOffset.x + brush2d[y - vertex2dIndex.y + brushOffset.y].length;
					x++
				) {
					//Get tool options for affected area
					let brushindex = {
						y: y - vertex2dIndex.y + brushOffset.y,
						x: x - vertex2dIndex.x + brushOffset.x
					};

					//Convert indexes back to 1d array
					let indexer = newMap2dTo1d(x, y, this._indiceSize, target);

					if (indexer && indexer.affected != null) {
						verticesToTransform.push({
							vertex: getVertex(indexer.affected.geometry, indexer.index),
							index: brushindex,
							mesh: indexer.affected
						});

						//If on the edge of an object, the touching vertices of the neighbour should be updated aswell
						indexer.edgeSharingNeighbours.forEach(sharer => {
							let targetNeighbour = indexer.affected.neighbour[sharer.neighbour];
							if (targetNeighbour != null) {
								verticesToTransform.push({
									vertex: getVertex(targetNeighbour.geometry, sharer.index),
									index: brushindex,
									mesh: targetNeighbour
								});
								meshgeometriesToUpdate.push(targetNeighbour.geometry);
							}
						});
					}
				}
			}

			function onlyUnique(value, index, self) {
				return self.indexOf(value) === index;
			}

			meshgeometriesToUpdate = meshgeometriesToUpdate.filter(onlyUnique);

			let indexedVertices = [];
			verticesToTransform.forEach(element => {
				if (!indexedVertices[element.index.y]) indexedVertices[element.index.y] = [];

				if (!indexedVertices[element.index.y][element.index.x]) {
					indexedVertices[element.index.y][element.index.x] = new ToolableVertex(
						element.vertex,
						element.mesh,
						this.min - this.baseline,
						this.max
					);
				}
				indexedVertices[element.index.y][element.index.x]._vertices.push(element.vertex);
				indexedVertices[element.index.y][element.index.x]._meshes.push(element.mesh);
			});

			return {
				meshes: meshgeometriesToUpdate,
				indexedVertices: indexedVertices
			};
		}
	}

	updateGeometries(meshgeometriesToUpdate) {
		meshgeometriesToUpdate.forEach(element => {
			element.computeFaceNormals();
			element.computeVertexNormals();
			element.attributes.position.needsUpdate = true;
			element.verticesNeedUpdate = true;
			element.normalsNeedUpdate = true;
		});
	}
	save() {
		let heightdata = new Float64Array(this.getHeightValues());
		let buffer = new ArrayBuffer(heightdata.byteLength);
		let test = new Float64Array(buffer);
		test.set(heightdata);
		let bytes = new Uint8Array(buffer);

		console.log(test);
		heightdata = pako.deflate(bytes, { level: 9, windowBits: 8, strategy: 1 });

		let savedTerrain = {
			min: this.min,
			max: this.max,
			baseline: this.baseline,
			mapsize: this.mapSize,
			indiceWorldSize: this.indiceWorlSize / PIXEL_PER_METER,
			indiceSize: this._indiceSize - 1,
			heightData: heightdata
		};

		let data = Buffer.from(JSON.stringify(savedTerrain));

		data = pako.deflate(data, { level: 9, windowBits: 8, strategy: 1 });

		let blob = new Blob([data], { type: "application/octet-stream" });
		url = URL.createObjectURL(blob);

		let element = document.createElement("a");
		element.setAttribute("href", url);
		element.setAttribute("download", "Terrain.tfm");
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);

		console.log("Done");
	}
	static async load(file, progress) {
		const terrain = await new Promise(function(resolve, reject) {
			//var xhr = new XMLHttpRequest();
			//xhr.open("GET", url, true);
			//xhr.responseType = "blob";
			//xhr.onload = function(e) {
			//	if (this.status == 200) {
			//let blob = this.response;
			let reader = new FileReader();
			reader.addEventListener("loadend", function() {
				let buffer = pako.inflate(reader.result);
				let text = new TextDecoder("utf-8").decode(buffer);
				//TerrainSave
				let ts = JSON.parse(text);
				ts.heightData = new Float64Array(pako.inflate(ts.heightData).buffer);

				let terrain = new Terrain(ts.mapsize, ts.indiceWorldSize, ts.indiceSize, ts.baseline, ts.min, ts.max);
				terrain.setHeights(ts.heightData);
				resolve(terrain);
			});
			reader.readAsArrayBuffer(file);
			//	}
			//};
			//xhr.send();
		});
		console.log(terrain);

		return terrain;
	}
}
let url;
function getVertex(geometry, index) {
	let positions = geometry.attributes.position.array;
	let x = positions[index * 3];
	let y = positions[index * 3 + 1];
	let z = positions[index * 3 + 2];

	if (x == undefined || y == undefined || z == undefined) {
		return null;
	}

	let vertex = new THREE.Vector3(x, y, z);
	vertex.index = index * 3;

	return vertex;
}

function setNeighbours(meshes, width) {
	meshes.forEach((mesh, index) => {
		mesh.neighbour = new Array(9);

		if (index % width != 0) {
			mesh.neighbour[0] = meshes[index - width - 1];
			mesh.neighbour[3] = meshes[index - 1];
			mesh.neighbour[6] = meshes[index + width - 1];
		}

		if ((index + 1) % width != 0) {
			mesh.neighbour[2] = meshes[index - width + 1];
			mesh.neighbour[5] = meshes[index + 1];
			mesh.neighbour[8] = meshes[index + width + 1];
		}

		if (index / width > 0) {
			mesh.neighbour[1] = meshes[index - width];
		}

		if (index + width < width * width) {
			mesh.neighbour[7] = meshes[index + width];
		}

		for (let i = 0; i < mesh.neighbour.length; i++) {
			let element = mesh.neighbour[i];

			if (element == null || element < 0 || element > width * width - 1) {
				mesh.neighbour[i] = null;
			}
		}
	});
}

function newMap2dTo1d(x, y, size, mesh) {
	return mapper(x, y, size, null, []);

	function mapper(x, y, size, neighbourindex, path) {
		let index = y * size + x;

		let neighbour = neighbourindex;
		if (neighbourindex != null) path.push(neighbourindex);
		let edgeSharingNeighbours = [];

		if (mesh == null) {
			return null;
		}

		//Out of bounds
		if (x < 0) {
			if (y < 0) {
				//1 is added or subtracted to skip the first point,
				//which is shared between the two
				mesh = mesh.neighbour[0];
				return mapper(x + size - 1, y + size - 1, size, 0, path);
			} else if (y >= size) {
				mesh = mesh.neighbour[2];
				return mapper(x + size - 1, y - size + 1, size, 2, path);
			} else {
				mesh = mesh.neighbour[1];
				return mapper(x + size - 1, y, size, 1, path);
			}
		} else if (x >= size) {
			if (y < 0) {
				mesh = mesh.neighbour[6];
				return mapper(x - size + 1, y + size - 1, size, 6, path);
			} else if (y >= size) {
				mesh = mesh.neighbour[8];
				return mapper(x - size + 1, y - size + 1, size, 8, path);
			} else {
				mesh = mesh.neighbour[7];
				return mapper(x - size + 1, y, size, 7, path);
			}
		} else if (y < 0) {
			mesh = mesh.neighbour[3];
			return mapper(x, y + size - 1, size, 3, path);
		} else if (y >= size) {
			mesh = mesh.neighbour[5];
			return mapper(x, y - size + 1, size, 5, path);
		}

		//Edge sharing
		if (x == 0) {
			if (y == 0) {
				edgeSharingNeighbours.push({
					neighbour: 0,
					index: size * size - 1
				});
			} else if (y == size - 1) {
				edgeSharingNeighbours.push({
					neighbour: 2,
					index: size - 1
				});
			}
			edgeSharingNeighbours.push({
				neighbour: 1,
				index: index + size - 1
			});
		} else if (x == size - 1) {
			if (y == 0) {
				edgeSharingNeighbours.push({
					neighbour: 6,
					index: size * (size - 1)
				});
			} else if (y == size - 1) {
				edgeSharingNeighbours.push({ neighbour: 8, index: 0 });
			}
			edgeSharingNeighbours.push({
				neighbour: 7,
				index: index - (size - 1)
			});
		}
		if (y == 0) {
			edgeSharingNeighbours.push({
				neighbour: 3,
				index: index + size * (size - 1)
			});
		}
		if (y == size - 1) {
			edgeSharingNeighbours.push({
				neighbour: 5,
				index: index - size * (size - 1)
			});
		}

		return {
			affected: mesh,
			edgeSharingNeighbours: edgeSharingNeighbours,
			path: path,
			index: index
		};
	}
}

class ToolableVertex {
	constructor(vertices, meshes, min, max) {
		if (!Array.isArray(vertices)) {
			vertices = [vertices];
			meshes = [meshes];
		}
		this._vertices = vertices;
		this._meshes = meshes;
		this._min = min;
		this._max = max;
	}

	set height(value) {
		value = Math.min(this._max, Math.max(this._min, value));
		this._meshes.forEach((mesh, index) => {
			mesh.geometry.attributes.position.array[this._vertices[index].index + 2] = value;
		});
	}

	get height() {
		return this._meshes[0].geometry.attributes.position.array[this._vertices[0].index + 2];
	}

	getWorldPosition() {
		let vertex = this._vertices[0].clone();
		vertex.applyMatrix4(this._meshes[0].matrixWorld);
		return { x: vertex.x, y: vertex.y, z: vertex.z };
	}
}

export { Terrain };
