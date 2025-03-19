import { table } from "console";

interface renstra {
    nama: string;
    kode: string;
    jenis: string;
    childs : renstra[]
}

interface table {
    data: renstra[];
}

// export const TableRenstra: React.FC<table> = ({ data }) => {
//     return(
//         <>
//             {data.map((item: renstra) => {
//                 <>
//                     <h1>{item.nama}</h1>
//                     <h1>{item.kode}</h1>
//                     {item.childs &&
//                         <TableRenstra 
//                             data={item.childs}
//                         />
//                     }
//                 </>
//             })}
//         </>
//     )
// }

export const TableRenstra = () => {
    return(
        <>
            <table className="w-full">
                <thead>
                    <tr className="bg-emerald-500 text-white">
                        <td className="border-r border-b px-6 py-4 min-w-[50px] text-center">No</td>
                        <td className="border-r border-b px-6 py-4 min-w-[200px]">Kode</td>
                        <td className="border-r border-b px-6 py-4 min-w-[200px]">Nama</td>
                        <td className="border-r border-b px-6 py-4 min-w-[200px]">Jenis</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-l border-b px-6 py-4 text-center">1</td>
                        <td className="border-r border-b px-6 py-4">10247107</td>
                        <td className="border-r border-b px-6 py-4">Program pertama</td>
                        <td className="border-r border-b px-6 py-4">Program</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}