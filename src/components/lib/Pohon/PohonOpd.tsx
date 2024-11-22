import { useEffect, useState } from 'react';
import { TbCirclePlus, TbPencil, TbTrash } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import {FormPohonOpd, FormEditPohon} from './FormPohonOpd';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
}

export const PohonOpd: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    
    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    // Add new item and remove form entry
    const addNewItem = (newItem: any, formId: number) => {
        setChildPohons([...childPohons, newItem]);
        setFormList(formList.filter((id) => id !== formId)); // Remove form entry
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
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                />
            :
            <>
                <div 
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "StrategicPemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "TacticalPemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                        `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "StrategicPemda" && 'border-red-700 text-red-700'}
                            ${tema.jenis_pohon === "TacticalPemda" && 'border-blue-500 text-blue-500'}
                            ${tema.jenis_pohon === "OperationalPemda" && 'border-green-500 text-green-500'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${tema.jenis_pohon === "Operational" && 'border-green-500 text-green-500'}
                            `}
                            >
                        <h1>{tema.jenis_pohon === 'StrategicPemda' ? 'StrategicPemda' : tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        <TablePohon item={tema} />
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    <div 
                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "StrategicPemda" && 'border-black'}
                            ${tema.jenis_pohon === "TacticalPemda" && 'border-black'}
                            ${tema.jenis_pohon === "OperationalPemda" && 'border-black'}
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
                                            hapusPohonOpd(tema.id);
                                    }
                                });
                            }}
                            >
                                <TbTrash className='mr-1'/>
                                Hapus
                            </ButtonRedBorder>
                        }
                    </div>
                    {/* footer */}
                    <div className="flex justify-evenly my-3 py-3">
                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                            onClick={newChild}
                            >
                            <TbCirclePlus className='mr-1' />
                            {newChildButtonName(tema.jenis_pohon)}
                        </ButtonGreenBorder>
                        {/* <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                            onClick={newChild}
                            >
                            <TbCirclePlus className='mr-1' />
                            Pelaksana
                        </ButtonGreenBorder> */}
                    </div>
                </div>
            </>
            }
            <ul>
                {childPohons.map((dahan: any, index: any) => (
                    <PohonOpd tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {formList.map((formId) => (
                    <FormPohonOpd
                        level={tema.level_pohon}
                        id={tema.id}
                        key={formId}
                        formId={formId}
                        onSave={addNewItem}
                        pokin={'opd'}
                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                    />
                ))}
            </ul>
        </li>
    )
}
export const PohonOpdEdited: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    
    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
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
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                />
            :
            <>
                <div 
                    className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                    `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${tema.jenis_pohon === "Operational" && 'border-green-500 text-green-500'}
                        `}
                    >
                        <h1>{tema.jenis_pohon === 'StrategicKota' ? 'StrategicPemda' : tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        <table className='w-full'>
                            <tbody>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Tema
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.nama_pohon ? tema.nama_pohon : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Indikator
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.indikator ? tema.indikator : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Target/Satuan
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.target ? tema.target : "-"} {tema.satuan ? tema.satuan : ""}
                                    </td>
                                </tr>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Perangkat Daerah
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.nama_opd ? tema.nama_opd : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Pelaksana
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.pelaksana ? tema.pelaksana.map((data: any) => (
                                            <p key={data.nama_pegawai}>{data.nama_pegawai}</p>
                                        )) : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td 
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-bl-lg
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}    
                                        `}
                                    >
                                        Keterangan
                                    </td>
                                    <td 
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                                            ${tema.jenis_pohon === "Strategic" && "border-red-700"}
                                            ${tema.jenis_pohon === "StrategicPemda" && "border-red-300"}
                                            ${tema.jenis_pohon === "Tactical" && "border-blue-500"}
                                            ${tema.jenis_pohon === "Operational" && "border-green-500"}
                                        `}
                                    >
                                        {tema.keterangan ? tema.keterangan : "-"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    <div 
                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white border-black`}
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
                                            hapusPohonOpd(tema.id);
                                    }
                                });
                            }}
                            >
                                <TbTrash className='mr-1'/>
                                Hapus
                            </ButtonRedBorder>
                        }
                    </div>
                    {/* footer */}
                    <div className="flex justify-evenly my-3 py-3">
                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                            onClick={newChild}
                            >
                            <TbCirclePlus className='mr-1' />
                            {newChildButtonName(tema.jenis_pohon)}
                        </ButtonGreenBorder>
                        {/* <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                            onClick={newChild}
                            >
                            <TbCirclePlus className='mr-1' />
                            Pelaksana
                        </ButtonGreenBorder> */}
                    </div>
                </div>
            </>
            }
            <ul>
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
        </li>
    )
}

export const TablePohon = (props: any) => {
  const tema = props.item.strategi;
  const keterangan = props.item.keterangan;
  const opd = props.item.perangkat_daerah?.nama_opd;
  const jenis = props.item.jenis_pohon;
  const indikator = props.item.indikator;
  const pelaksana = props.item.pelaksana;
  const target = props.item.target;
  const satuan = props.item.satuan;
  return (
    <table className='w-full'>
      <tbody>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}
                `}
            >
                Tema
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}
                `}
            >
                {tema ? tema : "-"}
            </td>
        </tr>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}
                `}
            >
                Indikator
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}
                `}
            >
                {indikator ? indikator : "-"}
            </td>
        </tr>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                Target/Satuan
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                {target ? target : "-"} {satuan ? satuan : "-"}
            </td>
        </tr>
        {opd && 
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                Perangkat Daerah
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                {opd ? opd : "-"}
            </td>
        </tr>
        }
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                Pelaksana
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                {pelaksana ? pelaksana.map((data: any) => (
                    <p key={data.nama_pegawai}>{data.nama_pegawai}</p>
                )) : "-"}
            </td>
        </tr>
        <tr>
            <td 
                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
                `}
            >
                Keterangan
            </td>
            <td 
                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                    ${jenis === "Strategic" && "border-red-700"}
                    ${jenis === "Tactical" && "border-blue-500"}
                    ${jenis === "Operational" && "border-green-500"}
                    ${jenis === "StrategicPemda" && "border-black"}
                    ${jenis === "TacticalPemda" && "border-black"}
                    ${jenis === "OperationalPemda" && "border-black"}    
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
    case 'StrategicPemda':
      return 'Tactical';
    case 'Strategic':
      return 'Tactical';
    case 'Tactical':
      return 'Opertional';
    default:
      return '-'
  }
}
