import React, { useEffect, useRef, useState, useReducer } from "react";
import { reducer } from "./Reducer";
import { PlayerPhysics } from "./Player";
import data from "../ballGame3.1/data"

const defaultState = {
    player: {},
}

let mouse = {
    x: 0,
    y: 0
}

export default function Board() {
    const canvasRef = useRef(null)

    const [pause, setPause] = useState(false);

    const [state, dispatch] = useReducer(reducer, defaultState)
    state.player = data.player

    // MERRI KORDINATAT E KURSORIT
    const move = ({ nativeEvent }) => {
        mouse.x = nativeEvent.x
        mouse.y = nativeEvent.y - 68 // -68 PËR SHKAK TË NAVBARIT
    }

    let rightHeld = false
    let leftHeld = false

    function downHandler({ key }) {
        if (key === 'ArrowRight') {
            rightHeld = true
        }
        if (key === 'ArrowLeft') {
            leftHeld = true
        }
        if (key === 'ArrowUp') {
            dispatch({ type: "JUMP" })
        }
    }

    function upHandler({ key }) {
        if (key === 'ArrowRight') {
            rightHeld = false
        }
        if (key === 'ArrowLeft') {
            leftHeld = false
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current
            const c = canvas.getContext('2d')
            c.clearRect(0, 0, canvas.width, canvas.height)

            let { player } = data

            PlayerPhysics(canvas, c, player, mouse)
            dispatch({ type: "GO_RIGHT", payload: rightHeld })
            dispatch({ type: "GO_LEFT", payload: leftHeld })

            requestAnimationFrame(render)
        }
        render() // RIRENDEROHU MENIHER
    }, [])

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            height={window.innerHeight - 71.5} // -71.5 PËR SHKAK TË NAVBARIT
            width={window.innerWidth}
            onMouseMove={move}
            // onClick={() => { dispatch({ type: "JUMP" }) }}
            onMouseEnter={() => setPause(false)}
            onMouseLeave={() => setPause(true)} />
    )
}