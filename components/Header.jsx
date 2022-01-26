import Container from "react-bootstrap/Container";
import styles from "../styles/Header.module.scss";

import { useState } from "react";

function Header({ caption, name, imgUrl }) {
  return (
    <>
      <div className={styles.Header}>
        <img src={imgUrl} alt='avatar' />
        <div className={styles.Text}>
          <h2>{caption}</h2>
          <h1>{name}</h1>
        </div>
      </div>
    </>
  );
}

export default Header;
