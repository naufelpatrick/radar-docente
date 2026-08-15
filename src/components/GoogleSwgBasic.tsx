import { useEffect } from 'react'

const scriptUrl = 'https://news.google.com/swg/js/v1/swg-basic.js'

type SwgWindow = Window & typeof globalThis & {
  SWG_BASIC?: Array<(basicSubscriptions: { init: (options: Record<string, unknown>) => void }) => void>
  __praxiaSwgBasicInitialized?: boolean
}

export function GoogleSwgBasic() {
  useEffect(() => {
    const swgWindow = window as SwgWindow
    if (swgWindow.__praxiaSwgBasicInitialized) return

    swgWindow.__praxiaSwgBasicInitialized = true
    swgWindow.SWG_BASIC = swgWindow.SWG_BASIC || []
    swgWindow.SWG_BASIC.push((basicSubscriptions) => {
      basicSubscriptions.init({
        type: 'NewsArticle',
        isPartOfType: ['Product'],
        isPartOfProductId: 'CAowyK7hCw:openaccess',
        clientOptions: { theme: 'light', lang: 'pt-BR' },
      })
    })

    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.type = 'application/javascript'
      script.src = scriptUrl
      document.head.appendChild(script)
    }
  }, [])

  return null
}
