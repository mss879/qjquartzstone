import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type RoomId = "kitchen" | "bathroom" | "living";
export type Zone = "counter" | "floor" | "wall";
export type RoomHandle = { setSurface: (zone: Zone, url: string | null) => Promise<void>; resize: () => void; dispose: () => void };

const slabWidth = 3.2, slabHeight = 1.6;
const originals: Record<Zone, string> = { counter: "#e6e2d9", floor: "#b9a48b", wall: "#ebe8e0" };
const paint = (color: string, roughness = .72, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const palette = { white: paint("#f4f1ea"), oak: paint("#6f5340", .55), walnut: paint("#47342a", .5), sage: paint("#5d6656", .55), ink: paint("#2b2c28", .5), clay: paint("#9a634c", .85), fabric: paint("#b3aa9a", .95), linen: paint("#d8d0c1", .95), chrome: paint("#d7d7d2", .16, 1), brass: paint("#a98a58", .3, 1) };
const ceiling = new THREE.MeshStandardMaterial({ color: "#f4f1ea", emissive: "#f4f1ea", emissiveIntensity: .62, roughness: 1 });
const daylight = new THREE.MeshBasicMaterial({ color: "#fbf9f2" });

// World-scale UVs keep veining at true slab proportions and continuous across a waterfall edge.
function worldUVs(geometry: THREE.BufferGeometry, offset: THREE.Vector3) {
  const position = geometry.getAttribute("position"), normal = geometry.getAttribute("normal"), uv = geometry.getAttribute("uv");
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) + offset.x, y = position.getY(i) + offset.y, z = position.getZ(i) + offset.z;
    if (Math.abs(normal.getY(i)) > .5) uv.setXY(i, x / slabWidth, z / slabHeight);
    else if (Math.abs(normal.getX(i)) > .5) uv.setXY(i, z / slabWidth, y / slabHeight);
    else uv.setXY(i, x / slabWidth, y / slabHeight);
  }
}

type Build = {
  zones: Record<Zone, THREE.MeshPhysicalMaterial>;
  box: (size: [number, number, number], at: [number, number, number], material: THREE.Material, castShadow?: boolean) => THREE.Mesh;
  round: (top: number, bottom: number, height: number, at: [number, number, number], material: THREE.Material) => THREE.Mesh;
  shell: (width: number, depth: number, height: number, centreZ: number) => void;
};

// A bright panel with slim frames on a side wall, reading as daylight beyond the room.
function sideWindow(b: Build, wallX: number, centreZ: number, width: number, bottom: number, height: number) {
  const x = wallX + (wallX < 0 ? .012 : -.012), middle = bottom + height / 2;
  b.box([.006, height, width], [x, middle, centreZ], daylight, false);
  for (const z of [centreZ - width / 2, centreZ - width / 6, centreZ + width / 6, centreZ + width / 2]) b.box([.05, height + .05, .035], [x, middle, z], palette.ink, false);
  for (const y of [bottom, bottom + height]) b.box([.05, .035, width], [x, y, centreZ], palette.ink, false);
}

function stool(b: Build, x: number, z: number) {
  b.round(.17, .17, .05, [x, .72, z], palette.walnut);
  b.round(.018, .018, .7, [x, .36, z], palette.brass);
  b.round(.15, .16, .02, [x, .01, z], palette.brass);
}

function pendant(b: Build, x: number, z: number, height = 1.72) {
  b.round(.004, .004, 2.85 - height, [x, (2.85 + height) / 2, z], palette.ink);
  b.round(.05, .13, .16, [x, height, z], palette.ink);
}

function plant(b: Build, x: number, y: number, z: number) {
  b.round(.09, .07, .18, [x, y + .09, z], palette.clay);
  for (const [dx, dz, tilt] of [[.05, 0, .35], [-.05, .03, -.3], [0, -.05, .1]]) {
    const leaf = b.box([.05, .36, .012], [x + dx, y + .34, z + dz], paint("#5b6b4d", .7));
    leaf.rotation.z = tilt;
  }
}

function kitchen(b: Build) {
  b.shell(6.8, 5.6, 2.9, .4);
  sideWindow(b, -3.4, .9, 2.7, .95, 1.55);
  // Back run
  b.box([4.9, .86, .62], [.5, .43, -2.09], palette.sage);
  b.box([4.94, .04, .66], [.5, .88, -2.07], b.zones.counter);
  b.box([.8, .012, .5], [1.25, .906, -2.07], palette.ink);
  b.box([1.9, .72, .34], [-.95, 2.03, -2.2], palette.sage);
  b.box([1.25, .72, .34], [2.33, 2.03, -2.2], palette.sage);
  b.box([.74, .42, .42], [1.25, 2.08, -2.16], palette.chrome);
  b.box([.95, 2.5, .64], [-2.45, 1.25, -2.08], palette.oak);
  b.box([.95, .01, .001], [-2.45, 1.3, -1.76], palette.ink, false);
  b.box([.56, .03, .4], [-.55, .905, -2.07], palette.ink);
  b.round(.014, .014, .3, [-.55, 1.05, -2.27], palette.brass);
  b.box([.02, .02, .2], [-.55, 1.2, -2.18], palette.brass);
  // Waterfall island
  b.box([2.5, .84, .86], [.1, .42, .55], palette.oak);
  b.box([3, .05, 1.14], [.1, .885, .55], b.zones.counter);
  b.box([.05, .86, 1.14], [-1.375, .43, .55], b.zones.counter);
  b.box([.05, .86, 1.14], [1.575, .43, .55], b.zones.counter);
  [-.75, .1, .95].forEach(x => { stool(b, x, 1.38); pendant(b, x, .55); });
  b.round(.14, .09, .1, [.7, .96, .4], palette.white);
  plant(b, -.8, .91, -2.15);
}

function bathroom(b: Build) {
  b.shell(4.8, 4.4, 2.7, .3);
  sideWindow(b, -2.4, 1.05, 1.5, 1.25, 1.05);
  // Floating vanity
  b.box([2.2, .4, .54], [-.55, .6, -1.61], palette.walnut);
  b.box([2.3, .05, .6], [-.55, .825, -1.58], b.zones.counter);
  b.box([.05, .28, .6], [-1.675, .685, -1.58], b.zones.counter);
  b.box([.05, .28, .6], [.575, .685, -1.58], b.zones.counter);
  b.round(.23, .17, .12, [-.55, .91, -1.56], palette.white);
  b.round(.19, .16, .02, [-.55, .965, -1.56], paint("#d8d4cb", .5));
  b.round(.012, .012, .22, [-.55, .96, -1.8], palette.chrome);
  b.box([.016, .016, .16], [-.55, 1.07, -1.74], palette.chrome);
  b.box([1.9, 1, .02], [-.55, 1.56, -1.87], new THREE.MeshStandardMaterial({ color: "#dfe5e3", metalness: 1, roughness: .06 }), false);
  // Walk-in shower
  b.box([.015, 2.05, 1.5], [1.05, 1.03, -1.13], new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: .14, roughness: .03, metalness: 0 }), false);
  b.box([.03, 2.05, .03], [1.05, 1.03, -.38], palette.ink);
  b.round(.1, .1, .02, [1.7, 2.2, -1.35], palette.chrome);
  b.round(.012, .012, .34, [1.7, 2.36, -1.35], palette.chrome);
  b.box([.8, .06, 2], [1.75, .03, -.85], palette.ink, false);
  // Details
  b.box([.03, .03, .8], [-2.3, 1.35, .3], palette.brass);
  b.box([.03, .9, .62], [-2.31, .95, .3], palette.linen);
  b.round(.16, .16, .44, [-1.9, .22, 1], palette.oak);
  plant(b, .3, .85, -1.65);
}

function living(b: Build) {
  b.shell(7, 5.6, 2.9, .4);
  sideWindow(b, -3.5, .35, 3.2, 1.05, 1.5);
  // Media wall
  b.box([3.4, .4, .46], [.4, .44, -2.1], palette.walnut);
  b.box([3.44, .04, .5], [.4, .66, -2.08], b.zones.counter);
  b.box([1.8, 1, .04], [.4, 1.62, -2.3], palette.ink, false);
  // Sofa
  b.box([1, .36, 2.9], [-2.6, .3, .35], palette.fabric);
  b.box([.28, .42, 2.9], [-3, .68, .35], palette.fabric);
  b.box([1, .46, .24], [-2.6, .4, 1.92], palette.fabric);
  b.box([1, .46, .24], [-2.6, .4, -1.22], palette.fabric);
  b.box([.14, .4, .46], [-2.78, .68, .9], palette.clay);
  b.box([.14, .4, .46], [-2.78, .68, -.2], palette.linen);
  // Coffee table and rug
  b.box([3.4, .012, 3.2], [-1.2, .006, .4], palette.linen, false);
  b.box([1.5, .045, .85], [-.9, .4, .4], b.zones.counter);
  for (const [x, z] of [[-1.55, .05], [-.25, .05], [-1.55, .75], [-.25, .75]]) b.box([.04, .38, .04], [x, .19, z], palette.ink);
  b.round(.13, .08, .09, [-1.05, .47, .35], palette.clay);
  // Armchair, lamp, side table
  b.box([.74, .3, .74], [1.62, .28, .3], palette.clay);
  b.box([.14, .46, .74], [1.95, .66, .3], palette.clay);
  b.round(.26, .26, .04, [1.95, .56, -.85], b.zones.counter);
  b.round(.022, .022, .54, [1.95, .27, -.85], palette.brass);
  b.round(.17, .17, .02, [1.95, .01, -.85], palette.brass);
  b.round(.014, .014, 1.55, [-2.9, .78, -1.6], palette.brass);
  b.round(.14, .2, .24, [-2.9, 1.62, -1.6], palette.linen);
  plant(b, 1.9, .68, -2.12);
}

const rooms: Record<RoomId, { build: (b: Build) => void; camera: [number, number, number]; target: [number, number, number] }> = {
  kitchen: { build: kitchen, camera: [.55, 1.62, 5.5], target: [.1, .92, -.4] },
  bathroom: { build: bathroom, camera: [.05, 1.4, 3.05], target: [-.15, 1, -1.2] },
  living: { build: living, camera: [.7, 1.5, 5.6], target: [-.3, .72, -.2] },
};

export function createRoom(canvas: HTMLCanvasElement, room: RoomId, { interactive, onRender }: { interactive: boolean; onRender?: () => void }): RoomHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ece9e1");
  const environment = new THREE.PMREMGenerator(renderer);
  scene.environment = environment.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .5;

  const zone = (name: Zone) => new THREE.MeshPhysicalMaterial({ color: originals[name], roughness: .6, clearcoat: 0 });
  const zones = { counter: zone("counter"), floor: zone("floor"), wall: zone("wall") };
  const b: Build = {
    zones,
    box(size, at, material, castShadow = true) {
      const geometry = new THREE.BoxGeometry(...size);
      const offset = new THREE.Vector3(...at);
      worldUVs(geometry, offset);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(offset);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    },
    round(top, bottom, height, at, material) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 48), material);
      mesh.position.set(...at);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    },
    shell(width, depth, height, centreZ) {
      const backZ = centreZ - depth / 2;
      b.box([width, .1, depth], [0, -.05, centreZ], zones.floor, false);
      b.box([width, height, .1], [0, height / 2, backZ - .05], zones.wall, false);
      b.box([.1, height, depth], [-width / 2 - .05, height / 2, centreZ], zones.wall, false);
      b.box([.1, height, depth], [width / 2 + .05, height / 2, centreZ], zones.wall, false);
      b.box([width, .1, depth], [0, height + .05, centreZ], ceiling, false);
    },
  };
  const config = rooms[room];
  config.build(b);

  scene.add(new THREE.HemisphereLight("#fff8ee", "#b9ad9a", 1.15));
  const sun = new THREE.DirectionalLight("#fff0dc", 2.1);
  sun.position.set(-3.5, 6, 7);
  sun.target.position.set(0, .4, -.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 18 });
  sun.shadow.normalBias = .02;
  sun.shadow.radius = 7;
  scene.add(sun, sun.target);

  const camera = new THREE.PerspectiveCamera(38, 1, .1, 40);
  camera.position.set(...config.camera);
  let frame = 0;
  const render = () => {
    frame = 0;
    renderer.render(scene, camera);
    onRender?.();
  };
  const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };

  const controls = interactive ? new OrbitControls(camera, canvas) : null;
  const target = new THREE.Vector3(...config.target);
  camera.lookAt(target);
  if (controls) {
    controls.target.copy(target);
    Object.assign(controls, { enablePan: false, enableDamping: false, minDistance: 2.6, maxDistance: 7, minPolarAngle: 1.05, maxPolarAngle: 1.53 });
    const azimuth = Math.atan2(config.camera[0] - config.target[0], config.camera[2] - config.target[2]);
    controls.minAzimuthAngle = azimuth - .5;
    controls.maxAzimuthAngle = azimuth + .5;
    controls.addEventListener("change", requestRender);
    controls.update();
  }

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { clientWidth: width, clientHeight: height } = parent;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 1 ? 58 : 38; // Portrait phones need a wider view to keep the room in frame.
    camera.updateProjectionMatrix();
    requestRender();
  };
  const observer = new ResizeObserver(resize);
  if (canvas.parentElement) observer.observe(canvas.parentElement);
  resize();

  const loader = new THREE.TextureLoader();
  const applied: Partial<Record<Zone, THREE.Texture>> = {};
  const setSurface = async (name: Zone, url: string | null) => {
    const material = zones[name];
    const texture = url ? await loader.loadAsync(url) : null;
    applied[name]?.dispose();
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      applied[name] = texture;
    } else delete applied[name];
    material.map = texture;
    material.color.set(texture ? "#ffffff" : originals[name]);
    material.roughness = texture ? .2 : .6;
    material.clearcoat = texture ? .55 : 0;
    material.clearcoatRoughness = .14;
    material.needsUpdate = true;
    requestRender();
  };

  return {
    setSurface, resize,
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls?.dispose();
      scene.traverse(node => { if (node instanceof THREE.Mesh) node.geometry.dispose(); });
      Object.values(applied).forEach(texture => texture.dispose());
      Object.values(zones).forEach(material => material.dispose());
      environment.dispose();
      renderer.dispose();
    },
  };
}
