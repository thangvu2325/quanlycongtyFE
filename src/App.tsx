import { Fragment, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layout/DefaultLayout";
import Loading from "./components/Loading/Loading";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout: any = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<Loading></Loading>}>
                    <Layout>
                      <Page />
                    </Layout>
                  </Suspense>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
