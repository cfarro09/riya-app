import { FC } from "react";
import "./TrainerCard.scss"
import { IonImg } from '@ionic/react';
import { User } from "../../../../domain/user";

interface TrainerProps {
    trainer: User
}

const TrainerCard: FC<TrainerProps> = ({ trainer }) => {
    return (
        <div className="trainer">
            <IonImg className="trainer-image" src={trainer?.picture?.url || "/userdefault.png"} />
            <div className="trainer-name">{trainer.name}</div>
            <div className="trainer-sport">{trainer?.categories ? trainer?.categories[0].name : ''}</div>
        </div>
    );
};

export default TrainerCard;