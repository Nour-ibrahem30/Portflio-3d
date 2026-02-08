import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function AnimatedSphere() {
  const meshRef = useRef()
  
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#00f5ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function Scene3D({ currentSection }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <AnimatedSphere />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

export default Scene3D
