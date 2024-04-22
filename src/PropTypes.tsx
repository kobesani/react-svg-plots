export interface BoundingBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RectangleProps extends Rectangle {
  index: number;
}

export interface CircleProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

// maybe we just track the scale of the width and height
export interface SVGViewBox {
  minx: number;
  miny: number;
  scaleWidth: number;
  scaleHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

export const generateViewBoxAttribute = (viewBox: SVGViewBox): string => {
  const width = viewBox.scaleWidth * viewBox.viewportWidth;
  const height = viewBox.scaleHeight * viewBox.viewportHeight;
  return `${viewBox.minx} ${viewBox.miny} ${width} ${height}`;
};

export interface SVGPanController {
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
  velocityX: number;
  velocityY: number;
}
