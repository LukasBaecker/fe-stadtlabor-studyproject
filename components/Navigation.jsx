import Link from "next/link";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/actions/auth.js";
import { setLanguage } from "../store/actions/index.js";
import Dropdown from "react-bootstrap/Dropdown";
function Navigation() {
  const router = useRouter();

  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const logout = () => {
    fetch("http://giv-project15.uni-muenster.de:9000/api/v1/users/logout", {
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
      <Dropdown id='languageDropdown'>
        <Dropdown.Toggle variant='primary' id='languageDropdownToggle'>
          {lang === "eng" ? "UK" : "DE"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => dispatch(setLanguage("eng"))}>
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => dispatch(setLanguage("ger"))}>
            Deutsch
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
                  <Link href='/'>Home</Link>
                </li>
                <li>
                  <Link href='/map'>Resources Map</Link>
                </li>
                <li key='user'>
                  <Link href='/user'>User Page</Link>
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
                      Sign Up!
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
