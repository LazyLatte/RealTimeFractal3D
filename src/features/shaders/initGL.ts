import { GLError} from "..";

const canvas = document.createElement("canvas");
canvas.id = "fractal-canvas";
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
canvas.addEventListener('webglcontextlost', (_) => {
  alert("webgl context lost!");
  window.location.reload();
}, false); 

export const initGL = () => {
    const gl = canvas.getContext('webgl2', {alpha: false, depth: false, antialias: false});
    if(!gl){
      if (typeof WebGL2RenderingContext !== 'undefined') {
        throw new GLError('Unable to initialize WebGL2. Might due to previous Context Lost!');
      } else {
        throw new Error('No WebGL2 support on your browser'); 
      }
    }
  
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}