"use client";

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    // 确保只添加一次复制按钮
    useEffect(() => {
        const addCopyButtons = () => {
            // 移除已存在的复制按钮
            document.querySelectorAll('.copy-button').forEach(btn => btn.remove());

            document.querySelectorAll('pre').forEach((pre) => {
                if (pre.querySelector('.copy-button')) return;

                const copyButton = document.createElement('button');
                copyButton.innerHTML = '复制';
                copyButton.className = 'copy-button absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10';

                copyButton.addEventListener('click', async () => {
                    const code = pre.querySelector('code')?.textContent || '';
                    try {
                        await navigator.clipboard.writeText(code);
                        copyButton.textContent = '已复制!';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 1500);
                    } catch (err) {
                        console.error('复制失败:', err);
                        copyButton.textContent = '失败';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 1500);
                    }
                });

                pre.classList.add('group', 'relative');
                pre.appendChild(copyButton);
            });
        };

        // 清除之前的监听器
        document.querySelectorAll('.copy-button').forEach(btn => btn.remove());

        // 添加新的监听器
        setTimeout(addCopyButtons, 100);
    }, [content]);


    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
                rehypeRaw,
                [rehypeSanitize, {
                    tagNames: ['div', 'span', 'p', 'strong', 'em', 'a', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'br', 'hr'],
                    attributes: {
                        a: ['href', 'target', 'rel'],
                        img: ['src', 'alt', 'width', 'height', 'loading'],
                        code: ['className'],
                        pre: ['className'],
                    },
                    protocols: {
                        href: ['http', 'https', 'mailto'],
                        src: ['http', 'https', 'data'],
                    },
                }],
                [rehypeHighlight, { detect: true }]
            ]}
            components={{
                // 修复类型错误：为code组件定义正确的类型
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');

                    // 内联代码
                    if (inline) {
                        return (
                            <code
                                className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    }

                    // 代码块 - 修复未占满问题
                    return (
                        <pre className={`rounded-lg overflow-x-auto my-4 p-0 ${match ? 'relative' : ''}`}>
                            {match && (
                                <span className="absolute top-2 left-3 text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded">
                                    {match[1]}
                                </span>
                            )}
                            <code
                                className={`${className} bg-[#282c34] w-full p-4`}
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    background: '#282c34',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {children}
                            </code>
                        </pre>
                    );
                },
                // 修复图片组件
                img: ({ src, alt, ...props }) => {
                    // 生成唯一的图片ID用于标题
                    const imgId = `img-${Math.random().toString(36).substr(2, 9)}`;

                    return (
                        <div className="my-6 flex flex-col items-center">
                            <div
                                className="group relative cursor-pointer max-w-full overflow-hidden rounded-xl transition-all duration-300"
                                onClick={() => {
                                    // 点击放大功能
                                    const fullScreenImg = document.createElement('div');
                                    fullScreenImg.innerHTML = `
                                        <div class="backGrounds fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-90 p-4">
                                            <div class="relative max-w-full max-h-full">
                                                <img src="${src}" class="max-w-full max-h-96 object-contain" />
                                                <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">&times;</button>
                                                ${alt ? `<div class="absolute bottom-4 left-0 right-0 text-center text-white text-sm px-4 py-2 bg-opacity-70 rounded-b-lg">${alt}</div>` : ''}
                                            </div>
                                        </div>
                                    `;
                                    document.body.appendChild(fullScreenImg);

                                    // 关闭功能
                                    fullScreenImg.querySelector('button')?.addEventListener('click', () => {
                                        document.body.removeChild(fullScreenImg);
                                    });
                                    fullScreenImg.addEventListener('click', (e) => {
                                        if (e.target === fullScreenImg) {
                                            document.body.removeChild(fullScreenImg);
                                        }
                                    });
                                }}
                            >
                                <img
                                    src={src}
                                    alt={alt || '图片'}
                                    width="100%"
                                    height="auto"
                                    loading="lazy"
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105 object-contain"
                                    {...props}
                                />
                                {/* 悬停时显示放大图标 */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="text-white text-lg font-bold">点击查看大图</span>
                                </div>
                            </div>
                        </div>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}