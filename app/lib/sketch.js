import p5 from "p5";

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

export const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 200); // 横長のキャンバスを作成
    p.background(200);
    p.textAlign(p.CENTER, p.CENTER); // テキストを中央揃えに設定

    for (let i = 0; i < testjson.timeline.length; i++) {
      let x = 100 * i + 50;
      let y = p.height / 2 + (i % 2 === 0 ? -20 : 20); // 偶数と奇数のイベントを上下にずらす
      p.text(testjson.timeline[i].year + ": " + testjson.timeline[i].event, x, y);
    }
    p.noLoop();
  };

  p.draw = () => {
    p.fill(255, 0, 0);
    p.ellipse(p.width / 2, p.height / 2, 50, 50);
  };
};