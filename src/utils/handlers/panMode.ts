import { MouseEvent } from "react";

import { SVGPanController, SVGViewBox } from "../../PropTypes";

// mouse down in pan mode
export const startPan = (
  event: MouseEvent<HTMLDivElement>,
  svgViewBox: SVGViewBox,
  setSvgViewBox: React.Dispatch<React.SetStateAction<SVGViewBox>>,
  svgPanController: SVGPanController,
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>
) => {
  event.preventDefault();

  setSvgPanController({
    ...svgPanController,
    isDragging: true,
    lastMouseX: event.clientX,
    lastMouseY: event.clientY,
  });
};

// mouse move in pan mode
export const updatePan = (
  event: MouseEvent<HTMLDivElement>,
  svgViewBox: SVGViewBox,
  setSvgViewBox: React.Dispatch<React.SetStateAction<SVGViewBox>>,
  svgPanController: SVGPanController,
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>
) => {
  event.preventDefault();

  if (!svgPanController.isDragging) return;

  const deltaX = event.clientX - svgPanController.lastMouseX;
  const deltaY = event.clientY - svgPanController.lastMouseY;

  const newViewBoxX = svgViewBox.minx - deltaX;
  const newViewBoxY = svgViewBox.miny - deltaY;

  setSvgViewBox({
    ...svgViewBox,
    minx: newViewBoxX,
    miny: newViewBoxY,
  });

  setSvgPanController({
    ...svgPanController,
    velocityX: deltaX,
    velocityY: deltaY,
    lastMouseX: event.clientX,
    lastMouseY: event.clientY,
  });
};

// mouse up in pan mode
export const endPan = (
  event: MouseEvent<HTMLDivElement>,
  svgViewBox: SVGViewBox,
  setSvgViewBox: React.Dispatch<React.SetStateAction<SVGViewBox>>,
  svgPanController: SVGPanController,
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>,
  friction: number,
) => {
  event.preventDefault();

  function applyInertia() {
    if (
      Math.abs(svgPanController.velocityX) < 0.1 &&
      Math.abs(svgPanController.velocityY) < 0.1
    ) {
      return;
    }

    const newViewBoxX = svgViewBox.minx - svgPanController.velocityX;
    const newViewBoxY = svgViewBox.miny - svgPanController.velocityY;
    setSvgViewBox({
      ...svgViewBox, minx: newViewBoxX, miny: newViewBoxY
    });

    const newVelocityX = svgPanController.velocityX * friction;
    const newVelocityY = svgPanController.velocityY * friction;
    setSvgPanController({
      ...svgPanController, velocityX: newVelocityX, velocityY: newVelocityY
    });

    requestAnimationFrame(applyInertia);
  }

  requestAnimationFrame(applyInertia);
};
