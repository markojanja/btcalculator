import { useState } from "react";

// Keeps a form's values in one object; setField("title") returns an onChange handler.
const useFormState = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const setField = (name) => (value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  return { values, setValues, setField };
};

export default useFormState;
