"use client";

import { motion } from "framer-motion";

export function DepthBackground3D() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 md:hidden bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.22),transparent_44%),radial-gradient(circle_at_85%_75%,rgba(217,70,239,0.18),transparent_42%)]" />

      <div className="hidden md:block">
        <motion.div
          animate={{ x: [0, 20, -12, 0], y: [0, -10, 8, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[14%] h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl will-change-transform"
        />
        <motion.div
          animate={{ x: [0, -18, 14, 0], y: [0, 9, -10, 0], scale: [1, 0.94, 1.06, 1] }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[16%] h-56 w-56 rounded-full bg-fuchsia-500/18 blur-3xl will-change-transform"
        />
        <motion.div
          animate={{ x: [0, 12, -16, 0], y: [0, 14, -6, 0], scale: [1, 1.04, 0.96, 1] }}
          transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[34%] bottom-[15%] h-64 w-64 rounded-full bg-blue-500/12 blur-3xl will-change-transform"
        />

        <motion.div
          animate={{ rotateX: [-8, -6, -9, -8], rotateY: [7, 11, 6, 7], y: [0, -8, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[30%] h-[56vh] w-[130vw] -translate-x-1/2 rounded-[3rem] border border-cyan-300/20 bg-cyan-500/[0.03] will-change-transform"
        >
          <div
            className="absolute inset-0 rounded-[3rem]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(34,211,238,0.12), rgba(34,211,238,0) 48%), repeating-linear-gradient(90deg, rgba(34,211,238,0.14) 0px, rgba(34,211,238,0.14) 1px, transparent 1px, transparent 54px), repeating-linear-gradient(0deg, rgba(34,211,238,0.14) 0px, rgba(34,211,238,0.14) 1px, transparent 1px, transparent 54px)"
            }}
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], rotateZ: [0, 3, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] top-[34%] h-32 w-24 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-lg will-change-transform"
        />
      </div>
    </div>
  );
}
