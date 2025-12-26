"use client"
import {Card, CardHeader, Image} from "@heroui/react";
import { useSpring, animated } from 'react-spring';
import {useEffect, useState} from "react";
import {apiClient} from "@/app/utils/axios";
import Link from "next/link";
 
// 接口定义
interface ImageFormat{
    name:string;
    url:string;
    width:number;
    height:number;
}
interface FriendLinkCover{
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    url: string;
    formats?: {
        thumbnail?: ImageFormat;
        small?: ImageFormat;
        medium?: ImageFormat;
        large?: ImageFormat;
    };
}
interface FriendLinkItem {
    id: number;
    documentId: string;
    FriendLinkName: string;
    FriendLinkDesc: string;
    friendlinkUrl: string;
    FriendLinkCover: FriendLinkCover;
}
// 定义接口响应
interface ApiFriendLinksReponse{
    data: FriendLinkItem[];
    meta:{
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    }
}
const FriendLinks = () => {
    // 动效
    const props = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 15 },
    });
    // 数据定义
    const [FriendlinkList, setFriendlinkList] =useState<FriendLinkItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    // 数据请求
    useEffect(() => {
        const fetchFriendLinksData = async ()=>{
            try {
                setLoading(true)
                // apiClient 的响应拦截器已经返回了 response.data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const  response: any = await  apiClient.get<ApiFriendLinksReponse>('/api/friend-links?populate=*')
                setFriendlinkList(response.data)
                console.log('友情链接地址',response)
            }catch (error){
                console.log(error)
                setFriendlinkList([]) // 确保出错时也是空数组
            }finally {
                setLoading(false)
            }
        };
        fetchFriendLinksData()
    }, []);
    // 加载状态
    if (loading){
        return <div>Loading...</div>;
    }
    return (
        <animated.div style={props} className="w-full flex items-center justify-center flex-wrap gap-6">
            {FriendlinkList.map((item)=>{
            //     获取第一张张图
                const imageUrl = item.FriendLinkCover?.url
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.FriendLinkCover.url}`
                    : '/Banner.jpg'; // 默认图片
            return (
                <Card key={item.id} className="col-span-12 sm:col-span-4 h-[150px]">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start!">
                        {/* 此处是链接 */}
                        <Link
                            href={item.friendlinkUrl || '#'}
                            target="_blank"
                            className="text-sm text-blue-400 hover:text-gray-900  underline z-20"
                        >
                            <p className="text-tiny text-white/60 uppercase font-bold">{item.FriendLinkName}</p>
                        </Link>
                        <h4 className="text-white font-medium text-large">{item.FriendLinkDesc}</h4>

                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={imageUrl}
                    />
                </Card>
            )
            })

            }
        </animated.div>
    )
}
export default FriendLinks;