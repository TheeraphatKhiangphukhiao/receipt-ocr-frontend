// import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import IntroPage from "./pages/intro page/IntroPage";
import CreatePage from "./pages/create page/CreatePage";
import EditPage from "./pages/edit page/EditPage";

function App() {
  //=========================================================
  // Part ต่างๆ ของหน้าต่างๆ
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: '/',
          element: <IntroPage />,
        },
        {
          path: '/create',
          element: <CreatePage />
        },
        {
          path: '/edit',
          element: <EditPage />
        },
      ],
    },
  ]);

  //=========================================================
  return (
    <>
      {/* CssBaseline คือ ทำไห้ส่วนต่างๆ ชิดหน้าต่างทางซ้าย */}
      <CssBaseline />
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
