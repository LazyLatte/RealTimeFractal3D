import { useState, useEffect, useRef, useCallback } from 'react';
import { initEps, initPowers, initPos, initColor } from './init';
import Control from './control';
import Setting from './setting';
import StateDisply from './state-display';
import useRender from './kernel';


const Mandelbulb = () => {
    const mandelbulbRef = useRef<HTMLDivElement>(null);
    const canvasWidth = Math.floor(window.innerWidth * window.devicePixelRatio);
    const canvasHeight = Math.floor(window.innerHeight * window.devicePixelRatio);
    const render = useRender(canvasWidth, canvasHeight);
    // set power = -1 to disable
    const [power_1, setPower_1] = useState(initPowers[0]);
    const [power_2, setPower_2] = useState(initPowers[1]);
    const [power_3, setPower_3] = useState(initPowers[2]);
    const [eps, setEps] = useState(initEps);
    const [camera, setCamera] = useState(initPos);
    const [color, setColor] = useState(initColor);

    const draw = useCallback(() => {
        const r = color.r / 255;
        const g = color.g / 255;
        const b = color.b / 255;
        render(canvasWidth, canvasHeight, eps, power_1, power_2, power_3, r, g, b, camera[0], camera[1], camera[2]);
        mandelbulbRef.current?.append(render.canvas);
        const cvs = document.querySelector('canvas');
        if(cvs){
            cvs.style.width = `${window.innerWidth}px`
            cvs.style.height = `${window.innerHeight}px`
        }
    }, [power_1, power_2, power_3, eps, color, camera])
    useEffect(() => {
        draw();
    }, [draw])
    return (
        <div ref={mandelbulbRef} style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden'}}>
          <Control powers={[power_1, power_2, power_3]} setCamera={setCamera} setEps={setEps}/>
          <Setting color={color} setColor={setColor} powerStates={[[power_1, setPower_1], [power_2, setPower_2], [power_3, setPower_3]]} />
          <StateDisply camera={camera} eps={eps}/>
        </div>
    )
}

export default Mandelbulb;