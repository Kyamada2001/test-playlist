import PlayListIndex from "./pages/playlist/Index";
import PlayListCreate from "./pages/playlist/Create";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import { BrowserRouter, Route, Routes, Link, RouteProps } from "react-router-dom";
  
  const routes = [
    {
      path: '/',
      Component: PlayListIndex
    },
    {
      path: '/create',
      Component: PlayListCreate
    },
    {
      path: '*',
      Component: NotFound
    },
  ] as const satisfies RouteProps[];
  
  const FrontendRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map(({ path, Component }, i) => <Route key={i} path={path} element={<Component />} />)}
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
  
  export default FrontendRoutes;