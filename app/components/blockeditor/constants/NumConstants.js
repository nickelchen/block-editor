'use strict';

export default {

    ELEM_TYPE: {
        photo: 'photo',
        text: 'text',
        link: 'link',
        place: 'place'
    },

    CANVAS: {
        data_ratio: 0.8,                                 // canvas输出 jpeg 的压缩比例
        width: 1200,                                     // 最大宽度
        width_ratio: 2.5                                 // 高度除以宽度后最大比率
    },

    GAODE_MAP: {
        zoom_init: 13,                                   // 地图初始化缩放
        zoom_poi: 18,                                    // 打开poi之后的缩放
        provider: 100                                    // 100=高德地图
    },

    MAX_LIMIT: {
        image_size: 5 * 1024 * 1024,                     // 每张图片最多5M
        elem_photo: 15,                                  // 每篇画报最多15个图片
        elem_place: 15,                                  // 每篇画报最多15个地理位置
        elem_link: 15,                                   // 每篇画报最多15个链接
        text_count: 4 * 1024,                            // 每篇画报最多4096个字数
        notify_max_text_count_delay: 3000                // 每隔三秒提示一下字数超出了
    }

};

