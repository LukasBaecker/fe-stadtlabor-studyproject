import Link from "next/link";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/actions/auth.js";
import { setLanguage } from "../store/actions/index.js";
import { userLogoutPostUrl } from "../helpers/urls";
import Dropdown from "react-bootstrap/Dropdown";
import LanguageSelector from "./LanguageSelector";
function Navigation() {
  const router = useRouter();

  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const logout = () => {
    fetch(userLogoutPostUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        res.json().then((result) => {
          dispatch(logoutUser());
          router.push("/");
          console.log("Logout: Success");
        });
      })
      .catch((err) => {
        console.log(err.message);
        console.log("Logout: Error");
      });
  };

  return (
    <>
      <LanguageSelector />
      <div className='navigation-wrap'>
        <input type='checkbox' className='navigation-toggler' />

        <div className='hamburger'>
          <div></div>
        </div>
        <div className='menu'>
          <div>
            <div>
              <ul>
                <li key='home'>
                  <Link href='/'>{lang === "eng" ? "Home" : "Startseite"}</Link>
                </li>
                <li key='map'>
                  <Link href='/map'>
                    {lang === "eng" ? "Resources Map" : "Karte der Gärten"}
                  </Link>
                </li>
                <li key='user'>
                  <Link href='/user'>
                    {lang === "eng" ? "User Profile" : "Nutzerprofil"}
                  </Link>
                </li>
                <li key='variety'>
                  <Link href='/cropvariety'>
                    {lang === "eng" ? "Crop Variety" : "Pflanzenvielfalt"}
                  </Link>
                </li>
                {isAuth ? (
                  <li key='logoutIn'>
                    <Button
                      variant='danger'
                      onClick={() => {
                        logout();
                      }}>
                      Logout
                    </Button>
                  </li>
                ) : (
                  <li key='loginOut'>
                    <Button
                      variant='secondary'
                      onClick={() => {
                        router.push("/login");
                      }}>
                      Login
                    </Button>
                    {"  "}
                    {lang === "eng" ? "or" : "oder"}
                    {"  "}
                    <Button
                      variant='secondary'
                      onClick={() => {
                        router.push("/register");
                      }}>
                      {lang === "eng" ? "Sign Up Now!" : "Jetzt registrieren!"}
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
