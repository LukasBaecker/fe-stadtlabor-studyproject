import Link from "next/link";
import Button from "react-bootstrap/Button";

function Navigation() {
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
                  <Button variant='danger'>Logout</Button>
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
