import { PostData } from '@/types/Post'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PostsState = {
  posts: PostData[],
}

const initialState: PostsState = {
  posts: [],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts(state, action: PayloadAction<PostsState>) {
      const uniqueNewPosts = action.payload.posts
          .filter(post => !state.posts.find(p => p.id === post.id))

      return {
        posts: [...state.posts, ...uniqueNewPosts]
      }
    },
    clearPosts(state) {
      return {
        ...state,
        posts: []
      }
    }
  },
})

export const { addPosts, clearPosts } = postsSlice.actions
export default postsSlice.reducer