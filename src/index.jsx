import React from "react";
import { initializeWidget } from "@vikadata/widget-sdk";
import { Snapshot } from "./snapshot";

export const HelloWorld = () => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ margin: "0 auto", display: "table", paddingTop: "4%" }}>
        <Snapshot />
      </div>
    </div>
  );
};

initializeWidget(HelloWorld, process.env.WIDGET_PACKAGE_ID);
