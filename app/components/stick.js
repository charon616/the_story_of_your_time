
import p5 from "p5";
import { sketch } from "../lib/sketch_result"; // load sketch from external file
import { useEffect, useRef } from "react";

export default function Stick({ timeline }) {
  const sketchRef = useRef(null);

  // create p5 instance
  useEffect(() => {
    if (timeline.length > 0 && sketchRef.current) {
      const p5Instance = new p5((p) => sketch(p, timeline, 3000), sketchRef.current);
      return () => p5Instance.remove(); // cleanup
    }
  }, [timeline]);

  return (
    <>
      <div ref={sketchRef} /> {/* p5 canvas for timeline */}
    </>
  );
}