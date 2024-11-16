'use client'

import '@/components/pages/Pohon/treeflex.css'
import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import { TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonGreenBorder, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { LoadingBeat } from '@/components/global/Loading';
import { ModalDasarHukum } from '../../rencanakinerja/ModalDasarHukum';
import { OpdTahunNull } from '@/components/global/OpdTahunNull';
import { PohonOpd } from '@/components/lib/Pohon/PohonOpd';

interface opd {
    kode_opd: string;
    nama_opd: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    strategic: strategics[]
}
interface strategics {
    id: number;
    parent: number;
    strategi: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    tacticals: tacticals[];
}
interface tacticals {
    id: number;
    parent: number;
    strategi: string;
    keterangan: string;
    indikators: string;
    kode_perangkat_daerah: opd;
    operational: operational[];
}
interface operational {
    id: number;
    parent: number;
    strategi: string;
    keterangan: string;
    indikators: string;
    kode_perangkat_daerah: opd;
}

const PokinOpd = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Pokin, setPokin] = useState<pokin[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');

    const [NewStrategic, setNewStrategic] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);

    const handleFetchDelete = () => {
        setDeleted((prev) => !prev);
    };


    useEffect(() => {
        const fetchPokinOpd = async() => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/findall/${SelectedOpd?.value}/${Tahun?.value}`);
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                setPokin(data);
            } catch(err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
            } finally {
                setLoading(false);
            }
        }
        if(SelectedOpd?.value != undefined && Tahun?.value != undefined){
            fetchPokinOpd();
        }
    },[SelectedOpd, Tahun]);

    if(Loading){
        return(
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <LoadingBeat />
                </div>
            </>
        )
    }
    if(error){
        return(
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if(SelectedOpd?.value == undefined || Tahun?.value == undefined){
        return(
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <OpdTahunNull />
                </div>
            </>
        )
    }

    return(
        <>
            <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
            </div>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <div className="tf-tree text-center mt-3">
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Pohon Kinerja OPD</h1>
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{SelectedOpd?.label}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{SelectedOpd?.value}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Tahun?.value}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* button */}
                                <div className="flex justify-center border my-3 py-3 border-black">
                                    <ButtonGreenBorder onClick={() => setNewStrategic(true)}>
                                        <TbCirclePlus />
                                        Strategic
                                    </ButtonGreenBorder>
                                </div>
                                <ModalDasarHukum isOpen={NewStrategic} onClose={() => {setNewStrategic(false)}}/>
                            </div>
                            {Pokin ? (
                            <ul>
                                <li>
                                    <PohonOpd tema={Pokin} deleteTrigger={handleFetchDelete}/>
                                </li>
                            </ul>
                            ) : (
                                <></>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PokinOpd;