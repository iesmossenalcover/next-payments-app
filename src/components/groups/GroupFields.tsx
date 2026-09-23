import { Group } from "@/lib/apis/payments/models";
import { displayKeyErrors } from "@/lib/utils";

interface GroupComponentProps {
    errors?: Map<string, string[]>
    group: Group
}

const
    GroupFields = ({ group, errors }: GroupComponentProps) => {

        return (
            <div className="space-y-5">
                <div>
                    <label
                        className="form-label"
                        htmlFor="name">Nom</label>
                    <input
                        className="form-input"
                        id="name" name="name" defaultValue={group.name} />
                    {displayKeyErrors("name", errors)}
                </div>

                <div>
                    <label
                        className="form-label"
                        htmlFor="description">Descripció</label>
                    <input
                        className="form-input"
                        id="description" name="description" defaultValue={group.description} />
                    {displayKeyErrors("description", errors)}
                </div>
            </div>
        )
    }

export default GroupFields;