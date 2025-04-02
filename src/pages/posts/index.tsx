"use client";

import { useState, useEffect } from "react";
import { useCache } from "@/services/cacheService";
import { fetchPosts, Post } from "@/services/apiService";

export default function PostsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    cachedData: posts,
    fetchData,
    clearCache,
    isStale,
  } = useCache<Post[]>("posts", fetchPosts, {
    storageType: "localStorage",
    // duration: 10 * 1000,
  });

  // コンポーネントマウント時とキャッシュが古い場合にデータを取得
  useEffect(() => {
    const loadData = async () => {
      if (!posts || isStale) {
        setLoading(true);

        try {
          await fetchData();

          setError(null);
        } catch (error) {
          setError("データの取得に失敗しました。");

          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [fetchData, isStale, posts]);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      await fetchData(true);

      setError(null);
    } catch (error) {
      setError("データの更新に失敗しました。");

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">投稿一覧</h1>
        <div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            >
              {loading ? "更新中..." : "更新"}
            </button>
            <button
              onClick={clearCache}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              キャッシュをクリア
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && <p>読み込み中...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
          </div>
        ))}
      </div>

      {!loading && !posts?.length && <p>投稿がありません。</p>}
    </div>
  );
}
