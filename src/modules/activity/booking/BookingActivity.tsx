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
	useIonLoading,
	useIonToast,
} from '@ionic/react'
import { useMemo, useState } from 'react'
import MultiStepProgressBar, { Step } from '../../../components/MultiStepProgressBar'
import {
	BookingActions,
	useBookingAppState,
	useBookingDispatch,
} from '../../../store/BookingProvider'
import ScheduleStep from './steps/ScheduleStep'
import LevelStep from './steps/LevelStep'
import PersonsStep from './steps/PersonsStep'

import { Activity } from '../../../domain/activity'
import PricesStep from './steps/PricesStep'
import { set } from 'immer/dist/internal'
import SummaryStep from './steps/SummaryStep'
import { createBooking } from '../../../proxy/booking'
import { AppActions, useGlobalAppDispatch } from '../../../store/AppProvider'

interface BookingActivityProps {
	onDismiss: (data?: string | null) => void
}

const BookingActivity = ({ onDismiss }: BookingActivityProps) => {
	const { booking } = useBookingAppState()
	const { levels, ages } = booking?.activity as Activity;
	const [presentLoading, dismissLoading] = useIonLoading();
	const [present, dismiss] = useIonToast();
	const dispatch = useGlobalAppDispatch();

	const allSteps: Step[] = [
		{ id: 1, last: false, label: 'Horario', value: 'schedule' },
		{ id: 2, last: false, label: 'Personas', value: 'persons' },
		{ id: 3, last: false, label: 'Nivel', value: 'level' },
		{ id: 4, last: false, label: 'Precios', value: 'prices' },
		{ id: 5, last: true, label: 'Resumen', value: 'resume' },
	]

	const steps: Step[] = useMemo(() => {
		if (levels.length === 0 && ages.length === 0) {
			return allSteps.filter((s) => s.value !== 'level')
		}
		return allSteps
	}, [levels, ages])

	const onVolver = () => {
		onDismiss()
	}

	const [index, setIndex] = useState(0);

	const isStepCompleted = (step: Step) => {
		if (step.value === 'schedule') {
			return (booking?.schedulesSelected?.length ?? 0) > 0
		}
		if (step.value === 'level') {
			const invalidAge = ages.length > 0 && booking?.age === undefined
			const invalidLevel = levels.length > 0 && booking?.level === undefined
			return !(invalidAge || invalidLevel)
		}
		if (step.value === 'persons') {
			// By default the logged user it fills the persons
			return true
		}

		if (step.value === 'prices') {
			return booking?.price !== undefined
		}

		return true
	}

	const areAllPreviousStepsCompleted = (stepIndex: number) => {
		return steps.slice(0, stepIndex).every((s) => isStepCompleted(s))
	}

	const handleStep = (step: Step) => {
		const stepIndex = steps.findIndex((s) => step.id === s.id)
		if (stepIndex > 0 && !areAllPreviousStepsCompleted(stepIndex)) return
		setIndex(stepIndex)
	}

	const handleNext = () => {
		if (index < steps.length) {
			setIndex(index + 1)
		}
	}

	const checkIfContinueIsEnabled = () => {
		return isStepCompleted(steps[index])
	}

	dismissLoading();

	const handleBooking = async () => {
		try {
			if (booking) {
				if (booking.persons.some(person => !person.dni || !person.name)) {
					present({
						message: `Debe ingresar el DNI y nombre de todos los participantes`,
						duration: 3000,  // Duración en milisegundos
						color: 'danger',  // Color del toast (rojo para errores)
						position: 'top',  // Posición del toast (top, middle, bottom)
						buttons: [{
							text: 'Cerrar',
							role: 'cancel',
							handler: () => {
								dismiss();
							},
						}],
					});
					return;
				}

				if (booking.price === undefined) {
					present({
						message: `Debe seleccionar un precio`,
						duration: 3000,
						color: 'danger',
						position: 'top',
						buttons: [{
							text: 'Cerrar',
							role: 'cancel',
							handler: () => {
								dismiss();
							},
						}],
					});
					return;
				}

				presentLoading({ message: 'Creando Reserva...', spinner: 'lines' });
				const bookingReponse = await createBooking(booking);
				dispatch({ type: AppActions.AddBooking, payload: booking });
				//muestra una alerta de exito de creacion de reserva
				present({
					message: `Reserva creada con éxito`,
					duration: 3000,  // Duración en milisegundos
					color: 'success',  // Color del toast (rojo para errores)
					position: 'top',  // Posición del toast (top, middle, bottom)
					buttons: [
						{
							text: 'Cerrar',
							role: 'cancel',
							handler: () => {
								dismiss();
							},
						},
					],
				});
				dismissLoading();
				onDismiss();
			}
		} catch (error) {
			dismissLoading();
			present({
				message: `No se pudo crear la reserva ${error.message}`,
				duration: 3000,  // Duración en milisegundos
				color: 'danger',  // Color del toast (rojo para errores)
				position: 'top',  // Posición del toast (top, middle, bottom)
				buttons: [
					{
						text: 'Cerrar',
						role: 'cancel',
						handler: () => {
							dismiss();
						},
					},
				],
			});
			console.error(error)
		}
	}

	const component = useMemo(() => {
		const step = steps[index]
		switch (step.value) {
			case 'schedule':
				return <ScheduleStep />
			case 'level':
				return <LevelStep />
			case 'persons':
				return <PersonsStep />
			case 'prices':
				return <PricesStep />
			case 'resume':
				return <SummaryStep />
			default:
				return <ScheduleStep />
		}
	}, [index])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonButton onClick={() => onVolver()}>Volver</IonButton>
					</IonButtons>
					<IonTitle>{booking?.activity.name}</IonTitle>
				</IonToolbar>
				<IonToolbar>
					<IonTitle>
						<IonText>
							<h6>{booking?.activity.activityType}</h6>
						</IonText>
					</IonTitle>
				</IonToolbar>
				<IonToolbar className='ion-padding-vertical'>
					<MultiStepProgressBar
						steps={steps}
						onChangeStep={handleStep}
						selectedStep={steps[index]}
					/>
				</IonToolbar>
			</IonHeader>
			<IonContent class='ion-padding'>{component}</IonContent>
			<IonFooter>
				<IonToolbar>
					{index < steps.length - 1 && (
						<IonButton
							style={{ '--background': '#F6C745' }}
							onClick={() => {
								handleNext()
							}}
							disabled={!checkIfContinueIsEnabled()}
							expand='block'
						>
							Continuar
						</IonButton>
					)}
					{steps.length === index + 1 && <IonButton onClick={() => handleBooking()} expand='block'>Reservar</IonButton>}
				</IonToolbar>
			</IonFooter>
		</IonPage>
	)
}

export default BookingActivity
