import "bulma/css/bulma.css";
import { render } from "react-dom";
import App from "./App";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start();
}

render(<App />, document.querySelector("#content"));
