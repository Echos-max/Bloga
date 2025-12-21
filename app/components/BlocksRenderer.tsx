import React, {JSX} from 'react';

type TextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: 'link';
  url: string;
  children: TextNode[];
};

type BlockNode = TextNode | LinkNode;

type Block = {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'image';
  children?: BlockNode[];
  level?: number;
  format?: 'ordered' | 'unordered';
  image?: {
    url: string;
    alternativeText?: string;
  };
};

type BlocksContent = Block[];

interface BlocksRendererProps {
  content: BlocksContent;
}

export default function BlocksRenderer({ content }: BlocksRendererProps) {
  if (!content || !Array.isArray(content)) {
    return <p className="text-gray-500">无内容</p>;
  }

  const renderText = (node: BlockNode): React.ReactNode => {
    if (!node) return null;

    if (node.type === 'text') {
      let text: React.ReactNode = node.text;

      if (node.bold) text = <strong>{text}</strong>;
      if (node.italic) text = <em>{text}</em>;
      if (node.underline) text = <u>{text}</u>;
      if (node.strikethrough) text = <s>{text}</s>;
      if (node.code) text = <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{text}</code>;

      return text;
    }

    if (node.type === 'link') {
      return (
        <a href={node.url} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
          {node.children?.map((child, i) => <React.Fragment key={i}>{renderText(child)}</React.Fragment>)}
        </a>
      );
    }

    return null;
  };

  const renderBlock = (block: Block, index: number): React.ReactNode => {
    if (!block) return null;

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4">
            {block.children?.map((child, i) => <React.Fragment key={i}>{renderText(child)}</React.Fragment>)}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${block.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-3xl font-bold mb-4 mt-8',
          2: 'text-2xl font-bold mb-3 mt-6',
          3: 'text-xl font-semibold mb-2 mt-4',
          4: 'text-lg font-semibold mb-2 mt-3',
          5: 'text-base font-semibold mb-2 mt-2',
          6: 'text-sm font-semibold mb-1 mt-2',
        }[block.level || 1];

        return (
          <HeadingTag key={index} className={headingClasses}>
            {block.children?.map((child, i) => <React.Fragment key={i}>{renderText(child)}</React.Fragment>)}
          </HeadingTag>
        );

      case 'list':
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
        const listClass = block.format === 'ordered' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4';
        return (
          <ListTag key={index} className={listClass}>
            {block.children?.map((child, i) => (
              <li key={i} className="mb-1">
                {renderText(child)}
              </li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
            {block.children?.map((child, i) => <React.Fragment key={i}>{renderText(child)}</React.Fragment>)}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
            <code>
              {block.children?.map((child, i) => <React.Fragment key={i}>{renderText(child)}</React.Fragment>)}
            </code>
          </pre>
        );

      case 'image':
        if (block.image?.url) {
          const imageUrl = block.image.url.startsWith('/uploads/')
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${block.image.url}`
            : block.image.url;
          return (
            <img
              key={index}
              src={imageUrl}
              alt={block.image.alternativeText || ''}
              className="max-w-full h-auto rounded-lg my-4"
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="blocks-content">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
