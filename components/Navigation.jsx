import Link from "next/link";
import styles from "../styles/Navigation.module.scss";

function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href='/signIn'>Sign In</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
