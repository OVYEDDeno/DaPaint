import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import ProtectedRoute from "./component/ProtectedRoute";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Auth from "./pages/auth";
import { Landing } from "./pages/landing";
import {Profile} from "./component/profile";
import {wlsub} from "./component/wlsub";
import {wallet} from "./component/wallet";
import {settings} from "./component/settings";
import {lineup} from "./component/lineup";
import {invite} from "./component/invite";
import {editprofile} from "./component/editprofile";
import {dapaintlist} from "./component/dapaintlist";
import {dapaintcreate} from "./component/dapaintcreate";
// import {wlsub} from "./component/wlsub";

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
                    {/* <Navbar /> */}
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Auth />} path="/auth" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<ProtectedRoute>
                            <Landing />
                        </ProtectedRoute>} path="/landing" />
                        <Route element={<dapaintcreate />} path="/dapaintcreate" />
                        <Route element={<dapaintlist />} path="/dapaintlist" />
                        <Route element={<editprofile />} path="/editprofile" />
                        <Route element={<invite />} path="/invite" />
                        <Route element={<lineup />} path="/lineup" />
                        <Route element={<settings />} path="/settings" />
                        <Route element={<wallet />} path="/wallet" />
                        <Route element={<wlsub />} path="/wlsub" />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
