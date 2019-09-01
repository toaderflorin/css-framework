(function () {
  const animations = {}
  const allGroups = []
  const allGroupElements = []
  const allElementsSet = new Set()
  
  let allElements = []
  let windowOffset = 0
  let scrollUp = false

  snakeToCamel = (s) => {
    return s.replace(/(\-\w)/g, (m) => { 
      return m[1].toUpperCase() 
    })
  }

  animationStart = (e) => {
    e.target.animationProgress = 0
    e.target.animationRunning = true
  }

  animationEnd = (e) => {
    e.target.animationRunning = false
  }

  update = () => {
    allElementsSet.forEach((elem) => {
      const rect = elem.getBoundingClientRect()
      const anim = elem.getAttribute('p-animation')

      if (rect.top < window.innerHeight && rect.top > 0 && !scrollUp) {
        if (!elem.visible) {
          window.setTimeout(() => {
            elem.style.animation = `${anim} 1s 1`
          })

          elem.visible = true
        }
      } else if (scrollUp && rect.top > window.innerHeight) {
        elem.style.animation = undefined
        elem.visible = false
      }
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.setInterval(tick, 10)

    allElements = document.querySelectorAll('[p-animation]')
    allElements.forEach((e) => {
      allElementsSet.add(e)
      e.addEventListener('animationstart', animationStart)
      e.addEventListener('animationend', animationEnd)      
    })

    update()
  })

  tick = () => {
    // if the animation is going past something
    allElements.forEach((e) => {
      const rect = e.getBoundingClientRect()
      const targetPercentage = rect.top / window.innerHeight * 100
        
      if (e.animationRunning) {  
        if (targetPercentage > 0) {
          console.log('Animation running', targetPercentage, e.animationProgress)        

          if (e.animationProgress > targetPercentage) {
            console.log('Stopped')
            e.style.animationPlayState = "paused"
          } else {
            console.log('Got here')
            e.animationProgress += 0.7
            e.style.animationPlayState = "running"
          }
        }
      }      
    })
  }

  document.addEventListener('scroll', (e) => {
    if (window.pageYOffset < windowOffset) {
      scrollUp = true
    } else {
      scrollUp = false
    }

    windowOffset = window.pageYOffset
    update()
  })
})()