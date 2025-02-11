import { Londrina_Solid } from "next/font/google";

const londrina = Londrina_Solid({
  weight: '300',
})

export default function CardBottom({ year, event, posx }) {
  return (
    <div className="flex flex-col items-center relative" style={{ left: `${posx}px` }}>
      <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 bg-black rounded-full w-4 h-4"></div>
      <div className="border border-black rounded-lg p-6 min-w-[16rem]">
        <h2 className="text-4xl font-bold">{year}</h2>
        <p className={`text-2xl ${londrina.className}`}>{event}</p>
      </div>
    </div>
  );
}