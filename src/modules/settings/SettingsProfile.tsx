import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonInput,
  IonIcon,
  IonButton,
  IonLabel,
  IonProgressBar,
} from '@ionic/react';
import { FC, useEffect, useState } from 'react'
import { useUI } from '../../store/UIProvider';
import Text, { FontWeight, TextSize } from '../../components/Text';
import { getCategories } from '../../proxy/categories';
import { Category } from '../../domain/category';
import { useAuth } from '../../store/AuthProvider';
import { locationOutline } from 'ionicons/icons';
import { getUserMe, updateUser } from '../../proxy/user';


const SettingsProfilePage: FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { setShowTabs } = useUI();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(currentUser?.name!);
  const [address, setAddress] = useState(currentUser?.address!);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(currentUser?.categories!.map(el => el.id)!);

  useEffect(() => {
    const load = async () => {
      const categories = await getCategories();
      setCategoriesList(categories)
    }
    load()
  }, [])

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleOnboardingUser = async (event: any) => {
    event.preventDefault()
    try {
      if (currentUser) {
        if (address.trim().length === 0) {
          alert("Debes ingresar una dirección");
          return;
        }

        if (name.trim().length === 0) {
          alert("Debes ingresar tu nombre");
          return;
        }

        if (selectedCategories.length === 0) {
          alert("Debes seleccionar al menos una categoría");
          return;
        }
        setIsLoading(true)

        await updateUser({
          currentUserId: currentUser.id,
          categories: selectedCategories,
          type: currentUser.type || "",
          address,
          name
        });
        const user = await getUserMe();
        setCurrentUser(user);
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setShowTabs(false);

    return () => {
      setShowTabs(true);
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/tabs/settings'></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleOnboardingUser} >Guardar</IonButton>
          </IonButtons>
          <IonTitle>Editar Perfil</IonTitle>
          {isLoading && <IonProgressBar type="indeterminate"></IonProgressBar>}
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonLabel>Nombre</IonLabel>
        <div className='addressInput'>
          <IonInput class="search-input" value={name} placeholder={"Ingresa tu nombre"} onIonInput={(event: any) => setName(event.target.value)} />
        </div>
        <IonLabel>Dirección</IonLabel>
        <div className='addressInput'>
          <IonInput value={address} class="search-input" placeholder={"Ingresa tu dirección"} onIonInput={(event: any) => setAddress(event.target.value)} >
            <IonIcon slot="end" icon={locationOutline}></IonIcon>
          </IonInput>
        </div>
        <Text size={TextSize.MEDIUM} weight={FontWeight.BOLD} component="h1">Categorias favoritas</Text>
        {categoriesList.map(category => (
          <IonButton
            key={category.id}
            color={selectedCategories.includes(category.id) ? "primary" : "medium"}
            onClick={() => toggleCategory(category.id)}
            className="categoryButton"
          >
            {category.name}
          </IonButton>
        ))}
      </IonContent>
    </IonPage>
  );
}

export { SettingsProfilePage };