export declare interface DecodeResult {
    /**
     * 以二进制形式存储的图片数据
     */
    data: Blob;
    width: number;
    height: number;
    /**
     * 是否是主图
     */
    isPrimary: boolean;
}

/**
 * @description heif reader
 */
export declare class HEIFReader {
    #private;
    /** 不同打包工具处理worker的方式不同,以便兼容 */
    static workPort?: Worker;
    constructor();
    init(): Promise<void>;
    /**
     * @description heif解码以流式方式解码
     * @param imgFile Uint8Array | Blob | File
     */
    heifDecode(imgFile: Uint8Array | Blob | File): Promise<DecodeResult[]>;
    /**
     * 释放解码器
     */
    free(): void;
}

export { }
