(function () {
  const puppeteer = {
    animations: {},
    _allGroups: [],
    _allElements: [],
    _allGroupElements: [],
    _allElementsSet: new Set(),
    _windowOffset: 0,
    _scrollUp: false
  }

  snakeToCamel = (s) => {
    return s.replace(/(\-\w)/g, (m) => { 
      return m[1].toUpperCase() 
    })
  }

  animationStart = (e) => {
    e.target.animationRunning = true
  }

  animationEnd = (e) => {
    e.target.animationRunning = false
  }

  update = () => {
    puppeteer._allElementsSet.forEach((elem) => {
      const rect = elem.getBoundingClientRect()
      const anim = elem.getAttribute('p-animation') 

      if (rect.top < window.innerHeight && rect.top > 0 && !puppeteer._scrollUp) {
        if (!elem.visible) {          
          window.setTimeout(() => {
            elem.style.animation = `${anim} 1s 1`
          })

          elem.visible = true
        }
      } else if (puppeteer._scrollUp && rect.top > window.innerHeight) {
        elem.style.animation = undefined
        elem.visible = false
      }
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.setInterval(tick, 500)

    puppeteer._allElements = document.querySelectorAll('[p-animation]')
    puppeteer._allElements.forEach((e) => {
      puppeteer._allElementsSet.add(e)
      e.addEventListener('animationstart', animationStart)
      e.addEventListener('animationend', animationEnd)      
    })

    update()
  })

  tick = () => {
    // if the animation is going past something
    console.log('Tick')
  }

  document.addEventListener('scroll', (e) => {
    if (window.pageYOffset < puppeteer._windowOffset) {
      puppeteer._scrollUp = true
    } else {
      puppeteer._scrollUp = false
    }

    puppeteer._windowOffset = window.pageYOffset
    update()
  })
})()