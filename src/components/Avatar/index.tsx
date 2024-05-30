import { Image } from "antd";
import { Fragment, FunctionComponent, ReactNode, useState } from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  icon?: ReactNode;
  height?: number;
  width?: number;
  className?: string;
  from?: string;
  to?: string;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  src,
  name,
  icon,
  height = 35,
  width = 35,
  className,
}) => {
  const [error, setError] = useState<boolean>(false);
  return (
    <Fragment>
      {error || !src ? (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: `${width}px`,
          }}
          className={` bg-gradient-to-r from-[#ee0979] to-[#ff6a00]   relative mr-4 font-bold select-none ${
            className ?? ""
          }`}
        >
          <span className="text-[#fff] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[12px]">
            {name
              ? name
                  ?.split(" ")
                  .map((word) => word.charAt(0))
                  .join("")
              : icon}
          </span>
        </div>
      ) : (
        <Image
          src={src ?? ""}
          alt="avatar user"
          width={height}
          height={width}
          className={className ?? ""}
          onError={() => {
            setError(true);
          }}
        ></Image>
      )}
    </Fragment>
  );
};

export default Avatar;
