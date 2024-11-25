'use client'

import '@/components/pages/Pohon/treeflex.css'
import { getOpdTahun } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import { TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonGreenBorder, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { LoadingBeat } from '@/components/global/Loading';
import { ModalDasarHukum } from '../../rencanakinerja/ModalDasarHukum';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { PohonOpd } from '@/components/lib/Pohon/PohonOpd';
import { FormPohonOpd } from '@/components/lib/Pohon/FormPohonOpd';
import { getUser, getToken } from '@/components/lib/Cookie';

interface opd {
    kode_opd: string;
    nama_opd: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    childs: childs[]
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    childs: childs[];
}

const PokinOpd = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const token = getToken();

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [NewStrategic, setNewStrategic] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
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

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };

    useEffect(() => {
        const fetchPokinOpd = async(url: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                setPokin(data);
            } catch(err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if(User?.roles == 'super_admin'){
            if(SelectedOpd?.value != undefined && Tahun?.value != undefined){
                fetchPokinOpd(`pohon_kinerja_opd/findall/${SelectedOpd?.value}/${Tahun?.value}`);
            }
        } else if(User?.roles != 'super_admin'){
            if(User?.kode_opd != undefined && Tahun?.value != undefined){
                fetchPokinOpd(`pohon_kinerja_opd/findall/${User?.kode_opd}/${Tahun?.value}`);
            }
        }
    },[User, SelectedOpd, Tahun, Deleted, token]);
    
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
                    <h1>Pohon Kinerja</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if(User?.roles == 'super_admin'){
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
    } 
    if(User?.roles != 'super_admin'){
        if(Tahun?.value == undefined){
            return(
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return(
        <>
            <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                {User?.roles == 'super_admin' ? 
                    <h1 className="font-bold">Pohon Kinerja {SelectedOpd?.label}</h1>
                :
                    <h1 className="font-bold">Pohon Cascading</h1>
                }
            </div>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <div className="tf-tree text-center mt-3">
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                {User?.roles == 'super_admin' ?
                                    <h1>Pohon Kinerja OPD</h1>
                                    :
                                    <h1>Pohon Cascading OPD</h1>
                                }
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.nama_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.kode_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* button */}
                                {User?.roles == 'admin_opd'|| User?.roles == 'super_admin' &&
                                    <div className="flex justify-center border my-3 py-3 border-black">
                                        <ButtonGreenBorder onClick={newChild}>
                                            <TbCirclePlus />
                                            Strategic
                                        </ButtonGreenBorder>
                                    </div>
                                }
                            </div>
                            {Pokin?.childs ? (
                            <ul>
                                {Pokin.childs.map((data: any) => (
                                    <li key={data.id}>
                                        <PohonOpd tema={data} deleteTrigger={() => setDeleted((prev) => !prev)}/>
                                    </li>
                                ))}
                                {formList.map((formId) => (
                                    <FormPohonOpd
                                        level={3}
                                        id={null}
                                        key={formId}
                                        formId={formId}
                                        pokin={'opd'}
                                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                    />
                                ))}
                            </ul>
                            ) : (
                                <ul>
                                    {formList.map((formId) => (
                                        <FormPohonOpd
                                            level={3}
                                            id={null}
                                            key={formId}
                                            formId={formId}
                                            pokin={'opd'}
                                            onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                        />
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PokinOpd;