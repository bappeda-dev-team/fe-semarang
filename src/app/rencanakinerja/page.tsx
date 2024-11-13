'use client'

import { useEffect, useState } from 'react';
import { getOpdTahun } from '@/components/lib/Cookie';
import { TablePerencanaan } from '@/components/pages/rencanakinerja/Table';
import { FiHome } from 'react-icons/fi';
import { ButtonSky } from "@/components/global/Button";
import { TbCirclePlus } from "react-icons/tb";
import Maintenance from '@/components/global/Maintenance';

const RencanaKinerja = () => {

    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
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
                            halaman_url='/rencanakinerja/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Rencana kinerja baru
                        </ButtonSky>
                    </div>
                    <div className="flex flex-col items-end">
                        <p>Nama Lengkap Pegawai</p>
                        <p>192730187240817204</p>
                        <p>Roles: Eselon 3</p>
                    </div>
                </div>
            <TablePerencanaan />
            </div>
            {/* <Maintenance /> */}
        </>
    )
}

export default RencanaKinerja;