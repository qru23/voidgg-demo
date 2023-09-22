import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useGetLeaderboardQuery } from "../services/valorant"
import { Player } from '../types/Player';
import { Title, Text, Flex, Card, Menu, Button, Image } from '@mantine/core'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RegionType } from '@/types/RegionType'

type RegionData = {
  name: string,
  value: RegionType,
  flagUrl: string,
}

const regions: RegionData[] = [
  {
    name: 'NA',
    value: 'na',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
  },
  {
    name: 'EU',
    value: 'eu',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/EU.svg',
  },
  {
    name: 'LATAM',
    value: 'latam',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/MX.svg'
  },
  {
    name: 'BR',
    value: 'br',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg'
  },
  {
    name: 'AP',
    value: 'ap',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/AU.svg'
  },
  {
    name: 'KR',
    value: 'kr',
    flagUrl: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/KR.svg'
  },
]

const SHOW_AMOUNT = 1000;

export default function Leaderboard() {
  // Need a separate state for this because we are faking
  const [page, setPage] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(regions[0])

  const { data, error, isFetching } 
    = useGetLeaderboardQuery({ region: selectedRegion.value });

  useEffect(() => {
    console.log(data)
  }, [data])

  const showingPlayers = useMemo(() => {
    if (!data) return []
    return data.players.slice(0, Math.min(page + SHOW_AMOUNT, data.players.length))
  }, [data, page])

  const loadMoreCallback = useCallback(() => {
    setTimeout(() => {
      setPage(page + SHOW_AMOUNT)
    }, 1000)
  }, [page])

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Title order={2}>Leaderboard</Title>
        <Menu>
          <Menu.Target>
            <Button>
              <Flex align="center" gap={4}>
                <Image w={20} h={12} src={selectedRegion.flagUrl} />
                <Text>{selectedRegion.name}</Text>
              </Flex>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            {
              regions.map(region => (
                <Menu.Item
                  key={region.value}
                  onClick={() => {
                    setPage(0)
                    setSelectedRegion(region)
                  }}
                >
                  <Flex align="center" gap={4}>
                    <Image w={20} h={12} src={region.flagUrl} />
                    <Text>{region.name}</Text>
                  </Flex>
                </Menu.Item>
              ))
            }
          </Menu.Dropdown>
        </Menu>
      </div>

      {
        isFetching ?
        <Text>Loading data..</Text>
        : error || data === undefined ?
        <Text>Error loading data</Text>
        :
        <InfiniteScroll
          dataLength={showingPlayers.length}
          hasMore={showingPlayers.length < data!.players.length}
          loader={<Text>Loading more players..</Text>}
          endMessage={<Text>That's everyone!</Text>}
          next={loadMoreCallback}
        >
          <Flex direction="column" gap={5}>
          {
            showingPlayers.map((player)=> (
              <LeaderboardItem
                key={player.leaderboardRank} 
                player={player}
                isRadiant={player.leaderboardRank <= data.radiant_threshold}
              />
            ))
          }
          </Flex>
        </InfiniteScroll>

      }
    </div>
  )
}

function LeaderboardItem(
  { player, isRadiant }: 
  { player: Player, isRadiant: boolean }
) {
  return (
    <Card bg={isRadiant ? '#DB8F2F' : 'dark'} c="white">
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Text mr="md">{player.leaderboardRank}</Text>
          <Text mr="3">
            <Link href={`/player/${player.puuid}`}>{player.gameName}</Link>
          </Text>
          <Text c="#ccc" size="sm">#{player.tagLine}</Text>
        </Flex>

        <Flex gap={4}>
          <Text>{player.rankedRating}</Text>
          <Text>({player.numberOfWins})</Text>
        </Flex>
      </Flex>
    </Card>
  )
}

