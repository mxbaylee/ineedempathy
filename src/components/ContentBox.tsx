import React from 'react';

export interface ContentBoxProps {
  title: string | JSX.Element;
  children: string | JSX.Element | JSX.Element[];
  widthLg?: number
  widthMd?: number
}

export const ContentBox = (props: ContentBoxProps) => {
  const widthLg = props.widthLg || 8
  const widthMd = props.widthMd || 6
  return(
    <div className="row mb-4">
      <div className={`col-lg-${widthLg} col-md-${widthMd} mb-md-0 mb-4`}>
        <div className="card">
          <div className="card-header pb-0">
            <div className="row">
              <div className="col-lg-12 col-12">
                <h6>{props.title}</h6>
              </div>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="card-body p-3">
              { props.children }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
