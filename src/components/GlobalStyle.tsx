import React from "react";
import { Global, css } from "@emotion/react";
import "leaflet/dist/leaflet.css";

const GlobalStyle = (props: any) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #root {
        height: 100%;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }
    `}
  />
);

export default GlobalStyle;
