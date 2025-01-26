import { useState } from "react";
import "./Form.css";

const Form = () => {
  const [sameIntrest, setSameIntrest] = useState(true);

  return (
    <div className="calculator-container">
      <form className="calculator">
        <label htmlFor="price">price</label>
        <input type="text" placeholder="price" id="price" />
        <div className="input-group">
          <label
            style={{
              textAlign: "left",
              display: "inline-flex",
              marginInline: "0 auto",
              gap: ".5rem",
            }}
            htmlFor="checkbox"
          >
            set same intrest
            <input
              className="flex1"
              type="checkbox"
              checked={sameIntrest}
              onChange={(e) => setSameIntrest(e.target.checked)}
              id="checkbox"
            />
          </label>
        </div>
        {sameIntrest ? (
          <>
            <label htmlFor="intrest">Intrest</label>
            <input type="text" placeholder="intrest" id="intrest" />
          </>
        ) : (
          <>
            <div className="input-group">
              <div className="flex-col flex1">
                <label htmlFor="long_intrest">long intrest</label>
                <input type="text" placeholder="long intrest" id="long_intrest" />
              </div>
              <div className="flex-col flex1">
                <label htmlFor="short_intrest">short intrest</label>
                <input type="text" placeholder="short intrest" id="short_intrest" />
              </div>
            </div>
          </>
        )}

        <label htmlFor="lot_size">lot size</label>
        <input type="text" placeholder="lot size" id="lot_size" />
        <div className="input-group">
          <div className="flex-col flex1">
            <label htmlFor="long">Long swap</label>
            <input type="text" placeholder="long" id="long" />
          </div>
          <div className="flex-col flex1">
            <label htmlFor="short">Short</label>
            <input type="text" placeholder="short" id="short" />
          </div>
        </div>
        <button>calculate</button>
      </form>
    </div>
  );
};

export default Form;
