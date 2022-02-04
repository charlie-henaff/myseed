import { createBrowserHistory } from "history";

const basePath = new URL(process.env.REACT_APP_BASE_URL).pathname;

export default createBrowserHistory({ basename: basePath });