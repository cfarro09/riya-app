import {produce, Draft} from 'immer'
import {Dispatch} from 'react'
import {castDraft} from 'immer'
import React, {createContext, FC, ReactNode, useReducer} from 'react'
import {Activity} from '../domain/activity'
import {Price, PriceDefinition} from '../domain/price'
import {Schedule} from '../domain/schedule'

interface DispatchObject<T, P = any> {
  type: T
  payload?: P
}

export type DispatchActivity = Dispatch<DispatchObject<ActivityActions>>

export enum ActivityActions {
  SetCurrentActivity = 'SET_CURRENT_ACTIVITY',
  SetActivities = 'SET_ACTIVITIES',
  SetPriceDefinition = 'SET_PRICE_DEFINITION',
  SetSchedulesToCreate = 'SET_SCHEDULES_TO_CREATE',
  SetSchedulesToDelete = 'SET_SCHEDULES_TO_DELETE',
  SetPricesToCreate = 'SET_PRICES_TO_CREATE',
  SetPricesToDelete = 'SET_PRICES_TO_DELETE',
  SetPopoverOpened = 'SET_POPOVER_OPENED',
  SetActivityForm = 'SET_ACTIVITY_FORM',
  ClearForm = 'CLEAR_FORM',
}

export const initiaFormState: ActivityForm = {
  currentActivity: {},  
  priceDefinition: null,
  popoverOpened: false,
  schedulesToCreate: [],
  schedulesToDelete: [],
  pricesToCreate: [],
  pricesToDelete: [],
}

export interface ActivityState {
  activities: Partial<Activity>[]
  activityForm: ActivityForm
}

export interface ActivityForm {
  currentActivity: Partial<Activity>
  priceDefinition: PriceDefinition | null
  popoverOpened: boolean
  schedulesToCreate: number[]
  schedulesToDelete: number[]
  pricesToCreate: number[]
  pricesToDelete: number[]
}

export const initialState: ActivityState = {
  activities: [],
  activityForm: initiaFormState,
}

export const appReducer = produce(
  (draft: Draft<ActivityState>, {type, payload}: DispatchObject<ActivityActions>) => {
    switch (type) {
      case ActivityActions.SetCurrentActivity:
        draft.activityForm = { ...draft.activityForm, currentActivity: payload }
        break
      case ActivityActions.SetActivities:
        draft.activities = payload as Partial<Activity>[]
        break
      case ActivityActions.SetPricesToCreate:
        draft.activityForm = { ...draft.activityForm, pricesToCreate: payload as number[] }
        break
      case ActivityActions.SetPricesToDelete:
        draft.activityForm = { ...draft.activityForm, pricesToDelete: payload as number[] }
        break
      case ActivityActions.SetSchedulesToCreate:
        draft.activityForm = { ...draft.activityForm, schedulesToCreate: payload as number[] }
        break
      case ActivityActions.SetSchedulesToDelete:
        draft.activityForm = { ...draft.activityForm, schedulesToDelete: payload as number[] }
        break
      case ActivityActions.SetPriceDefinition:
        draft.activityForm = { ...draft.activityForm, priceDefinition: payload as PriceDefinition }
        break
      case ActivityActions.SetPopoverOpened:
        draft.activityForm = { ...draft.activityForm, popoverOpened: payload as boolean }
        break
      case ActivityActions.SetActivityForm:
        draft.activityForm = { ...draft.activityForm, ...payload as ActivityForm }
        break
      case ActivityActions.ClearForm:
        draft.activityForm = initiaFormState
        break

      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }
)

export interface ActivityProviderInterface {
  children: ReactNode
  testStateProps?: Partial<ActivityState>
  testDispatch?: DispatchActivity
}

const ActivityStateContext = createContext<ActivityState | undefined>(undefined)
const ActivityDispatchContext = createContext<DispatchActivity | undefined>(undefined)

const ActivityProvider: FC<ActivityProviderInterface> = ({
  children,
  testStateProps,
  testDispatch,
}: ActivityProviderInterface) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <ActivityStateContext.Provider value={castDraft({...state, ...testStateProps})}>
      <ActivityDispatchContext.Provider value={testDispatch || dispatch}>
        {children}
      </ActivityDispatchContext.Provider>
    </ActivityStateContext.Provider>
  )
}

const useActivityAppState = (): ActivityState => {
  const context = React.useContext(ActivityStateContext) as ActivityState

  if (context === undefined) {
    throw new Error('useActivityAppState must be used within a ActivityStateContext')
  }

  return context
}

const useActivityDispatch = (): DispatchActivity => {
  const context = React.useContext(ActivityDispatchContext) as DispatchActivity

  if (context === undefined) {
    throw new Error('useActivityDispatch must be used within a ActivityDispatchContext')
  }

  return context
}

export {ActivityProvider, useActivityAppState, useActivityDispatch}
