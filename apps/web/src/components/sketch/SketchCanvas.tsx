import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
// @ts-ignore
import { fabric } from 'fabric';
import {
    Square,
    Circle,
    Type,
    Eraser,
    MousePointer2,
    Undo,
    Redo,
    Trash2,
    Pencil,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SketchCanvasProps { }

export const SketchCanvas = forwardRef((props: SketchCanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'rect' | 'circle' | 'text' | 'image'>('pencil');
    const [color, setColor] = useState('#800000'); // Bordo Default
    const [brushSize, setBrushSize] = useState(3);

    useImperativeHandle(ref, () => ({
        getData: () => {
            if (!fabricCanvas.current) return null;
            return {
                json: JSON.stringify(fabricCanvas.current.toJSON()),
                image: fabricCanvas.current.toDataURL({ format: 'png', quality: 0.8 })
            };
        }
    }));

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
            backgroundColor: '#ffffff',
            isDrawingMode: true,
        });

        fabricCanvas.current = canvas;
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = brushSize;

        const handleResize = () => {
            if (containerRef.current && fabricCanvas.current) {
                fabricCanvas.current.setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (!fabricCanvas.current) return;
        const canvas = fabricCanvas.current;
        canvas.isDrawingMode = activeTool === 'pencil';
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = brushSize;
        }
        canvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair';
    }, [activeTool, color, brushSize]);

    const addRect = () => {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            width: 150,
            height: 100,
            rx: 4, ry: 4
        });
        fabricCanvas.current?.add(rect);
        setActiveTool('select');
    };

    const addCircle = () => {
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            radius: 50,
        });
        fabricCanvas.current?.add(circle);
        setActiveTool('select');
    };

    const addText = () => {
        const text = new fabric.IText('Anotação técnica...', {
            left: 100,
            top: 100,
            fontFamily: 'Inter',
            fontSize: 20,
            fill: color,
        });
        fabricCanvas.current?.add(text);
        fabricCanvas.current?.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        setActiveTool('select');
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !fabricCanvas.current) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            fabric.Image.fromURL(data, (img: any) => {
                img.scaleToWidth(200);
                fabricCanvas.current?.add(img);
                fabricCanvas.current?.centerObject(img);
                fabricCanvas.current?.setActiveObject(img);
                fabricCanvas.current?.renderAll();
            });
        };
        reader.readAsDataURL(file);
        setActiveTool('select');
    };

    const handleUndo = () => {
        const canvas = fabricCanvas.current;
        if (canvas && canvas._objects.length > 0) {
            canvas.remove(canvas._objects[canvas._objects.length - 1]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background border-r">
            {/* Minimal Toolbar */}
            <div className="flex items-center gap-1 p-3 bg-secondary/20 border-b">
                <Button
                    variant={activeTool === 'select' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool('select')}
                    className="h-10 w-10 rounded-xl"
                >
                    <MousePointer2 size={20} />
                </Button>
                <Button
                    variant={activeTool === 'pencil' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool('pencil')}
                    className="h-10 w-10 rounded-xl"
                >
                    <Pencil size={20} />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-2" />

                <Button variant="ghost" size="icon" onClick={addRect} className="h-10 w-10 rounded-xl">
                    <Square size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={addCircle} className="h-10 w-10 rounded-xl">
                    <Circle size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={addText} className="h-10 w-10 rounded-xl">
                    <Type size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-10 w-10 rounded-xl">
                    <ImageIcon size={20} />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={addImage}
                />

                <Separator orientation="vertical" className="h-6 mx-2" />

                <div className="flex items-center gap-2 px-2">
                    {['#800000', '#000000', '#2563eb', '#16a34a', '#d97706'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={cn(
                                "w-6 h-6 rounded-full border-2 border-white shadow-sm transition-all",
                                color === c ? "scale-125 ring-2 ring-primary/20" : "hover:scale-110"
                            )}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <Separator orientation="vertical" className="h-6 mx-2" />

                <Button variant="ghost" size="icon" onClick={handleUndo} className="h-10 w-10 rounded-xl">
                    <Undo size={20} />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fabricCanvas.current?.clear()}
                    className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 ms-auto"
                >
                    <Trash2 size={20} />
                </Button>
            </div>

            {/* Canvas Container */}
            <div ref={containerRef} className="flex-1 bg-white relative overflow-hidden">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
});

SketchCanvas.displayName = 'SketchCanvas';
