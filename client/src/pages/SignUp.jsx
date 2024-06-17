import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-3xl text-center my-7'>Sign Up</h1>
      <form action='' className='flex flex-col gap-4 '>
        <input
          type='text'
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg '
        />
        <input
          type='email'
          placeholder='email'
          id='username'
          className='border p-3 rounded-lg '
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg '
        />
        <button className='border rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          Sign up
        </button>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>already have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-600'>Sign in </span>
        </Link>
      </div>
    </div>
  );
}
