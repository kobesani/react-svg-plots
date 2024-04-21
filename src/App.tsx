import "./assets/css/App.css";

import { useRef, MouseEvent, useState, useEffect } from "react";

import {
  BoundingBox,
  CircleProps,
  Rectangle,
  SVGViewBox,
  generateViewBoxAttribute,
} from "./PropTypes";

import BrushRect from "./components/BrushRect";
import Circle from "./components/Circle";

import { startBrush, updateBrush } from "./utils/handlers/brushHandlers";

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [circles, setCircles] = useState<CircleProps[]>([]);

  const defaultCircleColor = "seagreen";
  const selectedCircleColor = "purple";
  const defaultCircleRadius = 10;

  const svgViewBox: SVGViewBox = {
    minx: 0,
    miny: 0,
    scaleWidth: 1.0,
    scaleHeight: 1.0,
    viewportWidth: 800,
    viewportHeight: 600,
  };

  // const scale = 1;
  // const minx = 0;
  // const miny = 0;

  useEffect(() => {
    const data = [
      { cx: 50, cy: 50 },
      { cx: 100, cy: 100 },
      { cx: 150, cy: 150 },
      { cx: 200, cy: 200 },
    ];
    setCircles(
      data.map(
        (value): CircleProps => ({
          cx: value.cx,
          cy: value.cy,
          fill: defaultCircleColor,
          r: defaultCircleRadius,
        })
      )
    );
  }, []);

  const circleWithinRectangle = (
    circle: CircleProps,
    rectangle: Rectangle
  ): boolean => {
    return (
      circle.cx >= rectangle.x &&
      circle.cx <= rectangle.x + rectangle.width &&
      circle.cy >= rectangle.y &&
      circle.cy <= rectangle.y + rectangle.height
    );
  };

  // const startBrush = (event: MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();

  //   const svg = svgRef.current;
  //   if (!svg) return;

  //   const startX =
  //     minx + scale * event.clientX - svg.getBoundingClientRect().left;
  //   const startY =
  //     miny + scale * event.clientY - svg.getBoundingClientRect().top;
  //   setBoundingBox({ startX, startY, endX: startX, endY: startY });
  //   const newRect: Rectangle = {
  //     x: Math.min(startX, startX),
  //     y: Math.min(startY, startY),
  //     width: 0,
  //     height: 0,
  //   };
  //   setRectangles([...rectangles, newRect]);
  // };

  // const updateBrush = (event: MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();

  //   if (!boundingBox) return;

  //   const svg = svgRef.current;
  //   if (!svg) return;

  //   const endX =
  //     minx + scale * event.clientX - svg.getBoundingClientRect().left;
  //   const endY = miny + scale * event.clientY - svg.getBoundingClientRect().top;
  //   setBoundingBox({ ...boundingBox, endX, endY });

  //   const newRect: Rectangle = {
  //     x: Math.min(boundingBox.startX, endX),
  //     y: Math.min(boundingBox.startY, endY),
  //     width: Math.abs(endX - boundingBox.startX),
  //     height: Math.abs(endY - boundingBox.startY),
  //   };

  //   if (!rectangles.length) {
  //     setRectangles([newRect]);
  //   } else {
  //     const updatedRectangles = [...rectangles.slice(0, -1), newRect];
  //     setRectangles(updatedRectangles);
  //   }

  //   setCircles((prevCircles) => {
  //     return prevCircles.map((circle) => {
  //       const isSelected = rectangles.some((rectangle) =>
  //         circleWithinRectangle(circle, rectangle)
  //       );
  //       return {
  //         ...circle,
  //         fill: isSelected ? selectedCircleColor : defaultCircleColor,
  //       };
  //     });
  //   });
  // };

  const finishBrush = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setBoundingBox(null);
    /*
      Removes only last rectangle that happens when you go outside of the box and mouseup
      This works too, but the filter on all 0 height/width rects also works
    */
    // const lastRectangle = rectangles.slice(-1)[0]
    // if (lastRectangle.height === 0 && lastRectangle.width === 0) {
    //   setRectangles(rectangles.slice(0, -1))
    // }

    setRectangles(
      rectangles.filter((rect) => !(rect.height === 0 && rect.width === 0))
    );
  };

  const clearRects = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRectangles([]);

    setCircles((prevCircles) =>
      prevCircles.map((circle) => ({
        ...circle,
        fill: defaultCircleColor,
      }))
    );
  };

  const clearLastRect = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // no rectangles drawn yet
    if (!rectangles.length) return;

    const updatedRectangles = rectangles.slice(0, -1);
    setRectangles(updatedRectangles);

    setCircles((prevCircles) => {
      return prevCircles.map((circle) => {
        const isSelected = updatedRectangles.some((rectangle) =>
          circleWithinRectangle(circle, rectangle)
        );
        return {
          ...circle,
          fill: isSelected ? selectedCircleColor : defaultCircleColor,
        };
      });
    });
  };

  return (
    <>
      <div
        id="svg-container"
        onMouseDown={(event) =>
          startBrush(
            event,
            svgRef,
            svgViewBox,
            setBoundingBox,
            setRectangles
          )
        }
        onMouseMove={(event) =>
          updateBrush(
            event,
            boundingBox,
            svgRef,
            svgViewBox,
            rectangles,
            setBoundingBox,
            setRectangles,
            setCircles,
            defaultCircleColor,
            selectedCircleColor
          )
        }
        onMouseUp={finishBrush}
      >
        <svg
          preserveAspectRatio="xMidYMid slice"
          ref={svgRef}
          width={svgViewBox.viewportWidth}
          height={svgViewBox.viewportHeight}
          viewBox={generateViewBoxAttribute(svgViewBox)}
          // viewBox={`${minx} ${miny} ${scale * svgWidth} ${scale * svgHeight}`}
          // viewBox="0 0 0 0"
        >
          <rect
            height={600}
            width={800}
            fill="none"
            stroke="black"
            strokeWidth={1}
          ></rect>
          {circles.map((datum, index) => (
            <Circle
              key={index}
              cx={datum.cx}
              cy={datum.cy}
              r={datum.r}
              fill={datum.fill}
            />
          ))}
          {rectangles.map((rect, index) => (
            <BrushRect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
            />
          ))}
        </svg>
      </div>
      <button id="clear-last-button" onClick={clearLastRect}>
        Clear Last Selection
      </button>
      <button id="clear-button" onClick={clearRects}>
        Clear Selection
      </button>
    </>
  );
}

export default App;
