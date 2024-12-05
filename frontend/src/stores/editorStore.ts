import { proxy } from "valtio";

const editorStore = proxy({
  color: "EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
});
export default editorStore;
