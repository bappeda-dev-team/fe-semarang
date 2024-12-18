import { useEffect, useState } from 'react';
import { TbLayersLinked, TbCheck, TbCircleLetterXFilled, TbCirclePlus, TbHourglass, TbPencil, TbTrash, TbEye } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import { FormPohonOpd, FormEditPohon, FormCrosscutingOpd } from './FormPohonOpd';
import { getToken } from '../../Cookie';
import { ModalAddCrosscutting } from '@/components/pages/Pohon/ModalCrosscutting';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
}
interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
  }
  
  interface Indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: Target[];
  }
  
  interface Cross {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    kode_opd: string;
    nama_opd: string;
    keterangan: string;
    tahun: string;
    status: string;
    indikator: Indikator[];
  }
  

export const PohonOpd: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [CrossList, setCrossList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    const [DetailCross, setDetailCross] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Cross, setCross] = useState<boolean>(false);
    const [PohonCross, setPohonCross] = useState<Cross[]>([]);
    const [Edited, setEdited] = useState<any | null>(null);
    const token = getToken();

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const newCross = () => {
        setCrossList([...CrossList, Date.now()]); // Using unique IDs
    };
    const handleCross = () => {
        setCross((prev) => !prev);
    }
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }
    const handleDetailCross = () => {
        setDetailCross((prev) => !prev);
    }

    const fetchPohonCross = async (id: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/crosscutting_opd/findall/${id}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('terdapat kesalahan di koneksi backend');
            }
            const result = await response.json();
            const data = result.data || [];
            setPohonCross(data);
        } catch (err) {
            console.error(err);
        }
    }

    const hapusPohonOpd = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };
    const hapusPohonCross = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        console.log(id);
        // try {
        //     const response = await fetch(`${API_URL}/crosscutting_opd/delete/${id}`, {
        //         method: "DELETE",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //     })
        //     if (!response.ok) {
        //         alert("cant fetch data")
        //     }
        //     AlertNotification("Berhasil", "Data pohon Crosscutting Di hapus", "success", 1000);
        //     deleteTrigger();
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        //     console.error(err);
        // }
    };

    return (
        <li>
            {edit ?
                <FormEditPohon
                    level={tema.level_pohon}
                    id={tema.id}
                    key={tema.id}
                    formId={tema.id}
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
                :
                <>
                    <div
                        className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational"  && 'shadow-green-500 bg-green-500'}
                        ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                    `}
                    >
                        {/* HEADER */}
                        <div
                            className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                        `}
                        >
                            {tema.jenis_pohon === 'Operational N' ?
                                <h1>Operational {tema.level_pohon - 6}  </h1>
                                :
                                <h1>{tema.jenis_pohon} </h1>
                            }
                        </div>
                        {/* BODY */}
                        <div className="flex justify-center my-3">
                            {Edited ?
                                <TablePohonEdited item={Edited} />
                                :
                                <TablePohon item={tema} />
                            }
                        </div>
                        {/* BUTTON ACTION INSIDE BOX */}
                        {!['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                            <div
                                className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                `}
                            >
                                <ButtonSkyBorder onClick={() => setEdit(true)}>
                                    <TbPencil className="mr-1" />
                                    Edit
                                </ButtonSkyBorder>
                                <ButtonGreenBorder onClick={handleCross}>
                                    <TbLayersLinked className="mr-1" />
                                    CrossCuting
                                </ButtonGreenBorder>
                                <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id}/>
                                <ButtonRedBorder
                                    onClick={() => {
                                        AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                            if (result.isConfirmed) {
                                                hapusPohonOpd(tema.id);
                                            }
                                        });
                                    }}
                                >
                                    <TbTrash className='mr-1' />
                                    Hapus
                                </ButtonRedBorder>
                            </div>
                        }
                        {DetailCross &&
                            <>
                                <div className="flex justify-center my-3">
                                    {PohonCross.length == 0 ? 
                                        <p className="bg-white w-full rounded-lg py-3">tidak ada crosscuting</p>
                                    :
                                        <TableCrosscuting item={PohonCross} hapusPohonCross={hapusPohonCross}/>
                                    }
                                </div>
                            </>
                        }
                        {/* BUTTON ACTION INSIDE BOX */}
                        {/* detail cross */}
                        {!['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                            <div
                                className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                `}
                            >
                                <ButtonSkyBorder 
                                    onClick={() => {
                                        fetchPohonCross(tema.id);
                                        handleDetailCross();
                                    }}
                                >
                                    <TbEye className="mr-1" />
                                    Cek Crosscuting
                                </ButtonSkyBorder>
                            </div>
                        }
                        {/* footer */}
                        <div className="flex justify-evenly my-3 py-3">
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {Show &&
                                <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                    onClick={newChild}
                                >
                                    <TbCirclePlus className='mr-1' />
                                    {newChildButtonName(tema.jenis_pohon)}
                                </ButtonGreenBorder>
                            }
                        </div>
                    </div>
                </>
            }
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <PohonOpd tema={dahan} key={index} deleteTrigger={deleteTrigger} />
                ))}
                {formList.map((formId) => (
                    <FormPohonOpd
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        pokin={'opd'}
                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                    />
                ))}
                {CrossList.map((formId) => (
                    <FormCrosscutingOpd
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onCancel={() => setCrossList(CrossList.filter((id) => id !== formId))}
                    />
                ))}
            </ul>
        </li>
    )
}
export const PohonOpdEdited: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);
    const token = getToken();

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }

    const hapusPohonOpd = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
            deleteTrigger();
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Reload setelah 3 detik
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {edit ?
                <FormEditPohon
                    level={tema.level_pohon}
                    id={tema.id}
                    key={tema.id}
                    formId={tema.id}
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
                :
                <>
                    <div
                        className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational"&& 'shadow-green-500 bg-green-500'}
                        ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                    `}
                    >
                        {/* HEADER */}
                        <div
                            className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                        `}
                        >
                            {tema.jenis_pohon === 'Operational N' ?
                                <h1>Operational {tema.level_pohon - 6}</h1>
                                :
                                <h1>{tema.jenis_pohon}</h1>
                            }
                        </div>
                        {/* BODY */}
                        <div className="flex justify-center my-3">
                            {Edited ?
                                <TablePohonEdited item={Edited} />
                                :
                                <TablePohon item={tema} />
                            }
                        </div>
                        {/* BUTTON ACTION INSIDE BOX */}
                        {!['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                            <div
                                className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}    
                                `}
                            >
                                <ButtonSkyBorder onClick={() => setEdit(true)}>
                                    <TbPencil className="mr-1" />
                                    Edit
                                </ButtonSkyBorder>
                                <ButtonRedBorder
                                    onClick={() => {
                                        AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                            if (result.isConfirmed) {
                                                hapusPohonOpd(tema.id);
                                            }
                                        });
                                    }}
                                >
                                    <TbTrash className='mr-1' />
                                    Hapus
                                </ButtonRedBorder>
                            </div>
                        }
                        {/* footer */}
                        <div className="flex justify-evenly my-3 py-3">
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {Show &&
                                <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                    onClick={newChild}
                                >
                                    <TbCirclePlus className='mr-1' />
                                    {newChildButtonName(tema.jenis_pohon)}
                                </ButtonGreenBorder>
                            }
                        </div>
                    </div>
                    <ul style={{ display: Show ? 'block' : 'none' }}>
                        {formList.map((formId) => (
                            <FormPohonOpd
                                level={tema.level_pohon}
                                id={tema.id}
                                key={formId}
                                formId={formId}
                                pokin={'opd'}
                                onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                            />
                        ))}
                    </ul>
                </>
            }
        </li>
    )
}

export const TablePohon = (props: any) => {
    const tema = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const opd = props.item.perangkat_daerah?.nama_opd;
    const nama_opd = props.item.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    const status = props.item.status;
    return (
        <table className='w-full'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {(jenis === 'Strategic' || jenis === 'Strategic Pemda') && 'Strategic'}
                        {(jenis === 'Tactical' || jenis === 'Tactical Pemda') && 'Tactical'}
                        {(jenis === 'Operational' || jenis === 'Operational Pemda') && 'Operational'}
                        {jenis === 'Operational N' && 'Operational N'}
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {tema ? tema : "-"}
                    </td>
                </tr>
                {indikator ?
                    indikator.length > 1 ?
                        indikator.map((data: any, index: number) => (
                            <>
                                <tr key={data.id_indikator}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        Indikator {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets ? 
                                    data.targets.map((data: any) => (
                                        <tr key={data.id_target}>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                Target/Satuan {index + 1}
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                            </td>
                                        </tr>
                                    ))
                                :
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                -
                                            </td>
                                        </tr>
                                }
                            </>
                        ))
                        :
                        indikator.map((data: any) => (
                            <>
                                <tr key={data.id_indikator}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        Indikator
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}
                                    `}
                                    >
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets ? 
                                    data.targets.map((data: any) => (
                                        <tr key={data.id_target}>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                            </td>
                                        </tr>
                                    ))
                                :
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                            >
                                                -
                                            </td>
                                        </tr>
                                }
                            </>
                        ))
                    :
                    <>
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}
                            `}
                            >
                                Indikator
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}
                            `}
                            >
                                -
                            </td>
                        </tr>
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                Target/Satuan
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                -
                            </td>
                        </tr>
                    </>
                }
                {opd &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            Perangkat Daerah
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            {opd ? opd : "-"}
                        </td>
                    </tr>
                }
                {nama_opd &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            Perangkat Daerah
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            {nama_opd ? nama_opd : "-"}
                        </td>
                    </tr>
                }
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        Keterangan
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        {keterangan ? keterangan : "-"}
                    </td>
                </tr>
                {status &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                            `}
                        >
                            Status
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational Pemda" && "border-black"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                            `}
                        >
                            {status === 'menunggu_disetujui' ? (
                                <div className="flex items-center">
                                    {status || "-"}
                                    <TbHourglass />
                                </div>
                            ) : status === 'disetujui' ? (
                                <div className="flex items-center text-green-500">
                                    {status || "-"}
                                    <TbCheck />
                                </div>
                            ) : status === 'ditolak' ? (
                                <div className="flex items-center text-red-500">
                                    {status || "-"}
                                    <TbCircleLetterXFilled />
                                </div>
                            ) : (
                                <span>{status || "-"}</span>
                            )}
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}
export const TableCrosscuting = (props: any) => {
    const { item, hapusPohonCross } = props;

    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Nama Pohon</th>
                    <th className="border px-4 py-2">Jenis Pohon</th>
                    <th className="border px-4 py-2">OPD</th>
                    <th className="border px-4 py-2">Indikator</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {item.map((data: any) => (
                    <tr key={data.id} className="bg-white hover:bg-gray-100">
                        <td className="border px-4 py-2">{data.nama_pohon ? data.nama_pohon : "-"}</td>
                        <td
                            className={`border px-4 py-2`}
                        >
                            {data?.jenis_pohon ? data.jenis_pohon : "-"}
                        </td>
                        <td className="border px-4 py-2">
                            {data?.kode_opd ? data.kode_opd : "-"}
                        </td>
                        <td className="border px-4 py-2">
                            {data.indikator?.map((indikator: any) => (
                                <div key={indikator.id_indikator}>
                                    {indikator.nama_indikator}
                                </div>
                            )) || "-"}
                        </td>
                        <td className="border px-4 py-2">{data.status ? data.status : "-"}</td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => hapusPohonCross(data.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const TablePohonEdited = (props: any) => {
    const tema = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const opd = props.item.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    return (
        <table className='w-full'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {(jenis === 'Strategic' || jenis === 'Strategic Pemda') && 'Strategic'}
                        {(jenis === 'Tactical' || jenis === 'Tactical Pemda') && 'Tactical'}
                        {(jenis === 'Operational' || jenis === 'Operational Pemda') && 'Operational'}
                        {jenis === 'Operational N' && 'Operational N'}
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {tema ? tema : "-"}
                    </td>
                </tr>
                {indikator ?
                    indikator.length > 1 ?
                        indikator.map((data: any, index: number) => (
                            <>
                                <tr key={data.id_indikator}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${jenis === "Strategic Pemda" && "border-black"}
                                            ${jenis === "Tactical Pemda" && "border-black"}
                                            ${jenis === "Operational Pemda" && "border-black"}
                                        `}
                                    >
                                        Indikator {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${jenis === "Strategic Pemda" && "border-black"}
                                            ${jenis === "Tactical Pemda" && "border-black"}
                                            ${jenis === "Operational Pemda" && "border-black"}
                                        `}
                                    >
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets.map((data: any) => (
                                    <tr key={data.id_target}>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            Target/Satuan {index + 1}
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ))
                        :
                        indikator.map((data: any) => (
                            <>
                                <tr key={data.id_indikator}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${jenis === "Strategic Pemda" && "border-black"}
                                            ${jenis === "Tactical Pemda" && "border-black"}
                                            ${jenis === "Operational Pemda" && "border-black"}
                                        `}
                                    >
                                        Indikator
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${jenis === "Strategic Pemda" && "border-black"}
                                            ${jenis === "Tactical Pemda" && "border-black"}
                                            ${jenis === "Operational Pemda" && "border-black"}
                                        `}
                                    >
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets.map((data: any) => (
                                    <tr key={data.id_target}>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            Target/Satuan
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${jenis === "Strategic Pemda" && "border-black"}
                                                ${jenis === "Tactical Pemda" && "border-black"}
                                                ${jenis === "Operational Pemda" && "border-black"}    
                                            `}
                                        >
                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ))
                    :
                    <>
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}
                                `}
                            >
                                Indikator
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}
                                `}
                            >
                                -
                            </td>
                        </tr>
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                Target/Satuan
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                -
                            </td>
                        </tr>
                    </>
                }
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white text-start
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        Perangkat Daerah
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        {opd ? opd : "-"}
                    </td>
                </tr>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        Keterangan
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${jenis === "StrategicPemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}    
                        `}
                    >
                        {keterangan ? keterangan : "-"}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export const newChildButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return 'Tactical';
        case 'Tactical Pemda':
            return 'Operational';
        case 'Strategic':
            return 'Tactical';
        case 'Tactical':
            return 'Opertional';
        case 'Operational':
            return 'Opertional N';
        case 'Operational Pemda':
            return 'Opertional N';
        case 'Operational N':
            return 'Opertional N';
        default:
            return '-'
    }
}
export const newCrosscutingButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return '(Crosscuting) Tactical';
        case 'Tactical Pemda':
            return '(Crosscuting) Operational';
        case 'Strategic':
            return '(Crosscuting) Tactical';
        case 'Tactical':
            return '(Crosscuting) Opertional';
        case 'Operational':
            return '(Crosscuting) Opertional N';
        case 'Operational Pemda':
            return '(Crosscuting) Opertional N';
        case 'Operational N':
            return '(Crosscuting) Opertional N';
        default:
            return '-'
    }
}