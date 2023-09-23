import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { Title, Text, Flex, Card, Image, Grid } from '@mantine/core'
import {  useGetPlayerAccountQuery, useGetPlayerMatchHistoryQuery } from "@/services/valorant"
import { IconArrowBadgeUpFilled } from '@tabler/icons-react'
import { MatchData } from '@/types/MatchData'

export default function Player() {
  const { query } = useRouter() 

  const { data: player, error: getPlayerError, isLoading: getPlayerLoading } 
    = useGetPlayerAccountQuery(query.id as string, { skip: !Boolean(query.id) });

  const { 
    data: matchHistory, 
    error: matchHistoryError, 
    isLoading: matchHistoryLoading 
  } = useGetPlayerMatchHistoryQuery({ 
    region: player?.region || 'na',
    name: player?.name || '',
    tag: player?.tag || ''
  }, {
    skip: !Boolean(player)
  })

  return (
    <Flex 
      gap={10}
      direction="column"
    >
      <Card bg="dark" c="white">
      {
        getPlayerLoading ?
        <Text>Loading player data..</Text>
        : getPlayerError || player === undefined ?
        <Text>Error fetching player data :(</Text>
        :
        <>
          <Flex 
            gap={10}
            direction={{
              base: 'column',
              sm: 'row'
            }}
          >
            <Image src={player.card.wide} />
            <Flex direction="column">
              <Title order={1}>{player.name}</Title>
              <Title order={2} fw="normal">#{player.tag}</Title>
              <Flex>
                <IconArrowBadgeUpFilled />
                <Text>{player.account_level}</Text>
              </Flex>
            </Flex>
          </Flex>
        </>
      }
      </Card>

      <Card bg="dark" c="white">
        <Title order={2} mb={6}>Recent Matches</Title>
        {
          player === undefined || matchHistoryLoading ?
          <Text>Loading match history..</Text>
          : matchHistoryError || matchHistory === undefined ?
          <Text>Error fetching match history :(</Text>
          :
          <Flex direction="column" gap={10}>
            {
              matchHistory.map(match => (
                <RecentMatch 
                  key={match.metadata?.matchid || ''}
                  match={match} 
                />
              ))
            }
          </Flex>
        }
      </Card>    
    </Flex>
  )
}

function RecentMatch({ match }: { match: MatchData }) {
  const { query } = useRouter() 

  const playerData = useMemo(() => {
    return match.players.all_players.find(p => p.puuid === query.id)
  }, [match])

  const gameWon = useMemo(() => {
    if (!playerData) return false

    const winningTeam: 'Blue' | 'Red' = match.teams.blue.has_won ? 'Blue' : 'Red'
    return playerData.team === winningTeam
  }, [match, playerData])

  const duration = useMemo(() => {
    const length = match.metadata.game_length 

    // data is in seconds
    const minutes = Math.floor(length / 60)
    const seconds = Math.floor(length % 60)

    return `${minutes} min ${seconds} seconds`
  }, [match])

  const iconUrl = useMemo(() => {
    const characterName = (playerData?.character ?? '').replace('/', '').toLowerCase()
    return `https://www.valorantpicker.com/assets/imgs/agents/icons/${characterName}.png`
  }, [playerData])

  return (
    <Flex 
      align="center"
      justify="space-between"
      bg={gameWon ? 'red' : 'green'}
      gap={50}
      direction={{
        base: 'column',
        sm:'row',
      }}
      pr={10}
    >
      <Flex
        align="center"
        justify="space-between"
        w="100%"
      >
        <Flex 
          align="center" 
          gap={10}
          justify="space-between"
        >
          <Image src={iconUrl} w={80} h="auto" fit="cover" />
          <Flex direction="column">
            <Title order={3}>{playerData?.character}</Title>
            <Title order={4} fw="normal">{match.metadata.map}</Title>
          </Flex>
        </Flex>

        <Flex 
          justify="space-between"
          w={75}
        >
          <Flex direction="column" align="center">
            <Text>K</Text>
            <Text>{playerData?.stats.kills}</Text>
          </Flex>
          <Flex direction="column">
            <Text>D</Text>
            <Text>{playerData?.stats.deaths}</Text>
          </Flex>
          <Flex direction="column">
            <Text>A</Text>
            <Text>{playerData?.stats.assists}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex 
        direction="column" 
        align="flex-end"
        w="100%"
      >
        <Text>{duration}</Text>
        <Text>{match.metadata.game_start_patched}</Text>
      </Flex>
    </Flex>
  )
}