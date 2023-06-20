import { Group } from "@/lib/apis/payments/models";
import { displayKeyErrors } from "@/lib/utils";

interface GroupComponentProps {
    errors?: Map<string, string[]>
    group: Group
}

const
    GroupFields = ({ group, errors }: GroupComponentProps) => {

        return (
            <>
                <div className="mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="name">Nom</label>
                    <input
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        id="name" name="name" defaultValue={group.name} />
                    {displayKeyErrors("name", errors)}
                </div>

                <div className="mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="description">Descripció</label>
                    <input
                        className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                        id="description" name="description" defaultValue={group.description} />
                    {displayKeyErrors("description", errors)}
                </div>
            </>
        )
    }

export default GroupFields;