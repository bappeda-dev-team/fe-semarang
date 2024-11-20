import { useState } from 'react';
import { TbArrowGuide, TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import {FormPohon, FormAmbilPohon, FormEditPohon, FormPohonStrategic} from './FormPohon';

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
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    
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
    // Add new item and remove form entry
    const addNewItem = (newItem: any, formId: number) => {
        setChildPohons([...childPohons, newItem]);
        setFormList(formList.filter((id) => id !== formId)); // Remove form entry
    };
    const putNewItem = (newItem: any, formId: number) => {
        setPutPohons([...PutPohons, newItem]);
        setFormList(formList.filter((id) => id !== formId)); // Remove form entry
    };

    const handleFetchDelete = () => {
        setDeleted((prev) => !prev);
    };

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
            deleteTrigger();
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
                    onSave={addNewItem}
                    pokin={'pemda'}
                    onCancel={() => setEdit(false)}
                />
            :
            <>
                <div 
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Tematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "SubTematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "SubSubTematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "SuperSubTematik" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "StrategicKota" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                        `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "SubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "SubSubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "SuperSubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "StrategicKota" && 'border-black text-red-700'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${tema.jenis_pohon === "Operational" && 'border-green-500 text-green-500'}
                            `}
                            >
                        <h1>{tema.jenis_pohon === 'StrategicKota' ? 'StrategicPemda' : tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        <TablePohon item={tema} />
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    <div 
                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "SubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "SubSubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "SuperSubTematik" && 'border-black'}
                            ${tema.jenis_pohon === "StrategicKota" && 'border-black'}
                        `}
                    >
                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                            <TbPencil className="mr-1"/>
                            Edit
                        </ButtonSkyBorder>
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
                    <div className="flex justify-evenly my-3 py-3">
                        {/* TOMBOL ADD KHUSUS STRATEGIC KOTA  */}
                        {(tema.level_pohon === 0 || tema.level_pohon === 1 || tema.level_pohon === 2 || tema.level_pohon === 3) &&
                            <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                                onClick={newStrategic}
                            >
                                <TbCirclePlus className='mr-1' />
                                Strategic
                            </ButtonGreenBorder>
                        }
                        {/* TOMBOL ADD POHON SESUAI URUTAN AKARNYA */}
                        {tema.level_pohon !== 3 &&
                            <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
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
                    </div>
                </div>
            </>
            }
            <ul>
                {childPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={handleFetchDelete}/>
                ))}
                {strategicPohons.map((dahan: any, index: any) => (
                    <Pohon tema={dahan} key={index} deleteTrigger={handleFetchDelete}/>
                ))}
                {formList.map((formId) => (
                    <FormPohon
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onSave={addNewItem}
                        pokin={'pemda'}
                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                    />
                ))}
                {FormStrategic.map((formId) => (
                    <FormPohonStrategic
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onSave={addNewItem}
                        onCancel={() => setFormStrategic(FormStrategic.filter((id) => id !== formId))}
                    />
                ))}
                {PutList.map((formId) => (
                    <FormAmbilPohon
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onSave={putNewItem}
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
  const indikator = props.item.indikator;
  const target = props.item.target;
  const satuan = props.item.satuan;
  return (
    <table className='w-full'>
      <tbody>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
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
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                `}
            >
                {tema ? tema : "-"}
            </td>
        </tr>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                `}
            >
                Indikator
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                `}
            >
                {indikator ? indikator : "-"}
            </td>
        </tr>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                Target/Satuan
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                {target ? target : "-"} {satuan ? satuan : "-"}
            </td>
        </tr>
        {opd && 
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                Perangkat Daerah
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
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
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                Keterangan
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                    ${jenis === "Tematik" && "border-black"}
                    ${jenis === "SubTematik" && "border-black"}
                    ${jenis === "SubSubTematik" && "border-black"}
                    ${jenis === "SuperSubTematik" && "border-black"}
                    ${jenis === "StrategicKota" && "border-black"}
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}    
                `}
            >
                {keterangan ? keterangan : "-"}
            </td>
        </tr>
      </tbody>
    </table>
  )
}

export const tambahPohonName = (jenis: string): string => {
  switch (jenis) {
    case 'Tematik':
      return 'Sub-Tematik';
    case 'SubTematik':
      return 'SubSub-Tematik';
    case 'SubSubTematik':
      return 'SuperSub-Tematik';
    case 'SuperSubTematik':
      return 'Strategic';
    case 'Strategic':
      return 'Tactical';
    case 'StrategicKota':
      return 'Tactical';
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
    case 'SubTematik':
      return 'Strategic';
    case 'SubSubTematik':
      return 'Strategic';
    case 'SuperSubTematik':
      return 'Strategic';
    case 'Strategic':
      return 'Tactical';
    case 'StrategicKota':
      return 'Tactical';
    case 'Tactical':
      return 'Opertional';
    default:
      return '-'
  }
}
