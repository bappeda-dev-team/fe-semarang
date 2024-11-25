'use client'

import { useEffect, useState } from 'react';
import { getOpdTahun, getUser } from '@/components/lib/Cookie';
import { TablePerencanaan } from '@/components/pages/rencanakinerja/Table';
import { FiHome } from 'react-icons/fi';
import { ButtonSky } from "@/components/global/Button";
import { TbCirclePlus } from "react-icons/tb";
import { AlertNotification } from '@/components/global/Alert';
import {useRouter} from 'next/navigation';
import { TahunNull } from '@/components/global/OpdTahunNull';
import Maintenance from '@/components/global/Maintenance';

const RencanaKinerja = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        if(data){
            if(data.tahun){
                const tahun_value = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(tahun_value);
            }
        }
    },[])

    const TambahRencanaKinerja = () => {
        if(Tahun?.value == undefined){
            AlertNotification("Pilih Tahun", "Pilih tahun di header terlebih dahulu", "warning", 1000);
        } else {
            router.push('/rencanakinerja/tambah');
        }
    }
    if(Tahun?.value == undefined){
        return(
            <>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <TahunNull />
                </div>
            </>
        )
    }

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p>/ Rencana Kinerja</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-2xl uppercase">rencana kinerja {Tahun?.label}</h1>
                        <ButtonSky 
                            className="flex items-center justify-center"
                            onClick={TambahRencanaKinerja}
                        >
                            <TbCirclePlus className="mr-1"/>
                            Rencana kinerja baru
                        </ButtonSky>
                    </div>
                    {/* {(User?.roles == 'eselon_1' || User?.roles == 'eselon_2' || User?.roles == 'eselon_3' || User?.roles == 'eselon_4') && */}
                    <div className="flex flex-col items-end">
                        <p>{User?.email}</p>
                        <p>{User?.nip}</p>
                        <p>Roles: {User?.roles}</p>
                    </div>
                    {/* } */}
                </div>
                <TablePerencanaan />
            </div>
            {/* <Maintenance /> */}
        </>
    )
}

export default RencanaKinerja;