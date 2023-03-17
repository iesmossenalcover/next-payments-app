import { Container } from "@/components/layout/SideBar";
import { EventPeople, EventPeopleGroup, EventPerson, getEventPeople } from "@/lib/apis/payments";
import { setEventPeople } from "@/lib/apis/payments/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PeopleToEvent = () => {
    const router = useRouter()
    const [eventData, setEventData] = useState<EventPeople | undefined>(undefined);
    const [selected, setSelected] = useState<Set<number>>(new Set())

    const { id } = router.query

    useEffect(() => {
        if (!id) return;

        getEventPeople(id as string)
            .then(x => {
                if (x.errors) {
                    console.log(x.errors);
                } else {
                    if (!x.data) return;
                    var s = new Set<number>();

                    for (let i = 0; i < x.data.peopleGroups.length; i++) {
                        const g = x.data.peopleGroups[i];
                        for (let j = 0; j < g.people.length; j++) {
                            const p = g.people[j];
                            if (p.inEvent) 
                            {
                                s.add(p.id);
                            }
                        }
                    }
                    setSelected(s);
                    setEventData(x.data);
                }
            });
    }, [id])

    const persistChanges = () => {
        setEventPeople(id as string, Array.from(selected))
            .then(x => console.log(x));
    }

    const renderGroups = () => {
        return (
            <ul>
                {eventData?.peopleGroups.map(x => (
                    <li key={x.id}>
                        <Group data={x} selected={selected} setSelected={setSelected} />
                    </li>
                ))}
            </ul>
        )
    }

    if (!eventData) return null;

    return (

        <>
            <Head>
                <title>Events</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h4 className="font-bold text-3xl">{eventData.code}</h4>
                        <h4 className="font-bold text-3xl ml-3">-</h4>
                        <h4 className="font-bold text-3xl ml-3">{eventData.name}</h4>
                    </div>
                    <button onClick={persistChanges}>Guardar</button>
                </div>
                <h4 className="mt-3 font-semibold">Persones apuntades: {selected.size}</h4>
                <hr className="h-px mt-3 mb-8 bg-gray-300 border-0" />
                <div>
                    {renderGroups()}
                </div>
            </main>
        </>
    );
}

export default function PeopleToEventPage() {



    return (
        <Container>
            <PeopleToEvent />
        </Container>
    )
};

interface GroupProps {
    data: EventPeopleGroup,
    selected: Set<number>,
    setSelected: (x: Set<number>) => void;
}

const Group = ({ data, selected, setSelected }: GroupProps) => {
    const [show, setShow] = useState(false);
    const { name, people } = data;

    const onPersonCheck = (x: EventPerson, checked: boolean) => {
        if (checked) {
            selected.add(x.id)
        }
        else {
            selected.delete(x.id);
        }
        setSelected(new Set(selected));
    }

    const selectAll = () => {
        for (let i = 0; i < people.length; i++) {
            selected.add(people[i].id);
        }
        setSelected(new Set(selected));
    }

    const unSelectAll = () => {
        for (let i = 0; i < people.length; i++) {
            selected.delete(people[i].id);
        }
        setSelected(new Set(selected));
    }

    const renderPerson = (x: EventPerson) => {
        return (
            <div className="mt-4">
                <div className="flex items-center mb-4">
                    <input
                        id={`in_event_${x.id}`}
                        type="checkbox"
                        checked={selected.has(x.id)}
                        onChange={e => onPersonCheck(x, e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                    <label
                        htmlFor={`in_event_${x.id}`}
                        className="ml-2 text-lg font-medium">{x.fullName}</label>
                </div>
            </div>
        )
    }

    return (
        <div className="mb-7">
            <div className="flex justify-between mb-1">
                <h3>{name}</h3>
                <div>
                    <button onClick={selectAll}>Marcar tots</button>
                    <button className="ml-6" onClick={unSelectAll}>Desmarcar tots</button>
                    <button className="ml-6" onClick={() => setShow(!show)}>{show ? "Amaga" : "Mostra"}</button>
                </div>
            </div>
            <hr className="h-px bg-gray-500 border-0" />
            {!show ? null :
                <>
                    <ul>
                        {people.map(x => <li key={x.id}>{renderPerson(x)}</li>)}
                    </ul>
                </>
            }
        </div>
    )
}