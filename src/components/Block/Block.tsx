import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Block.module.css";
const Block = ({ children }: { children: ReactNode }) => {
  return (
    <div className={classNames("fr-container", styles.container)}>
      {children}
    </div>
  );
};

export default Block;
