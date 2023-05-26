import React from 'react';

export interface Link {
  href?: string;
  label: JSX.Element | string;
}

export interface TopBarProps {
  breadcrumbs: Link[];
  title: string
}

export const TopBar = (props: TopBarProps) => {
  return (
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
      <div className="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            { props.breadcrumbs.map((breadcrumb: Link) => {
              const { href, label } = breadcrumb
              if (href) {
                return (
                  <li key={href} className="breadcrumb-item text-sm">
                    <a className="opacity-5 text-dark" href={href}>{label}</a>
                  </li>
                )
              }
              return (
                <li key={href} className="breadcrumb-item text-sm text-dark active" aria-current="page">
                  {label}
                </li>
              )
            }) }
          </ol>
          <h6 className="font-weight-bolder mb-0">{props.title}</h6>
        </nav>
      </div>
    </nav>
  )
}
