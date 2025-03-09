
import p5 from "p5";
import { sketch } from "../lib/sketch_home"; // load sketch from external file
import { useEffect, useRef } from "react";

export default function StickHome() {
  const sketchRef = useRef(null);

  // create p5 instance
  useEffect(() => {
    const p5Instance = new p5((p) => sketch(p), sketchRef.current); // create p5 instance
    return () => p5Instance.remove(); // cleanup

  }, []);

  return (
    <>
      <div ref={sketchRef} /> {/* p5 canvas */}
    </>
  );
}