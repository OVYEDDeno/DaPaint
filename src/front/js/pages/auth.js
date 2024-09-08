import React, { useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
    general: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? process.env.BACKEND_URL + "/api/login"
      : process.env.BACKEND_URL + "/api/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", result.access_token);
          navigate("/landing");
          console.log("Log in successful!");
          console.log("Token:", result.access_token);
        } else {
          window.location.reload();
          localStorage.setItem("username", formData.name);
        }
      } else {
        setError({
          name: "",
          email: "",
          password: "",
          city: "",
          zipcode: "",
          phone: "",
          birthday: "",
          general: result.msg || "An error occurred. Please try again.",
        });

        if (result.errors) {
          setError((prevError) => ({
            ...prevError,
            ...result.errors,
          }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError((prevError) => ({
        ...prevError,
        general: "System Overload. Please try again another time.",
      }));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const url= process.env.BACKEND_URL + "/api/forgot-password"
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:formData.email}),
    });
    const result = await response.json();

    if (response.ok) {
      alert("email has been sent")
    }
    else
    {alert("failed to send email", result.message)}
    console.log("Forgot password submission for:", formData.email);
  };

  return (
    <>
      <div className="center-container">
        <a href="/auth" onClick={() => location.reload()}>
          <img
            src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Oncoming-Fist-3d-Medium-Dark-icon.png"
            alt="Logo"
            className="DIDDYlogo"
          />
        </a>
      </div>
      <div className="container mt">
        {!isForgotPassword ? (
          <>
            <h2 className="text-center">{isLogin ? "Login" : "Sign Up"}</h2>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="btn btn-secondary w-50 mx-auto mt-4 mb-4 d-block"
            >
              Switch to {isLogin ? "Sign Up" : "Login"}
            </button>
            <form
              onSubmit={handleSubmit}
              className="mx-auto p-4 border border-2 rounded-300 w-50"
            >
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.name && (
                      <div className="alert alert-danger" role="alert">
                        {error.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.city && (
                      <div className="alert alert-danger" role="alert">
                        {error.city}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zipcode</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.zipcode && (
                      <div className="alert alert-danger" role="alert">
                        {error.zipcode}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.phone && (
                      <div className="alert alert-danger" role="alert">
                        {error.phone}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Birthday</label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.birthday && (
                      <div className="alert alert-danger" role="alert">
                        {error.birthday}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.email && (
                      <div className="alert alert-danger" role="alert">
                        {error.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.password && (
                      <div className="alert alert-danger" role="alert">
                        {error.password}
                      </div>
                    )}
                    <p>
                      By signing up, you're agreeing to our terms of service and
                      privacy policy.
                    </p>
                  </div>
                </>
              )}
              {isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Email/Username</label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.email && (
                      <div className="alert alert-danger" role="alert">
                        {error.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {error.password && (
                      <div className="alert alert-danger" role="alert">
                        {error.password}
                      </div>
                    )}
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary w-100">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            {isLogin && (
              <div className="text-center mt-3">
                <button
                  className="btn forgot-button w-50"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Username/Password?
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="container mt-5">
            <h2 className="text-center">Forgot Password</h2>
            <form
              onSubmit={handleForgotPassword}
              className="mx-auto p-4 border border-2 rounded-300 w-50"
            >
              <div className="mb-3">
                <label className="form-label">Email/Username</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
            <button
              onClick={() => setIsForgotPassword(false)}
              className="btn btn-secondary w-100 mt-3"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </>
  );
};
