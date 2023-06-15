export default [
  {
    // Cubic Environment Map
    name: "environmentMapTex",
    type: "cubeTex",
    path: [
      "./textures/environmentMap/px.jpg",
      "./textures/environmentMap/nx.jpg",
      "./textures/environmentMap/py.jpg",
      "./textures/environmentMap/ny.jpg",
      "./textures/environmentMap/pz.jpg",
      "./textures/environmentMap/nz.jpg",
    ],
  },

  // Floor Texture Maps
  {
    name: "grassColorTex",
    type: "texture",
    path: "./textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTex",
    type: "texture",
    path: "./textures/dirt/normal.jpg",
  },
  // Imported Fox GLTF Model
  {
    name: "foxModel",
    type: "gltfModel",
    path: "./models/Fox/glTF/Fox.gltf",
  },
  // Portal
  {
    name: "portalModel",
    type: "gltfModel",
    path: "./models/Portal/portal.glb",
  },
  {
    name: "portalTexture",
    type: "texture",
    path: "./models/Portal/portal.jpg",
  },
  {
    name: "tubModel",
    type: "gltfModel",
    path: "./models/Tub/tub.glb",
  }
];
