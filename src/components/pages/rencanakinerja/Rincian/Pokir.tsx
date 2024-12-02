'use client'

import { ButtonSky } from "@/components/global/Button";
import Select from 'react-select';
import { useState, useEffect } from "react";
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingSync } from "@/components/global/Loading";

interface id {
    id: string;
}
interface pokir {
    id : string;
    jenis : string;
    usulan : string;
    alamat : string;
    permasalahan : string;
}

const Pokir: React.FC<id> = ({id}) => {

    const [pokir, setPokir] = useState<pokir[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPokir = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${user?.pegawai_id}/input_rincian_kak`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if(hasil.usulan_pokok_pikiran){
                    const p = hasil.find((item: any) => item.usulan_pokok_pikiran);
                    const data = p.usulan_pokok_pikiran
                    if(data == null){
                        setDataNull(true);
                        setPokir([]);
                    } else {
                        setDataNull(false);
                        setPokir(data);
                    }
                } else {
                    setDataNull(true);
                    setPokir([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){    
            fetchPokir();
        }
    },[id, user, token]);

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Usulan Pokok Pikiran</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* usulan pokok pikiran DPRD */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Usulan Pokok Pikiran</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="my-2">
                    <Select 
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                })
                            }}
                            placeholder={"Pilih pokok pikiran DPRD"}
                        />
                </div>
                <ButtonSky className="w-full mt-2">Simpan</ButtonSky>
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td className="border-r border-b px-6 py-3 min-w-[50px]">No</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Alamat</td>
                                <td className="border-r border-b px-6 py-3 min-w-[400px]">Permasalahan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={5}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                                pokir.map((data, index) => (
                                    <tr key={data.id}>
                                        <td className="border-r border-b px-6 py-3 min-w-[50px]">{index + 1}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.usulan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.alamat}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[400px]">{data.permasalahan}</td>
                                        <td className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Pokir;