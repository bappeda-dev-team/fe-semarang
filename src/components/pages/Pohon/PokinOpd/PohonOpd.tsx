'use client'

import '@/components/pages/Pohon/treeflex.css'
import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import { TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonGreenBorder, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { LoadingBeat } from '@/components/global/Loading';
import { ModalDasarHukum } from '../../rencanakinerja/ModalDasarHukum';
import { OpdTahunNull } from '@/components/global/OpdTahunNull';

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

const PohonOpd = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Pokin, setPokin] = useState<pokin[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');

    const [NewStrategic, setNewStrategic] = useState<boolean>(false);

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
                const data = result.data.strategic || [];
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
                                {Pokin.map((s: any) => (
                                <li key={s.id}>
                                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-red-700 shadow-lg shadow-red-500">
                                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-red-700 bg-white rounded-lg">
                                            <h1 className="text-red-700">Strategic</h1>
                                        </div>
                                        <div className="flex justify-center my-3">
                                            <table className="w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-red-700 bg-white text-start rounded-tl-lg">Strategic</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start rounded-tr-lg">{s.strategi ? s.strategi : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-red-700 bg-white text-start">Indikator</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start">{s.indikator ? s.indikator : "-"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="min-w-[100px] border px-2 py-1 border-red-700 bg-white text-start">Target / Satuan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start">{s.target ? s.target : "-"} {s.satuan ? s.satuan : "-"}</td>
                                                    </tr>
                                                    <tr className='rounded-b-lg'>
                                                        <td className="min-w-[100px] border px-2 py-1 border-red-700 bg-white text-start">Keterangan</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start">{s.keterangan ? s.keterangan : "-"}</td>
                                                    </tr>
                                                    <tr className='rounded-b-lg'>
                                                        <td className="min-w-[100px] border px-2 py-1 border-red-700 bg-white text-start rounded-bl-lg">Perangkat Daerah</td>
                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start rounded-br-lg">{s.perangkat_daerah ? s.perangkat_daerah.nama_opd : "-"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-evenly border my-3 py-2 border-red-700 bg-white rounded-lg">
                                            <ButtonSkyBorder>
                                                <TbPencil className="mr-1"/>
                                                Edit
                                            </ButtonSkyBorder>
                                            <ButtonRedBorder>
                                                <TbTrash className='mr-1'/>
                                                Hapus
                                            </ButtonRedBorder>
                                        </div>
                                        <div className="flex justify-evenly my-3 py-2">
                                            <ButtonGreenBorder className='bg-white'>
                                                <TbCirclePlus className="mr-1"/>
                                                Tactical
                                            </ButtonGreenBorder>
                                        </div>
                                    </div>
                                    {s.tacticals ? (
                                    <ul>
                                        {s.tacticals.map((t: any) => (
                                        <li key={t.id}>
                                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-blue-700 shadow-lg shadow-blue-500">
                                                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-blue-700 bg-white rounded-lg">
                                                    <h1 className="text-blue-700">Tactical</h1>
                                                </div>
                                                <div className="flex justify-center my-3">
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr>
                                                                <td className="min-w-[100px] border px-2 py-1 border-blue-700 bg-white text-start rounded-tl-lg">Tactical</td>
                                                                <td className="min-w-[300px] border px-2 py-1 border-blue-700 bg-white text-start rounded-tr-lg">{t.strategi ? t.strategi : "-"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="min-w-[100px] border px-2 py-1 border-blue-700 bg-white text-start">Indikator</td>
                                                                <td className="min-w-[300px] border px-2 py-1 border-blue-700 bg-white text-start">{t.indikator ? t.indikator : "-"}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="min-w-[100px] border px-2 py-1 border-blue-700 bg-white text-start">Target / Satuan</td>
                                                                <td className="min-w-[300px] border px-2 py-1 border-blue-700 bg-white text-start">{t.target ? t.target : "-"} {t.satuan ? t.satuan : "-"}</td>
                                                            </tr>
                                                            <tr className='rounded-b-lg'>
                                                                <td className="min-w-[100px] border px-2 py-1 border-blue-700 bg-white text-start">Keterangan</td>
                                                                <td className="min-w-[300px] border px-2 py-1 border-blue-700 bg-white text-start">{t.keterangan ? t.keterangan : "-"}</td>
                                                            </tr>
                                                            <tr className='rounded-b-lg'>
                                                                <td className="min-w-[100px] border px-2 py-1 border-blue-700 bg-white text-start rounded-bl-lg">Perangkat Daerah</td>
                                                                <td className="min-w-[300px] border px-2 py-1 border-blue-700 bg-white text-start rounded-br-lg">{t.perangkat_daerah ? t.perangkat_daerah.nama_opd : "-"}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="flex justify-evenly border my-3 py-2 border-blue-700 bg-white rounded-lg">
                                                    <ButtonSkyBorder>
                                                        <TbPencil className="mr-1"/>
                                                        Edit
                                                    </ButtonSkyBorder>
                                                    <ButtonRedBorder>
                                                        <TbTrash className='mr-1'/>
                                                        Hapus
                                                    </ButtonRedBorder>
                                                </div>
                                                <div className="flex justify-evenly my-3 py-2">
                                                    <ButtonGreenBorder className='bg-white'>
                                                        <TbCirclePlus className="mr-1"/>
                                                        Operational
                                                    </ButtonGreenBorder>
                                                </div>
                                            </div>
                                            {t.operational ? (
                                            <ul>
                                                {t.operational.map((o: any) => (
                                                <li key={o.id}>
                                                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-green-700 shadow-lg shadow-green-500">
                                                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-green-700 bg-white rounded-lg">
                                                            <h1 className="text-green-700">Operational</h1>
                                                        </div>
                                                        <div className="flex justify-center my-3">
                                                            <table className="w-full">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="min-w-[100px] border px-2 py-1 border-green-700 bg-white text-start rounded-tl-lg">Operational</td>
                                                                        <td className="min-w-[300px] border px-2 py-1 border-green-700 bg-white text-start rounded-tr-lg">{o.strategi ? o.strategi : "-"}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="min-w-[100px] border px-2 py-1 border-green-700 bg-white text-start">Indikator</td>
                                                                        <td className="min-w-[300px] border px-2 py-1 border-green-700 bg-white text-start">{o.indikator ? o.indikator : "-"}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="min-w-[100px] border px-2 py-1 border-green-700 bg-white text-start">Target / Satuan</td>
                                                                        <td className="min-w-[300px] border px-2 py-1 border-green-700 bg-white text-start">{o.target ? o.target : "-"} {o.satuan ? o.satuan : "-"}</td>
                                                                    </tr>
                                                                    <tr className='rounded-b-lg'>
                                                                        <td className="min-w-[100px] border px-2 py-1 border-green-700 bg-white text-start">Keterangan</td>
                                                                        <td className="min-w-[300px] border px-2 py-1 border-green-700 bg-white text-start">{o.keterangan ? o.keterangan : "-"}</td>
                                                                    </tr>
                                                                    <tr className='rounded-b-lg'>
                                                                        <td className="min-w-[100px] border px-2 py-1 border-green-700 bg-white text-start rounded-bl-lg">Perangkat Daerah</td>
                                                                        <td className="min-w-[300px] border px-2 py-1 border-green-700 bg-white text-start rounded-br-lg">{o.perangkat_daerah ? o.perangkat_daerah.nama_opd : "-"}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="flex justify-evenly border my-3 py-2 border-green-700 bg-white rounded-lg">
                                                            <ButtonSkyBorder>
                                                                <TbPencil className="mr-1"/>
                                                                Edit
                                                            </ButtonSkyBorder>
                                                            <ButtonRedBorder>
                                                                <TbTrash className='mr-1'/>
                                                                Hapus
                                                            </ButtonRedBorder>
                                                        </div>
                                                    </div>
                                                </li>
                                                ))}
                                            </ul>
                                            ) : (
                                                <></>
                                            )}
                                        </li>
                                        ))}
                                    </ul>
                                    ) : (
                                        <></>
                                    )}
                                </li>
                                ))}
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

export default PohonOpd;