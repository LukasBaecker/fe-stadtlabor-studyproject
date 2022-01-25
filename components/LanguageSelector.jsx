import Dropdown from "react-bootstrap/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../store/actions/index.js";

function LanguageDropdown() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  return (
    <Dropdown id="languageDropdown">
      <Dropdown.Toggle variant="secondary" id="languageDropdownToggle">
        {lang === "eng" ? "US" : "DE"}
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
  );
}

export default LanguageDropdown;
