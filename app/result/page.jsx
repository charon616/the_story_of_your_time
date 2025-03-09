"use client"

// result page
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { Londrina_Solid } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import dynamic from 'next/dynamic'
const Stick = dynamic(() => import('../components/stick_result'), { ssr: false }); // use dynamic import for p5.js canvas because it's not SSR compatible

const londrina = Londrina_Solid({
  weight: '300',
  subsets: ['latin']
})

export default function Result() {
  const router = useRouter();
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [country, setCountry] = useState(null);
  const [biography, setBiography] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // map function
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

  // set timeline data from localStorage
  useEffect(() => {
    // get data from localStorage if exists
    const resultData = JSON.parse(localStorage.getItem('resultData'))
    if (resultData) {
      setAge(resultData.age);
      setGender(resultData.gender);
      setOccupation(resultData.occupation);
      setCountry(resultData.country);
      setBiography(resultData.biography);
      setTimeline(resultData.timeline);

      let tl = resultData.timeline;
      let distance = tl[tl.length - 1].year - tl[0].year;
      let startPos = 0;
      let endPos = 3000; // timeline length is always 3000
      
      // calculate position for each event using map function
      const updatedTimeline = tl.map((item, i) => {
        const pos = map(item.year - tl[0].year, 0, distance, startPos, endPos);
        return { ...item, pos };
      });
      setTimeline(updatedTimeline);
    }
  }, []);

  // back to home
  const handleBackToHome = () => {
    router.push('/')
  }

  return(
    <main>
      <div className="flex gap-4 mb-8">
        <button onClick={handleBackToHome} className="bg-black rounded-full inline-block px-4 py-2 max-h-20 text-[#dadbcd]"><FontAwesomeIcon icon={faArrowLeft} /></button>
        <h1 className="text-4xl">{age} / {gender} / {occupation} / {country} </h1>
        <p className={`w-[40rem] whitespace-normal inline-block text-xl ${londrina.className}`}>{biography}</p>
      </div>
      <Stick timeline={timeline} />
    </main>
  )
}