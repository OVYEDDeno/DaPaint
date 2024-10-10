import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import {ForgotPassword} from "./component/forgotpassword";

import { Home } from "./pages/home";
import { About } from "./pages/about";
import injectContext from "./store/appContext";

import { Auth } from "./pages/auth";
import { Code } from "./pages/code";
import { Landing } from "./pages/landing";
import { Terms } from "./pages/terms";
import { Privacy } from "./pages/privacy";


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
                        <Route element={<Terms />} path="/terms" />
                        <Route element={<Privacy />} path="/privacy" />
                        <Route element={<About />} path="/about" />
                        <Route element={<Auth />} path="/auth" />
                        <Route element={<Code />} path="/code" />
                        <Route element={<ForgotPassword />} path="/forgot-password" />
                        <Route element={<Landing />} path="/landing" />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
