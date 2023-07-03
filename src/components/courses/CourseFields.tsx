import { Course } from "@/lib/apis/payments/models";
import { displayKeyErrors, toInputDate } from "@/lib/utils";

interface CourseComponentProps {
    errors?: Map<string, string[]>
    course: Course
}

const CourseFields = ({ course, errors }: CourseComponentProps) => {
    
    const start = new Date(course.startDate);
    const end = new Date(course.endDate);

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
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Data inici"
                    name="startDate" id="startDate" type="date" defaultValue={toInputDate(start)} />
                {displayKeyErrors("startDate", errors)}
            </div>

            <div className="mt-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="endDate">Data fi</label>
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Data fi"
                    name="endDate" id="endDate" type="date" defaultValue={toInputDate(end)} />
                {displayKeyErrors("endDate", errors)}
            </div>
        </>
    )
}

export default CourseFields;