namespace dou2d {
    /**
     * WebGL 工具类
     * @author wizardc
     */
    export namespace WebGLUtil {
        export function createTexture(renderContext: RenderContext, source: TexImageSource): WebGLTexture;
        export function createTexture(renderContext: RenderContext, width: number, height: number, data: any): WebGLTexture;
        export function createTexture(renderContext: RenderContext, sourceOrWidth: TexImageSource | number, height?: number, data?: any): WebGLTexture {
            let gl = renderContext.context;
            let texture = gl.createTexture() as WebGLTexture;
            if (!texture) {
                // 需要先创建 texture 失败, 然后 lost 事件才发出来
                renderContext.contextLost = true;
                return;
            }
            texture[glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            if (typeof sourceOrWidth == "number") {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sourceOrWidth, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            else {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceOrWidth);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }

        export function deleteTexture(texture: WebGLTexture): void {
            // 引擎默认的空白纹理不允许删除
            if (texture[engine_default_empty_texture]) {
                if (DEBUG) {
                    console.warn("Can not delete WebGLTexture: " + engine_default_empty_texture);
                }
                return;
            }
            let gl = texture[glContext] as WebGLRenderingContext;
            if (gl) {
                gl.deleteTexture(texture);
            }
            else {
                if (DEBUG) {
                    console.warn("delete WebGLTexture gl is empty!");
                }
            }
        }

        export function premultiplyTint(tint: number, alpha: number): number {
            if (alpha === 1) {
                return (alpha * 255 << 24) + tint;
            }
            if (alpha === 0) {
                return 0;
            }
            let R = ((tint >> 16) & 0xFF);
            let G = ((tint >> 8) & 0xFF);
            let B = (tint & 0xFF);
            R = ((R * alpha) + 0.5) | 0;
            G = ((G * alpha) + 0.5) | 0;
            B = ((B * alpha) + 0.5) | 0;
            return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
        }
    }
}
