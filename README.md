# The Story of Your Time

This is a simple life simulator using the OpenAI API that predicts a person's life timeline from birth to death based on their profile information. The result is then converted into a loose animation using a stick figure.

## Installation
This project uses [pnpm](https://pnpm.io/), but you can also use npm or yarn.

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.

## Usage

Enter your profile (or any information you like) into the form on the first page, then press the "Let's Start" button. The generated script and animation will be displayed on the next screen.

### API Key

To use this project, you need to set up your OpenAI API key. Create a .env file in the root of your project and add your OPENAI_API_KEY:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Tool
This project utilized the following technologies:
- [OpenAI API](https://platform.openai.com/)
- [p5.js](https://p5js.org/)
- [p5.scribble.js](https://github.com/generative-light/p5.scribble.js/)
- [Matter.js](https://github.com/liabru/matter-js)
- [BMWalker.js](https://github.com/tetunori/BMWalker.js)
- [FontAwesome](https://fontawesome.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)

## Reference
For the stick figure animation, I heavily relied on this reference by [reona396](https://openprocessing.org/user/13276?view=sketches&o=48).
- [https://openprocessing.org/sketch/1786659](https://openprocessing.org/sketch/1786659)

For the visualization part, I took inspiration from this angle.
- [https://www.chronoflotimeline.com/timeline/shared/11043/Kings-and-Queens-of-England-and-Great-Britain/](https://www.chronoflotimeline.com/timeline/shared/11043/Kings-and-Queens-of-England-and-Great-Britain/)

The idea of people walking on the timeline was inspired by [Adam Robinson](https://attackingpixels.com/about/).
- [https://adamrobinson.dev/](https://adamrobinson.dev/)

I rely on this data to assume the cause of death.
- [https://www.cdc.gov/nchs/fastats/leading-causes-of-death.htm](https://www.cdc.gov/nchs/fastats/leading-causes-of-death.htm)

##  Date
2025-03-01

## Author
Karin Kiho