/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import {
  selectConnectionStatus,
  selectGameState,
  selectGrid,
} from "../../app/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Typography } from "@mui/material";
import { Cell as ICell } from "../../app/Grid";
import { Cell } from "../cell/Cell";
import { css, jsx } from "@emotion/react";

export const Grid: React.FC = (): JSX.Element => {
  const grid = useAppSelector(selectGrid);
  const connection = useAppSelector(selectConnectionStatus);
  const gameState = useAppSelector(selectGameState);

  const gridStyles = css({
    listStyleType: "none",
    display: "inline-grid",
    padding: "10px",
    gridTemplateColumns: `repeat(${grid && grid.sizeX}, 50px)`,
    gridTemplateRows: `repeat(${grid && grid.sizeY}, 50px)`,
    gap: "4px",
    backgroundColor: "#efefef",
  });

  if (connection !== "connection established")
    return (
      <div>
        <Typography variant="h5" textAlign="center">
          {connection}
        </Typography>
      </div>
    );
  if (gameState === "loss")
    return (
      <div>
        <Typography variant="h5" textAlign="center">
          {connection}
        </Typography>
        <Typography variant="h1" textAlign="center">
          GET FUCKED LOL
        </Typography>
      </div>
    );
  return (
    <div>
      <Typography variant="h5" textAlign="center">
        {connection}
      </Typography>
      <ul css={gridStyles}>
        {grid &&
          grid.cells.map((row: Array<ICell>, idxY: number) =>
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
