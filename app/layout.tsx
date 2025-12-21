"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import TopNavbar from "./components/Navbar";
import LayoutWrapper from "./components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <TopNavbar />
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
        </body>
        </html>
    );
}