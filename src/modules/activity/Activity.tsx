import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonContent,
	IonFooter,
	IonText,
	useIonModal,
	IonIcon,
} from '@ionic/react'

import { FC, useEffect, useRef, useState } from 'react'
import { Activity } from '../../domain/activity'
import ActivityImagesSlider from './components/ActivityImagesSlider'
import './Activity.scss'
import BookingActivity from './booking/BookingActivity'
import { BookingActions, useBookingDispatch } from '../../store/BookingProvider'
import { Booking } from '../../domain/booking'
import { useGlobalAppState } from '../../store/AppProvider'
import { Media } from '../../domain/media'
import useAllActivities from '../../hooks/useAllActivities'
import trekkingImg from '../../assets/img/trekking.jpeg'
import { has } from 'immer/dist/internal'
import { useAuth } from '../../store/AuthProvider'
import { alarmOutline, checkboxOutline, checkmarkCircle, gridOutline, information, informationCircle, informationOutline, layersOutline, locationOutline, manOutline, pricetagOutline } from 'ionicons/icons'

interface ActivtyModalProps {
	onDismiss: (data?: string | null) => void
	activity: Partial<Activity>
	onSave: (activity?: Partial<Activity>) => Promise<void>
}

const ActivtyModal: FC<ActivtyModalProps> = ({ onDismiss, onSave, activity }) => {
	const bookingDispatch = useBookingDispatch()
	const { currentUser } = useAuth()
	const { loadAllActivities } = useAllActivities()
	const { categories } = useGlobalAppState()

	const getCatgoryPicture = (): Media => {
		if (activity?.category?.id === undefined) return { id: 0, name: '', url: trekkingImg }
		return (
			categories.find((c) => c.id === activity?.category?.id)?.picture ?? {
				id: 0,
				name: '',
				url: trekkingImg,
			}
		)
	}

	const hasPrices = activity?.prices?.length ?? 0 > 0
	const hasSchedules = activity?.schedules?.length ?? 0 > 0

	const categoryPicture: Media = getCatgoryPicture()

	const updateBooking = (booking: Partial<Booking>) => {
		bookingDispatch({
			payload: booking,
			type: BookingActions.SetBooking,
		})
	}

	useEffect(() => {
		loadAllActivities()
	}, [])

	const [presentBookingActivity, dismissBookingActivity] = useIonModal(BookingActivity, {
		onDismiss: () => onDismissBooking(),
		updateBooking,
	})

	const onDismissBooking = () => {
		bookingDispatch({ type: BookingActions.SetBooking, payload: { activity } })
		dismissBookingActivity()
	}

	const mapRef = useRef<HTMLDivElement>(null)

	async function createMap() {
		if (!mapRef.current) return
		if (!activity.lat || !activity.lng) return
		const coords = {
			lat: activity.lat,
			lng: activity.lng,
		}

		const map = new window.google.maps.Map(mapRef.current, {
			center: coords,
			zoom: 17,
			streetViewControl: false,
			mapTypeControl: false,
			zoomControl: false,
			draggable: false,
		})

		if (coords.lat !== 0) {
			new window.google.maps.Marker({
				position: coords,
				map: map,
				title: activity.address,
				draggable: false,
			})
		}
	}

	useEffect(() => {
		createMap()
	}, [mapRef])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonButton onClick={() => onDismiss()}>Volver</IonButton>
					</IonButtons>
					<IonTitle >{activity.activityType} {activity.name?.toUpperCase()}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent >
				<div className='ion-padding' style={{ marginTop: 12 }}>
					<ActivityImagesSlider pictures={activity.pictures ?? [categoryPicture]} />
					<div style={{ marginTop: 20 }}>
						<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<IonIcon size='small' icon={informationOutline} />
							<div style={{fontWeight: "bold"}}>Información General</div>
						</div>
						<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.description}</div>
					</div>
					
					{activity.additionalItems && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={checkboxOutline} />
								<div style={{fontWeight: "bold"}}>A tomar en cuenta</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.additionalItems}</div>
						</div>
					)}

					{activity.category && (
						
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={gridOutline} />
								<div style={{fontWeight: "bold"}}>Categoria</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.category?.name}</div>
						</div>
						// <IonText>
						// 	<h4>Categoria</h4>
						// 	<p>{activity.category?.name}</p>
						// </IonText>
					)}
					<div style={{ marginTop: 16 }}>
						<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<IonIcon size='small' icon={layersOutline} />
							<div style={{fontWeight: "bold"}}>Tipo</div>
						</div>
						<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.activityType}</div>
					</div>
					{/* <IonText>
						<h4>Tipo</h4>
						<p>{activity.activityType}</p>
					</IonText> */}
					{(activity?.levels?.length ?? 0) > 0 && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={checkmarkCircle} />
								<div style={{fontWeight: "bold"}}>Nivel</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.levels?.map((level) => level.name).join(', ')}</div>
						</div>
					)}
					{(activity?.ages?.length ?? 0) > 0 && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={manOutline} />
								<div style={{fontWeight: "bold"}}>Edades</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.ages?.map((age) => age.name).join(', ')}</div>
						</div>
					)}
					{activity?.vacancies !== undefined && activity.vacancies! > 0 && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={pricetagOutline} />
								<div style={{fontWeight: "bold"}}>Vacantes</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.vacancies}</div>
						</div>
					)}
					{activity?.duration && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={alarmOutline} />
								<div style={{fontWeight: "bold"}}>Duración</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.duration?.minutes}</div>
						</div>
					)}
					{activity.address && (
						<div style={{ marginTop: 16 }}>
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<IonIcon size='small' icon={locationOutline} />
								<div style={{fontWeight: "bold"}}>Ubicación</div>
							</div>
							<div style={{ marginLeft: 32, marginTop: 6 }}>{activity.address}</div>
							<div
								ref={mapRef}
								id='map'
								style={{ display: 'block', width: '100%', height: '200px', borderRadius: '10px', marginTop: 8 }}
							/>
						</div>
					)}
				</div>
			</IonContent>
			{hasPrices && hasSchedules && currentUser?.type !== "ofertante" && (
				<IonFooter>
					<IonToolbar>
						<IonButton
							style={{ '--background': '#F6C745' }}
							onClick={() => {
								updateBooking({ activity: activity, creator: currentUser })
								presentBookingActivity()
							}}
							expand='block'
						>
							Reservar
						</IonButton>
					</IonToolbar>
				</IonFooter>
			)}
		</IonPage>
	)
}

export default ActivtyModal
