import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch