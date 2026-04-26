"use client";
import { useState, useEffect } from "react";
import Header from "@/components/commons/Header";
import Wrapper from "@/components/commons/Wrapper";
import Main from "@/components/commons/Main";
import Footer from "@/components/commons/Footer";
import Alert from "@/components/ui/Alert";
import AdminSidebar from "@/components/admin/AdminSidebar";
import adminLayout from '@styles/AdminLayout.module.css';

export default function AdminLayout({ children }) {
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [mobile, setMobile] = useState(false);

  const hiddenBody = (show) => {
    if (!show) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("hidden");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.classList.remove("hidden");
      document.body.style.paddingRight = "";
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 767;
      setMobile(isMobile);
      setShowAdminSidebar(!isMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (mobile) {
      hiddenBody(showAdminSidebar);
    }
    return () => {
      if (mobile) hiddenBody(true);
    };
  }, [showAdminSidebar, mobile]);

  return (
    <>
      <Header
        page="admin"
        setShowAdminSidebar={setShowAdminSidebar}
        showAdminSidebar={showAdminSidebar}
      />
      <Wrapper>
        <AdminSidebar showAdminSidebar={showAdminSidebar} setShowAdminSidebar={setShowAdminSidebar} mobile={mobile} />
        <Main>
          <div className={`${showAdminSidebar ? adminLayout._ : adminLayout._ + " " + adminLayout.full}`}>{children}</div>
        </Main>
      </Wrapper>
      <Footer />
      <Alert />
    </>
  );
}