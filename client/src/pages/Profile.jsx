import { current } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>

      <form className='flex flex-col gap-4'>
        <img
          src={currentUser.avatar}
          alt='profilePic'
          className='h-24 w-24 object-cover self-center mt-2 rounded-full'
        />
        <input
          type='text'
          className='rounded-lg border p-3'
          placeholder='username'
        />
        <input
          type='email'
          className='rounded-lg border p-3'
          placeholder='Email'
        />
        <input
          type='password'
          className='rounded-lg border p-3'
          placeholder='password'
        />
        <button className='bg-slate-700 p-3 rounded-lg text-white hover:opacity-90'>
          Update
        </button>
      </form>
      <div className='flex justify-between mt-4 text-red-700'>
        {" "}
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
