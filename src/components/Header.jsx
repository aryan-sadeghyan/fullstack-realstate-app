import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          {" "}
          <h1 className='font-bold text-sm sm:text-lg flex flex-wrap'>
            <span className='text-s'>Aryan</span>
            <span>States</span>
          </h1>
        </Link>
        <form className='bg-slate-100 rounded-lg p-3 flex items-center'>
          <input
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            type='text'
            placeholder='search...'
          />
          <FaSearch />
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            {" "}
            <li className='text-slate-700 hidden sm:inline hover:underline'>
              Home
            </li>
          </Link>

          <Link to='/about'>
            {" "}
            <li className='text-slate-700 hidden sm:inline hover:underline'>
              About
            </li>
          </Link>
          <Link to='/Signin'>
            <li className='text-slate-700  hover:underline'>Sign in </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
