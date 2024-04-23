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

import { startPan, updatePan, finishPan } from "./utils/handlers/panMode";

import { clearRects, clearLastRect } from "./utils/handlers/buttonHandlers";

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [circles, setCircles] = useState<CircleProps[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [svgViewBox, setSvgViewBox] = useState<SVGViewBox>({
    minx: 0,
    miny: 0,
    scaleWidth: 1.0,
    scaleHeight: 1.0,
    viewportWidth: 800,
    viewportHeight: 600,
  });

  const [svgPanController, setSvgPanController] = useState<SVGPanController>({
    lastMouseX: 0,
    lastMouseY: 0,
    velocityX: 0,
    velocityY: 0,
  });
  useEffect(() => {
    function applyInertia(minX, minY, velocityX, velocityY) {
      // Apply inertia until the velocity is below a certain threshold
      if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
        return;
      }
      if (isDragging) return;
      const newViewBoxX = minX - velocityX;
      const newViewBoxY = minY - velocityY;
      setSvgViewBox({
        ...svgViewBox,
        minx: newViewBoxX,
        miny: newViewBoxY,
      });

      // Apply friction to slow down the velocity
      const newVelocityX = velocityX * frictionCoefficient;
      const newVelocityY = velocityY * frictionCoefficient;

      setSvgPanController({
        ...svgPanController,
        velocityX: newVelocityX,
        velocityY: newVelocityY,
      });

      requestAnimationFrame(() =>
        applyInertia(newViewBoxX, newViewBoxY, newVelocityX, newVelocityY)
      );
    }

    // Start applying inertia
    requestAnimationFrame(() =>
      applyInertia(
        svgViewBox.minx,
        svgViewBox.miny,
        svgPanController.velocityX,
        svgPanController.velocityY
      )
    );
  }, [svgPanController, svgViewBox]);

  const [mode, setMode] = useState<string | null>(null);

  const defaultCircleColor = "seagreen";
  const selectedCircleColor = "purple";
  const defaultCircleRadius = 10;
  const frictionCoefficient = 0.88;

  const changeModeToSelect = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMode("select");
    svgRef.current?.setAttribute("class", "mode-select");
  };

  const changeModeToPan = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMode("pan");
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
          startPan(event, svgPanController, setSvgPanController, setIsDragging)
        }
        onMouseMove={(event) =>
          updatePan(
            event,
            svgViewBox,
            setSvgViewBox,
            svgPanController,
            setSvgPanController,
            isDragging
          )
        }
        onMouseUp={(event) => finishPan(event, setIsDragging)}
        // onMouseDown={(event) =>
        //   startBrush(event, svgRef, svgViewBox, setBoundingBox, setRectangles)
        // }
        // onMouseMove={(event) =>
        //   updateBrush(
        //     event,
        //     boundingBox,
        //     svgRef,
        //     svgViewBox,
        //     rectangles,
        //     setBoundingBox,
        //     setRectangles,
        //     setCircles,
        //     defaultCircleColor,
        //     selectedCircleColor
        //   )
        // }
        // onMouseUp={(event) =>
        //   finishBrush(event, rectangles, setBoundingBox, setRectangles)
        // }
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
