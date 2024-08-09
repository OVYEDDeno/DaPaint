import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import ProtectedRoute from "./component/ProtectedRoute";

import { Home } from "./pages/home";
import { About } from "./pages/about";
import injectContext from "./store/appContext";

import { Auth } from "./pages/auth";
import { Landing } from "./pages/landing";
import { Profile } from "./component/profile";
import { Wlsub } from "./component/wlsub";
import { Wallet } from "./component/wallet";
import { Setting } from "./component/setting";
import { Lineup } from "./component/lineup";
import { Invite } from "./component/invite";
import { EditProfile } from "./component/editprofile";
import DaPaintList from "./component/dapaintlist";
import { DaPaintCreate } from "./component/dapaintcreate";
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
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<About />} path="/about" />
                        <Route element={<Auth />} path="/auth" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<ProtectedRoute>
                            <Landing />
                        </ProtectedRoute>} path="/landing" />
                        <Route element={<DaPaintCreate />} path="/dapaintcreate" />
                        <Route element={<DaPaintList />} path="/dapaintlist" />
                        <Route element={<EditProfile />} path="/editprofile" />
                        <Route element={<Invite />} path="/invite" />
                        <Route element={<Lineup />} path="/lineup" />
                        <Route element={<Setting />} path="/setting" />
                        <Route element={<Wallet />} path="/wallet" />
                        <Route element={<Wlsub />} path="/wlsub" />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
