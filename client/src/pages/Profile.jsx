import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <div className='p-3 max-w-xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>

      <form className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          className='hidden'
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='h-24 w-24 object-cover self-center mt-2 rounded-full cursor-pointer'
        />
        <p className='text-center text-small'>
          {fileUploadError ? (
            <span className='text-red-600'>
              Error image Upload (img must be less that 2mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span>{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className='text-green-600'> image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
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
