import Spinner from "react-bootstrap/Spinner";

export default function spinner() {
  return (
    <div className='spinnerDiv'>
      <Spinner animation='border' role='status' variant='secondary'></Spinner>
    </div>
  );
}
