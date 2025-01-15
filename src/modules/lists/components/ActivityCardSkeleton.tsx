import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSkeletonText } from "@ionic/react";

const ActivityCardSkeleton = () => (
  <IonCard>
    <IonSkeletonText animated={true} style={{ width: '100%', height: "200px" }}></IonSkeletonText>
    <IonCardHeader>
      <IonCardSubtitle>
        <IonSkeletonText animated={true} style={{ width: '100%', height: "40px" }}></IonSkeletonText>
      </IonCardSubtitle>
      <IonCardTitle>
        <IonSkeletonText animated={true} style={{ width: '100%' }}></IonSkeletonText>
      </IonCardTitle>
    </IonCardHeader>
  </IonCard>
)

export default ActivityCardSkeleton;