'use client'

import { TableLaporan, TablePerencanaan } from '@/components/pages/rincianbelanja/Table';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getOpdTahun } from '@/components/lib/Cookie';

const RincianBelanja = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

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
            if(data.opd){
                const opd_value = {
                    value: data.opd.value,
                    label: data.opd.label,
                }
                setSelectedOpd(opd_value);
            }
        }
    },[])

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p>/ Rincian Belanja</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-2xl uppercase">Rincian Belanja {Tahun?.label}</h1>
                    </div>
                    <p>{SelectedOpd?.label}</p>
                    {/* <div className="flex flex-col items-end">
                        <p>Nama Lengkap Pegawai</p>
                        <p>192730187240817204</p>
                        <p>Roles: Eselon 3</p>
                    </div> */}
                </div>
                {/* <TableLaporan /> */}
                <TablePerencanaan />
            </div>
        </>
    )
}

export default RincianBelanja;