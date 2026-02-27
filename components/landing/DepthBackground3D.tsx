"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function DepthBackground3D() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const farX = useSpring(pointerX, { stiffness: 40, damping: 28, mass: 1.4 });
  const farY = useSpring(pointerY, { stiffness: 40, damping: 28, mass: 1.4 });
  const nearX = useSpring(pointerX, { stiffness: 65, damping: 22, mass: 1.1 });
  const nearY = useSpring(pointerY, { stiffness: 65, damping: 22, mass: 1.1 });
  const gridRotateX = useSpring(pointerY, { stiffness: 55, damping: 23, mass: 1.2 });
  const gridRotateY = useSpring(pointerX, { stiffness: 55, damping: 23, mass: 1.2 });

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const nx = (event.clientX / window.innerWidth - 0.5) * 24;
      const ny = (event.clientY / window.innerHeight - 0.5) * 18;
      pointerX.set(nx);
      pointerY.set(ny);
    }

    function onDeviceOrientation(event: DeviceOrientationEvent) {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      pointerX.set((gamma / 45) * 12);
      pointerY.set((beta / 90) * 10);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("deviceorientation", onDeviceOrientation);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
    };
  }, [pointerX, pointerY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ x: farX, y: farY }}
        className="absolute left-[6%] top-[12%] h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <motion.div
        style={{ x: nearX, y: nearY }}
        className="absolute right-[8%] top-[20%] h-56 w-56 rounded-full bg-fuchsia-500/18 blur-3xl"
      />
      <motion.div
        style={{ x: farX, y: nearY }}
        className="absolute left-[32%] bottom-[16%] h-64 w-64 rounded-full bg-blue-500/14 blur-3xl"
      />

      <motion.div
        style={{
          rotateX: gridRotateX,
          rotateY: gridRotateY,
          x: farX,
          y: farY
        }}
        className="absolute left-1/2 top-[30%] h-[62vh] w-[150vw] -translate-x-1/2 rounded-[3rem] border border-cyan-300/20 bg-cyan-500/[0.03]"
      >
        <div
          className="absolute inset-0 rounded-[3rem]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(34,211,238,0.15), rgba(34,211,238,0) 42%), repeating-linear-gradient(90deg, rgba(34,211,238,0.18) 0px, rgba(34,211,238,0.18) 1px, transparent 1px, transparent 42px), repeating-linear-gradient(0deg, rgba(34,211,238,0.18) 0px, rgba(34,211,238,0.18) 1px, transparent 1px, transparent 42px)"
          }}
        />
      </motion.div>

      <motion.div
        style={{ x: nearX, y: farY, rotateX: gridRotateX, rotateY: gridRotateY }}
        className="absolute right-[12%] top-[34%] h-36 w-28 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-lg"
      />
      <motion.div
        style={{ x: farX, y: nearY, rotateX: gridRotateX, rotateY: gridRotateY }}
        className="absolute left-[14%] top-[40%] h-28 w-24 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-lg"
      />
    </div>
  );
}
