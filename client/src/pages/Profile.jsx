import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userListings, setUserListings] = useState();
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`./api/user/update/${currentUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.updatedUser));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleClick = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem("token");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    const res = await fetch(`/api/listing/getuserlistings/${currentUser.id}`);
    const data = await res.json();
    setUserListings(data.userListings);
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => {
        prev.filter((listing) => {
          listing.id !== listingId;
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          className='hidden'
          accept='image/*'
          id='avatar'
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
          defaultValue={currentUser.username}
          onChange={handleChange}
          id='username'
        />
        <input
          type='email'
          className='rounded-lg border p-3'
          placeholder='Email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          id='email'
        />
        <input
          type='password'
          className='rounded-lg border p-3'
          placeholder='password'
          onChange={handleChange}
          id='password'
        />
        <button
          disabled={loading}
          className='bg-slate-700 p-3 rounded-lg text-white hover:opacity-90'
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          className='bg-green-700 uppercase text-center hover:opacity-95 rounded-lg text-white p-3'
          to={"/create-listing"}
        >
          create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-4 text-red-700'>
        {" "}
        <span onClick={handleClick} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-600'>
        {updateSuccess ? <span>user updated</span> : ""}
      </p>
      <p
        className='text-center text-green-700 cursor-pointer'
        onClick={handleShowListings}
      >
        show Listings
      </p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing.id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing.id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing.id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing.id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
