import { Course } from "@/lib/apis/payments/models";
import { displayKeyErrors, toInputDate } from "@/lib/utils";
import { DateTime } from "@/components/form";

interface CourseComponentProps {
    errors?: Map<string, string[]>
    course: Course
}

const CourseFields = ({ course, errors }: CourseComponentProps) => {

    const start = course.startDate ? new Date(course.startDate) : new Date();
    const end = course.endDate ? new Date(course.endDate) : new Date();

    return (
        <div className="space-y-5">
            <div>
                <label
                    className="form-label"
                    htmlFor="name">Nom</label>
                <input
                    className="form-input"
                    id="name" name="name" defaultValue={course.name} />
                {displayKeyErrors("name", errors)}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
            <div>
                <label
                    className="form-label"
                    htmlFor="startDate">Data inici</label>
                <DateTime
                    className="form-input"
                    id="startDate"
                    name="startDate"
                    type="date"
                    required={true}
                    initialValue={toInputDate(start)}
                    onDateChanged={() => { }} />
                {displayKeyErrors("startDate", errors)}
            </div>

            <div>
                <label
                    className="form-label"
                    htmlFor="endDate">Data fi</label>

                <DateTime
                    className="form-input"
                    id="endDate"
                    name="endDate"
                    type="date"
                    required={true}
                    initialValue={toInputDate(end)}
                    onDateChanged={() => { }} />
                {displayKeyErrors("endDate", errors)}
            </div>
            </div>
        </div>
    )
}

export default CourseFields;