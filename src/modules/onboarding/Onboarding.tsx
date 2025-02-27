import { FC, useState } from 'react'
import { IonHeader, IonTitle, IonToolbar, IonPage, IonContent, IonIcon, IonFooter, IonButton, IonInput, IonLabel, IonRadioGroup, IonItem, IonRadio } from '@ionic/react';
import Text, { FontWeight, TextSize } from '../../components/Text';
import { locationOutline } from 'ionicons/icons';
import "./Onboarding.css";
import { getUserMe, updateUser } from '../../proxy/user';
import { useAuth } from '../../store/AuthProvider';

import { useHistory } from 'react-router';
import { useGlobalAppState } from '../../store/AppProvider';
// import { User } from '../../domain/user';


const OnboardingPage: FC = () => {
	const { currentUser, setCurrentUser, } = useAuth();
	const { categories } = useGlobalAppState();
	const [address, setAddress] = useState("");
	const [type, setType] = useState("ofertante");
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [name, setName] = useState("");
	const history = useHistory();

	const toggleCategory = (categoryId: number) => {
		if (selectedCategories.includes(categoryId)) {
			setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
		} else {
			setSelectedCategories([...selectedCategories, categoryId]);
		}
	};

	const handleOnboardingUser = async () => {
		try {
			if (currentUser) {

				if (address.trim().length === 0) {
					alert("Debes ingresar una dirección");
					return;
				}

				if (name.trim().length === 0) {
					alert("Debes ingresar tu alias");
					return;
				}

				if (selectedCategories.length === 0) {
					alert("Debes seleccionar al menos una categoría");
					return;
				}

				await updateUser({
					currentUserId: currentUser.id,
					categories: selectedCategories,
					type,
					address,
					name
				});
				const user = await getUserMe();
				setCurrentUser(user);

				history.push("/tabs/home");
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Onboarding</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div className="app">
					<Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component="h1"style={{ color: 'var(--ion-color-dark)' }}>¿Cómo te podríamos ayudar?
					</Text>
					<div className='addressInput'>
						<IonInput placeholder={"Ingresa tu alias"} style={{ '--color': 'var(--ion-text-color)' }}  onIonInput={(event: any) => setName(event.target.value)} 
						/>
					</div>
					<div className='addressInput'>``
						<IonInput placeholder={"Ingresa tu dirección"} style={{ '--color': 'var(--ion-text-color)' }} onIonInput={(event: any) => setAddress(event.target.value)} />
					</div>
					<div className='addressInput'>
						<IonRadioGroup
						onIonChange={(e: any) => setType(e?.target?.value)}
						name={`type-radio`} defaultValue={"ofertante"}>
							<IonItem>
								<IonRadio mode='md' value={`ofertante`}>
									Quiero dar un servicio
								</IonRadio>
							</IonItem>
							<IonItem>
								<IonRadio mode='md' value={`demandante`}>
									Quiero comprar
								</IonRadio>
							</IonItem>
						</IonRadioGroup>
					</div>
					<Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component="h1" style={{ color: 'var(--ion-color-dark)' }}>
						{type === "ofertante" ? "¿Qué categorías desea registrar?" : "Categorias favoritas"}
					</Text>
					<div className="categorySelection">
						{categories.map(category => (
							<IonButton
								key={category.id}
								color={selectedCategories.includes(category.id) ? "primary" : "medium"}
								onClick={() => toggleCategory(category.id)}
								className="categoryButton"
							>
								{category.name}
							</IonButton>
						))}
					</div>
				</div>
			</IonContent>
			<IonFooter collapse="fade">
				<IonToolbar className='center'>
					<IonButton className='continueButton' onClick={handleOnboardingUser} >
						<IonLabel>Continuar</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	)
}

export { OnboardingPage }
