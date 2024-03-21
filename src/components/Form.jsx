import React from 'react';
import { InfinitySpin } from "react-loader-spinner";

const Form = ({ username, setUsername, password, setPassword, formHeading = "Form", buttonValue, onSubmit, loader = false }) => {
  return (
    <>
      <div className="auth-container">
        <form onSubmit={onSubmit}>
          <h2 className='color-black'>{formHeading}</h2>

          <div className="form-group">
            <label className='color-black' htmlFor="username">Username : </label>
            <input type="text" id='username' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} required={true} />
          </div>

          <div className="form-group">
            <label className='color-black' htmlFor="password">Password : </label>
            <input type="password" id='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
          </div>

          <div className="form-group">
            <button type="submit" className={loader ? 'with-loader' : null}>
              {buttonValue}
              {
                loader && 
                <InfinitySpin
                  visible={true}
                  width="100"
                  color="#FFF"
                  ariaLabel="infinity-spin-loading"
                  />
              }
              </button>
            {/* <ToastContainer /> */}
          </div>
        </form>
      </div>
    </>
  )
}

export default Form;
