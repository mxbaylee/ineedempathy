import React from 'react';

export interface ImgProps {
  src: string
  className?: string
  alt?: string
}

export const Img = (props: ImgProps) => {
  const src = window.location.href + props.src

  return (
    <img src={src} className={props.className} alt={props.alt} />
  )
}
