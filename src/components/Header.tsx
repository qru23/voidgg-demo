import { Flex, Box, Button } from '@mantine/core';
import Logo from '@/assets/logo.svg'
import Link from 'next/link'

export default function Header() {
  return (
    <Flex
      align="center"
    >
      <div
        className='w-[125px] h-full overflow-hidden p-3'
      >
        <Link
          href="/"
        >
          <Logo
            width="100%"
            height="25px"
            viewBox="230 0 25 125"
            style={{
              fill: "rgb(94, 92, 230)",
            }}
          />   
        </Link>
      </div>

      <Link
        href="/posts"
      >
        Posts
      </Link>
    </Flex>
  )
}