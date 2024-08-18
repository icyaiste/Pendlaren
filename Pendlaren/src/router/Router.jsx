import { createBrowserRouter } from "react-router-dom";
import Timetable from "../pages/timetables/Timetable";
import Home from "../pages/home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/timetable/:extId",
        element: <Timetable/>
    }
])

export default router;