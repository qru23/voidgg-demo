export type MatchPlayerData = {
  puuid: string,
  team: 'Blue' | 'Red'
  stats: {
    kills: number,
    assists: number,
    deaths: number,
  },
  character: string,
}

export type MatchData = {
  metadata: {
    map: string,
    matchid: string,
    game_length: number,
    game_start_patched: string,
  }
  players: {
    all_players: MatchPlayerData[],
    red: MatchPlayerData[],
    blue: MatchPlayerData[],
  },
  teams: {
    red: {
      has_won: boolean,
    },
    blue: {
      has_won: boolean,
    }
  }
}