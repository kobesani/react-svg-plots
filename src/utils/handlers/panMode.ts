import { MouseEvent } from "react";

import { SVGPanController, SVGViewBox } from "../../PropTypes";

// mouse down in pan mode
export const startPan = (
  event: MouseEvent<HTMLDivElement>,
  svgPanController: SVGPanController,
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
) => {
  event.preventDefault();

  setIsDragging(true);

  setSvgPanController({
    ...svgPanController,
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
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>,
  isDragging: boolean
) => {
  event.preventDefault();
  if (isDragging) {
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
  }
};

// mouse up in pan mode
export const finishPan = (
  event: MouseEvent<HTMLDivElement>,
  svgViewBox: SVGViewBox,
  setSvgViewBox: React.Dispatch<React.SetStateAction<SVGViewBox>>,
  svgPanController: SVGPanController,
  setSvgPanController: React.Dispatch<React.SetStateAction<SVGPanController>>,
  friction: number,
  isDragging: boolean,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
) => {
  event.preventDefault();
  setIsDragging(false);

  if (svgPanController.velocityX === 0 && svgPanController.velocityY === 0) {
    return;
  }

  // If the mouse was not dragged, exit the function
  function applyInertia(minX, minY, velocityX, velocityY) {
    // Apply inertia until the velocity is below a certain threshold
    if (!isDragging) return;
    if (
      Math.abs(velocityX) < 0.1 &&
      Math.abs(velocityY) < 0.1
    ) {
      return;
    }

    const newViewBoxX = minX - velocityX;
    const newViewBoxY = minY - velocityY;
    setSvgViewBox({
      ...svgViewBox,
      minx: newViewBoxX,
      miny: newViewBoxY,
    });

    // Apply friction to slow down the velocity
    const newVelocityX = velocityX * friction;
    const newVelocityY = velocityY * friction;

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
};
