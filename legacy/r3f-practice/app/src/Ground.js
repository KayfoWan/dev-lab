import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from "three";

export default function Ground() {

    const [roughness, normal] = useLoader(TextureLoader, [
        process.env.PUBLIC_URL + "assets/CarShow/textures/terrain-roughness.jpg",
        process.env.PUBLIC_URL + "assets/CarShow/textures/terrain-normal.jpg",
    ], null, (error) => {
        console.error("Texture loading failed! Check your path in public folder:", error);
    });

    useEffect(()=>{
        console.log("Applying texture settings...");
        [normal, roughness].forEach((t)=>{
            t.wrapS = RepeatWrapping;
            t.wrapT = RepeatWrapping;
            t.repeat.set(5,5);
            t.offset.set(0,0);
            t.needsUpdate = true;
        });
        //normal.colorSpace = SRGBColorSpace;
    }, [normal, roughness])

    /* mesh.rotation.x = -Math.PI * 0.5;*/
    return(
        <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
            <planeGeometry args={[30, 30]}/>
            <MeshReflectorMaterial
                envMapIntensity={2}
                normalMap={normal}
                normalScale={[0.15, 0.15]}
                roughnessMap={roughness}
                dithering={true}
                color={[0.015, 0.015, 0.015]}
                roughness={0.25}
                blur={[1000, 400]}
                mixBlur={30}
                mixStrength={80}
                mixContrast={1}
                resolution={1024}
                mirror={2.5}
                depthScale={0.01}
                minDepthThreshold={0.9}
                maxDepthThreshold={1}
                depthToBlurRatioBias={0.25}
                debug={0}
                reflectorOffset={0.2}
            />
        </mesh>
    )
}