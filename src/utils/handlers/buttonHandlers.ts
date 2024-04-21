import { MouseEvent } from "react";
import { Rectangle, CircleProps } from "../../PropTypes";
import { circleWithinRectangle } from "./brushHandlers";


export const clearRects = (
  event: MouseEvent<HTMLButtonElement>,
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>,
  setCircles: React.Dispatch<React.SetStateAction<CircleProps[]>>,
  defaultCircleColor: string,
) => {
  event.preventDefault();
  setRectangles([]);

  setCircles((prevCircles) =>
    prevCircles.map((circle) => ({
      ...circle,
      fill: defaultCircleColor,
    }))
  );
};

export const clearLastRect = (
  event: MouseEvent<HTMLButtonElement>,
  rectangles: Rectangle[],
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>,
  setCircles: React.Dispatch<React.SetStateAction<CircleProps[]>>,
  defaultCircleColor: string,
  selectedCircleColor: string
) => {
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
