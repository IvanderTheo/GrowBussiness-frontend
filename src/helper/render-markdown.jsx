import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const renderMarkdown = (text) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({children}) => (
                    <h1 className="text-3xl font-bold mb-4">
                        {children}
                    </h1>
                ),

                h2: ({children}) => (
                    <h2 className="text-2xl font-bold mb-3">
                        {children}
                    </h2>
                ),

                p: ({children}) => (
                    <p className="mb-2 leading-7">
                        {children}
                    </p>
                ),

                ul: ({children}) => (
                    <ul className="list-disc ml-6 mb-3">
                        {children}
                    </ul>
                ),

                ol: ({children}) => (
                    <ol className="list-decimal ml-6 mb-3">
                        {children}
                    </ol>
                ),

                code({inline, children}) {
                    return inline ? (
                        <code className="bg-gray-700 px-1 rounded">
                            {children}
                        </code>
                    ) : (
                        <pre className="bg-black p-4 rounded-xl overflow-x-auto">
                            <code>
                                {children}
                            </code>
                        </pre>
                    );
                }
            }}
        >
            {text}
        </ReactMarkdown>
    );
};