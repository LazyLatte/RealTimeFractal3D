import {vs} from './vs.glsl';

export const createFractalShdaer = (gl: WebGL2RenderingContext, fs: string): WebGLProgram => {
  
  const initShader = (type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER', source: string) => {
    const shader = gl.createShader(gl[type]);

    if (!shader) {
      throw new Error('Unable to create a shader.');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`An error occurred during compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }
  const vertexShader = initShader("VERTEX_SHADER", vs);
  const fragmentShader = initShader("FRAGMENT_SHADER", fs);
  const program = gl.createProgram();

  if (!program) {
      throw new Error('Unable to create the program.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Unable to link the shaders: ${gl.getProgramInfoLog(program)}`);
  }

  gl.useProgram(program);
  const positions = [
      -1, -1,
      1, -1,
      1, 1,
      -1, 1
  ];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const index = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(index, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(index);

  const iRes_location = gl.getUniformLocation(program, "iResolution");
  gl.uniform2f(iRes_location, gl.canvas.width, gl.canvas.height);
  return program;
}

