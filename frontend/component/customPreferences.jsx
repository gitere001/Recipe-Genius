import { Plus } from "lucide-react";
import './components-styles/customPreference.css'
export default function CustomPreference(props) {
  return (
    <div className="add-custom-item">
      <input
        type="text"
        placeholder={props.placeholder}
        name={props.name}
      />
      <button className="add-more-choices">
        <Plus />
      </button>
    </div>
  );
}

{
  /* <fieldset>
<form action="" className="custom-preference-form">
  <input
	type="text"
	placeholder=
	name=
  />
  <button className="add-more-choices">
	<Plus />
  </button>
</form>
</fieldset>
<fieldset>
              <form className="custon-diet-form custom-preference">
                <input
                  type="text"
                  placeholder=
                  name=
                />
                <button className="add-more-choices">
                  <Plus />
                </button>
              </form>
            </fieldset> */
}
