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
    const searchLower = searchInput.toLocaleLowerCase();
    const filtered = categories.filter((el) =>
      el.name.toLocaleLowerCase().includes(searchLower)
    );
    if (currentUser?.categories) {
      const userCategoryIds = new Set(currentUser.categories.map((c: any) => c.id));
      const prioritized = filtered.filter(cat => userCategoryIds.has(cat.id));
      const others = filtered.filter(cat => !userCategoryIds.has(cat.id));
      prioritized.sort((a, b) => a.name.localeCompare(b.name));
      others.sort((a, b) => a.name.localeCompare(b.name));
      return [...prioritized, ...others];
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, currentUser?.categories, searchInput]);

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
                style={{ marginTop: 0, color: 'var(--ion-color-dark)' }}
                size={TextSize.MEDIUM}
                weight={FontWeight.BOLD}
                component='h1'
              >
                Categorias
              </Text>
              <SearchInput placeHolder='Buscar' onChange={handleFilterCategory} />
              <CategoryGrid
                categories={filteredCategories}
                onClickItem={(category) => {
                  setCategory(category)
                  presentCategoriesModal()
                }}
              />
            </>
          }
          <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1' style={{ color: 'var(--ion-color-dark)' }}>
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
              <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1' style={{ color: 'var(--ion-color-dark)' }}>
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
              <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component='h1' style={{ color: 'var(--ion-color-dark)' }}>
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
