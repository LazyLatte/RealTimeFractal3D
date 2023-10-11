import { useEffect, useRef, useCallback, useMemo } from 'react';
import Control from './control';
import StateDisplay from './state-display';
import Setting, {SettingContent, SettingFoot, useSettingReducer} from './setting';
import useRender from './webgl';
const Fractal = () => {
  const render = useMemo(() => useRender(), []);
  const fractalRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useSettingReducer();
  const {fractal, neon, color, juliaEnabled, julia, params, camera, front, eps, ray_multiplier, far_plane} = state;
  console.log(camera[0], camera[1], camera[2]);
  console.log(front[0], front[1], front[2]);
  const draw = useCallback(() => {
    const cvs = render(fractal, params.map(e => e.value), camera, front, juliaEnabled, julia, neon, [color.r / 255, color.g / 255, color.b / 255], eps, ray_multiplier, far_plane);
    fractalRef.current?.append(cvs);
    return cvs;
  }, [state]);
  useEffect(() => {
      draw();
  }, [draw]);
  return (
    <div ref={fractalRef} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'}}>
      <StateDisplay camera={camera} eps={eps} ray_multiplier={ray_multiplier}/>
      <Control dispatch={dispatch}/>
      <Setting>
        <SettingContent setting={state} dispatch={dispatch}/>
        <SettingFoot draw={draw} dispatch={dispatch}/>
      </Setting>
    </div>
  )
}

export default Fractal;