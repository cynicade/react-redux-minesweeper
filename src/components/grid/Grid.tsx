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
    padding: "1em",
    gridTemplateColumns: `repeat(${grid && grid.sizeX}, 40px)`,
    gridTemplateRows: `repeat(${grid && grid.sizeY}, 40px)`,
    gap: "3px",
    backgroundColor: "#efefef",
    borderRadius: "5px",
  });

  if (connection !== "connection established")
    return (
      <div>
        <Typography variant="h5" textAlign="center" color="secondary">
          {connection}
        </Typography>
      </div>
    );
  if (gameState === "loss")
    return (
      <div>
        <Typography variant="h5" textAlign="center" color="secondary">
          {connection}
        </Typography>
        <Typography variant="h1" textAlign="center" color="secondary">
          You lost
        </Typography>
      </div>
    );
  if (gameState === "win")
    return (
      <div>
        <Typography variant="h5" textAlign="center" color="secondary">
          {connection}
        </Typography>
        <Typography variant="h1" textAlign="center" color="secondary">
          You won
        </Typography>
      </div>
    );
  return (
    <div>
      <Typography variant="h5" textAlign="center" color="secondary">
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
