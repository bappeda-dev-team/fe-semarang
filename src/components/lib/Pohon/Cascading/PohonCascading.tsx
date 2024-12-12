import { useEffect, useState } from 'react';
import { TbCirclePlus, TbPencil, TbTrash, TbTrashX, TbUsersPlus, TbEye } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import { FormCascading, FormEditCascading } from './FormCascading';
import { getToken, getUser } from '../../Cookie';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
}

export const PohonCascading: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
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
    const handleEditSuccess = (data: any) => {
      setEdited(data);
      setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }
    const hapusPelaksana = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete_pelaksana/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pelaksana Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {edit ? 
                <FormEditCascading
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
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'shadow-green-500 bg-green-500'}
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
                        <h1>{tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        {Edited ? 
                            <TablePohonEdited item={Edited} hapusPelaksana={hapusPelaksana}/>
                        :
                            <TablePohon item={tema} hapusPelaksana={hapusPelaksana} />
                        }
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' )&& 
                        <div 
                            className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                            `}
                        >
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            <ButtonGreenBorder onClick={() => setEdit(true)}>
                                <TbUsersPlus className="mr-1"/>
                                Pelaksana
                            </ButtonGreenBorder>
                        </div>
                    }
                    {((User?.roles != 'super_admin' && User?.roles != 'admin_opd') && (tema.jenis_pohon == 'Operational' || tema.jenis_pohon == 'Operational N')) && 
                        <div 
                            className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                            `}
                        >
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            <ButtonSkyBorder onClick={() => setEdit(true)}>
                                <TbPencil className="mr-1"/>
                                Pelaksana
                            </ButtonSkyBorder>
                        </div>
                    }
                </div>
            </>
            }
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <PohonCascading tema={dahan} key={index} deleteTrigger={deleteTrigger}/>
                ))}
                {formList.map((formId) => (
                    <FormCascading
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
export const PohonCascadingEdited: React.FC<pohon> = ({ tema, deleteTrigger }) => {

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

    const hapusPelaksana = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete_pelaksana/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pelaksana Berhasil Dihapus", "success", 1000);
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
                <FormEditCascading
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
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'shadow-green-500 bg-green-500'}
                    `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                        `}
                    >
                        <h1>{tema.jenis_pohon}</h1>
                    </div>
                    {/* BODY */}
                    <div className="flex justify-center my-3">
                        {Edited ? 
                            <TablePohonEdited item={Edited} hapusPelaksana={hapusPelaksana}/>
                        :
                            <TablePohon item={tema} hapusPelaksana={hapusPelaksana}/>
                        }
                    </div>
                    {/* BUTTON ACTION INSIDE BOX */}
                    {!['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                        <div 
                            className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white border-black`}
                        >
                            <ButtonSkyBorder onClick={() => setEdit(true)}>
                                <TbPencil className="mr-1"/>
                                Edit
                            </ButtonSkyBorder>
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
                <ul style={{ display: Show ? '' : 'none' }}>
                    {formList.map((formId) => (
                        <FormCascading
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
  const { item, hapusPelaksana } = props;
  const tema = props.item.nama_pohon;
  const jenis = props.item.jenis_pohon;
  const pelaksana = props.item.pelaksana;
  return (
    <div className="flex flex-col w-full">
        <table className='mb-2'>
            <tbody>
                <tr>
                    <td 
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-l-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
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
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {tema ? tema : "-"}
                    </td>
                </tr>
            </tbody>
        </table>
        <table className='mt-2'>
            <tbody >
                {pelaksana ?
                    pelaksana.length > 1 ?
                        pelaksana.map((item: any, index: number) => (
                            <tr key={item.id_pelaksana}>
                                <td 
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Pelaksana {index + 1}
                                </td>
                                <td 
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    {item.nama_pegawai}
                                </td>
                                <td
                                    onClick={() => hapusPelaksana(item.id_pelaksana)}
                                    className={`min-w-[50px] p-4 border bg-white text-center text-red-500 rounded-r-lg cursor-pointer hover:bg-red-500 hover:text-white
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    <TbTrashX />
                                </td>
                            </tr>
                        ))
                    :
                        pelaksana.map((data: any) => (
                            <tr key={data.id_pelaksana}>
                                <td 
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Pelaksana
                                </td>
                                <td 
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    {data.nama_pegawai}
                                </td>
                                <td
                                    onClick={() => hapusPelaksana(data.id_pelaksana)}
                                    className={`min-w-[50px] p-4 border bg-white text-center text-red-500 rounded-r-lg cursor-pointer hover:bg-red-500 hover:text-white
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    <TbTrashX />
                                </td>
                            </tr>
                        ))
                :
                    <tr>
                        <td 
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            Pelaksana
                        </td>
                        <td 
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            -
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    </div>
  )
}
export const TablePohonEdited = (props: any) => {
  const { item, hapusPelaksana } = props;
  const tema = props.item.nama_pohon;
  const jenis = props.item.jenis_pohon;
  const pelaksana = props.item.pelaksana;
  return (
    <div className="flex flex-col w-full">
        <table className='mb-2'>
            <tbody>
                <tr>
                    <td 
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-l-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
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
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                    >
                        {tema ? tema : "-"}
                    </td>
                </tr>
            </tbody>
        </table>
        <table className='mt-2'>
            <tbody >
                {pelaksana ?
                    pelaksana.length > 1 ?
                        pelaksana.map((item: any, index: number) => (
                            <tr key={item.id_pelaksana}>
                                <td 
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    Pelaksana {index + 1}
                                </td>
                                <td 
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    {item.nama_pegawai}
                                </td>
                                <td
                                    onClick={() => hapusPelaksana(item.id_pelaksana)}
                                    className={`min-w-[50px] p-4 border bg-white text-center text-red-500 rounded-r-lg cursor-pointer hover:bg-red-500 hover:text-white
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                >
                                    <TbTrashX />
                                </td>
                            </tr>
                        ))
                    :
                    pelaksana.map((data: any) => (
                        <tr key={data.id_pelaksana}>
                            <td 
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                Pelaksana
                            </td>
                            <td 
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                {data.nama_pegawai}
                            </td>
                            <td
                                onClick={() => hapusPelaksana(data.id_pelaksana)}
                                className={`min-w-[50px] p-4 border bg-white text-center text-red-500 rounded-r-lg cursor-pointer hover:bg-red-500 hover:text-white
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                            >
                                <TbTrashX />
                            </td>
                        </tr>
                    ))
                :
                    <tr>
                        <td 
                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            Pelaksana
                        </td>
                        <td 
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                        >
                            -
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    </div>
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
    default:
      return '-'
  }
}