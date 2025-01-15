import { Person, PersonResponse } from "../person";
import { StrapiCollectionResponse } from "../response";

export function mapPersonsResponseToPersons(personsResponse: StrapiCollectionResponse<PersonResponse>): Person[] {
    return personsResponse?.data?.map((personResponse) => ({
        id: personResponse.id,
        name: personResponse.attributes.name,
        dni: personResponse.attributes.dni,
    }));
}
    