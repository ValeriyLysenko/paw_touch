import {
    useContext, MouseEvent,
} from 'react';
import { runInAction } from 'mobx';
import AppContext from 'aux/AppContext';
import LayoutContext from 'aux/LayoutContext';
import NavigationContext from 'aux/NavigationContext';
import { sendBlobToServer, uniOnOpenHandler } from 'libs/lib';
import { zoomOnReset, setCanvasBg } from 'libs/canvasLib';

const useMainMenuCanvas = (): HandlerFunc[] => {
    const { canvasRef } = useContext(LayoutContext);
    const { mainCanvas, canvasStoreDefaults } = useContext(AppContext);
    const {
        saveToGalleryModalRef,
        saveToGalleryPropmptModalRef,
    } = useContext(NavigationContext);

    const clickNewCanvasHandler = (e: MouseEvent) => {
        e.stopPropagation();
        uniOnOpenHandler(saveToGalleryPropmptModalRef);
    };

    const clickClearCanvasHandler = (e: MouseEvent) => {
        e.stopPropagation();
        const { current: canvas } = canvasRef;
        if (!canvas) return;
        const { width, height } = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, width, height);
        // Set default background color
        setCanvasBg(ctx);
        ctx.restore();
    };

    const clickDownloadCanvasHandler = (e: MouseEvent) => {
        e.stopPropagation();
        const { current: canvas } = canvasRef;
        if (!canvas) return;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png', 1);
        link.download = 'Your masterpiece.png';
        link.click();
    };

    const clickSaveToGalleryCanvasHandler = (e: MouseEvent) => {
        e.stopPropagation();
        uniOnOpenHandler(saveToGalleryModalRef);
    };

    const resetCanvasToDefaults = async () => {
        const { historyDefaults } = canvasStoreDefaults;
        const history = mainCanvas.getHistory;
        const historySpec = mainCanvas.getHistorySpec;
        const { current: canvas } = canvasRef;
        if (!canvas) return;
        const { width, height } = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        /* const response = await sendBlobToServer(canvas, {
            imageType: 'image/png',
            imageQuality: 1,
        });

        console.log('RESPONSE', response); */

        /* canvas.toBlob((blob) => {
            // const img = document.createElement('img');
            // const url = URL.createObjectURL(blob);

            // img.onload = () => {
            //     // No longer need to read the blob so it's revoked
            //     URL.revokeObjectURL(url);
            // };

            // img.src = url;
            // console.log(url);
            // document.body.appendChild(img);

        }, 'image/png', 1.0); */

        runInAction(() => {
            mainCanvas.resetScale();
            zoomOnReset(ctx, {
                data: history,
                spec: historySpec,
            });

            ctx.save();
            ctx.clearRect(0, 0, width, height);
            // Set default background color
            setCanvasBg(ctx);
            ctx.restore();
            mainCanvas.setHistory(historyDefaults);
            mainCanvas.setHistorySpecPos(0);
        });

        console.log('--> resetCanvasToDefaults');
    };

    return [
        clickNewCanvasHandler,
        clickClearCanvasHandler,
        clickDownloadCanvasHandler,
        clickSaveToGalleryCanvasHandler,
        resetCanvasToDefaults,
    ];
};

export default useMainMenuCanvas;
