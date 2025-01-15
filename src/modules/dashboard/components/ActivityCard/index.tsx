import {FC} from 'react'
import './ActivityCard.scss'
import {Activity} from '../../../../domain/activity'
import trekkingImg from '../../../../assets/img/trekking.jpeg'
import {useGlobalAppState} from '../../../../store/AppProvider'

interface TrainerProps {
  activity: Activity
}

const ActivityCard: FC<TrainerProps> = ({activity}) => {
  const {categories} = useGlobalAppState();

  const hasCategory = activity?.category?.id !== undefined;
  const hasPicture = activity?.pictures?.length > 0;

  //function to get the picture of the activity
  

  
  const picture = hasPicture
    ? activity.pictures[0].url
    : hasCategory ? categories.find((c) => c.id === activity.category.id)?.picture?.url ?? trekkingImg : trekkingImg;

  return (
    <div className='activity' style={{ border: '1px solid #ededed', width: '95%', paddingBottom: 18,  borderRadius: 8, marginRight: 8 }}>
      <img className='activity-ima' src={picture} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
      <div className='activity-name' style={{ marginLeft: 8, marginRight: 8, marginTop: 8, fontWeight: "bold" }}>{activity.name}</div>
      <div className='activity-name' style={{ marginLeft: 8, marginRight: 8, marginTop: 8 }}>{activity.category?.name}</div>
    </div>
  )
}

export default ActivityCard
