import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChnage = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setLoading(false);
      setError(null);
      navigate("/signin");
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        setError(data.message);
        setLoading(false);

        return;
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-3xl text-center my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input
          type='text'
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg '
          onChange={handleChnage}
        />
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
          {loading ? "Loading..." : "SIGN UP"}
        </button>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>already have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-600'>Sign in </span>
        </Link>
      </div>
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
