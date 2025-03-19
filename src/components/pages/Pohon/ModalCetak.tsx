'use client'

import { useState, useEffect, useRef } from "react";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { TbPrinter, TbXboxX } from "react-icons/tb";
import { PohonOpd } from "@/components/lib/Pohon/Opd/PohonOpd";
import html2canvas from "html2canvas";
import { LoadingButtonClip } from "@/components/global/Loading";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    pohon: any;
}

export const ModalCetak: React.FC<modal> = ({ isOpen, onClose, onSuccess, pohon }) => {

    const modalRef = useRef<HTMLDivElement | null>(null);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);

    const handleDownloadPdf = async () => {
        if (!modalRef.current) return;

        const elementsToHide = document.querySelectorAll(".hide-on-capture") as NodeListOf<HTMLElement>;
        elementsToHide.forEach((el) => (el.style.display = "none"));

        try {
            setLoadingCetak(true);
            const element = modalRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                width: element.scrollWidth + 50, // Use full scrollable width
                height: element.scrollHeight + 250, // Use full scrollable height
                windowWidth: element.scrollWidth + 50, // Force full width rendering
                windowHeight: element.scrollHeight + 250, // Force full height rendering
                useCORS: true, // For cross-origin images
            });

            // Create a new canvas with extra padding
            const paddingTop = 50 // Extra padding for the top of the canvas
            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + paddingTop;

            const ctx = newCanvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white"; // Optional: Background color
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, 0, paddingTop);

                //hitung posisi horizontal untuk centering
                const horizontalOffset = (newCanvas.width - canvas.width) / 2;

                // Gambar canvas di tengah horizontal
                ctx.drawImage(canvas, horizontalOffset, paddingTop);
            }

            const imgData = newCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${pohon.nama_pohon}.jpg`;
            link.click();
        } catch (error) {
            alert("Error capturing the element");
            console.error("Error capturing the element:", error);
        } finally {
            // Ensure elements are restored even if an error occurs
            elementsToHide.forEach((el) => (el.style.display = ""));
            setLoadingCetak(false);
        }
    };

    const handleClose = () => {
        onClose();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-5 z-10 w-[98%] min-h-[98%] max-h-[98%] text-start overflow-auto`}>
                    <div className="flex flex-wrap justify-between items-center border-b pb-2">
                        <ButtonSky
                            className="flex flex-wrap items-center gap-2"
                            onClick={handleDownloadPdf}
                        >
                            {LoadingCetak ?
                                <>
                                    <LoadingButtonClip />
                                    <p>Downloading</p>
                                </>
                                :
                                <>
                                    <TbPrinter />
                                    <p>Download</p>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed onClick={handleClose}>
                            <TbXboxX className="text-2xl" />
                        </ButtonRed>
                    </div>
                    <div ref={modalRef} className="flex py-3 justify-center items-center">
                        <PohonOpd
                            tema={pohon}
                            deleteTrigger={handleClose}
                            set_show_all={() => null}
                        />
                    </div>
                </div>
            </div>
        )
    }
}