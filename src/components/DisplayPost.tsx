import { Title, Text, Flex, Card, Avatar, Menu, Button, Image, Grid } from '@mantine/core'
import { PostData } from '@/types/Post'
import Link from 'next/link'

export default function DisplayPost({ post, withLinks }: { post: PostData, withLinks: boolean }) {
  return (
    <Card
      bg="dark"
      c="white"
    >
      <Flex direction="column" gap={5}>
        <Flex gap={10} align="center" mb={5}>
          <Avatar
            src={post.authorAvatar}
          />
          <Title order={4}>{post.authorName}</Title>
        </Flex>
        
        {
          withLinks ? 
          <>
            <Link
              href={`/posts/${post.id}`}
            >
              <Image 
                src={post.postImage}
                radius="md"
              />
            </Link>
            <Link
              href={`/posts/${post.id}`}
            >
              <Text>{post.postText}</Text>
            </Link> 
          </>
          :
          <>
            <Image 
              src={post.postImage}
              radius="md"
            />
            <Text>{post.postText}</Text>
          </>
        }

        <Flex justify="flex-end" c="gray">
          <Text size="sm">{new Date(post.createdAt).toLocaleString()}</Text>
        </Flex>
      </Flex>
    </Card>
  )
}