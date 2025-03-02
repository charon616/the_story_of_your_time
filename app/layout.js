import { Rubik_Dirt } from "next/font/google";
import "./globals.css";
import Script from 'next/script'

const rubik = Rubik_Dirt({
  weight: "400",
  subsets: ["latin"]
});

export const metadata = {
  title: "The Story of Your Time",
  description: "This is a simple life simulator using the OpenAI API.",
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js" />
      <body className={rubik.className}> {/* apply default font */}
        {children}
      </body>
    </html>
  );
}
