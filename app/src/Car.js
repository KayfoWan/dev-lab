import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";

export default function Car() {
    const gltf = useGLTF(
        process.env.PUBLIC_URL + "assets/CarShow/models/chevy/scene.gltf"
        //process.env.PUBLIC_URL + "assets/CarShow/models/ferrari/scene.gltf"
    );

    useEffect(()=>{
        gltf.scene.scale.set(0.005, 0.005, 0.005);
        gltf.scene.position.set(0, -0.035, 0);
        gltf.scene.traverse((object)=>{
            if(object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 20;
            }
        });
    },[gltf]);

    useFrame((state, delta)=>{
        let t = state.clock.getElapsedTime();

        let group = gltf.scene.children[0].children[0].children[0];
        group.children[0].rotation.x = t * 2;
        group.children[2].rotation.x = t * 2;
        group.children[4].rotation.x = t * 2;
        group.children[6].rotation.x = t * 2;
    });

    return <primitive object={gltf.scene}/>;
}