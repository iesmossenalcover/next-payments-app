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
    return (
        <div className="space-y-5">
            <div>
                <label
                    className="form-label"
                    htmlFor="groupId"
                >Grup de l&apos;aplicació</label>
                <SelectorComponent
                    id="groupId"
                    name="groupId"
                    selector={groupSelector}
                    onSelect={val => setOuGroupRelation({ ...ouGroupRelation, groupId: parseInt(val) })} />
                {displayKeyErrors("groupId", errors)}
            </div>
            <div>
                <label
                    className="form-label"
                    htmlFor="groupMail">Correu del grup</label>
                <input
                    className="form-input"
                    id="groupMail" name="groupMail"
                    value={ouGroupRelation.groupMail}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, groupMail: e.target.value })} />
                {displayKeyErrors("groupMail", errors)}
            </div>

            <div>
                <label
                    className="form-label"
                    htmlFor="activeOu">Unitat organitzativa activa</label>
                <input
                    className="form-input"
                    id="activeOu" name="activeOu"
                    value={ouGroupRelation.activeOu}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, activeOu: e.target.value })} />
                {displayKeyErrors("activeOu", errors)}
            </div>

            <div>
                <label
                    className="form-label"
                    htmlFor="oldOu">Unitat organitzativa antiga</label>
                <input
                    className="form-input"
                    id="oldOu" name="oldOu"
                    value={ouGroupRelation.oldOu}
                    onChange={(e) => setOuGroupRelation({ ...ouGroupRelation, oldOu: e.target.value })} />
                {displayKeyErrors("oldOu", errors)}
            </div>
            
            <div className="space-y-4 rounded-lg bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                <Toggle
                    name="changePasswordNextSignIn"
                    id="changePasswordNextSignIn"
                    value={ouGroupRelation.changePasswordNextSignIn}
                    onToggled={val => setOuGroupRelation({ ...ouGroupRelation, changePasswordNextSignIn: val })}
                    text="Canviar contrasenya al següent inici de sessió"
                />
                <Toggle
                    name="updatePassword"
                    id="updatePassword"
                    value={ouGroupRelation.updatePassword}
                    onToggled={val => setOuGroupRelation({ ...ouGroupRelation, updatePassword: val })}
                    text="Actualitzar contrassenya?"
                />
            </div>
            {displayKeyErrors("", errors)}
        </div>
    )
}

export default OuGroupRelationsFields;