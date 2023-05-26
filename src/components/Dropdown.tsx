import React from 'react';

export interface DropdownProps {
  label: JSX.Element;
  children: JSX.Element[] | JSX.Element;
}

/*
<Dropdown label={<i className="fa fa-ellipsis-v text-secondary"></i>}>
  <ul className="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
    <li><a className="dropdown-item border-radius-md" href="about:blank">Action</a></li>
    <li><a className="dropdown-item border-radius-md" href="about:blank">Another action</a></li>
    <li><a className="dropdown-item border-radius-md" href="about:blank">Something else here</a></li>
  </ul>
</Dropdown>
*/
export const Dropdown = (props: DropdownProps) => {
  return (
    <div className="dropdown float-lg-end pe-4">
      <a href="about:blank" className="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
        { props.label }
      </a>
      { props.children }
    </div>
  )
}
