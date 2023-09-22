import { PostData } from '@/types/Post'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { addPosts, PostsState } from '../stores/posts'

export type GetPostsArgs = {
  page: number,
  limit: number,
  filter: string,
}

export type GetPostsData = {
  posts: PostData[],
  hasMore: boolean,
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://6396aee2a68e43e41808fa18.mockapi.io/api/posts/'
  }),
  endpoints: (build) => ({
    getPosts: build.query<PostsState, GetPostsArgs>({
      query: ({ page, limit, filter }) => ({ url: `?page=${page}&limit=${limit}&filter=${filter}` }),
      transformResponse(result: PostData[], meta, args) {
        return {
          posts: result,
        }
      }
    }),
    getPostById: build.query<PostData, string>({
      query: (id) => ({ url: `/${id}` })
    })
  })
})

export const { 
  useGetPostsQuery,
  useGetPostByIdQuery,
} = postsApi