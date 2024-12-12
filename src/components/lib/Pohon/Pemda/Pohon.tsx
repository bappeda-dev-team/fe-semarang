import { useState } from 'react';
import { TbEye, TbArrowGuide, TbCheck, TbCircleLetterXFilled, TbCirclePlus, TbHourglass, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import {FormPohonPemda, FormAmbilPohon, FormEditPohon} from './FormPohonPemda';
import { getToken } from '../../Cookie';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
}

export const Pohon: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [PutPohons, setPutPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [PutList, setPutList] = useState<number[]>([]); // List of form IDs
    const [FormStrategic, setFormStrategic] = useState<number[]>([]); // List of form IDs
    const [strategicPohons, setStrategicPohons] = useState(tema.strategics || []);
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);
    const token = getToken();
    
    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const newPutChild = () => {
        setPutList([...PutList, Date.now()]); // Using unique IDs
    };
    const newStrategic = () => {
        setFormStrategic([...PutList, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
      setEdited(data);
      setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }

    const hapusSubTematik = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data Pohon Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };
    const hapusPohonOpd = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch(err){
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
                    pokin={'pemda'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
            :
            <>
                <div 
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Sub Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Sub Sub Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Super Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Operational Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'shadow-green-500 bg-green-500'}
                        ${tema.status === "ditolak" && 'shadow-black bg-gray-500'}
                        `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Super Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#139052] from-40% to-[#2DCB06]'}
                            `}
                            >
                        <h1>{tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        {Edited ? 
                            <TablePohonEdited item={Edited}/>
                        :
                            <TablePohon item={tema} />
                        }
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    <div 
                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white border-black
                            ${tema.jenis_pohon === "Strategic" && 'border-white'}
                            ${tema.jenis_pohon === "Tactical" && 'border-white'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-white'}
                        `}
                    >
                        {!['Strategic', 'Tactical', 'Operational', 'Operational N'].includes(tema.jenis_pohon) &&
                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                            <TbPencil className="mr-1"/>
                            Edit
                        </ButtonSkyBorder>
                        }
                        {tema.jenis_pohon !== 'Tematik' && 
                            <ButtonRedBorder
                            onClick={() => {
                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                    if(result.isConfirmed){
                                        if(tema.jenis_pohon === 'Tematik' || 'SubTematik' || 'SubSubTematik' || 'SuperSubTematik'){
                                            hapusSubTematik(tema.id);
                                        } else {
                                            hapusPohonOpd(tema.id);
                                        }
                                    }
                                });
                            }}
                            >
                                <TbTrash className='mr-1'/>
                                Hapus
                            </ButtonRedBorder>
                        }
                    </div>
                    {/* TOMBOL ADD POHON */}
                    {(
                        tema.jenis_pohon !== 'Operational Pemda' && 
                        tema.jenis_pohon !== 'Operational' &&
                        tema.jenis_pohon !== 'Operational N'
                    ) &&
                        <div className="flex flex-wrap gap-3 justify-evenly my-3 py-3">
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {Show &&
                                <>
                                    {/* TOMBOL ADD POHON SESUAI URUTAN AKARNYA */}
                                    {tema.level_pohon !== 3 &&
                                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 rounded-lg
                                                ${(tema.jenis_pohon === 'Strategic' || tema.jenis_pohon === 'Strategic Pemda') && 'border-[#3b82f6] hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white'}    
                                            `}
                                            onClick={newChild}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            {tambahPohonName(tema.jenis_pohon)}
                                        </ButtonGreenBorder>
                                    }
                                    {/* AMBIL POHON MULAI DARI STRATEGIC DARI OPD */}
                                    <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                                        onClick={newPutChild}
                                        >
                                        <TbArrowGuide className='mr-1' />
                                        {"(Ambil)"} {ambilPohonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                                    {/* TOMBOL ADD KHUSUS STRATEGIC KOTA  */}
                                    {(tema.level_pohon === 0 || tema.level_pohon === 1 || tema.level_pohon === 2 || tema.level_pohon === 3) &&
                                        <ButtonRedBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 rounded-lg`}
                                            onClick={newStrategic}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            Strategic
                                        </ButtonRedBorder>
                                    }
                                </>
                            }
                        </div>
                    }
                </div>
            </>
            }
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {strategicPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {formList.map((formId) => (
                    <FormPohonPemda
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        pokin={'pemda'}
                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                    />
                ))}
                {FormStrategic.map((formId) => (
                    <FormPohonPemda
                        level={3}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        pokin={'pemda'}
                        onCancel={() => setFormStrategic(FormStrategic.filter((id) => id !== formId))}
                    />
                ))}
                {PutList.map((formId) => (
                    <FormAmbilPohon
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onCancel={() => setPutList(PutList.filter((id) => id !== formId))}
                    />
                ))}
            </ul>
        </li>
    )
}
export const PohonEdited: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [PutList, setPutList] = useState<number[]>([]); // List of form IDs
    const [FormStrategic, setFormStrategic] = useState<number[]>([]); // List of form IDs
    const [strategicPohons, setStrategicPohons] = useState(tema.strategics || []);
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);
    const token = getToken();
    
    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const newPutChild = () => {
        setPutList([...PutList, Date.now()]); // Using unique IDs
    };
    const newStrategic = () => {
        setFormStrategic([...PutList, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
      setEdited(data);
      setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }

    const hapusSubTematik = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data Pohon Berhasil Dihapus", "success", 1000);
            // deleteTrigger();
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Reload setelah 3 detik
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
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
            // deleteTrigger();
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Reload setelah 3 detik
        } catch(err){
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
                    pokin={'pemda'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
            :
            <>
                <div 
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Sub Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Sub Sub Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Super Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Operational Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-700 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'shadow-green-500 bg-green-500'}
                    `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Super Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#139052] from-40% to-[#2DCB06]'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-700 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                        `}
                            >
                        <h1>{tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        {Edited ? 
                            <TablePohonEdited item={Edited}/>
                        :
                            <TablePohonEdited item={tema} />
                        }
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    <div 
                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Super Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-black text-red-700'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-black text-blue-500'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-black text-green-500'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-700 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                        `}
                    >
                        {!['Strategic', 'Tactical', 'Operational', 'Operational N'].includes(tema.jenis_pohon) &&
                            <ButtonSkyBorder onClick={() => setEdit(true)}>
                                <TbPencil className="mr-1"/>
                                Edit
                            </ButtonSkyBorder>
                        }
                        {tema.jenis_pohon !== 'Tematik' && 
                            <ButtonRedBorder
                            onClick={() => {
                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                    if(result.isConfirmed){
                                        if(tema.jenis_pohon === 'Tematik' || 'Sub Tematik' || 'SubSub Tematik' || 'SuperSub Tematik'){
                                            hapusSubTematik(tema.id);
                                        } else {
                                            hapusPohonOpd(tema.id);
                                        }
                                    }
                                });
                            }}
                            >
                                <TbTrash className='mr-1'/>
                                Hapus
                            </ButtonRedBorder>
                        }
                    </div>
                    {/* TOMBOL ADD POHON */}
                    {(
                        tema.jenis_pohon !== 'Operational Pemda' && 
                        tema.jenis_pohon !== 'Operational' &&
                        tema.jenis_pohon !== 'Operational N'
                    ) &&
                        <div className="flex flex-wrap gap-3 justify-evenly my-3 py-3">
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {Show &&
                                <>
                                    {/* TOMBOL ADD POHON SESUAI URUTAN AKARNYA */}
                                    {tema.level_pohon !== 3 &&
                                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 rounded-lg
                                                ${(tema.jenis_pohon === 'Strategic' || tema.jenis_pohon === 'Strategic Pemda') && 'border-[#3b82f6] hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white'}    
                                            `}
                                            onClick={newChild}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            {tambahPohonName(tema.jenis_pohon)}
                                        </ButtonGreenBorder>
                                    }
                                    {/* AMBIL POHON MULAI DARI STRATEGIC DARI OPD */}
                                    <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                                        onClick={newPutChild}
                                        >
                                        <TbArrowGuide className='mr-1' />
                                        {"(Ambil)"} {ambilPohonName(tema.jenis_pohon)}
                                    </ButtonGreenBorder>
                                    {/* TOMBOL ADD KHUSUS STRATEGIC KOTA  */}
                                    {(tema.level_pohon === 0 || tema.level_pohon === 1 || tema.level_pohon === 2 || tema.level_pohon === 3) &&
                                        <ButtonRedBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 rounded-lg`}
                                            onClick={newStrategic}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            Strategic
                                        </ButtonRedBorder>
                                    }
                                </>
                            }
                        </div>
                    }
                </div>
            </>
            }
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {strategicPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {formList.map((formId) => (
                    <FormPohonPemda
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        pokin={'pemda'}
                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                    />
                ))}
                {FormStrategic.map((formId) => (
                    <FormPohonPemda
                        level={3}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        pokin={'pemda'}
                        onCancel={() => setFormStrategic(FormStrategic.filter((id) => id !== formId))}
                    />
                ))}
                {PutList.map((formId) => (
                    <FormAmbilPohon
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onCancel={() => setPutList(PutList.filter((id) => id !== formId))}
                    />
                ))}
            </ul>
        </li>
    )
}

export const TablePohon = (props: any) => {
  const tema = props.item.tema;
  const keterangan = props.item.keterangan;
  const opd = props.item.perangkat_daerah?.nama_opd;
  const jenis = props.item.jenis_pohon;
  const indikator = props.item.indikators;
  const status = props.item.status;
  return (
    <table className='w-full'>
      <tbody>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "Sub Tematik" && "border-black"}
                    ${jenis === "Sub Sub Tematik" && "border-black"}
                    ${jenis === "Super Sub Tematik" && "border-black"}
                    ${jenis === "Strategic Pemda" && "border-black"}
                    ${jenis === "Tactical Pemda" && "border-black"}
                    ${jenis === "Operational Pemda" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                `}
            >
                {(jenis === 'Tematik' || jenis === 'Sub Tematik' || jenis === 'Sub Sub Tematik' || jenis === 'Super Sub Tematik') && 'Tema'}
                {(jenis === 'Strategic' || jenis === 'Strategic Pemda') && 'Strategic'}
                {(jenis === 'Tactical' || jenis === 'Tactical Pemda') && 'Tactical'}
                {(jenis === 'Operational' || jenis === 'Operational Pemda') && 'Operational'}
                {jenis === 'Operational N' && 'Operational N'}
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
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
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                        {data.targets.map((data: any, index: number) => (
                            <tr key={data.id_target}>
                                <td 
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
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
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
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
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
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
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
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
                Perangkat Daerah
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                {opd ? opd : "-"}
            </td>
        </tr>
        }
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
                Keterangan
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
export const TablePohonEdited = (props: any) => {
  const tema = props.item.nama_pohon;
  const keterangan = props.item.keterangan;
  const opd = props.item.nama_opd;
  const jenis = props.item.jenis_pohon;
  const indikator = props.item.indikators;
  const status = props.item.status;
  return (
    <table className='w-full'>
      <tbody>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                  ${jenis === "Tematik" && "border-black"}
                  ${jenis === "Sub Tematik" && "border-black"}
                  ${jenis === "Sub Sub Tematik" && "border-black"}
                  ${jenis === "Super Sub Tematik" && "border-black"}
                  ${jenis === "Strategic Pemda" && "border-black"}
                  ${jenis === "Tactical Pemda" && "border-black"}
                  ${jenis === "Operational Pemda" && "border-black"}
                  ${jenis === "Strategic" && "border-red-700"}
                  ${jenis === "Tactical" && "border-blue-500"}
                  ${jenis === "Operational" && "border-green-500"}
                `}
            >
                Tema
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                  ${jenis === "Tematik" && "border-black"}
                  ${jenis === "Sub Tematik" && "border-black"}
                  ${jenis === "Sub Sub Tematik" && "border-black"}
                  ${jenis === "Super Sub Tematik" && "border-black"}
                  ${jenis === "Strategic Pemda" && "border-black"}
                  ${jenis === "Tactical Pemda" && "border-black"}
                  ${jenis === "Operational Pemda" && "border-black"}
                  ${jenis === "Strategic" && "border-red-700"}
                  ${jenis === "Tactical" && "border-blue-500"}
                  ${jenis === "Operational" && "border-green-500"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}
                                `}
                            >
                                Indikator {index + 1}
                            </td>
                            <td 
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
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
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${jenis === "Operational" && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Target/Satuan {index + 1}
                                </td>
                                <td 
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${jenis === "Operational" && "border-green-500"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}
                                `}
                            >
                                Indikator
                            </td>
                            <td 
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}
                                `}
                            >
                                {data.nama_indikator ? data.nama_indikator : "-"}
                            </td>
                        </tr>
                        {data.targets.map((data: any, index: number) => (
                            <tr key={data.id_target}>
                                <td 
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${jenis === "Operational" && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Target/Satuan
                                </td>
                                <td 
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Tematik" && "border-black"}
                                        ${jenis === "Sub Tematik" && "border-black"}
                                        ${jenis === "Sub Sub Tematik" && "border-black"}
                                        ${jenis === "Super Sub Tematik" && "border-black"}
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${jenis === "Operational" && "border-green-500"}
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
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational" && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}
                            `}
                        >
                            Indikator
                        </td>
                        <td 
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                ${jenis === "Tematik" && "border-black"}
                                ${jenis === "Sub Tematik" && "border-black"}
                                ${jenis === "Sub Sub Tematik" && "border-black"}
                                ${jenis === "Super Sub Tematik" && "border-black"}
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${jenis === "Operational" && "border-green-500"}
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
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                Target/Satuan
                            </td>
                            <td 
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Tematik" && "border-black"}
                                    ${jenis === "Sub Tematik" && "border-black"}
                                    ${jenis === "Sub Sub Tematik" && "border-black"}
                                    ${jenis === "Super Sub Tematik" && "border-black"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${jenis === "Operational" && "border-green-500"}
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
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "Sub Tematik" && "border-black"}
                    ${jenis === "Sub Sub Tematik" && "border-black"}
                    ${jenis === "Super Sub Tematik" && "border-black"}
                    ${jenis === "Strategic Pemda" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical Pemda" && "border-black"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational Pemda" && "border-black"}
                    ${jenis === "Operational" && "border-green-500"}      
                `}
            >
                Perangkat Daerah
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "Sub Tematik" && "border-black"}
                    ${jenis === "Sub Sub Tematik" && "border-black"}
                    ${jenis === "Super Sub Tematik" && "border-black"}
                    ${jenis === "Strategic Pemda" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical Pemda" && "border-black"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational Pemda" && "border-black"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                {opd ? opd : "-"}
            </td>
        </tr>
        }
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
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                Keterangan
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
                    ${jenis === "Operational" && "border-green-500"}    
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
                        ${jenis === "Operational" && "border-green-500"}    
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
                        ${jenis === "Operational" && "border-green-500"}    
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

export const tambahPohonName = (jenis: string): string => {
  switch (jenis) {
    case 'Tematik':
      return 'Sub Tematik';
    case 'Sub Tematik':
      return 'Sub Sub Tematik';
    case 'Sub Sub Tematik':
      return 'Super Sub Tematik';
    case 'Super Sub Tematik':
      return 'Strategic';
    case 'Strategic Pemda':
      return 'Tactical';;
    case 'Tactical Pemda':
      return 'Opertional';
    case 'Strategic':
      return 'Tactical';;
    case 'Tactical':
      return 'Opertional';
    default:
      return '-'
  }
}
export const ambilPohonName = (jenis: string): string => {
  switch (jenis) {
    case 'Tematik':
      return 'Strategic';
    case 'Sub Tematik':
      return 'Strategic';
    case 'Sub Sub Tematik':
      return 'Strategic';
    case 'Super Sub Tematik':
      return 'Strategic';
    case 'Strategic':
      return 'Tactical';
    case 'Tactical':
      return 'Operational';
    case 'Strategic Pemda':
      return 'Tactical';
    case 'Tactical Pemda':
      return 'Opertional';
    default:
      return '-'
  }
}
