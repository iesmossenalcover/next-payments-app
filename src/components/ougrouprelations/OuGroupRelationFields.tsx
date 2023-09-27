import { OuGroupRelation } from "@/lib/apis/payments/models";
import { Dispatch } from "react";
import { Selector, SelectorComponent } from "../Selector";
import Toggle from "../Toggle";
import { displayKeyErrors } from "@/lib/utils";

interface OuGroupRelationsFieldsProps {
    errors?: Map<string, string[]>
    ouGroupRelation: OuGroupRelation,
    groupSelector: Selector,
    setOuGroupRelation: Dispatch<OuGroupRelation>
}

const OuGroupRelationsFields = ({ ouGroupRelation, groupSelector, setOuGroupRelation, errors }: OuGroupRelationsFieldsProps) => {
    console.log(groupSelector)
    return (
        <>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="groupId"
                >Grup de l&apos;aplicació</label>
                <SelectorComponent
                    id="groupId"
                    name="groupId"
                    selector={groupSelector}
                    onSelect={val => setOuGroupRelation({ ...ouGroupRelation, groupId: parseInt(val) })} />
                {displayKeyErrors("groupId", errors)}
            </div>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="groupMail">Correu del grup</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="groupMail" name="groupMail"
                    value={ouGroupRelation.groupMail}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, groupMail: e.target.value })} />
                {displayKeyErrors("groupMail", errors)}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="activeOu">Unitat organitzativa activa</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="activeOu" name="activeOu"
                    value={ouGroupRelation.activeOu}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, activeOu: e.target.value })} />
                {displayKeyErrors("activeOu", errors)}
            </div>

            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="oldOu">Unitat organitzativa antiga</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="oldOu" name="oldOu"
                    value={ouGroupRelation.oldOu}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, oldOu: e.target.value })} />
                {displayKeyErrors("oldOu", errors)}
            </div>
            
            <div className="mt-5">
                <Toggle
                    name="changePasswordNextSignIn"
                    id="changePasswordNextSignIn"
                    value={ouGroupRelation.changePasswordNextSignIn}
                    onToggled={val => setOuGroupRelation({ ...ouGroupRelation, changePasswordNextSignIn: val })}
                    text="Canviar contrasenya al següent inici de sessió"
                />
            </div>
            <div className="mt-5">
                <Toggle
                    name="updatePassword"
                    id="updatePassword"
                    value={ouGroupRelation.updatePassword}
                    onToggled={val => setOuGroupRelation({ ...ouGroupRelation, updatePassword: val })}
                    text="Actualitzar contrassenya?"
                />
            </div>
            <div className="mt-3">
                {displayKeyErrors("", errors)}
            </div>
        </>
    )
}

export default OuGroupRelationsFields;