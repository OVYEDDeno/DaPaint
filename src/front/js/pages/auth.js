import React, { useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        city: '',
        zipcode: '',
        phone: '',
        birthday: '',
    });
    const [error, setError] = useState({
        name: '',
        email: '',
        password: '',
        city: '',
        zipcode: '',
        phone: '',
        birthday: '',
        general: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setError((prevError) => ({
            ...prevError,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'https://effective-space-robot-xjgx65xw5wf67wx-3001.app.github.dev/api/login'
            : 'https://effective-space-robot-xjgx65xw5wf67wx-3001.app.github.dev/api/signup';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", result.access_token);
                    navigate("/landing");
                    console.log("Log in successful!");
                    console.log('Token:', result.access_token);
                } else {
                    window.location.reload();
                }
            } else {
                setError({
                    name: '',
                    email: '',
                    password: '',
                    city: '',
                    zipcode: '',
                    phone: '',
                    birthday: '',
                    general: result.msg || "An error occurred. Please try again."
                });

                if (result.errors) {
                    setError(prevError => ({
                        ...prevError,
                        ...result.errors
                    }));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError((prevError) => ({
                ...prevError,
                general: "System Overload. Please try again another time."
            }));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit} className="mx-auto p-4 border border-2 rounded-3 w-50">
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
                            {error.name && <div className="alert alert-danger" role="alert">{error.name}</div>}
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
                            {error.city && <div className="alert alert-danger" role="alert">{error.city}</div>}
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
                            {error.zipcode && <div className="alert alert-danger" role="alert">{error.zipcode}</div>}
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
                            {error.phone && <div className="alert alert-danger" role="alert">{error.phone}</div>}
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
                            {error.birthday && <div className="alert alert-danger" role="alert">{error.birthday}</div>}
                        </div>
                    </>
                )}
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
                    {error.email && <div className="alert alert-danger" role="alert">{error.email}</div>}
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
                    {error.password && <div className="alert alert-danger" role="alert">{error.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="btn btn-secondary w-50 mx-auto mt-3 d-block">
                Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
            {isLogin && (
                <div className="text-center mt-3">
                    <a href="#" onClick={() => alert("Forgot Username/Password clicked!")}>Forgot Username/Password?</a>
                </div>
            )}
        </div>
    );
};

export default AuthPage;
