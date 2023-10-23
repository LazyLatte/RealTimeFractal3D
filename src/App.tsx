import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Fractal, {ErrorBoundary} from './fractal';
import './App.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Fractal />} errorElement={<ErrorBoundary/>}/>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
