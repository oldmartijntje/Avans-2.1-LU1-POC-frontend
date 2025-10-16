import { useState, useEffect } from "react";

interface Post {
    id: number;
    title: string;
    body: string;
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-gray-600">Loading...</p>;

    return (
        <section className="p-6">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <ul className="space-y-3">
                {posts.map(post => (
                    <li key={post.id} className="border p-3 rounded-lg hover:bg-gray-50">
                        <h2 className="text-lg font-semibold">{post.title}</h2>
                        <p className="text-sm text-gray-700">{post.body}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
