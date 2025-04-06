'use client'

// import Maintenance from "@/components/global/Maintenance";
import Cascading from "@/components/pages/Pohon/Cascading/Cascading";
import { useEffect, useState } from "react";
import { getOpdTahun } from "@/components/lib/Cookie";


const LaporanCascadingOpd = () => {
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    
    useEffect(() => {
        const data = getOpdTahun();
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    return(
        <>
            <Cascading 
                jenis="laporan"
            />
        </>
    )
}

export default LaporanCascadingOpd;