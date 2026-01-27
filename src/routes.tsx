import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MD5Tool from "./pages/MD5Tools";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MD5Tool />,
    },
    {
        path: "/api",
        element: <App />,
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}