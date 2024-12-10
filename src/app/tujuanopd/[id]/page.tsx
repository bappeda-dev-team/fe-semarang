import { FiHome } from "react-icons/fi";
import { FormEditTujuanOpd } from "@/components/pages/tujuanopd/FormTujuanOpd";

const Edittematik = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Tujuan OPD</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditTujuanOpd />
        </>
    )
}

export default Edittematik;