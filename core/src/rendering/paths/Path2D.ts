namespace dou2d {
    /**
     * 2D路径
     * @author wizardc
     */
    export abstract class Path2D {
        /**
         * 当前移动到的坐标 x
         * 注意: 目前只有 drawArc 之前会被赋值
         */
        public lastX: number = 0;

        /**
         * 当前移动到的坐标 y
         * 注意: 目前只有 drawArc 之前会被赋值
         */
        public lastY: number = 0;

        public commands: number[] = [];
        public data: (number | number[])[] = [];

        protected _type: number;

        protected _commandPosition: number = 0;
        protected _dataPosition: number = 0;

        /**
         * 路径类型
         */
        public get type(): number {
            return this._type;
        }

        /**
         * 将当前绘图位置移动到 (x, y) 如果缺少任何一个参数, 则此方法将失败, 并且当前绘图位置不改变
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字 (以像素为单位)
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字 (以像素为单位)
         */
        public moveTo(x: number, y: number): void {
            this.commands[this._commandPosition++] = PathCommand.moveTo;
            let pos = this._dataPosition;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this._dataPosition = pos;
        }

        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字 (以像素为单位)
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字 (以像素为单位)
         */
        public lineTo(x: number, y: number): void {
            this.commands[this._commandPosition++] = PathCommand.lineTo;
            let pos = this._dataPosition;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this._dataPosition = pos;
        }

        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线当前绘图位置随后设置为 (anchorX, anchorY)
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法, 则当前绘图位置的默认值为 (0, 0) 如果缺少任何一个参数, 则此方法将失败, 并且当前绘图位置不改变
         * 绘制的曲线是二次贝塞尔曲线二次贝塞尔曲线包含两个锚点和一个控制点该曲线内插这两个锚点, 并向控制点弯曲
         * @param controlX 一个数字, 指定控制点相对于父显示对象注册点的水平位置
         * @param controlY 一个数字, 指定控制点相对于父显示对象注册点的垂直位置
         * @param anchorX 一个数字, 指定下一个锚点相对于父显示对象注册点的水平位置
         * @param anchorY 一个数字, 指定下一个锚点相对于父显示对象注册点的垂直位置
         */
        public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
            this.commands[this._commandPosition++] = PathCommand.curveTo;
            let pos = this._dataPosition;
            this.data[pos++] = controlX;
            this.data[pos++] = controlY;
            this.data[pos++] = anchorX;
            this.data[pos++] = anchorY;
            this._dataPosition = pos;
        }

        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线三次贝塞尔曲线由两个锚点和两个控制点组成该曲线内插这两个锚点, 并向两个控制点弯曲
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置
         */
        public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void {
            this.commands[this._commandPosition++] = PathCommand.cubicCurveTo;
            let pos = this._dataPosition;
            this.data[pos++] = controlX1;
            this.data[pos++] = controlY1;
            this.data[pos++] = controlX2;
            this.data[pos++] = controlY2;
            this.data[pos++] = anchorX;
            this.data[pos++] = anchorY;
            this._dataPosition = pos;
        }

        /**
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置 (以像素为单位)
         * @param y 相对于父显示对象注册点的圆心的 y 位置 (以像素为单位)
         * @param width 矩形的宽度 (以像素为单位)
         * @param height 矩形的高度 (以像素为单位)
         */
        public drawRect(x: number, y: number, width: number, height: number): void {
            let x2 = x + width;
            let y2 = y + height;
            this.moveTo(x, y);
            this.lineTo(x2, y);
            this.lineTo(x2, y2);
            this.lineTo(x, y2);
            this.lineTo(x, y);
        }

        /**
         * 绘制一个圆角矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置 (以像素为单位)
         * @param y 相对于父显示对象注册点的圆心的 y 位置 (以像素为单位)
         * @param width 矩形的宽度 (以像素为单位)
         * @param height 矩形的高度 (以像素为单位)
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度 (以像素为单位)
         * @param ellipseHeight 用于绘制圆角的椭圆的高度 (以像素为单位) 如果未指定值, 则默认值与为 ellipseWidth 参数提供的值相匹配
         */
        public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
            let radiusX = (ellipseWidth * 0.5) | 0;
            let radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
            if (!radiusX || !radiusY) {
                this.drawRect(x, y, width, height);
                return;
            }
            let hw = width * 0.5;
            let hh = height * 0.5;
            if (radiusX > hw) {
                radiusX = hw;
            }
            if (radiusY > hh) {
                radiusY = hh;
            }
            if (hw === radiusX && hh === radiusY) {
                if (radiusX === radiusY) {
                    this.drawCircle(x + radiusX, y + radiusY, radiusX);
                }
                else {
                    this.drawEllipse(x, y, radiusX * 2, radiusY * 2);
                }
                return;
            }
            //    A-----B
            //  H         C
            //  G         D
            //    F-----E
            // 从 D 点开始, 结束在 D 点
            let right = x + width;
            let bottom = y + height;
            let xlw = x + radiusX;
            let xrw = right - radiusX;
            let ytw = y + radiusY;
            let ybw = bottom - radiusY;
            this.moveTo(right, ybw);
            this.curveTo(right, bottom, xrw, bottom);
            this.lineTo(xlw, bottom);
            this.curveTo(x, bottom, x, ybw);
            this.lineTo(x, ytw);
            this.curveTo(x, y, xlw, y);
            this.lineTo(xrw, y);
            this.curveTo(right, y, right, ytw);
            this.lineTo(right, ybw);
        }

        /**
         * 绘制一个圆
         * @param x 圆心相对于父显示对象注册点的 x 位置 (以像素为单位)
         * @param y 相对于父显示对象注册点的圆心的 y 位置 (以像素为单位)
         * @param radius 圆的半径 (以像素为单位)
         */
        public drawCircle(x: number, y: number, radius: number): void {
            this.arcToBezier(x, y, radius, radius, 0, Math.PI * 2);
        }

        /**
         * 绘制一个椭圆
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字 (以像素为单位)
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字 (以像素为单位)
         * @param width 矩形的宽度 (以像素为单位)
         * @param height 矩形的高度 (以像素为单位)
         */
        public drawEllipse(x: number, y: number, width: number, height: number): void {
            let radiusX = width * 0.5;
            let radiusY = height * 0.5;
            // 移动 x 和 y 到椭圆的中心
            x += radiusX;
            y += radiusY;
            this.arcToBezier(x, y, radiusX, radiusY, 0, Math.PI * 2);
        }

        /**
         * 绘制一段圆弧路径圆弧路径的圆心在 (x, y) 位置, 半径为 r, 根据 anticlockwise (默认为顺时针) 指定的方向从 startAngle 开始绘制, 到 endAngle 结束
         * @param x 圆弧中心 (圆心) 的 x 轴坐标
         * @param y 圆弧中心 (圆心) 的 y 轴坐标
         * @param radius 圆弧的半径
         * @param startAngle 圆弧的起始点, x 轴方向开始计算, 单位以弧度表示, 注意, 必须在0~2π之间
         * @param endAngle 圆弧的终点, 单位以弧度表示, 注意, 必须在0~2π之间
         * @param anticlockwise 如果为 true, 逆时针绘制圆弧, 反之, 顺时针绘制
         */
        public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void {
            if (anticlockwise) {
                if (endAngle >= startAngle) {
                    endAngle -= Math.PI * 2;
                }
            }
            else {
                if (endAngle <= startAngle) {
                    endAngle += Math.PI * 2;
                }
            }
            this.arcToBezier(x, y, radius, radius, startAngle, endAngle, anticlockwise);
        }

        /**
         * 绘制一段圆弧路径
         * @param x 圆弧中心 (圆心) 的 x 轴坐标
         * @param y 圆弧中心 (圆心) 的 y 轴坐标
         * @param radiusX 圆弧的半径 x
         * @param radiusY 圆弧的半径 y
         * @param startAngle 圆弧的起始点, x 轴方向开始计算, 单位以弧度表示, 注意：必须为正数
         * @param endAngle 圆弧的终点, 单位以弧度表示, 注意：与startAngle差值必须在0~2π之间
         * @param anticlockwise 如果为 true, 逆时针绘制圆弧, 反之, 顺时针绘制, 注意：如果为true, endAngle必须小于startAngle, 反之必须大于
         */
        private arcToBezier(x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
            let halfPI = Math.PI * 0.5;
            let start = startAngle;
            let end = start;
            if (anticlockwise) {
                end += -halfPI - (start % halfPI);
                if (end < endAngle) {
                    end = endAngle;
                }
            }
            else {
                end += halfPI - (start % halfPI);
                if (end > endAngle) {
                    end = endAngle;
                }
            }
            let currentX = x + Math.cos(start) * radiusX;
            let currentY = y + Math.sin(start) * radiusY;
            if (this.lastX != currentX || this.lastY != currentY) {
                this.moveTo(currentX, currentY);
            }
            let u = Math.cos(start);
            let v = Math.sin(start);
            for (let i = 0; i < 4; i++) {
                let addAngle = end - start;
                let a = 4 * Math.tan(addAngle / 4) / 3;
                let x1 = currentX - v * a * radiusX;
                let y1 = currentY + u * a * radiusY;
                u = Math.cos(end);
                v = Math.sin(end);
                currentX = x + u * radiusX;
                currentY = y + v * radiusY;
                let x2 = currentX + v * a * radiusX;
                let y2 = currentY - u * a * radiusY;
                this.cubicCurveTo(x1, y1, x2, y2, currentX, currentY);
                if (end === endAngle) {
                    break;
                }
                start = end;
                if (anticlockwise) {
                    end = start - halfPI;
                    if (end < endAngle) {
                        end = endAngle;
                    }
                }
                else {
                    end = start + halfPI;
                    if (end > endAngle) {
                        end = endAngle;
                    }
                }
            }
        }
    }
}
