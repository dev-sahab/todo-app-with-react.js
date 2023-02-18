import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home";
// import Practice from "./Pages/practice/Practice";

function App() {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Practice />} /> */}
      </Routes>
    </>
  );
}

export default App;
