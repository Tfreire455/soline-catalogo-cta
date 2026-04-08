// src/components/ImageSkeleton.js
import React from "react";

const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center">
    <div className="w-12 h-12 rounded-full bg-stone-200/80" />
  </div>
);

export default ImageSkeleton;
