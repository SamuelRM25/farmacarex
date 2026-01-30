import html2canvas from 'html2canvas';

export const exportElementAsImage = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            backgroundColor: null, // Allow transparent background to avoid color parsing issues if possible, or default
            useCORS: true, // Enable CORS to avoid tainted canvas
            logging: false,
            ignoreElements: (node) => node.classList.contains('no-export') // Helper class to hide buttons in export
        });

        const image = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${fileName}.jpg`;
        link.click();
    } catch (error) {
        console.error('Error exporting image:', error);
        alert('Hubo un error al generar la imagen. Por favor intenta de nuevo.');
    }
};
