import React from "react";
import ReactDOM from "react-dom/client";
import "./css/main.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Scope from "./Scope";

const router = createBrowserRouter(
	createRoutesFromElements(<Route path="/" element={<Scope />} />)
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
