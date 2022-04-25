// https://github.com/vercel/next.js/issues/18356#issuecomment-1017687918
import NextImage, { ImageLoader } from "next/image";
import { ComponentPropsWithoutRef } from "react";

const customLoader: ImageLoader = ({ src }) => {
  return src;
};

export default function Image(props: ComponentPropsWithoutRef<typeof NextImage>) {
  return <NextImage {...props} loader={customLoader} />;
}
