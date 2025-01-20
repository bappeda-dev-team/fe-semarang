import { useEffect, useState } from 'react';
import { TbLayersLinked, TbCheck, TbCircleLetterXFilled, TbCirclePlus, TbHourglass, TbPencil, TbTrash, TbEye, TbArrowAutofitWidth } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import { FormPohonOpd, FormEditPohon, FormCrosscutingOpd } from './FormPohonOpd';
import { getToken, getUser } from '../../Cookie';
import { ModalAddCrosscutting } from '@/components/pages/Pohon/ModalCrosscutting';
import { ModalPindahPohonOpd } from '@/components/pages/Pohon/ModalPindahPohonOpd';

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
    const [PindahPohon, setPindahPohon] = useState<boolean>(false);
    const [CrossLoading, setCrossLoading] = useState<boolean>(false);
    const [PohonCross, setPohonCross] = useState<Cross[]>([]);
    const [Edited, setEdited] = useState<any | null>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
       const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[])

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const handleCross = () => {
        setCross((prev) => !prev);
    }
    const handlePindahPohon = () => {
        setPindahPohon((prev) => !prev);
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
            setCrossLoading(true);
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
        } finally{
            setCrossLoading(false);
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
    const hapusPohonCross = async (id: any, ori?: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log("id yang dihapus : ", id, "ori : ", ori);
        try {
            const response = await fetch(`${API_URL}/crosscutting_opd/delete/${id}/${User?.nip}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            const data = await response.json();
            if(data.code == 400){
                AlertNotification("Gagal", "Crosscutting hanya bisa dihapus saat setelah disetujui", "error", 3000, true);
            } else if(data.code == 200){
                AlertNotification("Berhasil", "Data pohon Crosscutting Di hapus", "success", 1000);
                deleteTrigger();
            }
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
                            ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                            ${tema.jenis_pohon === "Tactical"&& 'shadow-blue-500 bg-blue-500'}
                            ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                            ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                            ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
                        `}
                    >
                        {/* HEADER */}
                        <div
                            className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-700'}
                                ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                ${(tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
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
                        {/* BUTTON ACTION INSIDE BOX SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 */}
                        {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1') &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 2*/}
                        {(User?.roles == 'level_2' && 
                            (
                                tema.jenis_pohon === 'Tactical' ||  
                                tema.jenis_pohon === 'Tactical Crosscutting' ||  
                                tema.jenis_pohon === 'Operational' || 
                                tema.jenis_pohon === 'Operational Crosscutting' || 
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting'
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 3*/}
                        {(User?.roles == 'level_3' && 
                            (
                                tema.jenis_pohon === 'Operational' ||  
                                tema.jenis_pohon === 'Operational Crosscutting' ||  
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting'
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 4*/}
                        {(User?.roles == 'level_4' && 
                            (
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting'
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* DETAIL DATA CROSSCUTTING */}
                        {DetailCross &&
                            <>
                                <div className="flex justify-center my-3">
                                    {CrossLoading ? (
                                        <p className="bg-white w-full rounded-lg py-3 text-center">Loading...</p>
                                    ) : PohonCross.length === 0 ? (
                                        <p 
                                            className={`bg-white w-full rounded-lg py-3
                                                ${tema.jenis_pohon === 'Operational N' && 'border border-green-500'}
                                            `}
                                        >
                                            tidak ada crosscuting
                                        </p>
                                    ) : (
                                        <TableCrosscuting item={PohonCross} ori={tema.id} hapusPohonOpd={hapusPohonOpd} />
                                    )}
                                </div>
                            </>
                        }
                        {/* BUTTON ACTION INSIDE BOX CEK CROSSCUTTING */}
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
                                    {DetailCross ? "Sembunyikan" : "Cek Crosscutting"}
                                </ButtonSkyBorder>
                            </div>
                        }
                        {/* footer */}
                        <div className="flex justify-evenly my-3 py-3">
                            {(tema.level_pohon != 4 && (
                                User?.roles == 'super_admin' ||
                                User?.roles == 'admin_opd' ||
                                User?.roles == 'level_1' ||
                                User?.roles == 'level_2'
                            )) &&
                                <>
                                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={handlePindahPohon}
                                        >
                                        <TbArrowAutofitWidth className='mr-1' />
                                        Pindah
                                    </ButtonBlackBorder>
                                    <ModalPindahPohonOpd 
                                        onClose={handlePindahPohon}
                                        isOpen={PindahPohon}
                                        id={tema.id}
                                        pohon={tema}
                                        onSuccess={deleteTrigger}
                                    />
                                </>
                            }
                            {(User?.roles == 'level_3' && (
                                tema.jenis_pohon == "Operational" ||
                                tema.jenis_pohon == "Operational Pemda" ||
                                tema.jenis_pohon == "Operational Crosscutting" ||
                                tema.jenis_pohon == "Operational N" ||
                                tema.jenis_pohon == "Operational N Crosscutting"
                            )) &&
                                <>
                                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={handlePindahPohon}
                                        >
                                        <TbArrowAutofitWidth className='mr-1' />
                                        Pindah
                                    </ButtonBlackBorder>
                                    <ModalPindahPohonOpd 
                                        onClose={handlePindahPohon}
                                        isOpen={PindahPohon}
                                        id={tema.id}
                                        pohon={tema}
                                        onSuccess={deleteTrigger}
                                    />
                                </>
                            }
                            {(User?.roles == 'level_4' && (
                                tema.jenis_pohon == "Operational N" ||
                                tema.jenis_pohon == "Operational N Crosscutting"
                            )) &&
                                <>
                                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={handlePindahPohon}
                                        >
                                        <TbArrowAutofitWidth className='mr-1' />
                                        Pindah
                                    </ButtonBlackBorder>
                                    <ModalPindahPohonOpd 
                                        onClose={handlePindahPohon}
                                        isOpen={PindahPohon}
                                        id={tema.id}
                                        pohon={tema}
                                        onSuccess={deleteTrigger}
                                    />
                                </>
                            }
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {/* BUTTON TAMBAH POKIN OPD SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 & 2 */}
                            {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1' || User?.roles == 'level_2') &&
                                Show &&
                                <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={newChild}
                                >
                                        <TbCirclePlus className='mr-1' />
                                        {newChildButtonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                            }
                            {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 3 */}
                            {(User?.roles == 'level_3' && 
                                (
                                    tema.jenis_pohon === 'Tactical' || 
                                    tema.jenis_pohon === 'Tactical Pemda' || 
                                    tema.jenis_pohon === 'Operational' || 
                                    tema.jenis_pohon === 'Operational Pemda' || 
                                    tema.jenis_pohon === 'Operational N' || 
                                    tema.jenis_pohon === 'Operational N Pemda'
                                )) &&
                                Show &&
                                    <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={newChild}
                                    >
                                        <TbCirclePlus className='mr-1' />
                                        {newChildButtonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                            }
                            {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 4 */}
                            {(User?.roles == 'level_4' && 
                                (
                                    tema.jenis_pohon === 'Operational' || 
                                    tema.jenis_pohon === 'Operational Pemda' || 
                                    tema.jenis_pohon === 'Operational N' || 
                                    tema.jenis_pohon === 'Operational N Pemda'
                                )) &&
                                Show &&
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
    const [DetailCross, setDetailCross] = useState<boolean>(false);
    const [Cross, setCross] = useState<boolean>(false);
    const [PindahPohon, setPindahPohon] = useState<boolean>(false);
    const [CrossLoading, setCrossLoading] = useState<boolean>(false);
    const [PohonCross, setPohonCross] = useState<Cross[]>([]);
    const [Edited, setEdited] = useState<any | null>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
       const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleCross = () => {
        setCross((prev) => !prev);
    }
    const handlePindahPohon = () => {
        setPindahPohon((prev) => !prev);
    }
    const handleDetailCross = () => {
        setDetailCross((prev) => !prev);
    }
    const handleShow = () => {
        setShow((prev) => !prev);
    }
    const fetchPohonCross = async (id: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setCrossLoading(true);
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
        } finally{
            setCrossLoading(false);
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
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Reload setelah 3 detik
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
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational"&& 'shadow-green-500 bg-green-500'}
                        ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                        ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
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
                        {/* BUTTON ACTION INSIDE BOX SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 */}
                        {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1') &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 2*/}
                        {(User?.roles == 'level_2' && 
                            (
                                tema.jenis_pohon === 'Tactical' ||  
                                tema.jenis_pohon === 'Tactical Crosscutting' ||  
                                tema.jenis_pohon === 'Operational' || 
                                tema.jenis_pohon === 'Operational Crosscutting' || 
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting'
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 3*/}
                        {(User?.roles == 'level_3' && 
                            (
                                tema.jenis_pohon === 'Operational' ||  
                                tema.jenis_pohon === 'Operational Crosscutting' ||  
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting' 
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* BUTTON ACTION INSIDE BOX ASN LEVEL 4*/}
                        {(User?.roles == 'level_4' && 
                            (
                                tema.jenis_pohon === 'Operational N' ||
                                tema.jenis_pohon === 'Operational N Crosscutting'
                            )) &&
                            !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
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
                                                    if(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting"){
                                                        hapusPohonCross(tema.id)
                                                    } else {
                                                        hapusPohonOpd(tema.id);
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <TbTrash className='mr-1' />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                        }
                        {/* DETAIL DATA CROSSCUTTING */}
                        {DetailCross &&
                            <>
                                <div className="flex justify-center my-3">
                                    {CrossLoading ? (
                                        <p className="bg-white w-full rounded-lg py-3 text-center">Loading...</p>
                                    ) : PohonCross.length === 0 ? (
                                        <p 
                                            className={`bg-white w-full rounded-lg py-3
                                                ${tema.jenis_pohon === 'Operational N' && 'border border-green-500'}
                                            `}
                                        >
                                            tidak ada crosscuting
                                        </p>
                                    ) : (
                                        <TableCrosscuting item={PohonCross} hapusPohonCross={hapusPohonCross} />
                                    )}
                                </div>
                            </>
                        }
                        {/* BUTTON ACTION INSIDE BOX CEK CROSSCUTTING */}
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
                                    {DetailCross ? "Sembunyikan" : "Cek Crosscutting"}
                                </ButtonSkyBorder>
                            </div>
                        }
                        {/* footer */}
                        <div className="flex justify-evenly my-3 py-3">
                            {(tema.level_pohon != 4 && (
                                User?.roles == 'super_admin' ||
                                User?.roles == 'admin_opd' ||
                                User?.roles == 'level_1' ||
                                User?.roles == 'level_2'
                            )) &&
                                <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                    onClick={handlePindahPohon}
                                >
                                    <TbArrowAutofitWidth className='mr-1' />
                                    Pindah
                                </ButtonBlackBorder>
                            }
                            {(User?.roles == 'level_3' && (
                                tema.jenis_pohon == "Operational" ||
                                tema.jenis_pohon == "Operational Pemda" ||
                                tema.jenis_pohon == "Operational Crosscutting" ||
                                tema.jenis_pohon == "Operational N" ||
                                tema.jenis_pohon == "Operational N Crosscutting"
                            )) &&
                                <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                    onClick={handlePindahPohon}
                                >
                                    <TbArrowAutofitWidth className='mr-1' />
                                    Pindah
                                </ButtonBlackBorder>
                            }
                            {(User?.roles == 'level_4' && (
                                tema.jenis_pohon == "Operational N" ||
                                tema.jenis_pohon == "Operational N Crosscutting"
                            )) &&
                                <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                    onClick={handlePindahPohon}
                                >
                                    <TbArrowAutofitWidth className='mr-1' />
                                    Pindah
                                </ButtonBlackBorder>
                            }
                            <ModalPindahPohonOpd 
                                onClose={handlePindahPohon}
                                isOpen={PindahPohon}
                                id={tema.id}
                                pohon={tema}
                                onSuccess={deleteTrigger}
                            />
                            {/* BUTTON TAMPILKAN / SEMBUNYIKAN */}
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {/* BUTTON TAMBAH POKIN OPD SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 & 2 */}
                            {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1' || User?.roles == 'level_2') &&
                                Show &&
                                <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={newChild}
                                >
                                        <TbCirclePlus className='mr-1' />
                                        {newChildButtonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                            }
                            {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 3 */}
                            {(User?.roles == 'level_3' && 
                                (
                                    tema.jenis_pohon === 'Tactical' || 
                                    tema.jenis_pohon === 'Tactical Pemda' || 
                                    tema.jenis_pohon === 'Operational' || 
                                    tema.jenis_pohon === 'Operational Pemda' || 
                                    tema.jenis_pohon === 'Operational N' || 
                                    tema.jenis_pohon === 'Operational N Pemda'
                                )) &&
                                Show &&
                                    <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={newChild}
                                    >
                                        <TbCirclePlus className='mr-1' />
                                        {newChildButtonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                            }
                            {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 4 */}
                            {(User?.roles == 'level_4' && 
                                (
                                    tema.jenis_pohon === 'Operational' || 
                                    tema.jenis_pohon === 'Operational Pemda' || 
                                    tema.jenis_pohon === 'Operational N' || 
                                    tema.jenis_pohon === 'Operational N Pemda'
                                )) &&
                                Show &&
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
    const id = props.item.id;
    const tema = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const opd = props.item.perangkat_daerah?.nama_opd;
    const nama_opd = props.item.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    const status = props.item.status;

    const [OpdAsal, setOpdAsal] = useState<string | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOpdAsal = async() => {
            try{
                setProses(true);
                const response = await fetch(`${API_URL}/crosscutting_opd/opd-from/${id}`, {
                   method: "GET",
                   headers: {
                    Authorization: `${token}`,
                    'Content-Type' : 'application/json',
                   }
                });
                if (!response.ok) {
                    throw new Error('kesalahan ketika fetch data opd asal');
                }
                const data = await response.json();
                if(data.code === 500){
                    setOpdAsal(null);
                } else {
                    setOpdAsal(data.data.nama_opd);
                    // console.log(data.data.nama_opd);
                }
            } catch(err){
                console.error(err, "gagal fetch data opd asal");
            } finally {
                setProses(false);
            }
        }
        fetchOpdAsal();
    }, [token, id]);

    return (
        <table className='w-full'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                        `}
                    >
                        {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                        {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                        {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                        {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        Indikator {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                `}
                                            >
                                                Target/Satuan {index + 1}
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        Indikator
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                `}
                                            >
                                                Target/Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                `}
                            >
                                Indikator
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Target/Satuan
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                            `}
                        >
                            Perangkat Daerah
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                            `}
                        >
                            Perangkat Daerah
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                        `}
                    >
                        Keterangan
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                        `}
                    >
                        {keterangan ? keterangan : "-"}
                    </td>
                </tr>
                {status &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                            `}
                        >
                            Status
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                            `}
                        >
                            {status === 'menunggu_disetujui' ? (
                                <div className="flex items-center">
                                    Pending
                                    <TbHourglass />
                                </div>
                            ) : status === 'crosscutting_disetujui_existing' ? (
                                <div className="flex items-center text-green-500">
                                    Pilihan Crosscutting
                                    <TbCheck />
                                </div>
                            ) : status === 'disetujui' ? (
                                <div className="flex items-center text-green-500">
                                    Disetujui
                                    <TbCheck />
                                </div>
                            ) : status === 'ditolak' ? (
                                <div className="flex items-center text-red-500">
                                    Ditolak
                                    <TbCircleLetterXFilled />
                                </div>
                            ) : (
                                <span>{status || "-"}</span>
                            )}
                        </td>
                    </tr>
                }
                {(status === "crosscutting_disetujui" || status === "crosscutting_disetujui_existing")  &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 text-start rounded-l-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            `}
                        >
                            OPD Asal
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 text-start rounded-r-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            `}
                        >
                            {Proses ? "Loading.." : OpdAsal ? OpdAsal : "-"}
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}
export const TableCrosscuting = (props: any) => {
    const { item, hapusPohonOpd } = props;

    return (
        <div className="flex flex-col w-full">

            {item.map((data: any, index: number) => (
                <>
                    <div className="flex flex-wrap w-full bg-white p-2 mt-2 justify-between items-center rounded-t-xl">
                        <h1 className='p-1'>Crosscutting ke {index + 1}</h1>
                        <ButtonRedBorder 
                            onClick={() => {
                                if((data.status === 'crosscutting_disetujui' || data.status === 'crosscutting_disetujui_existing')){
                                    AlertNotification("Pohon Harus Ditolak/Pending", "Pohon harus berstatus ditolak atau Pending untuk bisa dihapus, hal ini mencegah pohon yang sudah diterima (beserta anak pohonnya) terhapus tanpa persetujuan ke dua OPD", "warning", 50000, true);
                                } else {
                                    AlertQuestion("Hapus?", "Hapus pohon crosscutting?", "question", "Hapus", "Batal").then((result) => {
                                        if (result.isConfirmed) {
                                            hapusPohonOpd(data.id);
                                        }
                                    });
                                }
                            }}
                        >
                            Hapus
                        </ButtonRedBorder>
                    </div>
                    <table key={index} className="w-full">
                        <tbody>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-yellow-100 text-start`}
                                >
                                    tema {data.id}
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-yellow-100 text-start`}
                                >
                                    {data.nama_pohon ? 
                                        <p>{data.nama_pohon}</p>
                                    : 
                                        <p className="italic font-thin">*menunggu diterima & diedit</p>
                                    }
                                </td>
                            </tr>
                            {data.indikator ?
                                data.indikator.length > 1 ?
                                    data.indikator.map((data: any, index: number) => (
                                        <>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    Indikator {index + 1}
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    {data.nama_indikator ? data.nama_indikator : "-"}
                                                </td>
                                            </tr>
                                            {data.targets ? 
                                                data.targets.map((data: any) => (
                                                    <tr key={data.id_target}>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan {index + 1}
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                        </td>
                                                    </tr>
                                                ))
                                            :
                                                    <tr>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start   
                                                        `}
                                                        >
                                                            -
                                                        </td>
                                                    </tr>
                                            }
                                        </>
                                    ))
                                    :
                                    data.indikator.map((data: any) => (
                                        <>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    Indikator
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    {data.nama_indikator ? data.nama_indikator : "-"}
                                                </td>
                                            </tr>
                                            {data.targets ? 
                                                data.targets.map((data: any) => (
                                                    <tr key={data.id_target}>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                        </td>
                                                    </tr>
                                                ))
                                            :
                                                    <tr>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
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
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                        >
                                            Indikator
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                        >
                                            -
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                        >
                                            Target/Satuan
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                        >
                                            -
                                        </td>
                                    </tr>
                                </>
                            }
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                >
                                    Jenis Pohon
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start 
                                        ${(data.jenis_pohon === "Strategic" || data.jenis_pohon === "Strategic Crosscutting") && 'text-red-700'}
                                        ${(data.jenis_pohon === "Tactical" || data.jenis_pohon === "Tactical Crosscutting") && 'text-blue-500'}
                                        ${(data.jenis_pohon === "Operational" || data.jenis_pohon === "Operational Crosscutting") && 'text-green-500'}
                                        ${(data.jenis_pohon === "Operational N" || data.jenis_pohon === "Operational N Crosscutting") && 'text-green-300'}
                                    `}
                                >
                                    {data.jenis_pohon ? 
                                        data.jenis_pohon 
                                    : 
                                        <p className='italic font-thin'>*menunggu diterima & diedit</p>
                                    }
                                </td>
                            </tr>
                            {data.nama_opd &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-yellow-100 text-start`}
                                    >
                                        Perangkat Daerah
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-yellow-100 text-start`}
                                    >
                                        {data.nama_opd ? data.nama_opd : "-"}
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start`}
                                >
                                    Keterangan
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                >
                                    {data.keterangan ? data.keterangan : "-"}
                                </td>
                            </tr>
                            {data.status &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start`}
                                    >
                                        Status
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                    >
                                        {data.status === 'crosscutting_menunggu' ? (
                                            <div className="flex flex-wrap gap-2 items-center">
                                                pending
                                                <TbHourglass />
                                            </div>
                                        ) : data.status === 'crosscutting_disetujui' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-green-500">
                                                diterima dengan pohon baru
                                                <TbCheck />
                                            </div>
                                        ) : data.status === 'crosscutting_ditolak' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-red-500">
                                                ditolak
                                                <TbCircleLetterXFilled />
                                            </div>
                                        ) : data.status === 'crosscutting_disetujui_existing' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-green-500">
                                                diterima dengan pohon OPD pilihan
                                                <TbCheck />
                                            </div>
                                        ) : (
                                            <span>{data.status || "-"}</span>
                                        )}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </>
            ))}
        </div>
    );
};

export const TablePohonEdited = (props: any) => {
    const tema = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const opd = props.item.nama_opd;
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
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                        `}
                    >
                        {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                        {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                        {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                        {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting`') && 'Operational N'}
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        Indikator {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Target/Satuan {index + 1}
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
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
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        Indikator
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Target/Satuan
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                `}
                            >
                                Indikator
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
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
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Target/Satuan
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
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
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                        `}
                    >
                        Perangkat Daerah
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}                        `}
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
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                        `}
                    >
                        Keterangan
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                        `}
                    >
                        {keterangan ? keterangan : "-"}
                    </td>
                </tr>
                {status &&
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                            `}
                        >
                            Status
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                            `}
                        >
                            {status === 'menunggu_disetujui' ? (
                                <div className="flex items-center">
                                    Pending
                                    <TbHourglass />
                                </div>
                            ) : status === 'crosscutting_disetujui_existing' ? (
                                <div className="flex items-center text-green-500">
                                    Pilihan Crosscutting
                                    <TbCheck />
                                </div>
                            ) : status === 'disetujui' ? (
                                <div className="flex items-center text-green-500">
                                    Disetujui
                                    <TbCheck />
                                </div>
                            ) : status === 'ditolak' ? (
                                <div className="flex items-center text-red-500">
                                    Ditolak
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

export const newChildButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return 'Tactical';
        case 'Tactical Pemda':
            return 'Operational';
        case 'Operational Pemda':
            return 'Opertional N';
        case 'Strategic':
            return 'Tactical';
        case 'Tactical':
            return 'Opertional';
        case 'Operational':
            return 'Opertional N';
        case 'Operational N':
            return 'Opertional N';
        case 'Strategic Crosscutting':
            return 'Tactical';
        case 'Tactical Crosscutting':
            return 'Operational';
        case 'Operational Crosscutting':
            return 'Operational N';
        case 'Operational N Crosscutting':
            return 'Operational N';
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