import React from 'react';
import { Img } from './Img';

export interface SidebarProps {
}

export const Sidebar = (props: SidebarProps) => {
  return(
    <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3   bg-gradient-dark" id="sidenav-main">
      <div className="sidenav-header">
        <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
        <span className="navbar-brand m-0">
          <Img src="/assets/img/logo-ct.png" className="navbar-brand-img h-100" alt="main_logo" />
          <span className="ms-1 font-weight-bold text-white">Open Source</span>
        </span>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link text-white active bg-gradient-info" href="about:blank">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">home</i>
              </div>
              <span className="nav-link-text ms-1">Home</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
