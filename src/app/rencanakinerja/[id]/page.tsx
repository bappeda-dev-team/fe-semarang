'use client'

import { FiHome } from 'react-icons/fi';
import Musrebang from '@/components/pages/rencanakinerja/Rincian/Usulan';
import SubKegiatan from '@/components/pages/rencanakinerja/Rincian/SubKegiatan';
import Sakip from '@/components/pages/rencanakinerja/Rincian/Sakip';
import Renaksi from '@/components/pages/rencanakinerja/Rincian/Renaksi';
import DasarHukum from '@/components/pages/rencanakinerja/Rincian/DasarHukum';
import GambaranUmum from '@/components/pages/rencanakinerja/Rincian/GambaranUmum';
import Inovasi from '@/components/pages/rencanakinerja/Rincian/Inovasi';
import Permasalahan from '@/components/pages/rencanakinerja/Rincian/Permasalahan';
import { useParams } from 'next/navigation';

const RincianRencanaKinerja = () => {

    const params = useParams();
    const id_rekin = params.id as string;

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Rencana Kinerja</p>
                <p>/ Nama sub kegiatan</p>
            </div>
            <div className="my-5">
                {/* status sasaran */}
                {/* <div className="mt-3 rounded-xl shadow-lg border px-5 py-3">
                    <h1>Status Sasaran</h1>
                    <div className="my-3 border"></div>
                    <button className="w-full uppercase bg-emerald-500 rounded-lg py-1 font-bold my-1">siap ditarik skp</button>
                    <button className="w-full uppercase bg-emerald-500 rounded-lg py-1 font-bold my-1">manrisk siap diverifikasi</button>
                    <div className="my-3 border"></div>
                </div> */}
                <Musrebang id={id_rekin}/>
                <SubKegiatan id={id_rekin}/>
                <Sakip id={id_rekin}/>
                <Renaksi/>
                <DasarHukum id={id_rekin}/>
                <GambaranUmum id={id_rekin}/>
                <Permasalahan id={id_rekin}/>
                {/* <Inovasi id={id_rekin}/> */}
            </div>
        </>
    )
}

export default RincianRencanaKinerja;