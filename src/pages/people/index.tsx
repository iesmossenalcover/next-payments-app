import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getCoursesSelector, GetPeopleView, getPeopleView } from '@/lib/apis/payments'
import useUser from '@/lib/hooks/useUser'
import Table, { Row } from '@/components/Table'
import { Selector, SelectorComponent } from '@/components/Selector'
import { Spinner } from '@/components/Loading'

const tableHeaders: string[] = ["Identitat", "Nom", "Llinatges", "Número expedient", "Grup"];

const People = () => {

    const { user } = useUser()

    const [loadingCourses, setLoadingCourses] = useState(true)
    const [loadingPeople, setLoadingPeople] = useState(false)
    const [selector, setSelector] = useState<Selector | undefined>(undefined)
    const [people, setPeople] = useState<any[]>([])
    const [currentCourseId, setCurrentCourseId] = useState<number | undefined>()

    const setPeopleView = (pv: GetPeopleView | undefined) => {
        if (pv == undefined) return;
        setPeople(pv.people);
    }

    const onCourseSelected = (value: string) => {
        setLoadingPeople(true);
        setCurrentCourseId(parseInt(value))
    }

    const mapToRow = (): Row[] => {
        return people.map(x => {
            return { key: x.id, values: [x.documentId, x.firstName, x.lastName, x.academicRecordNumber, x.groupName] }
        });
    }

    useEffect(() => {
        getCoursesSelector()
            .then(x => setSelector(x))
            .finally(() => setLoadingCourses(false))
    }, []);

    useEffect(() => {
        setLoadingPeople(true);
        getPeopleView(currentCourseId)
            .then(x => setPeopleView(x))
            .finally(() => setLoadingPeople(false));
    }, [currentCourseId]);

    if (loadingCourses || !user) {
        return null
    }

    const listPeople = () => {
        if (loadingPeople) return null;
        return (
            <Table
                paging={false}
                headers={tableHeaders}
                rows={mapToRow()}
            />
        )
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className='flex justify-start items-center mb-4'>
                    <SelectorComponent
                        id='course'
                        name='course'
                        onSelect={onCourseSelected}
                        selector={selector as Selector} />
                    
                    {loadingPeople ? <Spinner /> : null }
                </div>

                {listPeople()}
            </main>
        </>
    )
}


export default People