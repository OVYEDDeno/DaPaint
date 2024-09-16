import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import ProtectedRoute from "./component/ProtectedRoute";
import {ForgotPassword} from "./component/forgotpassword";
import {Profile} from "./component/profile";


import { Home } from "./pages/home";
import { About } from "./pages/about";
import injectContext from "./store/appContext";

import { Auth } from "./pages/auth";
import { Code } from "./pages/code";
import { Landing } from "./pages/landing";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<About />} path="/about" />
                        <Route element={<Auth />} path="/auth" />
                        <Route element={<Code />} path="/code" />
                        <Route element={<ForgotPassword />} path="/forgot-password" />
                        <Route element={<ProtectedRoute>
                            <Landing />
                        </ProtectedRoute>} path="/landing" />
                        <Route element={<ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>} path="/profile" />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
