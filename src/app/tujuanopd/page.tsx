'use client'

import { ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import Table from "@/components/pages/tujuanopd/Table";
import { getOpdTahun } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";

const TematikKota = () => {

    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    },[]);

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Tujuan OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Tujuan OPD</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/tujuanopd/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah Tujuan OPD
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default TematikKota;