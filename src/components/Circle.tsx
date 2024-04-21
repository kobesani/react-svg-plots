// import { useState } from "react";
import { CircleProps } from "../PropTypes";

const Circle = (props: CircleProps) => {
  // const defaultColor = "black";
  // const originalColor = props.fill;
  // const [color, setColor] = useState<string>(originalColor);

  return (
    <>
      <circle
        cx={props.cx}
        cy={props.cy}
        r={props.r}
        fill={props.fill}
      ></circle>
    </>
  );
};

export default Circle;
