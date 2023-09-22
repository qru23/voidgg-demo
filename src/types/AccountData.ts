import { RegionType } from './RegionType'

export type AccountData = {
  account_level: number,
  card: {
    wide: string,
  },
  region: RegionType,
  name: string,
  tag: string,  
}