import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userSlice, {
  signInStart,
  signInSuccess,
  singInFailure,
  saveToken,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error, token } = useSelector((state) => state.user);

  const handleChnage = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });   

      const data = await res.json();
      dispatch(saveToken(data.token));

      if (data.success === false) {
        dispatch(singInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      dispatch(singInFailure(error.message));
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-3xl text-center my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input
          type='email'
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg '
          onChange={handleChnage}
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg '
          onChange={handleChnage}
        />
        <button className='border rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "SIGN IN"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-4'>
        <p>dont have an account?</p>
        <Link to={"/signup"}>
          <span className='text-blue-600'>Sign up </span>
        </Link>
      </div>
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
