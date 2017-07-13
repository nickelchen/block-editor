'use strict';

import when from 'when';

import {EXIF} from 'exif-js';

const rotateCanvasByOrientation = (canvas, width, height, orientation) => {
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // 判断拍照设备持有方向调整照片角度
    if (orientation > 4) {
        canvas.width = height;
        canvas.height = width;
    }
    switch (orientation) {
    case 2:
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
    case 3:
        // 180° rotate left
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
    case 4:
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
    case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
    case 6:
        // 90° rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -height);
        break;
    case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
    case 8:
        // 90° rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-width, 0);
        break;
    }

    return ctx;
};


const getImageData = (file, target_data_ratio) => {
    return when.promise((resolve, reject, notify) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onloadend = () => {
            const img = new Image();
            img.src = fr.result;
            img.onload = () => {
                EXIF.getData(img, () => {
                    const height = img.height,
                        width = img.width;

                    const canvas = document.createElement('canvas');
                    const orientation = img.exifdata ? img.exifdata.Orientation : 1;
                    const ctx = rotateCanvasByOrientation(canvas, width, height, orientation);
                    ctx.drawImage(img, 0, 0);

                    try {
                        const data = canvas.toDataURL('image/jpeg', target_data_ratio);
                        resolve(data);
                    } catch(e) {
                        reject(e);
                    }
                });
            };
        };
    });
};

const resizeImage = (file, target_width, target_width_ratio, target_data_ratio) => {
    return when.promise((resolve, reject, notify) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onloadend = () => {
            const img = new Image();
            img.src = fr.result;
            img.onload = () => {
                EXIF.getData(img, () => {
                    const height = img.height,
                        width = img.width;

                    const canvas = document.createElement('canvas');
                    const orientation = img.exifdata ? img.exifdata.Orientation : 1;
                    const ctx = rotateCanvasByOrientation(canvas, width, height, orientation);
                    ctx.drawImage(img, 0, 0);

                    const canvas2 = document.createElement('canvas');
                    const ctx2 = canvas2.getContext('2d');

                    // 缩放到 target_width 宽度
                    const factor = target_width / canvas.width;
                    canvas2.width = canvas.width * factor;
                    canvas2.height = canvas.height * factor;

                    // 控制不要过高
                    canvas2.height = Math.min(canvas2.height, canvas2.width * target_width_ratio);

                    ctx2.scale(factor, factor);
                    ctx2.drawImage(canvas, 0, 0);

                    // 控制不要过大，适当压缩
                    const data = canvas2.toDataURL('image/jpeg', target_data_ratio);
                    resolve(data);

                });
            };
        };
    });
};


export default {
    getImageData,
    resizeImage
};


