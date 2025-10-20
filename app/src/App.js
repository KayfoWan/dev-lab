import React, {Suspense} from "react";
import { Canvas } from "@react-three/fiber";
import "./style.css";
import { CubeCamera, Environment, OrbitControls, PerspectiveCamera, SpotLight } from "@react-three/drei";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Ground from "./Ground";
import Car from "./Car";
import Rings from "./Rings";
import { Boxes } from "./Boxes";

function CarShow() {
  return(
    <>
    <OrbitControls target={[0, 0, 0.35]} maxPolarAngle={1.45}/>
    <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]}/>

    {/* let color = new Color(0,0,0);*/}
    <color args={[0,0,0]} attach={"background"}/>

    {
      /*
      let spotlight = new Spotlight();
      spotlight.intensity = 1.5;
      spotlight.position.set(...);
      */
    }

    <SpotLight
      color={[1, 0.25, 0.7]}
      intensity={150}
      angle={2}
      penumbra={0.5}
      position={[3, 4, 0]}
      distance={40}
      castShadow
      shadow-bias={-0.0001}
    />

    <SpotLight
      color={[0.14, .05, 1]}
      intensity={200}
      angle={2}
      penumbra={.5}
      position={[-3, 4, 0]}
      distance={40}
      castShadow
      shadow-bias={-0.0001}
    />

    <CubeCamera resolution={256} frames={Infinity}>
      {(texture)=>(
        <>
          <Environment map={texture}/>
          <Car />
        </>
      )}
    </CubeCamera>

    <Boxes/>
    <Rings/>
    <Ground/>

    <EffectComposer>
        {
          /*
          <DepthOfField focusDistance={0.0035} focalLength={0.01} bokehScale={3} height={400}/>
          */
        }
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={.15}
          width={300}
          height={300}
          kernalSize={5}
          luminanceThreshold={0.95}
          luminanceSmoothing={0.025}
        />

        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0012]}
        />
    </EffectComposer>

    {
    /*
    <mesh>
      <boxGeometry args={[1, 1, 1]}/>
      <meshBasicMaterial color={'red'}/>
    </mesh>
    */
    }
    </>
  )
}

function App() {
  return(
    <Suspense fallback={null}>
      <Canvas shadows>
        <CarShow/>
      </Canvas>
    </Suspense>
  )
}

export default App;