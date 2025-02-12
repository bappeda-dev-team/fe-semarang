'use client'

import { ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import Table from "@/components/pages/tujuanpemda/Table";
import { getOpdTahun, getToken } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";

interface Periode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
}

const TujuanPemda = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const token = getToken();
    const [Periode, setPeriode] = useState<Periode | null>(null);

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

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPeriode = async() => {
            try{
                const response = await fetch(`${API_URL}/periode/tahun/${Tahun?.value}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                setPeriode(hasil);
            } catch(err) {
                console.error("error fetch periode", err);
            }
        };
        if (Tahun?.value !== null && Tahun?.value !== undefined) {
            fetchPeriode();
        }
    },[Tahun, token]);

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ Tujuan Pemda</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Tujuan Pemda</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                        <h1 className="uppercase font-bold ml-1">(Periode {Periode?.tahun_awal} - {Periode?.tahun_akhir})</h1>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default TujuanPemda;