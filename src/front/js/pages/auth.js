import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/auth.css";
import React, { useState } from 'react';
// export const login_signup = () => {
//   return (

const AuthPage = () => {
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
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            const url = isLogin ? 'http://localhost:5000/user/login' : 'http://localhost:5000/user/signup';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (response.ok) {
                    alert(isLogin ? 'Login successful' : 'Sign up successful');
                    if (isLogin) {
                        console.log('Token:', result.access_token);
                    }
                } else {
                    alert(result.msg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        return (
            <div>
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                            <input
                                type="text"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                placeholder="Zipcode"
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                required
                            />
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)}>
                    Switch to {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </div>
        );
    };
    
    export default AuthPage;
    