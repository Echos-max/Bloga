"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { RiLoginCircleLine } from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient } from "../utils/axios";
import { useEffect, useState } from "react";

// 导航定义
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function TopNavbar() {
  const pathname = usePathname();
  // 检查是否为激活状态
  const isActive = (path: string) => {
    // 处理首页逻辑
    if (path === "/" && pathname === "/") return true;
    // 处理其他路径
    return pathname.startsWith(path) && path !== "/";
  };

  
  // 登陆后台地址
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loginurlpath, setLoginUrlpath] = useState<any[]>([]);

  // 移动端底部导航项
  const mobileNavItems = [
    { label: "首页", href: "/", icon: "🏠" },
    { label: "文章", href: "/pages/articles", icon: "📝" },
    { label: "动态", href: "/pages/Dynanmin", icon: "🔄" },
    { label: "友链", href: "/pages/FriendLinks", icon: "🔗" },
    { label: "图册", href: "/pages/Album", icon: "📸" },
  ];
  useEffect(() => {
    const fetchLoginUrl = async () => {
      try {
        const res = await apiClient.get('/api/loginurls');
        const data = res?.data;
        setLoginUrlpath(Array.isArray(data) ? data : (data ? [data] : []));
        console.log('我是登陆地址', res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // 静默处理错误，避免在控制台显示 404
        if (error?.response?.status === 404) {
          console.warn('登录地址 API 端点不存在，跳过获取');
        } else {
          console.error('获取登录地址失败:', error);
        }
      }
    };
    fetchLoginUrl();
  }, []);
  return (
    <>
      {/* 顶部导航栏 - 仅在中等及以上屏幕显示 */}
      <Navbar className="lg:w-full lg:h-16 fixed md:w-full md:h-14 max-sm:hidden">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link href="/" passHref>
              <span
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  isActive("/")
                    ? "text-primary bg-primary/10 font-bold "
                    : "text-default-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                首页
              </span>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/pages/articles" passHref>
              <span
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  isActive("/pages/articles")
                    ? "text-primary bg-primary/10 font-bold "
                    : "text-default-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                文章
              </span>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/pages/Dynanmin" passHref>
              <span
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  isActive("/pages/Dynanmin")
                    ? "text-primary bg-primary/10 font-bold "
                    : "text-default-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                动态
              </span>
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="/pages/FriendLinks" passHref>
              <span
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  isActive("/pages/FriendLinks")
                    ? "text-primary bg-primary/10 font-bold "
                    : "text-default-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                友链
              </span>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/pages/Album" passHref>
              <span
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  isActive("/pages/Album")
                    ? "text-primary bg-primary/10 font-bold "
                    : "text-default-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                图册
              </span>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">

          <NavbarItem className="hidden lg:flex flex-row items-center gap-2">
            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {Array.isArray(loginurlpath) && loginurlpath.map((item: any, idx: number) => {
              const loginurls = item?.loginurl || "";
              console.log("我是登陆地址",loginurls);
              
              return (
                <Link key={loginurls || idx} href={loginurls} passHref >
                  <span className="text-default-700 hover:text-primary">
                    <RiLoginCircleLine size={23} color="#7f7e83" />
                  </span>
                </Link>
              );
            })}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      
      {/* 移动端底部导航菜单 - 仅在小屏幕显示 */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-divider">
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-2 rounded-t-xl transition-all ${
                isActive(item.href)
                  ? "text-primary font-bold"
                  : "text-default-500 hover:text-primary"
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          {/* 移动端登录项 */}
          {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {Array.isArray(loginurlpath) && loginurlpath.map((item: any, idx: number) => {
            const loginurls = item?.loginurl || "";
            const loginName = item?.loginName || "登录";

            return (
              <Link
                key={loginurls || `login-${idx}`}
                href={loginurls || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full py-2 rounded-t-xl transition-all text-default-500 hover:text-primary"
              >
                <span className="text-xl mb-1">👤</span>
                <span className="text-xs">{loginName}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* 为底部导航预留空间，防止内容被遮挡 */}
      <div className="sm:hidden pb-28"></div>
    </>
  );
}