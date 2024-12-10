import { FiHome } from "react-icons/fi";
import { FormTujuanOpd } from "@/components/pages/tujuanopd/FormTujuanOpd";

const tambahTujuanOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Tujuan OPD</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormTujuanOpd />
        </>
    )
}

export default tambahTujuanOpd;