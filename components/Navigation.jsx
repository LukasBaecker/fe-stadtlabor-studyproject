import Link from "next/link";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/auth.js";

function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = () => {
    fetch("http://giv-project15.uni-muenster.de:9000/api/v1/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        res.json().then((result) => {
          dispatch(logoutUser());
          console.log("Logout: Success");
          router.push("/");
        });
      })
      .catch((err) => {
        console.log(err.message);
        console.log("Logout: Error");
      });
  };

  return (
    <>
      <div className='navigation-wrap'>
        <input type='checkbox' className='navigation-toggler' />
        <div className='hamburger'>
          <div></div>
        </div>
        <div className='menu'>
          <div>
            <div>
              <ul>
                <li>
                  <Link href='/'>Home</Link>
                </li>
                <li>
                  <Link href='/map'>Resources Map</Link>
                </li>
                <li>
                  <Link href='/user/1'>User Page</Link>
                </li>
                <li>
                  <Button
                    variant='danger'
                    onClick={() => {
                      logout();
                    }}>
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
