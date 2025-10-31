import React from 'react'
import { BiHome } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  return (
    <div className='z-50 fixed top-0 left-0 w-full h-16 bg-secondary rounded-md bg-secondary flex border-[1px] border-zinc-700'>
      <div className='h-full w-[60%] flex items-center justify-center gap-20'>
        <Link to={"/"}><BiHome className={`w-7 h-7 ${location.pathname==="/"?"text-white" : "text-zinc-400"} hover:text-white duration-300`}/></Link>
        <Link to={"/task"}><GoTasklist className={`w-7 h-7 ${location.pathname==="/task"?"text-white" : "text-zinc-400"} hover:text-white duration-300`}/></Link>
        <Link to={"/calender"}><SlCalender className={`w-6 h-6 ${location.pathname==="/calender"?"text-white" : "text-zinc-400"} hover:text-white duration-300`}/></Link>
      </div>
      <div className='h-full w-[40%] flex items-center justify-center gap-20'>
        <Link to={"/profile"}><CgProfile className={`w-7 h-7 ${location.pathname==="/profile"?"text-white" : "text-zinc-400"} hover:text-white duration-300`}/></Link>
      </div>
    </div>
  )
}

export default Navbar