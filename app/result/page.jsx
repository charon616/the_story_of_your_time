"use client"
import p5 from "p5";

import { useEffect, useRef, useState } from "react";
import { sketch } from "../lib/sketch"; // 外部ファイルからスケッチを読み込む
import { createScene } from "../lib/scene"; // Three.js のロジックを読み込む
import CardBottom from "@/app/components/CardBottom";
import CardAbove from "@/app/components/CardAbove";

export default function Result() {
  const sketchRef = useRef(null);
  const sceneRef = useRef(null);
  const [timeline, setTimeline] = useState([]);
  const [minX, setMinX] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [data, setData] = useState(null);

  // const biography = data.biography;
  // const timeline = data.timeline;

  // console.log(biography);
  // consolee.log(timeline);

  const testjson = {
    "age": 20,
    "gender": "F",
    "country": "Japan",
    "timeline": [
      {
        "year": 1960,
        "event": "Born in New York, USA."
      },
      {
        "year": 1978,
        "event": "Enrolled in the School of Visual Arts, New York."
      },
      {
        "year": 1982,
        "event": "Held first solo exhibition at a local gallery."
      },
      {
        "year": 1985,
        "event": "Gained recognition for experimental mixed-media works."
      },
      {
        "year": 1990,
        "event": "Explored digital media and interactive installations."
      },
      {
        "year": 1995,
        "event": "Joined an artist residency program in Berlin."
      },
      {
        "year": 2000,
        "event": "Released a major public art installation in Los Angeles."
      },
      {
        "year": 2005,
        "event": "Published a book on contemporary art practices."
      },
      {
        "year": 2010,
        "event": "Became a professor of visual arts at a renowned university."
      },
      {
        "year": 2015,
        "event": "Retrospective exhibition held at the Museum of Modern Art."
      },
      {
        "year": 2020,
        "event": "Received a lifetime achievement award for contributions to the arts."
      },
      {
        "year": 2025,
        "event": "Continued to produce and mentor emerging artists."
      },
      {
        "year": 2030,
        "event": "Announced a major new body of work on artificial intelligence in art."
      },
      {
        "year": 2032,
        "event": "Passed away at the age of 72, leaving behind a legacy of innovative and thought-provoking art."
      }
    ]
  }  

  function map(value, start1, stop1, start2, stop2, withinBounds = false) {
    let newValue = (value - start1) * (stop2 - start2) / (stop1 - start1) + start2;
    if (withinBounds) {
      if (start2 < stop2) {
        return Math.min(Math.max(newValue, start2), stop2);
      } else {
        return Math.min(Math.max(newValue, stop2), start2);
      }
    }
    return newValue;
  }

  useEffect(() => {
    // localStorageからデータを取得
    const resultData = localStorage.getItem('resultData');
    if (resultData) {
      setData(JSON.parse(resultData));
    }

    let distance = testjson.timeline[testjson.timeline.length - 1].year - testjson.timeline[0].year;
    let startPos = 0;
    let endPos = 1000;
    
    const updatedTimeline = testjson.timeline.map((item, i) => {
      const pos = map(item.year - testjson.timeline[0].year, 0, distance, startPos, endPos);
      return { ...item, pos };
    });
    setTimeline(updatedTimeline);

    setMinX(updatedTimeline[0].pos);
    console.log(updatedTimeline[0].pos);
    console.log(updatedTimeline[updatedTimeline.length - 1].pos);
    setMaxX(updatedTimeline[updatedTimeline.length - 1].pos);
    // const p5Instance = new p5(sketch, sketchRef.current);
    
    // if (sceneRef.current) {
    //   const cleanup = createScene(sceneRef.current);
    //   return cleanup;
    // }

    // return () => p5Instance.remove(); // クリーンアップ
  }, []);

  return(
    <main className="bg-image-result">
      <div className="flex gap-4 mb-8">
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <h1 className="text-4xl">{testjson.age} / {testjson.gender} / {testjson.country} </h1>
        <p className="w-80 break-all whitespace-normal inline-block">ProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfileProfile</p>
      </div>
      {/* <div ref={sketchRef} /> */}
      {/* <div ref={sceneRef} /> */}

      <div className="timeline-container py-8 mb-20 w-full overflow-x-scroll">
        <div className="timeline-line absolute left-0 right-0 h-1 bg-black top-1/2"></div>
        <div className="flex gap-2 items-start mb-8">
          {timeline.map((item, index) => (
            index % 2 === 0 ? 
            <div key={index} className="timeline-item flex">
              <CardAbove year={item.year} event={item.event} posx={item.pos} />
            </div> : null
          ))}
        </div>
        <div className="timeline-container flex gap-2 items-start">
          {timeline.map((item, index) => (
            index % 2 === 1 ? 
            <div key={index} className="timeline-item flex">
              <CardBottom year={item.year} event={item.event} posx={item.pos} />
            </div> : null
          ))}
        </div>
      </div>
    </main>
  )
}