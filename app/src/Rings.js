import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";

const colorRed = new Color(1, 0.1, 0.3);
const colorBlue = new Color(0.1, 0.3, 1);

const INTENSITY = 0.5;

export default function Rings() {
    const itemRef = useRef([]);

    useFrame((state)=>{
        for(let i = 0; i < itemRef.current.length; i++) {
            let mesh = itemRef.current[i];

            if(!mesh || !mesh.material) continue;

            let z = (i - 7) * 3.5;
            mesh.position.set(0,0,-z);

            let dist = Math.abs(z);
            mesh.scale.set(1 - dist * 0.04, 1 - dist * 0.04, 1 - dist * 0.04);

            let colorScale = 1;
            if(dist > 2) {
                colorScale = 1 - (Math.min(dist, 12) - 2) / 10;
            }
            colorScale *= INTENSITY;

            if(i % 2 == 1) {
                mesh.material.emissive.set(colorRed).multiplyScalar(colorScale);
            } else {
                mesh.material.emissive.set(colorBlue).multiplyScalar(colorScale);
            }

            mesh.material.needsUpdate = true;
        }
    });

    return(
        <>
        {
            new Array(14).fill(0).map((v,i)=>(
                
                <mesh
                    castShadow
                    receiveShadow
                    position={[0,0,0]}
                    key={i}
                    ref={(el)=>{itemRef.current[i] = el}}
                >
                    <torusGeometry args={[3.35, 0.05, 16, 100]}/>
                    <meshStandardMaterial emissive={[0.5, 0.5, 0.5]} color={[0, 0, 0]}/>
                </mesh>
            ))
        }
        </>
    )
}