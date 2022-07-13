import React, { useEffect, useRef, useState, useReducer, useCallback } from "react";
import { reducer } from "./Reducer";
import { PlayerPhysics } from "./gameProps/Player";
import { DrawCircles } from "./gameProps/DrawCircles";
import data from "./functionsAndData/data"

const defaultState = {
    player: {},
}

let mouse = {
    x: 0,
    y: 0
}

export default function Board() {
    const [level, setLevel] = useState(1)
    const [pause, setPause] = useState(false);

    const [state, dispatch] = useReducer(reducer, defaultState)

    let maxLevel = 2

    let rightHeld = false
    let leftHeld = false
    let upHeld = false

    const downHandler = ({ key }) => {
        if (key === 'ArrowRight') {
            console.log("RIGHT")
            rightHeld = true
        }
        if (key === 'ArrowLeft') {
            console.log("LEFT")
            leftHeld = true
        }
        if (key === 'ArrowUp') {
            upHeld = true
        }
        if (key === 'l' || key === 'L') {
            levelHandler()
        }
    }

    function upHandler({ key }) {
        if (key === 'ArrowRight') {
            rightHeld = false
        }
        if (key === 'ArrowLeft') {
            leftHeld = false
        }
        if (key === 'ArrowUp') {
            upHeld = false
        }
    }

    const levelHandler = useCallback(() => {
            if (level === maxLevel) {
                setLevel(1)
                console.log("level", 1)
            } else {
                setLevel(level + 1)
                console.log("level", 2)
            }
        }, [level])

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [level]);

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    let newCanvas
    let circle
    useEffect(() => {
        const canvas = canvasRef.current
        let dpr = window.devicePixelRatio || 1
        let rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        const context = canvas.getContext('2d')
        context.scale(dpr, dpr)
        contextRef.current = context

        newCanvas = data.create(canvas, level)
        state.player = newCanvas.getPlayer()
        circle = newCanvas.getCircle()
        return () => {

        }
    }, [level])

    const fps = 60
    const secondsPerFrame = (1000 / 60) * (60 / fps) - (1000 / 60) * 0.5;
    let lastFrameTime = 0
    useEffect(() => {
        const render = (time) => {
            if (time - lastFrameTime < secondsPerFrame) {
                requestAnimationFrame(render);
                return
            }
            lastFrameTime = time

            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

            DrawCircles(canvasRef.current, contextRef.current, circle, level)
            PlayerPhysics(canvasRef.current, contextRef.current, state.player, level)

            dispatch({ type: "GO_LEFT", payload: leftHeld })
            dispatch({ type: "GO_RIGHT", payload: rightHeld })
            dispatch({ type: "JUMP", payload: upHeld })

            requestAnimationFrame(render)
        }
        render(lastFrameTime) // RIRENDEROHU MENIHER
        return () => {
            cancelAnimationFrame(render)
        }
    }, [level])

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight * 0.9} /> // * 0.925 PËR SHKAK TË NAVBARIT
    )
}