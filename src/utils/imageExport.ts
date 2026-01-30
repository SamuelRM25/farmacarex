import { toJpeg } from 'html-to-image';

export const exportElementAsImage = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const dataUrl = await toJpeg(element, {
            quality: 0.95,
            backgroundColor: '#ffffff',
            filter: (node) => {
                // Skip elements with no-export class
                return !node.classList?.contains('no-export');
            }
        });

        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error exporting image:', error);
        alert('Hubo un error al generar la imagen. Por favor intenta de nuevo.');
    }
};
