import { useRouter } from 'next/router'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Title, Text, Flex, Card, Menu, Button, Image, Grid, Avatar } from '@mantine/core'
import { useGetPostByIdQuery } from '../../services/posts'
import { useAppSelector } from '../../hooks'
import { PostData } from '@/types/Post'
import DisplayPost from '@/components/DisplayPost'

export default function Post() {
  const [post, setPost] = useState<PostData | undefined>(undefined)

  const { query } = useRouter()
  const cachedPost = useAppSelector(state => state.posts.posts.find(post => post.id === query.id ))

  const { data, error, isLoading } 
    = useGetPostByIdQuery(query.id as string, { skip: post !== undefined })

  useEffect(() => {
    console.log('cachedPost', cachedPost)
    if (cachedPost) setPost(cachedPost)
  }, [cachedPost])

  useEffect(() => {
    console.log('loaded post', data)
    if (data) setPost(data)
  }, [data])

  return (
    <>
      {
      post === undefined || isLoading ?
      <Text>Loading post..</Text>
      :
      error ?
      <Text>Error loading post!</Text>
      : 
      <DisplayPost 
        post={post}
        withLinks={false}
      />
      }
    </>
  )
}