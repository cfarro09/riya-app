import { FC } from "react";
import "./SearchInput.scss"
import { IonIcon, IonInput } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';

interface SearchInputProps {
    placeHolder: string,
    onChange: Function
}

const SearchInput: FC<SearchInputProps> = ({ placeHolder, onChange }) => {

    const onChangeInput = (event: any) => {
        onChange(event.target.value)
    }

    return (
        <div className="search-input-wrap">
            <IonInput class="search-input"
                debounce={400}
                enterkeyhint="search"
                labelPlacement="stacked"
                placeholder={placeHolder}
                type="text"
                onInput={onChangeInput}
                clearOnEdit={true}
            >
                <IonIcon color="primary" slot="start" icon={searchOutline} aria-hidden="true"></IonIcon>
            </IonInput>
        </div>
    );
};

export default SearchInput;