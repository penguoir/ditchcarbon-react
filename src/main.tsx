import React from "react";
import ReactDOM from "react-dom/client";
import "./css/main.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import ScopeOne from "./ScopeOne";
import ScopeTwo from "./ScopeTwo";
import Root from "./Root";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
      <Route path="/" element={<Root />} />
			<Route path="/scope-1" element={<ScopeOne />} />
			<Route path="/scope-2" element={<ScopeTwo />} />
		</>
	)
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
