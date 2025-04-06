import React, { useEffect, useState } from 'react';
import { TbEye, TbPrinter } from 'react-icons/tb';
import { ButtonSky, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { ModalCetak } from '@/components/pages/Pohon/ModalCetak';

interface pohon {
    tema: any;
    show_all?: boolean;
    set_show_all: () => void;
}

export const PohonLaporan: React.FC<pohon> = ({ tema, show_all, set_show_all }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);

    const [IsCetak, setIsCetak] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (show_all) {
            setShow(true);
        }
        if (show_all && (Show === false)) {
            set_show_all();
        }
    }, [show_all, Show, set_show_all]);

    const handleShow = () => {
        setShow((prev) => !prev);
    }

    return (
        <li>
            <div
                className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                ${(tema.jenis_pohon === "Operational N") && 'shadow-green-500'}
                ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
            `}
            >
                {/* HEADER */}
                <div
                    className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                    ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                    ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === "Strategic Crosscutting") && 'border-red-500 text-red-700'}
                    ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === "Tactical Crosscutting") && 'border-blue-500 text-blue-500'}
                    ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                `}
                >
                    {tema.jenis_pohon === 'Operational N' ?
                        <h1>Operational {tema.level_pohon - 6}  </h1>
                        :
                        <h1>{tema.jenis_pohon} </h1>
                    }
                </div>
                {/* BODY */}
                <div className="flex flex-col justify-center my-3">
                    <TablePohon item={tema} />
                    <div className="mt-3">
                        <Pagu jenis={tema.jenis_pohon}/>
                    </div>
                    <div className="mt-5">
                        <ProgramKegiatan jenis={tema.jenis_pohon}/>
                    </div>
                </div>
                {/* BUTTON ACTION TAMPILKAN DAN PELAKSANA*/}
                <div
                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                        ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                        ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                    `}
                >
                    <ButtonSky className='flex items-center gap-1' onClick={() => setIsCetak(true)}>
                        <TbPrinter />
                        Cetak
                    </ButtonSky>
                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg hide-on-capture`}
                        onClick={handleShow}
                    >
                        <TbEye className='mr-1' />
                        {Show ? 'Sembunyikan' : 'Tampilkan'}
                    </ButtonBlackBorder>
                </div>
            </div>
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <PohonLaporan
                        tema={dahan}
                        key={index}
                        show_all={show_all}
                        set_show_all={() => set_show_all()}
                    />
                ))}
            </ul>
            <ModalCetak
                jenis='cascading'
                onClose={() => setIsCetak(false)}
                isOpen={IsCetak}
                pohon={tema}
            />
        </li>
    )
}

export const TablePohon = (props: any) => {

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
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
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
                </tbody>
            </table>
            {pelaksana ?
                pelaksana.map((item: any, index: number) => (
                    <React.Fragment key={index}>
                        <table className='mt-2'>
                            <tbody>
                                <React.Fragment key={item.id_pelaksana}>
                                    <tr>
                                        <td
                                            className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-tl-lg
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                        >
                                            {pelaksana.length > 1 ? 
                                                <span>Pelaksana {index + 1}</span>
                                                :
                                                <span>Pelaksana</span>
                                            }
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
                                            {item.nama_pegawai}
                                        </td>
                                    </tr>
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
                                            Rencana Kinerja
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
                                            Contoh Rencana Kinerja
                                        </td>
                                    </tr>
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
                                            Target
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
                                            20
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
                                            Satuan
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
                                            %
                                        </td>
                                    </tr>
                                </React.Fragment>
                            </tbody>
                        </table>
                    </React.Fragment>
                ))
                :
                <table className='mt-2'>
                    <tbody>
                        <React.Fragment>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                    `}
                                >
                                    Pelaksana
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
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
                        </React.Fragment>
                    </tbody>
                </table>
            }
        </div>
    )
}
export const Pagu:React.FC<{jenis: string}> = ({ jenis }) => {
    return (
        <div className="flex flex-col w-full">
            <table>
                <tbody>
                    <tr>
                        <td className={`flex items-center justify-center gap-2 px-2 py-3 rounded-lg bg-white
                                ${(jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda') && 'border border-black'}
                                ${jenis === 'Operational N' && 'border border-green-500'}
                            `}>
                            <p>Pagu : </p>
                            <div className={`py-1 px-3 rounded-lg
                                ${(jenis === 'Strategic Pemda' || jenis === 'Strategic') && 'text-white bg-red-600'}    
                                ${(jenis === 'Tactical Pemda' || jenis === 'Tactical') && 'text-white bg-blue-500'}
                                ${(jenis === 'Operational Pemda' || jenis === 'Operational') && 'text-white bg-green-500'}
                                ${jenis === 'Operational N' && 'text-black border border-green-500'}
                            `}>
                                Rp. 2934823948
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export const ProgramKegiatan:React.FC<{jenis: string}> = ({ jenis }) => {
    return (
        <div className="flex flex-col w-full">
            <table>
                <thead>
                    <tr>
                        <td className={`flex items-center justify-center rounded-t-lg py-2
                            ${(jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda') && 'border border-black'}    
                            ${jenis === 'Strategic' && 'border-b border-red-700 bg-white'}    
                            ${jenis === 'Tactical' && 'border-b border-blue-500 bg-white'}    
                            ${jenis === 'Operational' && 'border-b border-green-500 bg-white'}  
                            ${jenis === 'Operational N' && 'border border-green-500 bg-white'}  
                        `}>
                            {(jenis === 'Strategic' || jenis === 'Tactical' || jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda') && 'Program'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational N') && 'Kegiatan'}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={`flex flex-col gap-4 min-w-[300px] px-4 py-3 bg-white
                            ${(jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda') && 'border-x border-b border-black rounded-b-lg'}    
                            ${(jenis === 'Strategic' || jenis === 'Tactical' || jenis === 'Operational') && 'rounded-b-lg'}      
                            ${jenis === 'Operational N' && 'border-x border-b border-green-500 rounded-b-lg'}    
                        `}>
                            <p>PROGRAM KOORDINASI DAN SINKRONISASI PERENCANAAN PEMBANGUNAN DAERAH (5.01.03)</p>
                            <ButtonGreenBorder className='flex items-center gap-1'>
                                <TbEye />
                                Tampilkan indikator
                            </ButtonGreenBorder>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}