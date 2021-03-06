/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FlagIcon from "@mui/icons-material/Flag";
import { Icon } from "@mui/material";
import { css, jsx } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { gameActions, selectCells } from "../game/gameSlice";

type PropsType = {
  x: number;
  y: number;
  counter: number | null;
  mine: boolean;
};

export const Cell: React.FC<PropsType> = ({
  x,
  y,
  counter,
  mine,
}: PropsType): JSX.Element => {
  const dispatch = useAppDispatch();
  const cells = useAppSelector(selectCells);
  const getBackgroundColor = (): string => {
    if (cells && cells[y][x].open) return "#fff";
    return "inherit";
  };
  const cellStyles = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    border: "1px solid #999",
    fontWeight: "bold",
    fontSize: "18px",
    backgroundColor: getBackgroundColor(),
  });

  if (cells && cells[y][x].open)
    return (
      <div css={cellStyles}>
        {mine ? (
          <Icon
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "primary.main",
              color: "secondary.main",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Brightness7Icon />
          </Icon>
        ) : (
          <p css={{ width: "100%", textAlign: "center" }}>{counter}</p>
        )}
      </div>
    );

  return (
    <div css={cellStyles}>
      <button
        css={{
          width: "100%",
          height: "100%",
          backgroundColor: "#eeeeee",
          border: "none",
          transitionDuration: "500ms",
          "&:hover": { backgroundColor: "#c7c5c7" },
        }}
        onClick={() => dispatch(gameActions.openCell({ y, x }))}
        onContextMenu={(e) => {
          e.preventDefault();
          dispatch(gameActions.flagCell({ y, x }));
        }}
      >
        {cells && cells[y][x].flag && !cells[y][x].open && (
          <Icon sx={{ width: "100%" }}>
            <FlagIcon />
          </Icon>
        )}
      </button>
    </div>
  );
};
