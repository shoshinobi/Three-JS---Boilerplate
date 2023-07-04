import * as THREE from "three";
import Experience from "./Experience";

// Post Processing
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
//

// Post Effects
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// Shader Passes
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
// Anti Aliasing
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

export default class Renderer {
  
  constructor() {
    this.usePostprocess = true;
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    // Debug
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Renderer");
    }

    this.setInstance();
    this.setPostProcess();
    this.resize();
  }

  /*-------------------------------- Methods ------------------------------*/

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });

    //Lighting
    this.instance.physicallyCorrectLights = true;

    // Gamma Correction
    this.instance.outputColorSpace = THREE.SRGBColorSpace;

    // Tone Mapping (ACEC Filmic, sRGB, Uncharted, Cineon, None, Custom, etc.)
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.75;

    // Shadows
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    // Cavas Sizes
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Background Color
    this.instance.setClearColor(0x181513, 1);

    // Debug Parameters
    if (this.debug.active) {
      // Background Clear Color
      this.instance.clearColor = "0x000000";
      this.debugFolder
        .addColor(this.instance, "clearColor")
        .name("BG Color")
        .onChange(() => {
          this.instance.setClearColor(this.instance.clearColor, 1);
        });
    }
  }

  // Post Processing

  setPostProcess() {
    // Render Target
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        samples: this.instance.getPixelRatio() === 1 ? 2 : 0,
        alpha: true,
      }
    );

    // Effect Composer
    this.effectComposer = new EffectComposer(this.instance);

    // Render Pass
    const renderPass = new RenderPass(this.scene, this.camera.instance);
    this.effectComposer.addPass(renderPass);

    // RGB Shift Pass
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.enabled = true;
    rgbShiftPass.uniforms.amount.value = 0.0015;
    rgbShiftPass.uniforms.angle.value = 0.0;
    this.effectComposer.addPass(rgbShiftPass);

    // Unreal Bloom Pass
    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      0.25,
      0.2,
      0.5
    );
    unrealBloomPass.enabled = true;
    this.effectComposer.addPass(unrealBloomPass);

    // Gamma Correction Pass
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    gammaCorrectionPass.enabled = true;
    this.effectComposer.addPass(gammaCorrectionPass);

    /*------- Tint Shader pass -------*/

    const TintShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTint: { value: null },
      },
      vertexShader: `
      varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
      }
      `,
      fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec3 uTint;

      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        color.rgb += uTint;
        gl_FragColor = color;

      }
      `,
    };

    const tintShaderPass = new ShaderPass(TintShader);
    tintShaderPass.uniforms["uTint"].value = new THREE.Vector3(0.1, 0.1, 0.2);
    tintShaderPass.enabled = true;
    this.effectComposer.addPass(tintShaderPass);

    /*------- Displacement Pass -------*/

    const DisplacementShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: null },
      },
      vertexShader: `
      varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
      }
      `,
      fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime;

      varying vec2 vUv;
      
      void main() {
        vec2 newUV = vec2(
          vUv.x + sin(vUv.y * 1.0 + uTime) * 0.01,
          vUv.y + sin(vUv.x * 10.0 + uTime) * 0.01
        );


        vec4 color = texture2D(tDiffuse, newUV);
        gl_FragColor = color;

      }
      `,
    };

    this.displacementPass = new ShaderPass(DisplacementShader);
    this.displacementPass.uniforms.uTime.value = 0;
    this.displacementPass.enabled = true;
    this.effectComposer.addPass(this.displacementPass);

    /*------- Anti Aliasing -------*/

    console.log(
      "WeGL2 Capable Browser : " + this.instance.capabilities.isWebGL2
    );
    if (
      this.instance.getPixelRatio() === 1 &&
      !this.instance.capabilities.isWebGL2
    ) {
      const smaaPass = new SMAAPass();
      smaaPass.enabled = true;
      this.effectComposer.addPass(smaaPass);
      console.log("SMAA Pass Added");
    }

    /*------------------ Debug -----------------*/

    if (this.debug.active) {
      this.debugFolder.add(this, "usePostprocess").name("Post Process");
      this.debugFolder.add(gammaCorrectionPass, "enabled").name("Gamma Pass");
      this.debugFolder.add(rgbShiftPass, "enabled").name("RGB Shift Pass");
      this.debugFolder.add(unrealBloomPass, "enabled").name("Bloom Pass");
      this.debugFolder
        .add(unrealBloomPass, "strength")
        .name("Bloom strength")
        .min(0)
        .max(2)
        .step(0.001);
      this.debugFolder
        .add(unrealBloomPass, "radius")
        .name("Bloom radius")
        .min(0)
        .max(2)
        .step(0.001);
      this.debugFolder
        .add(unrealBloomPass, "threshold")
        .name("Bloom threshold")
        .min(0)
        .max(2)
        .step(0.001);
      this.debugFolder.add(tintShaderPass, "enabled").name("Tint Pass");
      this.debugFolder
        .addColor(tintShaderPass.uniforms["uTint"], "value")
        .name("Tint Color")
        .onChange(() => {
          tintShaderPass.uniforms["uTint"].value = new THREE.Vector3(
            tintShaderPass.uniforms["uTint"].value.r,
            tintShaderPass.uniforms["uTint"].value.g,
            tintShaderPass.uniforms["uTint"].value.b
          );
        });
    }
  }

  /*--------------- END OF POST PROCESSING --------------*/

  resize() {
    // Renderer
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Effect Composer
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (this.usePostprocess) {
      // Update displacement pass
      this.displacementPass.uniforms.uTime.value += 0.01;

      this.effectComposer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
