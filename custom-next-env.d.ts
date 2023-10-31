/* eslint-disable import/no-default-export */
/// <reference types="next" />
/// <reference types="next/types/global" />

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};

declare module "*.png" {
  const content: StaticImageData;
  export default content;
}

declare module "*.svg" {
  const content: StaticImageData;
  export default content;
}
declare module "*.jpg" {
  const content: StaticImageData;
  export default content;
}

declare module "*.jpeg" {
  const content: StaticImageData;
  export default content;
}

declare module "*.gif" {
  const content: StaticImageData;
  export default content;
}

declare module "*.webp" {
  const content: StaticImageData;
  export default content;
}

declare module "*.ico" {
  const content: StaticImageData;
  export default content;
}

declare module "*.bmp" {
  const content: StaticImageData;
  export default content;
}
