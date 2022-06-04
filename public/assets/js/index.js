import * as THREE from 'three';

import { GLTFLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/GLTFLoader.js"

const WIDTH = 512;
const HEIGHT = 512;

class App {
  constructor() {
    this.loadedAssets = {};
    this.searchParams=new URLSearchParams(location.search);
    this.setupPromise=new Promise((resolve,reject)=>{
      this.loadAsync().then(() => {
        this.setupThree();
        this.setupEvents();
        resolve();
      });
    });
  }
  setupThree() {
    const myCanvas = document.querySelector("#myCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas: myCanvas,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(WIDTH, HEIGHT);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.z = 5;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const PLANE_SIZE=10;
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(PLANE_SIZE,PLANE_SIZE),
      new THREE.MeshBasicMaterial({
        color:0xffffff,
      })
    );
    plane.position.z = PLANE_SIZE * 0.5 / Math.tan(camera.fov * 0.5 * THREE.MathUtils.DEG2RAD) * -1 + camera.position.z;
    scene.add(plane);
    {
      const text = this.searchParams.get("text") ?? "foo";
      console.log(text);
      const canvas = document.createElement("canvas");
      canvas.width=1024;
      canvas.height=1024;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle="#ff0000";
      ctx.fillRect(0,0,1024,1024);
      ctx.fillStyle="#00ff00";
      const DEFAULT_FONT_SIZE=512;
      let fontSize=512;
      ctx.font=`${fontSize}px sans-serif`;
      const textWidth = ctx.measureText(text).width;
      if(canvas.width<textWidth){
        fontSize=Math.floor(DEFAULT_FONT_SIZE/textWidth*canvas.width);
        ctx.font=`${fontSize}px sans-serif`;
      }
      ctx.textAlign="center";
      ctx.fillText(text,1024/2,1024/2);
      plane.material.color=null;
      plane.material.map=new THREE.CanvasTexture(canvas);
      // console.log(canvas.toDataURL());
      plane.material.needsUpdate=true;
    }


    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    const { myGltf } = this.loadedAssets;
    const cube = myGltf.scene.getObjectByName("Cube");
    {
      const textureNameList = ["--red", "--green", "--blue"].map((modifier) => `dummy-texture${modifier}`);
      for (let i = 0; i < cube.children.length; ++i) {
        const child = cube.children[i];
        const textureName = textureNameList[i];
        const texture = this.loadedAssets[textureName];
        texture.flipY = false;
        texture.needsUpdate = true;
        const material = new THREE.MeshStandardMaterial({
          map: texture,
        });
        child.material = material;
        material.needsUpdate = true;

      }


    }
    scene.add(cube);

    this.three = {
      renderer,
      scene,
      camera,
      cube,
    }
  }
  setupEvents() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.onTick();
    };
    animate();
  }
  onTick() {
    const time = performance.now() / 1000;
    this.update(time);
    this.draw();
  }
  update(time) {
    const { cube } = this.three;
    cube.rotation.x = time;
    cube.rotation.y = time;
  }
  draw() {
    const { renderer, scene, camera } = this.three;
    renderer.render(scene, camera);
    const result=renderer.domElement.toDataURL();
    // if (!this.result) {
    //   this.result = result;
    //   console.log(this.result);
    // }
    return result;
  }
  async loadTextureAsync(url, name) {
    const texture = await new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, (texture) => {
        // console.log(texture);
        resolve(texture);
      })
    });
    Object.assign(this.loadedAssets, {
      [name]: texture,
    });
    return texture;
  }
  async loadMyGltfAsync() {
    const myGltf = await new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load("/assets/models/my.glb", (gltf) => {
        // console.log(gltf);
        resolve(gltf);
      });
    });
    Object.assign(this.loadedAssets, {
      myGltf,
    });
    return myGltf;
  }
  async loadAsync() {
    const promises = [];
    for (let modifier of ["--red", "--green", "--blue"]) {
      promises.push(this.loadTextureAsync(`/assets/textures/dummy-texture${modifier}.png`, `dummy-texture${modifier}`));
    }

    promises.push(this.loadMyGltfAsync());
    return Promise.all(promises);
  }
}


// console.log(THREE);


window.app = new App();





