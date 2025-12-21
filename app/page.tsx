"use client"
import Image from 'next/image'
import { useSpring, animated } from "react-spring";
import { RiGithubLine, RiMailCheckLine, RiWechatLine } from "@remixicon/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function HomePage() {
    // 动画效果
    const props = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 15 },
    });
    // 滚动到文章页
    const router = useRouter();

    useEffect(() => {
        const handleScroll = (e: { deltaY: number; }) => {
            // 向下滚动跳转到文章页
            if (e.deltaY > 0) router.push('/pages/article');
            // 向上滚动跳转到首页（如果不在首页）
            else if (window.scrollY > 0) router.push('/');
        };

        window.addEventListener('wheel', handleScroll, { passive: true });
        return () => window.removeEventListener('wheel', handleScroll);
    }, [router]);
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
                    {/* 左侧内容 - 头像和介绍 */}
                    <div className="flex flex-col items-center text-center w-full max-w-md lg:max-w-lg">
                        <animated.div
                            style={props}
                            className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mb-4 sm:mb-6
                                       bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full
                                       flex items-center justify-center  border-white
                                     transition-shadow duration-300 overflow-hidden"
                        >
                            <Image
                                src="/Av.png"
                                alt="Avatar with glasses"
                                width={160}
                                height={160}
                                className="rounded-full object-cover w-full h-full"
                                priority
                            />
                        </animated.div>

                        <animated.div style={props} className="mb-3 sm:mb-4">
                            <h2 className="font-bold text-yellow-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                                Hello Friends!
                            </h2>
                        </animated.div>

                        <animated.div style={props} className="mb-5 sm:mb-6 px-4 sm:px-6">
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                                Hello! 我是一个前端的爱好者，励志成为一个高级的前端架构师！
                            </p>
                        </animated.div>

                        <animated.div style={props} className="SocialIcon">
                            <ul className="flex justify-center items-center gap-3 sm:gap-4">
                                {[RiMailCheckLine, RiWechatLine, RiGithubLine].map((Icon, index) => (
                                    <li
                                        key={index}
                                        className="rounded-full w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14
                                                   bg-gray-100 flex items-center justify-center
                                                   hover:bg-amber-100 active:bg-gray-50
                                                   transition-all duration-300 transform hover:scale-110 active:scale-95
                                                  cursor-pointer"
                                    >
                                        <Icon
                                            color="#854d0e"
                                            size={20}
                                            className="sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors duration-300"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </animated.div>
                    </div>

                    {/* 右侧插图 - 响应式调整 */}
                    <animated.div
                        style={props}
                        className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96
                                   bg-gradient-to-br from-yellow-50 to-orange-50
                                   rounded-full flex items-center justify-center
                                   overflow-hidden  transition-shadow duration-300
                                   hidden md:flex"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src="/sun.png"
                                alt="sun"
                                width={80}
                                height={80}
                                className="opacity-30 animate-pulse w-16 h-16 sm:w-20 sm:h-20"
                            />
                        </div>
                        <Image
                            src="/Ara.png"
                            alt="Illustration"
                            width={320}
                            height={320}
                            className="object-contain p-4 sm:p-6 md:p-8 relative z-10 w-full h-full"
                        />
                    </animated.div>
                </div>
            </div>
        </div>
    );
}