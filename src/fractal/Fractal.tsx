import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { initEps, initPos} from './init';
import Control from './control';
import StateDisplay from './state-display';
import Setting, {SettingContent, useSettingReducer} from './setting';
import useRender, {fractalDE_JS} from './shader';
import { vec3 } from 'gl-matrix';
const Fractal = () => {
    const fractalRef = useRef<HTMLDivElement>(null);
    const render = useMemo(() => useRender(), []);
    const [eps, setEps] = useState(initEps);
    const [camera, setCamera] = useState(initPos);
    const [state, dispatch] = useSettingReducer();
    const {fractal, color, julia, params} = state;
    const paramValues = Array(3).fill(0).map((_, i) => i < params.length ? params[i].value : 0) as vec3; // pad to vec3

    const draw = useCallback(() => {
        const rgb = vec3.fromValues(color.r, color.g, color.b);
        vec3.scale(rgb, rgb, 1 / 255);
        const cvs = render(fractal, paramValues, camera, julia[0], julia[1], rgb, eps);
        fractalRef.current?.append(cvs);
    }, [state, eps, camera])
    useEffect(() => {
        draw();
    }, [draw])
    return (
        <div ref={fractalRef} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'}}>
          <StateDisplay camera={camera} eps={eps}/>
          <Control fractalDE={(p) => fractalDE_JS(fractal, p, paramValues, julia[0], julia[1])} setCamera={setCamera} setEps={setEps}/>
          <Setting>
            <SettingContent setting={state} dispatch={dispatch}/>
          </Setting>
        </div>
    )
}

export default Fractal;