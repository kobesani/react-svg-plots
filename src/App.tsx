import "./assets/css/App.css";

import { useRef, useState, useEffect, MouseEvent } from "react";

import {
  BoundingBox,
  CircleProps,
  Rectangle,
  SVGViewBox,
  generateViewBoxAttribute,
  SVGPanController,
} from "./PropTypes";

import BrushRect from "./components/BrushRect";
import Circle from "./components/Circle";

import {
  startBrush,
  updateBrush,
  finishBrush,
} from "./utils/handlers/brushHandlers";

import { clearRects, clearLastRect } from "./utils/handlers/buttonHandlers";

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [circles, setCircles] = useState<CircleProps[]>([]);
  const [svgViewBox, setSvgViewBox] = useState<SVGViewBox>(
    {
      minx: 0,
      miny: 0,
      scaleWidth: 1.0,
      scaleHeight: 1.0,
      viewportWidth: 800,
      viewportHeight: 600,
    }
  );

  const [svgPanController, setSvgPanController] = useState<SVGPanController>(
    {
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      velocityX: 0,
      velocityY: 0,
    }
  );

  const defaultCircleColor = "seagreen";
  const selectedCircleColor = "purple";
  const defaultCircleRadius = 10;

  const changeModeToSelect = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    svgRef.current?.setAttribute("class", "mode-select");
  };

  const changeModeToPan = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    svgRef.current?.setAttribute("class", "mode-pan");
  };

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

  return (
    <>
      <div
        id="svg-container"
        onMouseDown={(event) =>
          startBrush(event, svgRef, svgViewBox, setBoundingBox, setRectangles)
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
        onMouseUp={(event) =>
          finishBrush(event, rectangles, setBoundingBox, setRectangles)
        }
      >
        <svg
          preserveAspectRatio="xMidYMid slice"
          ref={svgRef}
          width={svgViewBox.viewportWidth}
          height={svgViewBox.viewportHeight}
          viewBox={generateViewBoxAttribute(svgViewBox)}
        >
          <rect
            width={800}
            height={600}
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
      <button
        id="clear-last-button"
        onClick={(event) =>
          clearLastRect(
            event,
            rectangles,
            setRectangles,
            setCircles,
            defaultCircleColor,
            selectedCircleColor
          )
        }
      >
        Clear Last Selection
      </button>
      <button
        id="clear-button"
        onClick={(event) =>
          clearRects(event, setRectangles, setCircles, defaultCircleColor)
        }
      >
        Clear Selection
      </button>
      <button id="mode-select" onClick={(event) => changeModeToSelect(event)}>
        Select
      </button>
      <button id="mode-pan" onClick={(event) => changeModeToPan(event)}>
        Pan
      </button>
    </>
  );
}

export default App;
