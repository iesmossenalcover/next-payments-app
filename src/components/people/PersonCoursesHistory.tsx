import { PersonCourse } from "@/lib/apis/payments/models";
import { displayDate } from "@/lib/utils";

const YesNo = ({ value, date }: { value: boolean, date?: string }) => (
    <span className="inline-flex flex-col">
        <span className={`badge ${value ? "badge-green" : "badge-gray"}`}>{value ? "Sí" : "No"}</span>
        {value && date && <span className="mt-0.5 text-xs text-slate-500 tabular-nums">{displayDate(date)}</span>}
    </span>
);

const PersonCoursesHistory = ({ courses }: { courses?: PersonCourse[] }) => {
    if (!courses || courses.length === 0) return null;

    return (
        <div className="card mt-6 overflow-x-auto">
            <h2 className="section-title px-6 pt-6 sm:px-8">Històric per curs</h2>
            <p className="mt-1 px-6 text-sm text-slate-500 sm:px-8">Les autoritzacions són per curs escolar. Només es poden modificar les del curs actual.</p>
            <table className="data-table mt-4">
                <thead>
                    <tr>
                        <th>Curs</th>
                        <th>Grup</th>
                        <th>AFA</th>
                        <th>Matriculat</th>
                        <th>Autorització a peu</th>
                        <th>Autorització transport</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(x => (
                        <tr key={x.courseId}>
                            <td className="font-medium text-slate-900">
                                {x.courseName}
                                {x.active && <span className="badge badge-brand ml-2">Actual</span>}
                            </td>
                            <td>{x.groupName}</td>
                            <td><YesNo value={x.amipa} /></td>
                            <td><YesNo value={x.enrolled} /></td>
                            <td><YesNo value={x.walkingAuthorization} date={x.walkingAuthorizationDate} /></td>
                            <td><YesNo value={x.transportAuthorization} date={x.transportAuthorizationDate} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PersonCoursesHistory;
