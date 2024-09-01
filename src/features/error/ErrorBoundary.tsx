import {useRouteError} from "react-router-dom";

const style: React.CSSProperties = {
  height: '100%', 
  width: '100%', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center',
  whiteSpace: 'pre-wrap'
}

export class GLError extends Error {
  constructor(msg: string) {
      super(msg);
      this.name = 'GLError';
      Object.setPrototypeOf(this, GLError.prototype);
      
  }
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  if(error instanceof GLError){
    return (
      <div style={style}>
        <h1 style={{textAlign: 'center'}}>{error.message}</h1>
        <h2 style={{marginBottom: 0}}># Try the following tips after the context restore #</h2>
        <ol>
          <li><h3>Use higher eps and ray_multiplier when moving the camera.</h3></li>
          <li><h3>Once you find your desired location, you can decrease eps and ray_multiplier to get detailed scene.</h3></li>
        </ol>
      </div>
    )
  }

  return <h1 style={style}>😥{(error as Error).message}</h1>;
}
