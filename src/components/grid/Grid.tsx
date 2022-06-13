/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { selectGrid } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { ICell } from "../../types";
import { Cell } from "../cell/Cell";
import { css, jsx } from "@emotion/react"; // need jsx for pragma
import { Typography } from "@mui/material";

export const Grid: React.FC = (): JSX.Element => {
  const grid = useAppSelector(selectGrid);

  if (!grid)
    return (
      <Typography variant="h5" textAlign="center" color="secondary">
        Loading...
      </Typography>
    );

  const cellSize = () => {
    switch (grid.sizeX) {
      case 8:
        return "60px";
      default:
        return "45px";
    }
  };

  const gridStyles = css({
    listStyleType: "none",
    display: "inline-grid",
    padding: "1em",
    gridTemplateColumns: `repeat(${grid.sizeX}, ${cellSize()})`,
    gridTemplateRows: `repeat(${grid.sizeY}, ${cellSize()})`,
    gap: "3px",
    backgroundColor: "#efefef",
    borderRadius: "5px",
  });

  return (
    <div>
      <ul css={gridStyles}>
        {grid.cells.map((row: Array<ICell>, idxY: number) =>
          row.map((cell: ICell, idxX: number) => {
            return (
              <li key={String(idxX) + String(idxY)}>
                <Cell
                  x={idxX}
                  y={idxY}
                  counter={cell.counter}
                  mine={cell.mine}
                />
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
