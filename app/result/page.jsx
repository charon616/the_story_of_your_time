"use client"
import p5 from "p5";

import { useEffect, useRef, useState } from "react";
import { sketch } from "../lib/sketch"; // 外部ファイルからスケッチを読み込む
import { createScene } from "../lib/scene"; // Three.js のロジックを読み込む
import CardBottom from "@/app/components/CardBottom";
import CardAbove from "@/app/components/CardAbove";
import { Londrina_Solid } from "next/font/google";

const londrina = Londrina_Solid({
  weight: '300',
})

export default function Result() {
  const sketchRef = useRef(null);
  const sceneRef = useRef(null);

  const [minX, setMinX] = useState(0);
  const [maxX, setMaxX] = useState(0);
  
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [country, setCountry] = useState(null);
  const [biography, setBiography] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [data, setData] = useState(null);

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
    const resultData = JSON.parse(localStorage.getItem('resultData'))
    if (resultData) {
      setData(resultData);
      setAge(resultData.age);
      setGender(resultData.gender);
      setCountry(resultData.country);
      setBiography(resultData.biography);
      setTimeline(resultData.timeline);

      let tl = resultData.timeline;

      let distance = tl[tl.length - 1].year - tl[0].year;
      let startPos = 0;
      let endPos = 3000;
      
      const updatedTimeline = tl.map((item, i) => {
        const pos = map(item.year - tl[0].year, 0, distance, startPos, endPos);
        return { ...item, pos };
      });
      setTimeline(updatedTimeline);
  
      setMinX(updatedTimeline[0].pos);
      setMaxX(updatedTimeline[updatedTimeline.length - 1].pos);

      // const p5Instance = new p5((p) => sketch(p, updatedTimeline, endPos), sketchRef.current);
    }
    
    // if (sceneRef.current) {
    //   const cleanup = createScene(sceneRef.current);
    //   return cleanup;
    // }

    // return () => p5Instance.remove(); // クリーンアップ
  }, []);

  useEffect(() => {
    if (timeline && sketchRef.current) {
      const p5Instance = new p5((p) => sketch(p, timeline, 3000), sketchRef.current);
      return () => p5Instance.remove(); // クリーンアップ
    }
  }, [timeline]);

  return(
    <main>
    <button>button</button>
      <div className="flex gap-4 mb-8">
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <h1 className="text-4xl">{age} / {gender} / {country} </h1>
        <p className={`w-[40rem] whitespace-normal inline-block text-xl ${londrina.className}`}>{biography}</p>
      </div>
      {/* <div ref={sceneRef} /> */}

      <div ref={sketchRef} />
      {/* <div className="timeline-container mb-20 w-full overflow-x-scroll">
        <div className="flex gap-2 items-end">
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
      </div> */}
    </main>
  )
}