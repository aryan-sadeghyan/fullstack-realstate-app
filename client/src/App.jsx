import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute.jsx";

// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { getLocalToken, setUser } from "./redux/user/userSlice.js";
// import { useEffect } from "react";
import CreateListing from "./pages/CreateListing.jsx";

export default function App() {
  // const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.user);

  // async function fetchUser() {
  //   try {
  //     const localToken = localStorage.getItem("token");

  //     if (localToken) {
  //       dispatch(getLocalToken(localToken));
  //     }

  //     if (!token) {
  //       return;
  //     }
  //     const res = await fetch(`/api/user/token`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const info = await res.json();
  //     console.log(info);

  //     if (info.success) {
  //       dispatch(setUser(info.user));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // }

  // useEffect(() => {
  //   fetchUser();
  // }, [token]);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path='/Profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
