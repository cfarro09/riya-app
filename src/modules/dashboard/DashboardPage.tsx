import { FC, useEffect, useMemo, useState } from 'react'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonPage, useIonModal } from '@ionic/react'
import Text, { FontWeight, TextSize } from '../../components/Text'
import CategoryGrid from './components/CategoryGrid'
import TrainerSlider from './components/TrainerSlider'
import SearchInput from './components/SearchInput'
import { useGlobalAppState } from '../../store/AppProvider'
import ActivitiesSlider from './components/ActivitiesSlider'
import ActivityModal from '../activity/Activity'
import { Activity } from '../../domain/activity'
import CategoriesAndActivities from '../lists/CategoriesAndActivities'
import { Category } from '../../domain/category'
import useAllActivities from '../../hooks/useAllActivities'
import { useAuth } from '../../store/AuthProvider'
import { User } from '../../domain/user'
import TrainerModal from '../trainer/Trainer'
import { useActivityAppState } from '../../store/ActivityProvider'
import BookingsSlider, { ActivityWithBookings } from './components/BookingsSlider'
import { Booking } from '../../domain/booking'
import BookingModal from '../bookingModal/BookingModal'

const DashboardPage: FC = () => {
  const [category, setCategory] = useState<Category>()
  const [activity, setActivity] = useState<Activity>()
  const [trainer, setTrainer] = useState<User>()
  const [booking, setBooking] = useState<ActivityWithBookings>()

  const { currentUser } = useAuth();

  const [presentActivityModal, dismissActivityModal] = useIonModal(ActivityModal, {
    onDismiss: () => dismissActivityModal(),
    onDidDismiss: () => setActivity(undefined),
    activity,
  })

  const [presentTrainerModal, dismissTrainerModal] = useIonModal(TrainerModal, {
    trainer: trainer,
    onDismiss: () => dismissTrainerModal(),
    onDidDismiss: () => setTrainer(undefined),
  });

  const [presentBookingModal, dismissBookingModal] = useIonModal(BookingModal, {
    booking1: booking,
    onDismiss: () => dismissBookingModal(),
    onDidDismiss: () => setBooking(undefined),
  });

  const [presentCategoriesModal, dismissCategoriesModal] = useIonModal(CategoriesAndActivities, {
    onDismiss: () => dismissCategoriesModal(),
    onDidDismiss: () => setCategory(undefined),
    category,
  });

  const { categories, trainers, myBookings } = useGlobalAppState();
  const { allActivities, } = useAllActivities();
  const { activities } = useActivityAppState();
  const [searchInput, setSearchInput] = useState('');

  const handleFilterCategory = async (value: string) => {
    setSearchInput(value)
  }

  const filteredCategories = useMemo(() => {
    return categories.filter((el) =>
      el.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchInput])

  console.log()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='app'>
          {currentUser?.type != "ofertante" &&
            <>
              <Text
                style={{ marginTop: 0 }}
                size={TextSize.MEDIUM}
                weight={FontWeight.BOLD}
                component='h1'
              >
                Categorias
              </Text>
              <SearchInput placeHolder='Buscar categorias' onChange={handleFilterCategory} />
              <CategoryGrid
                categories={filteredCategories}
                onClickItem={(category) => {
                  setCategory(category)
                  presentCategoriesModal()
                }}
              />
            </>
          }
          <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1'>
            Últimas actividades
          </Text>
          <ActivitiesSlider
            activities={currentUser?.type === "ofertante" ? activities as Activity[] : allActivities}
            onClickItem={(activity) => {
              setActivity(activity);
              presentActivityModal();
            }}
          />
          {currentUser?.type != "ofertante" &&
            <>
              <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1'>
                Mis reservas
              </Text>
              <BookingsSlider
                bookings={myBookings}
                onClickItem={(booking) => {
                  setBooking(booking)
                  presentBookingModal()
                  // trainers = { trainers }
                  // onClickItem = {(trainer) => openTrainerModal(trainer)}
                }}
              />
            </>
          }
          {currentUser?.type != "ofertante" &&
            <>
              <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1'>
                Entrenadores
              </Text>
              <TrainerSlider
                trainers={trainers.filter(trainer => myBookings.some(act => act.activity?.creator?.id == trainer.id))}
                onClickItem={(trainer) => {
                  setTrainer(trainer)
                  presentTrainerModal()
                  // trainers = { trainers }
                  // onClickItem = {(trainer) => openTrainerModal(trainer)}
                }}
              />
            </>
          }
        </div>
      </IonContent>
    </IonPage>
  )
}

export { DashboardPage }
