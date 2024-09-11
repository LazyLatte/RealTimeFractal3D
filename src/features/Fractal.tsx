import { useEffect, useRef, useCallback, useMemo } from 'react';
import Control from './control';
import StateDisplay from './state-display';
import Save from './save';
import Setting, {useSettingReducer} from './setting';
import { initGL, toggleShader} from './shaders';

const Fractal = () => {
  const gl = useMemo(() => initGL(), []);
  const fractalRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useSettingReducer();
  const {fractal, params, juliaEnabled, julia, camera, front, eps, ray_multiplier, style} = state;
  const render = useMemo(() => toggleShader(gl, fractal), [fractal]);

  const draw = useCallback(() => {
    render(params, juliaEnabled, julia, camera, front, eps, ray_multiplier, style);
    fractalRef.current?.append(gl.canvas as HTMLCanvasElement);
    return gl.canvas as HTMLCanvasElement;
  }, [state]);
  
  useEffect(() => {
      draw();
  }, [draw]);
  
  //return <Lighting setting={state} dispatch={dispatch}/>;
  
  return (
    <div ref={fractalRef} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'}}>
      <StateDisplay camera={camera} eps={eps} ray_multiplier={ray_multiplier}/>
      <Control dispatch={dispatch}/>
      <Save draw={draw}/>
      <Setting setting={state} dispatch={dispatch}/>
    </div>
  );
}

export default Fractal;