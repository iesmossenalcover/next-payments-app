import { SuccessAlert } from "@/components/Alerts";
import { createEvent } from "@/lib/apis/payments/client";
import { Event } from "@/lib/apis/payments/models";
import { useState } from "react";
import PersonFields from "@/components/people/PersonFields";
import EventFields from "@/components/events/EventFields";

const defaultEvent: Event = {
    id: 0,
    code: "",
    name: "",
    price: 0,
    amipaPrice: 0,
    publishDate: "",
    unpublishDate: "",
    enrollment: false
};

const Create = () => {
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)
    const [errors, setErrors] = useState<Map<string, string[]>>()

    const onSubmit = async (e: Event) => {
        setLoading(true);
        const data = await createEvent(e);
        if (data.errors) {
            setErrors(data.errors);
            setLoading(false);
        }
        else {
            const id = data.data as number;
            setCreated(true);
        }
    }

    const onFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const enrollment = formData.get("enrollment");

        const event: Event = {
            id: 0,
            code: formData.get("code") as string,
            name: formData.get("name") as string,
            price: parseFloat(formData.get("price") as string),
            amipaPrice: parseFloat(formData.get("amipaPrice") as string),
            publishDate: formData.get("publishDate") as string,
            unpublishDate: formData.get("unpublishDate") as string,
            enrollment: formData.get("enrollment") == null ? false : true,

        };
        console.log(event);

        await onSubmit(event);
    }

    const formDisabled = () => loading;

    return (
        <div className="max-w-lg m-auto">
            <div className="m-5">
                {created ?
                    <SuccessAlert text="Event afegit correctament" /> :
                    <form action="#" method="post" onSubmit={onFormSubmit} autoComplete="off">
                        <EventFields
                            allowSetEvent={true}
                            errors={errors}
                            event={defaultEvent} />
                        <div>
                            <input
                                disabled={formDisabled()}
                                className="w-full mt-6 bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:hover:cursor-not-allowed"
                                value="Afegir Event"
                                type="submit" />
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default Create;