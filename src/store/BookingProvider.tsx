import { produce, Draft } from 'immer'
import { Dispatch } from 'react'
import { castDraft } from 'immer'
import React, { createContext, FC, ReactNode, useReducer } from 'react'
import { Booking } from '../domain/booking'

interface DispatchObject<T, P = any> {
  type: T
  payload?: P
}

export type DispatchBooking = Dispatch<DispatchObject<BookingActions>>

export enum BookingActions {
  ClearData = 'CLEAR_DATA',
  SetBooking = 'SET_BOOKING',
}

export interface BookingState {
  booking: Booking | null
}

export const initialState: BookingState = {
  booking: null
}

export const appReducer = produce(
  (draft: Draft<BookingState>, { type, payload }: DispatchObject<BookingActions>) => {
    switch (type) {
      case BookingActions.SetBooking:
        draft.booking = payload
        break
      case BookingActions.ClearData:
        return initialState;
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }
)

export interface BookingProviderInterface {
  children: ReactNode
  testStateProps?: Partial<BookingState>
  testDispatch?: DispatchBooking
}

const BookingStateContext = createContext<BookingState | undefined>(undefined)
const BookingDispatchContext = createContext<DispatchBooking | undefined>(undefined)

const BookingProvider: FC<BookingProviderInterface> = ({
  children,
  testStateProps,
  testDispatch,
}: BookingProviderInterface) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <BookingStateContext.Provider value={castDraft({ ...state, ...testStateProps })}>
      <BookingDispatchContext.Provider value={testDispatch || dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingStateContext.Provider>
  )
}

const useBookingAppState = (): BookingState => {
  const context = React.useContext(BookingStateContext) as BookingState

  if (context === undefined) {
    throw new Error('useBookingAppState must be used within a BookingStateContext')
  }

  return context
}

const useBookingDispatch = (): DispatchBooking => {
  const context = React.useContext(BookingDispatchContext) as DispatchBooking

  if (context === undefined) {
    throw new Error('useBookingDispatch must be used within a BookingDispatchContext')
  }

  return context
}

export { BookingProvider, useBookingAppState, useBookingDispatch }
