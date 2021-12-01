import Link from "next/link";

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
                  <Link href='/signIn'>Sign In</Link>
                </li>
                <li>
                  <Link href='/user'>Userpage</Link>
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
