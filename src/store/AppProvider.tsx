import { produce, Draft } from 'immer'
import { Dispatch } from 'react'
import { Category } from '../domain/category'
import { castDraft } from 'immer'
import React, { createContext, FC, ReactNode, useReducer } from 'react'
import { Level } from '../domain/level'
import { Age } from '../domain/age'
import { Package } from '../domain/package'
import { Activity } from '../domain/activity'
import { User } from '../domain/user'
import { Booking } from '../domain/booking'

interface DispatchObject<T, P = any> {
  type: T
  payload?: P
}

export type DispatchApp = Dispatch<DispatchObject<AppActions>>

export enum AppActions {
  SetUserProfile = 'SET_USER_PROFILE',
  ClearData = 'CLEAR_DATA',
  SetCategories = 'SET_CATEGORIES',
  SetAges = 'SET_AGES',
  SetLevels = 'SET_LEVELS',
  SetPackages = 'SET_PACKAGES',
  SetBookings = 'SET_BOOKINGS',
  SetActivities = 'SET_ACTIVITIES',
  SetTrainers = 'SET_TRAINERS',
  UpdateTrainerRating = 'UPDATE_TRAINER_RATING',
  AddBooking = 'ADD_BOOKING',
}

export interface AppState {
  categories: Category[]
  ages: Age[]
  levels: Level[]
  packages: Package[],
  actitivies: Activity[],
  trainers: User[],
  myBookings: Booking[]
}

export const initialState: AppState = {
  categories: [],
  ages: [],
  levels: [],
  packages: [],
  actitivies: [],
  trainers: [],
  myBookings: []
}

export const appReducer = produce(
  (draft: Draft<AppState>, { type, payload }: DispatchObject<AppActions>) => {
    switch (type) {
      case AppActions.SetCategories:
        draft.categories = payload as Category[]
        break
      case AppActions.ClearData:
        return initialState
      case AppActions.SetAges:
        draft.ages = payload as Age[]
        break
      case AppActions.SetLevels:
        draft.levels = payload as Level[]
        break
      case AppActions.SetPackages:
        draft.packages = payload as Package[]
        break
      case AppActions.SetActivities:
        draft.actitivies = payload as Activity[]
        break
      case AppActions.SetBookings:
        draft.myBookings = payload as Booking[]
        break
      case AppActions.SetTrainers:
        draft.trainers = payload as User[]
        break
      case AppActions.AddBooking:
        const booking = payload as Booking;
        draft.myBookings = [...draft.myBookings, booking]
        break
      case AppActions.UpdateTrainerRating:
        const trainer = payload as User;
        draft.trainers = draft.trainers.map(trr => trr.id === trainer.id ? trainer : trr)
        break
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }
)

export interface AppProviderInterface {
  children: ReactNode
  testStateProps?: Partial<AppState>
  testDispatch?: DispatchApp
}

const AppStateContext = createContext<AppState | undefined>(undefined)
const AppDispatchContext = createContext<DispatchApp | undefined>(undefined)

const GlobalAppProvider: FC<AppProviderInterface> = ({
  children,
  testStateProps,
  testDispatch,
}: AppProviderInterface) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppStateContext.Provider value={castDraft({ ...state, ...testStateProps })}>
      <AppDispatchContext.Provider value={testDispatch || dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

const useGlobalAppState = (): AppState => {
  const context = React.useContext(AppStateContext) as AppState

  if (context === undefined) {
    throw new Error('useAppState must be used within a AppStateContext')
  }

  return context
}

const useGlobalAppDispatch = (): DispatchApp => {
  const context = React.useContext(AppDispatchContext) as DispatchApp

  if (context === undefined) {
    throw new Error('useGlobalAppDispatch must be used within a AppDispatchContext')
  }

  return context
}

export { GlobalAppProvider, useGlobalAppState, useGlobalAppDispatch }
