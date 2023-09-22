import { LeaderboardData } from '../types/LeaderboardData'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MatchData } from '@/types/MatchData'
import { RegionType } from '@/types/RegionType'

export type GetLeaderboardArgs = {
  region: RegionType,
}

export type GetPlayerMatchHistoryArgs = {
  region: RegionType,
  name: string,
  tag: string,
}

export const valorantApi = createApi({
  reducerPath: 'valorantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.henrikdev.xyz/valorant/'
  }),
  endpoints: (build) => ({
    getLeaderboard: build.query<LeaderboardData, GetLeaderboardArgs>({
      query: ({ region }) => ({ url: `v2/leaderboard/${region}` })
    }),
    getPlayerAccount: build.query<AccountData, string>({
      query: (id) => ({ url: `v1/by-puuid/account/${id}` }),
      transformResponse(returnValue: { status: number, data: AccountData }) {
        return  returnValue.data
      },
    }),
    getPlayerMatchHistory: build.query<MatchData[],  GetPlayerMatchHistoryArgs>({
      query: ({ region, name, tag }) => ({ url: `v3/matches/${region}/${name}/${tag}` }),
      transformResponse(returnValue: { status: number, data: MatchData[] }) {
        return returnValue.data
      }
    })
  })
})

export const { 
  useGetLeaderboardQuery, 
  useGetPlayerAccountQuery,
  useGetPlayerMatchHistoryQuery
} = valorantApi