import '@/components/pages/Pohon/treeflex.css'
import { useState, useEffect } from 'react';
import { LoadingBeat } from '@/components/global/Loading';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from '@/components/global/Button';
import { TbArrowGuide, TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import {ModalAddStrategic, ModalEditStrategic} from '../ModalStrategic';

interface pohontematik {
    id: number;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

interface tematik {
    id: number;
    parent: number;
    tema: string;
    target: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    childs: subtematik[];
}
interface subtematik {
    id: number;
    parent: number;
    tema: string;
    keterangan: string;
    indikators: string;
    childs: subtematik[];
}

const PohonTematik = ({id} : pohontematik) => {

    const [Pokin, setPokin] = useState<tematik | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [ModalStrategic, setModalStrategic] = useState<boolean>(false);
    const [ModalTactical, setModalTactical] = useState<boolean>(false);
    const [ModalOperational, setModalOperational] = useState<boolean>(false);
    const [EditStrategic, setEditStrategic] = useState<boolean>(false);
    const [EditTactical, setEditTactical] = useState<boolean>(false);
    const [EditOperational, setEditOperational] = useState<boolean>(false);
    const [StrategicId, setStrategicId] = useState<number | null>(null);

    const [Deleted, setDeleted] = useState<boolean>(false);
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleFetchUpdate = () => {
        setFetchTrigger((prev) => !prev);
    };

    //Handle Modal Strategic
    const openModalStrategic = (ids: number) => {
        setModalStrategic(true);
        setStrategicId(ids);
    }
    const closeModalStrategic = () => {
        setModalStrategic(false);
        setStrategicId(null);
    }
    const openModalEditStrategic = (ids: number) => {
        setEditStrategic(true);
        setStrategicId(ids);
    }
    const closeModalEditStrategic = () => {
        setEditStrategic(false);
        setStrategicId(null);
    }
    //Handle Modal Tactical
    const openModalTactical = (ids: number) => {
        setModalTactical(true);
        setStrategicId(ids);
    }
    const closeModalTactical = () => {
        setModalTactical(false);
        setStrategicId(null);
    }
    const openModalEditTactical = (ids: number) => {
        setEditTactical(true);
        setStrategicId(ids);
    }
    const closeModalEditTactical = () => {
        setEditTactical(false);
        setStrategicId(null);
    }
    //Handle Modal Operational
    const openModalOperational = (ids: number) => {
        setModalOperational(true);
        setStrategicId(ids);
    }
    const closeModalOperational = () => {
        setModalOperational(false);
        setStrategicId(null);
    }
    const openModalEditOperational = (ids: number) => {
        setEditOperational(true);
        setStrategicId(ids);
    }
    const closeModalEditOperational = () => {
        setEditOperational(false);
        setStrategicId(null);
    }

    useEffect(() => {
        const fetchTematikKab = async() => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/tematik/${id}`);
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                setPokin(data);
            } catch(err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
            } finally {
                setLoading(false);
            }
        }
        if(id != undefined){
            fetchTematikKab();
        }
    },[id, fetchTrigger, Deleted]);

    const hapusSubTematik = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data Pohon Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };
    const hapusPohonOpd = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete/${id}`, {
                method: "DELETE",
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    if(error){
        return(
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <h1 className="text-red-500">{error}</h1>
            </div>
        )
    }
    if(Loading){
        return(
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <LoadingBeat className="mx-5 py-5"/>
            </div>
        )
    }

    return(
        <>
            <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                <div className="tf-tree text-center mt-3">
                    <ul>
                        {Pokin ? (
                        <li key={Pokin.id}>
                            {/* 1 KOTAK */}
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                                {/* HEADER */}
                                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Tematik Pemda</h1>
                                </div>
                                {/* BODY */}
                                <div className="flex justify-center my-3">
                                    <table className='w-full'>
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tema</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin.tema? Pokin.tema : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin.target ? Pokin.target : "-"}{Pokin.satuan ? Pokin.satuan : ""}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Keterangan</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin.keterangan ? Pokin.keterangan : "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* button */}
                                <div className="flex justify-center border my-3 py-3 border-black">
                                    <ButtonSkyBorder halaman_url={`/tematikkota/${Pokin.id}`}>
                                        <TbPencil className="mr-1"/>
                                        Edit
                                    </ButtonSkyBorder>
                                </div>
                                {/* footer */}
                                <div className="flex justify-center my-3 py-3">
                                    <ButtonGreenBorder halaman_url={`/subtematik/${Pokin.id}/tambah`}>
                                        <TbCirclePlus className='mr-1'/>
                                        Sub Tema
                                    </ButtonGreenBorder>
                                </div>
                            </div>
                            {Pokin.childs ? (
                                <ul>
                                    {Pokin.childs.map((item: any) => (
                                    <li key={item.id}>
                                        <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-white shadow-lg shadow-slate-500">
                                            <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                                <h1>Sub-Tematik Pemda</h1>
                                            </div>
                                            <div className="flex justify-center my-3">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start rounded-tl-lg">Sub Tema</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start rounded-tr-lg">{item.tema ? item.tema : "-"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start">Target/Satuan</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start">{item.target ? item.target : "-"} {item.satuan ? item.satuan : ""}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-1 border-black text-start rounded-bl-lg">Keterangan</td>
                                                            <td className="min-w-[300px] border px-2 py-1 border-black text-start rounded-br-lg">{item.keterangan ? item.keterangan : "-"}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="flex justify-evenly border my-3 py-2 border-black">
                                                <ButtonSkyBorder halaman_url={`/subtematik/${Pokin.id}/edit`}>
                                                    <TbPencil className="mr-1"/>
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ButtonRedBorder
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "STRATEGIC, TATCICAL & OPERATIONAL jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                            if(result.isConfirmed){
                                                                hapusSubTematik(item.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <TbTrash className='mr-1'/>
                                                    Hapus
                                                </ButtonRedBorder>
                                            </div>
                                            <div className="flex justify-evenly my-3 py-2">
                                                <ButtonGreenBorder onClick={() => openModalStrategic(item.id)}>
                                                    <TbCirclePlus className="mr-1"/>
                                                    Strategic
                                                </ButtonGreenBorder>
                                                    <ModalAddStrategic 
                                                        isOpen={ModalStrategic}
                                                        onClose={closeModalStrategic}
                                                        id={StrategicId}
                                                        level={1}
                                                        onSuccess={handleFetchUpdate}
                                                    />
                                                <ButtonGreenBorder>
                                                    <TbArrowGuide className="mr-1"/>
                                                    Ambil Strategic
                                                </ButtonGreenBorder>
                                            </div>
                                        </div>
                                        {item.strategics ? (
                                            <ul>
                                                {item.strategics.map((s: any) => (
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
                                                                        <td className="min-w-[300px] border px-2 py-1 border-red-700 bg-white text-start rounded-tr-lg">{s.tema ? s.tema : "-"}</td>
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
                                                            <ButtonSkyBorder onClick={() => openModalEditStrategic(s.id)}>
                                                                <TbPencil className="mr-1"/>
                                                                Edit
                                                            </ButtonSkyBorder>
                                                                <ModalEditStrategic
                                                                    isOpen={EditStrategic}
                                                                    onClose={() => closeModalEditStrategic()}
                                                                    id={StrategicId}
                                                                    level={1}
                                                                    onSuccess={handleFetchUpdate}
                                                                />
                                                            <ButtonRedBorder
                                                                onClick={() => {
                                                                    AlertQuestion("Hapus?", "TACTICAL & OPERATIONAL yang sudah ada akan ikut terhapus jika ada", "question", "Hapus", "Batal").then((result) => {
                                                                        if(result.isConfirmed){
                                                                            hapusPohonOpd(s.id);
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <TbTrash className='mr-1'/>
                                                                Hapus
                                                            </ButtonRedBorder>
                                                        </div>
                                                        <div className="flex justify-evenly my-3 py-2">
                                                            <ButtonGreenBorder 
                                                                className='bg-white'
                                                                onClick={() => openModalTactical(s.id)}
                                                            >
                                                                <TbCirclePlus className="mr-1"/>
                                                                Tactical
                                                            </ButtonGreenBorder>
                                                                <ModalAddStrategic 
                                                                    isOpen={ModalTactical}
                                                                    onClose={closeModalTactical}
                                                                    id={StrategicId}
                                                                    level={2}
                                                                    onSuccess={handleFetchUpdate}
                                                                />
                                                        </div>
                                                    </div>
                                                    {s.childs ? (
                                                        <ul>
                                                            {s.childs.map((t: any) => (
                                                            <li key={s.id}>
                                                                <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-blue-500 shadow-lg shadow-blue-500">
                                                                    <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-blue-500 bg-white rounded-lg">
                                                                        <h1 className="text-blue-500">Tactical</h1>
                                                                    </div>
                                                                    <div className="flex justify-center my-3">
                                                                        <table className="w-full">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="min-w-[100px] border px-2 py-1 border-blue-500 bg-white text-start rounded-tl-lg">Tactical</td>
                                                                                    <td className="min-w-[300px] border px-2 py-1 border-blue-500 bg-white text-start rounded-tr-lg">{t.tema ? t.tema : "-"}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="min-w-[100px] border px-2 py-1 border-blue-500 bg-white text-start">Indikator</td>
                                                                                    <td className="min-w-[300px] border px-2 py-1 border-blue-500 bg-white text-start">{t.indikator ? t.indikator : "-"}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="min-w-[100px] border px-2 py-1 border-blue-500 bg-white text-start">Target / Satuan</td>
                                                                                    <td className="min-w-[300px] border px-2 py-1 border-blue-500 bg-white text-start">{t.target ? t.target : "-"} {t.satuan ? t.satuan : "-"}</td>
                                                                                </tr>
                                                                                <tr className='rounded-b-lg'>
                                                                                    <td className="min-w-[100px] border px-2 py-1 border-blue-500 bg-white text-start">Keterangan</td>
                                                                                    <td className="min-w-[300px] border px-2 py-1 border-blue-500 bg-white text-start">{t.keterangan ? t.keterangan : "-"}</td>
                                                                                </tr>
                                                                                <tr className='rounded-b-lg'>
                                                                                    <td className="min-w-[100px] border px-2 py-1 border-blue-500 bg-white text-start rounded-bl-lg">Perangkat Daerah</td>
                                                                                    <td className="min-w-[300px] border px-2 py-1 border-blue-500 bg-white text-start rounded-br-lg">{t.kode_perangkat_daerah ? t.kode_perangkat_daerah.nama_opd : "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="flex justify-evenly border my-3 py-2 border-blue-500 bg-white rounded-lg">
                                                                        <ButtonSkyBorder onClick={() => openModalEditTactical(t.id)}>
                                                                            <TbPencil className="mr-1"/>
                                                                            Edit
                                                                        </ButtonSkyBorder>
                                                                            <ModalEditStrategic
                                                                                isOpen={EditTactical}
                                                                                onClose={() => closeModalEditTactical()}
                                                                                id={StrategicId}
                                                                                level={2}
                                                                                onSuccess={handleFetchUpdate}
                                                                            />
                                                                        <ButtonRedBorder
                                                                            onClick={() => {
                                                                                AlertQuestion("Hapus?", "OPERATIONAL yang sudah ada akan ikut terhapus jika ada", "question", "Hapus", "Batal").then((result) => {
                                                                                    if(result.isConfirmed){
                                                                                        hapusPohonOpd(t.id);
                                                                                    }
                                                                                });
                                                                            }}
                                                                        >
                                                                            <TbTrash className='mr-1'/>
                                                                            Hapus
                                                                        </ButtonRedBorder>
                                                                    </div>
                                                                    <div className="flex justify-evenly my-3 py-2">
                                                                        <ButtonGreenBorder 
                                                                            className='bg-white'
                                                                            onClick={() => openModalOperational(t.id)}
                                                                        >
                                                                            <TbCirclePlus className="mr-1"/>
                                                                            Operational
                                                                        </ButtonGreenBorder>
                                                                            <ModalAddStrategic 
                                                                                isOpen={ModalOperational}
                                                                                onClose={closeModalOperational}
                                                                                id={StrategicId}
                                                                                level={3}
                                                                                onSuccess={handleFetchUpdate}
                                                                            />
                                                                    </div>
                                                                </div>
                                                                {t.childs ? (
                                                                    <ul>
                                                                        {t.childs.map((o: any) => (
                                                                        <li key={s.id}>
                                                                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg bg-green-500 shadow-lg shadow-green-500">
                                                                                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-green-500 bg-white rounded-lg">
                                                                                    <h1 className="text-green-500">Operational</h1>
                                                                                </div>
                                                                                <div className="flex justify-center my-3">
                                                                                    <table className="w-full">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td className="min-w-[100px] border px-2 py-1 border-green-500 bg-white text-start rounded-tl-lg">Operational</td>
                                                                                                <td className="min-w-[300px] border px-2 py-1 border-green-500 bg-white text-start rounded-tr-lg">{o.tema ? o.tema : "-"}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td className="min-w-[100px] border px-2 py-1 border-green-500 bg-white text-start">Indikator</td>
                                                                                                <td className="min-w-[300px] border px-2 py-1 border-green-500 bg-white text-start">{o.indikator ? o.indikator : "-"}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td className="min-w-[100px] border px-2 py-1 border-green-500 bg-white text-start">Target / Satuan</td>
                                                                                                <td className="min-w-[300px] border px-2 py-1 border-green-500 bg-white text-start">{o.target ? o.target : "-"} {o.satuan ? o.satuan : "-"}</td>
                                                                                            </tr>
                                                                                            <tr className='rounded-b-lg'>
                                                                                                <td className="min-w-[100px] border px-2 py-1 border-green-500 bg-white text-start">Keterangan</td>
                                                                                                <td className="min-w-[300px] border px-2 py-1 border-green-500 bg-white text-start">{o.keterangan ? o.keterangan : "-"}</td>
                                                                                            </tr>
                                                                                            <tr className='rounded-b-lg'>
                                                                                                <td className="min-w-[100px] border px-2 py-1 border-green-500 bg-white text-start rounded-bl-lg">Perangkat Daerah</td>
                                                                                                <td className="min-w-[300px] border px-2 py-1 border-green-500 bg-white text-start rounded-br-lg">{o.kode_perangkat_daerah ? o.kode_perangkat_daerah.nama_opd : "-"}</td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                <div className="flex justify-evenly border my-3 py-2 border-green-500 bg-white rounded-lg">
                                                                                    <ButtonSkyBorder onClick={() => openModalEditOperational(o.id)}>
                                                                                        <TbPencil className="mr-1"/>
                                                                                        Edit
                                                                                    </ButtonSkyBorder>
                                                                                        <ModalEditStrategic
                                                                                            isOpen={EditOperational}
                                                                                            onClose={() => closeModalEditOperational()}
                                                                                            id={StrategicId}
                                                                                            level={3}
                                                                                            onSuccess={handleFetchUpdate}
                                                                                        />
                                                                                    <ButtonRedBorder
                                                                                        onClick={() => {
                                                                                            AlertQuestion("Hapus?", "Hapus operational yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                                                if(result.isConfirmed){
                                                                                                    hapusPohonOpd(o.id);
                                                                                                }
                                                                                            });
                                                                                        }}
                                                                                    >
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
                                    ))}
                                </ul>
                            ) : (
                                <></>
                            )}
                        </li>
                        ) : (<></>)}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PohonTematik;
