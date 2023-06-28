import { useState, useEffect } from 'react';

const useValidateInput = (val) => {
    const [error, setError] = useState(true);

    if (!val || (val && (val.trim().length <= 0))) setError(true);
    else setError(false);

    return [val, error];
};

export default useValidateInput;
 