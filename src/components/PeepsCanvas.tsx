'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Stage {
  width: number
  height: number
}

interface ResetProps {
  startX: number
  startY: number
  endX: number
}

/* ================= UTILS ================= */

const randomRange = (min: number, max: number) =>
  min + Math.random() * (max - min)

const randomIndex = <T,>(array: T[]) =>
  (Math.random() * array.length) | 0

const removeFromArray = <T,>(array: T[], i: number): T =>
  array.splice(i, 1)[0]

const removeRandomFromArray = <T,>(array: T[]): T =>
  removeFromArray(array, randomIndex(array))

const getRandomFromArray = <T,>(array: T[]): T =>
  array[randomIndex(array)]

/* ================= CLASS ================= */

class Peep {
  image: HTMLImageElement
  rect: number[]
  width: number
  height: number
  drawArgs: [
    HTMLImageElement, // image
    number, // sx
    number, // sy
    number, // sWidth
    number, // sHeight
    number, // dx
    number, // dy
    number, // dWidth
    number  // dHeight
  ]

  x = 0
  y = 0
  anchorY = 0
  scaleX = 1
  walk!: gsap.core.Timeline

  constructor(image: HTMLImageElement, rect: [number, number, number, number]) {
    this.image = image
    this.rect = rect
    this.width = rect[2]
    this.height = rect[3]

    this.drawArgs = [
      image,     // source image
      rect[0],   // sx
      rect[1],   // sy
      rect[2],   // sWidth
      rect[3],   // sHeight
      0,         // dx
      0,         // dy
      rect[2],   // dWidth (same as source width)
      rect[3]    // dHeight (same as source height)
    ]
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.scaleX, 1)
    ctx.drawImage(...this.drawArgs)
    ctx.restore()
  }
}

/* ================= COMPONENT ================= */

export default function PeepsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.src = '/peeps.png'

    const stage: Stage = { width: 0, height: 0 }
    const allPeeps: Peep[] = []
    const availablePeeps: Peep[] = []
    const crowd: Peep[] = []

    const resetPeep = (peep: Peep): ResetProps => {
      const direction = Math.random() > 0.5 ? 1 : -1
      const offsetY =
        100 - 250 * gsap.parseEase('power2.in')(Math.random())

      const startY = stage.height - peep.height + offsetY
      let startX: number
      let endX: number

      if (direction === 1) {
        startX = -peep.width
        endX = stage.width
        peep.scaleX = 1
      } else {
        startX = stage.width + peep.width
        endX = 0
        peep.scaleX = -1
      }

      peep.x = startX
      peep.y = startY
      peep.anchorY = startY

      return { startX, startY, endX }
    }

    const normalWalk = (peep: Peep, props: ResetProps) => {
      const tl = gsap.timeline({ repeat: -1 })
      tl.timeScale(randomRange(1, 2))

      tl.to(peep, { duration: 6, x: props.endX, ease: 'none' }, 0)
      tl.to(
        peep,
        {
          duration: 0.25,
          repeat: 30,
          yoyo: true,
          y: props.startY - 10,
        },
        0
      )
      tl.call(() => {
        resetPeep(peep)
      })

      return tl
    }

    const resize = () => {
      stage.width = canvas.clientWidth
      stage.height = canvas.clientHeight

      canvas.width = stage.width * devicePixelRatio
      canvas.height = stage.height * devicePixelRatio

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const render = () => {
      ctx.clearRect(0, 0, stage.width, stage.height)
      crowd.forEach(p => p.render(ctx))
    }

    img.onload = () => {
      const rows = 15
      const cols = 7
      const rectW = img.naturalWidth / rows
      const rectH = img.naturalHeight / cols

      for (let i = 0; i < rows * cols; i++) {
        allPeeps.push(
          new Peep(img, [
            (i % rows) * rectW,
            ((i / rows) | 0) * rectH,
            rectW,
            rectH,
          ])
        )
      }

      availablePeeps.push(...allPeeps)
      resize()

      while (availablePeeps.length) {
        const peep = removeRandomFromArray(availablePeeps)
        peep.walk = normalWalk(peep, resetPeep(peep))
        crowd.push(peep)
      }

      gsap.ticker.add(render)
    }

    window.addEventListener('resize', resize)

    return () => {
      gsap.ticker.remove(render)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]"
    />
  )
}
