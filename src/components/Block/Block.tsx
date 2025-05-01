import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Block.module.css";
const Block = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("fr-container", styles.container, className)}>
      {children}
    </div>
  );
};

export default Block;
