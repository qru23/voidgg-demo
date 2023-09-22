import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react'
import { Title, Text, Flex, Card, Avatar, Image, Input } from '@mantine/core'
import { useGetPostsQuery } from '@/services/posts'
import { PostData } from '@/types/Post'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '../hooks'
import { clearPosts, addPosts } from '../stores/posts'
import DisplayPost from '@/components/DisplayPost'
import { useDebounce } from 'usehooks-ts'

const PAGE_LIMIT = 5

export default function Posts() {
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 500)

  const [moreResults, setMoreResults] = useState(false)
  const [page, setPage] = useState(1)

  const { posts } = useAppSelector((state) => state.posts)

  const dispatch = useAppDispatch()

  const { data: queryData, error, isLoading, currentData } 
    = useGetPostsQuery({ page: page, limit: PAGE_LIMIT, filter: debouncedFilter })
    
  useEffect(() => {
    if (queryData === undefined) return
    
    setMoreResults(queryData.posts.length >= PAGE_LIMIT)
    
    // We need to add a delay so we make sure we only add posts after they've been cleared
    setTimeout(() => {
      dispatch(addPosts(queryData))
    }, 10)
  }, [queryData])

  const loadMorePosts = useCallback(() => {
    setPage(page + 1)
  }, [page])

  // Clear our current posts when we change our filter
  useEffect(() => {
    setPage(1)
    dispatch(clearPosts())
  }, [debouncedFilter])

  return (
    <>
      <Flex justify="space-between" align="center">
        <Title order={1} mb={10}>Posts</Title>
        <Input 
          placeholder='Search'
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setFilter(e.target.value) }}
        />
      </Flex>
      {
        isLoading ?
        <Text>Loading posts..</Text>
        : error ? 
        <Text>Error getting posts :(</Text>
        :
        <InfiniteScroll
          next={loadMorePosts}
          dataLength={posts.length}
          hasMore={moreResults}
          loader={<Text>Loading more posts..</Text>}
          endMessage={<Text>That's all the posts!</Text>}
        >
          <Flex 
            direction="column"
            gap={10}
          >
            {
              posts.map(post => (
                <DisplayPost
                  key={post.id}
                  post={post}
                  withLinks={true}
                />
              ))
            }
          </Flex>          
        </InfiniteScroll>
      }
    </>
  )
}
