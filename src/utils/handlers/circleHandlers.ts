import { CircleProps, Rectangle } from "../../PropTypes";

export const circleWithinRectangle = (
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
