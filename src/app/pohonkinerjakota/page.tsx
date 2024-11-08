import TematikKab from "@/components/pages/Pohon/TematikKab/TematikKab";
import { FiHome } from "react-icons/fi";

const pohonkinerjakota = () => {
    return(
        <>
            <div className="flex flex-wrap items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabupaten</p>
                <p className="mr-1">/ Pohon Kinerja Kabupaten</p>
            </div>
            <TematikKab />
        </>
    )
}

export default pohonkinerjakota;