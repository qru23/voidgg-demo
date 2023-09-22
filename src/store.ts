import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { valorantApi } from './services/valorant'
import { postsApi } from './services/posts'
import postsReducer from './stores/posts'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    [valorantApi.reducerPath]: valorantApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
      valorantApi.middleware, 
      postsApi.middleware
    )
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch