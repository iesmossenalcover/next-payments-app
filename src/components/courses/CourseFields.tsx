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
        <>
            <div className="mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="name">Nom</label>
                <input
                    className="px-4 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 leading-tight focus:outline-none focus:bg-white"
                    id="name" name="name" defaultValue={course.name} />
                {displayKeyErrors("name", errors)}
            </div>

            <div>
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="startDate">Data inici</label>
                <DateTime
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="startDate"
                    name="startDate"
                    type="date"
                    required={true}
                    initialValue={toInputDate(start)}
                    onDateChanged={() => { }} />
                {displayKeyErrors("startDate", errors)}
            </div>

            <div className="mt-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="endDate">Data fi</label>

                <DateTime
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="endDate"
                    name="endDate"
                    type="date"
                    required={true}
                    initialValue={toInputDate(end)}
                    onDateChanged={() => { }} />
                {displayKeyErrors("endDate", errors)}
            </div>
        </>
    )
}

export default CourseFields;