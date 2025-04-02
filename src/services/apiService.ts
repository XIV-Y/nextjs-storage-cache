import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts');

  console.log('API Call!!!')

  return response.data.map(post => ({
    ...post,
    // キャッシュの確認のためにランダム値を割り振る
    title: `${post.title} [${Math.floor(Math.random() * 1000)}]`,
  }));
};
