import type { AppProps } from 'next/app';
import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";
import "../lib/firebase";
import '../styles/globals.css';

function MyApp( { Component, pageProps }: AppProps )
{
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
        </div>
    );
}

export default MyApp
